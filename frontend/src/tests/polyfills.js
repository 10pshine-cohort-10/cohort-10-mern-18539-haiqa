// jsdom does not provide TextEncoder/TextDecoder, but React Router needs them.
import { TextDecoder, TextEncoder } from 'node:util';

Object.assign(globalThis, { TextEncoder, TextDecoder });
