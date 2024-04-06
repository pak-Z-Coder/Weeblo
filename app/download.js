"use server";
export const handleDownload = (videoUrl) => {
  if (videoUrl) {
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = "video.mp4";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
