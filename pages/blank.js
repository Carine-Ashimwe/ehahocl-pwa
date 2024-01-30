import Link from "next/link";

function Blank() {
  return (
    <div className="auth-description">
      <h1 className="text-grey my-4">Page blank!</h1>
      <h4 className="text-grey font-weight-normal">
        Welcome to  eHaho! this is blank page.
      </h4>
      <h4 className="text-grey font-weight-normal">
        <Link href="/vendor/dashboard" className="color-primary ml-1">Back Home</Link>
      </h4>
    </div>
  );
}

export default Blank;
