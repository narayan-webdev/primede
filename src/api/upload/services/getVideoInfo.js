import ffmpeg from "fluent-ffmpeg";
export default async (filePath) => {
    return new Promise((resolve, reject) => {
        ffmpeg(filePath)
            .setFfprobePath("C:/ProgramData/chocolatey/bin/ffprobe.exe") // Specify the full path to ffprobe
            .ffprobe((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    const duration = data.format.duration;
                    const resolution = {
                        width: data.streams[0].width,
                        height: data.streams[0].height,
                    };
                    resolve({ duration, resolution });
                }
            });
    });
}
