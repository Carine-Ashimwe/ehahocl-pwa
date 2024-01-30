
export const MsgText = ({ text, textColor }: { text: any, textColor: string }) => {
  return (
    <>
      <small
        style={
          textColor === 'danger'
            ? {
              fontSize: '13px',
              color: '#ff416c',
              float: 'left',
              margin: '-15px 0px 10px 0px',
              display: 'block',
            }
            : {
              fontSize: '13px',
              color: 'green',
              float: 'left',
              margin: '-15px 0px 10px 0px',
              display: 'block',
            }
        }
      >
        <i style={{ paddingRight: '3px' }} className="icon-material-outline-info"></i>
        <i>{text}</i>
      </small>
    </>
  );
};


