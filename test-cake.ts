import { File } from 'node:buffer';
import { FormData } from 'undici';

const fd = new FormData();
const file = new File(['foo'], 'foo.txt', { type: 'text/plain' });

fd.append('referenceImage', file);

const fileField = fd.get('referenceImage');
console.log(fileField instanceof File, typeof fileField, fileField);
