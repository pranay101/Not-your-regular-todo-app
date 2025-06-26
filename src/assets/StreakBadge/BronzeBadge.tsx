import * as React from "react"
import { SVGProps, Ref, forwardRef, memo } from "react"
const SvgComponent = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    data-name="Layer 2"
    viewBox="0 0 42.58 51.22"
    ref={ref}
    {...props}
  >
    <g data-name="Layer 1">
      <path
        d="M22.95 24.73 42.58 0l-12.3.06L14 18.11l8.95 6.62z"
        style={{
          fill: "#afafaf",
          strokeWidth: 0,
        }}
      />
      <path
        d="M19.63 25.12 0 .38 14.28.22l13.97 18.06-8.62 6.84z"
        style={{
          fill: "#ccc",
          strokeWidth: 0,
        }}
      />
      <circle
        cx={21.12}
        cy={33.22}
        r={18}
        style={{
          fill: "#db6800",
          strokeWidth: 0,
        }}
      />
      <rect
        width={27}
        height={6}
        x={7.62}
        y={13.22}
        rx={3}
        ry={3}
        style={{
          strokeWidth: 0,
          fill: "#a04a04",
        }}
      />
      <text
        style={{
          fill: "#a04a04",
          fontFamily: "Montserrat-Bold,Montserrat",
          fontSize: "19.42px",
          fontWeight: 700,
        }}
        transform="translate(15.55 39.85)"
      >
        <tspan x={0} y={0}>
          {"3"}
        </tspan>
      </text>
    </g>
  </svg>
)
const ForwardRef = forwardRef(SvgComponent)
const Memo = memo(ForwardRef)
export default Memo
