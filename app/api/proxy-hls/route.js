export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return new Response('URL parameter is required', { status: 400 });
  }

  try {
    // Decode the URL if it's encoded
    let decodedUrl;
    try {
      decodedUrl = decodeURIComponent(url);
    } catch (e) {
      decodedUrl = url; // If decoding fails, use original URL
    }

    // Validate URL
    if (!decodedUrl || (!decodedUrl.startsWith('http://') && !decodedUrl.startsWith('https://'))) {
      return new Response('Invalid URL format', { status: 400 });
    }

    // Extract origin for Referer header
    let referer = decodedUrl;
    try {
      const urlObj = new URL(decodedUrl);
      referer = `${urlObj.protocol}//${urlObj.host}`;
    } catch (e) {
      // If URL parsing fails, use basic referer
      referer = decodedUrl.split('/').slice(0, 3).join('/');
    }

    // Fetch the stream from the original source
    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': referer,
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'identity',
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      console.error(`Proxy fetch failed: ${response.status} ${response.statusText} for URL: ${decodedUrl}`);
      return new Response(`Failed to fetch stream: ${response.statusText}`, {
        status: response.status,
      });
    }

    // Get the content type from the response or determine it from the URL
    const contentType = response.headers.get('content-type') || 
      (decodedUrl.includes('.m3u8') ? 'application/vnd.apple.mpegurl' : 
       decodedUrl.includes('.ts') ? 'video/mp2t' : 'application/octet-stream');

    // Check if this is a text-based file (m3u8 playlist) or binary (video segments)
    const isTextFile = contentType.includes('mpegurl') || 
                       contentType.includes('text') || 
                       contentType.includes('plain') ||
                       decodedUrl.includes('.m3u8') ||
                       decodedUrl.includes('.vtt') ||
                       decodedUrl.includes('.srt') ||
                       decodedUrl.includes('playlist');

    let processedData;
    let finalContentType = contentType;

    if (isTextFile) {
      // Read as text for m3u8 playlists and subtitles
      const data = await response.text();
      
      // For m3u8 playlists, rewrite URLs to use our proxy
      if (contentType.includes('mpegurl') || decodedUrl.includes('.m3u8')) {
        const baseUrl = decodedUrl.substring(0, decodedUrl.lastIndexOf('/') + 1);
        // Get the origin from request headers
        const host = request.headers.get('host') || 'localhost:3000';
        const protocol = request.headers.get('x-forwarded-proto') || 
                        (host.includes('localhost') ? 'http' : 'https');
        const proxyBase = `${protocol}://${host}/api/proxy-hls`;
        
        // Process each line of the m3u8 playlist
        processedData = data.split('\n').map(line => {
          // Skip comments and empty lines
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith('#') || !trimmedLine) {
            return line;
          }
          
          // Check if this line contains a URL (segment file or nested playlist)
          // Handle absolute URLs
          if (trimmedLine.startsWith('http://') || trimmedLine.startsWith('https://')) {
            return `${proxyBase}?url=${encodeURIComponent(trimmedLine)}`;
          }
          
          // Handle relative URLs and paths
          if (trimmedLine && !trimmedLine.startsWith('#')) {
            try {
              // Handle both absolute paths and relative URLs
              let absoluteUrl;
              if (trimmedLine.startsWith('/')) {
                // Absolute path on same domain
                try {
                  const baseUrlObj = new URL(baseUrl);
                  absoluteUrl = `${baseUrlObj.protocol}//${baseUrlObj.host}${trimmedLine}`;
                } catch (e) {
                  // Fallback if baseUrl parsing fails
                  const urlMatch = baseUrl.match(/^(https?:\/\/[^\/]+)/);
                  if (urlMatch) {
                    absoluteUrl = `${urlMatch[1]}${trimmedLine}`;
                  } else {
                    return line; // Can't construct URL, return original
                  }
                }
              } else {
                // Relative URL
                try {
                  absoluteUrl = new URL(trimmedLine, baseUrl).href;
                } catch (e) {
                  // If relative URL construction fails, try with baseUrl as string
                  if (baseUrl.endsWith('/')) {
                    absoluteUrl = baseUrl + trimmedLine;
                  } else {
                    absoluteUrl = baseUrl + '/' + trimmedLine;
                  }
                }
              }
              return `${proxyBase}?url=${encodeURIComponent(absoluteUrl)}`;
            } catch (e) {
              // If URL construction fails, return original line
              console.error('Error processing URL in m3u8:', e, 'Line:', trimmedLine, 'BaseUrl:', baseUrl);
              return line;
            }
          }
          
          return line;
        }).join('\n');
      } else {
        processedData = data;
      }
    } else {
      // For binary files (video segments), read as array buffer
      const arrayBuffer = await response.arrayBuffer();
      processedData = arrayBuffer;
    }

    // Return the response with proper CORS headers
    return new Response(processedData, {
      status: 200,
      headers: {
        'Content-Type': finalContentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Range',
        'Access-Control-Expose-Headers': 'Content-Length, Content-Range',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    console.error('Failed URL:', url);
    return new Response(`Proxy error: ${error.message}`, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
}

export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
