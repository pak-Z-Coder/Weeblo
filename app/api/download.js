// import axios from 'axios';
// import fs from 'fs';
// import path from 'path';
// import ffmpeg from 'fluent-ffmpeg';
// import ffmpegStatic from 'ffmpeg-static';

// // Set the ffmpeg path to the static binary provided by ffmpeg-static
// ffmpeg.setFfmpegPath(ffmpegStatic.path);

// const downloadChunks = async (chunkUrls, outputDir) => {
//   if (!fs.existsSync(outputDir)) {
//     fs.mkdirSync(outputDir);
//   }

//   const downloadPromises = chunkUrls.map((url, index) => {
//     const chunkPath = path.join(outputDir, `chunk_${index}.ts`);
//     return axios({
//       url,
//       method: 'GET',
//       responseType: 'stream',
//     }).then((response) => {
//       return new Promise((resolve, reject) => {
//         const writer = fs.createWriteStream(chunkPath);
//         response.data.pipe(writer);
//         writer.on('finish', resolve);
//         writer.on('error', reject);
//       });
//     });
//   });

//   await Promise.all(downloadPromises);
// };

// const combineChunks = (outputDir, outputFile) => {
//   return new Promise((resolve, reject) => {
//     const chunkFiles = fs.readdirSync(outputDir)
//       .filter((file) => file.endsWith('.ts'))
//       .sort();

//     const inputFileList = chunkFiles.map((file) => `file '${path.join(outputDir, file)}'`).join('\n');
//     const inputFilePath = path.join(outputDir, 'filelist.txt');
//     fs.writeFileSync(inputFilePath, inputFileList);

//     ffmpeg()
//       .input(inputFilePath)
//       .inputOptions('-f concat', '-safe 0')
//       .outputOptions('-c copy')
//       .save(outputFile)
//       .on('end', resolve)
//       .on('error', reject);
//   });
// };

// export default async function handler(req, res) {
//   const { m3u8Url, outputFileName } = req.query;

//   if (!m3u8Url || !outputFileName) {
//     res.status(400).json({ error: 'm3u8Url and outputFileName are required' });
//     return;
//   }

//   try {
//     const response = await axios.get(m3u8Url);
//     const content = response.data;
//     const chunkUrls = content.split('\n').filter(line => line && !line.startsWith('#'));
//     const outputDir = path.join(process.cwd(), 'chunks');

//     await downloadChunks(chunkUrls, outputDir);

//     const outputFilePath = path.join(process.cwd(), outputFileName);
//     await combineChunks(outputDir, outputFilePath);

//     res.status(200).json({ message: 'Video downloaded and combined successfully', outputFile: outputFileName });

//     // Clean up
//     fs.rmSync(outputDir, { recursive: true, force: true });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to download video' });
//   }
// }
