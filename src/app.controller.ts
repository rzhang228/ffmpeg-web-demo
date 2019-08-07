import { Response } from 'express';
import { Controller, Get, Res } from '@nestjs/common';
import Pipe from '../decorators/pipe';

@Controller()
export class AppController {
  @Get()
  async get() {
    return `<video autoplay id="videoElement" width="1500px" height="700px" >您的浏览器不支持 video 标签。</video>
    <script src="https://cdn.bootcss.com/flv.js/1.5.0/flv.min.js"></script>
    <script>
    if (flvjs.isSupported()) {
        var videoElement = document.getElementById('videoElement');
        var flvPlayer = flvjs.createPlayer({
            type: 'flv',
            url: '/stream'
        });
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();
        flvPlayer.play();
    }
</script>`;
  }

  @Get('/stream')
  async getStream(@Pipe() pipe, @Res() res: Response) {
    pipe(res);
  }
}
