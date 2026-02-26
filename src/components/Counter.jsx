import CountUp from 'react-countup'

export default function Counter({ end, duration = 2, suffix = '' }) {
  return (
    <CountUp end={end} duration={duration} suffix={suffix} />
  )
}
