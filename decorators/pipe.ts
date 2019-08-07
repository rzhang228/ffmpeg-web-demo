import { createParamDecorator } from '@nestjs/common';
import Recorder from '../lib/recorder';

const recorder = new Recorder();

export default createParamDecorator(() => {
  return recorder.pipe.bind(recorder);
});
