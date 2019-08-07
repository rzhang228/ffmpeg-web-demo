import { Writable } from 'stream';
import * as debugBuider from 'debug';
import * as ffmpeg from 'fluent-ffmpeg';
import { parse } from 'ffmpeg-device-list-parser';
import { path as ffmpegPath } from 'ffmpeg-static';

const debug = debugBuider('Recorder');

// osx 用 avfoundation
// windows 用 gdigrab
export default class Recorder {
  private devices: any;

  constructor() {
    this.init();
  }

  private async init() {
    this.devices = await parse({
      ffmpegPath,
    });
  }

  public pipe(writableStream: Writable) {
    return ffmpeg(
      `${this.devices.videoDevices[1].id}:${this.devices.audioDevices[0].id}`,
    )
      .setFfmpegPath(ffmpegPath)
      .inputOptions([
        '-f avfoundation',
        '-r 30',
        '-vsync 2',
        '-capture_cursor 1',
        '-pixel_format uyvy422',
      ])
      .outputOptions(['-f flv', '-c:v libx264', '-crf 0', '-c:a aac'])
      .on('start', commandLine => {
        debug('start command: ' + commandLine);
      })
      .on('progress', obj => {
        debug(
          'frame=',
          obj.frames,
          ' fps=',
          obj.currentFps,
          ' bitrate=',
          obj.currentKbps,
          'kbits/s size=',
          obj.targetSize,
          ' time=',
          obj.timemark,
        );
      })
      .on('error', err => {
        debug(err.message);
      })
      .pipe(
        writableStream,
        // { end: true },
      );
  }
}
