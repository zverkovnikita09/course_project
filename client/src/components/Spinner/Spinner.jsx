import './Spinner.css'

export const Spinner = ({ isBlue }) => {
  return (
    <span className={`spinner ${isBlue ? "blue" : ''}`} />
  )
};