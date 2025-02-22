import PropTypes from 'prop-types';
import { ToastOptions, toast } from 'react-toastify';

setMessage.propTypes = {
  severity: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  text: PropTypes.string,
};
export default function setMessage(severity, text) {
  const options = {
    theme: 'colored',
    autoClose: 6000,
    position: toast.POSITION.BOTTOM_RIGHT,
    hideProgressBar: true,
  };

  switch (severity) {
    case 'info':
      toast.info(text, options);
      break;
    case 'success':
      toast.success(text, options);
      break;
    case 'warning':
      toast.warn(text, options);
      break;
    case 'error':
      toast.error(text, options);
      break;
    default:
      toast(text, options);
  }
}
