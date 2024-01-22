import {SVGProps} from 'react';

export default function MdiBrushVariant(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M8 3C5.79 3 4 4.79 4 7v7c0 1.1.9 2 2 2h3v4c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-4h3c1.1 0 2-.9 2-2V3H8m0 2h4v2h2V5h1v4h2V5h1v5H6V7c0-1.1.9-2 2-2m-2 9v-2h12v2H6Z"
      ></path>
    </svg>
  );
}