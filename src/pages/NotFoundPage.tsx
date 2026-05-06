import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { SEO } from "../components/SEO";

export function NotFoundPage() {
  return (
    <>
      <SEO
        title="Page Not Found | ACT Creative"
        description="The page you are looking for does not exist."
        path="/404"
        noindex
      />
      <section className="min-h-[60vh] flex items-center justify-center bg-black">
        <div className="container mx-auto px-6 lg:px-8 text-center max-w-xl">
          <p className="text-[#CCFF00] text-7xl mb-4">404</p>
          <h1 className="text-3xl text-white mb-4">Page not found</h1>
          <p className="text-gray-400 mb-8">
            The page you are looking for does not exist or has moved. Try one of the
            links below.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              className="bg-[#CCFF00] hover:bg-[#b8e600] text-black"
            >
              <Link to="/">Back to Home</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-[#CCFF00] text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black bg-transparent"
            >
              <Link to="/services">Browse Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
