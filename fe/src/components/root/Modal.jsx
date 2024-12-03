export function Modal({ isOpen, onClose, onConfirm, message, buttonMessage }) {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <button className="close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer btn-wrap">
          <button className="btn btn-dark-outline" onClick={onClose}>
            닫기
          </button>
          <button className="btn btn-dark" onClick={onConfirm}>
            {buttonMessage}
          </button>
        </div>
      </div>
    </div>
  );
}
