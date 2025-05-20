'use client';
import { use } from 'react';


export default function AdminTaskPage(paramsPromise) {
const { id } = paramsPromise.params;
console.log(id);
  return ( 
<div>
    <h1>Summary Page.</h1>
</div>

   );
}
