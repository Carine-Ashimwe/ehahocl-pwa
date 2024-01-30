import Link from "next/link";

function Notfound() {
  return (
    <div className="auth-description">
      <h1 className="text-grey my-4">Page not found!</h1>
      <h4 className="text-grey font-weight-normal">
        Welcome to  eHaho! The page or product you&#39;re trying to access is either removed or misplaced
      </h4>
      <h4 className="text-grey font-weight-normal">
        <Link href="/vendor/dashboard" className="color-primary ml-1">Back Home</Link>
      </h4>
    </div>
  );
}

export default Notfound;
