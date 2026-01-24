import React from "react";
import { FaShieldAlt, FaMoneyCheck, FaClock, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

function Landing() {
    return (
        <div
            className="min-h-screen bg-cover bg-center"
            style={{
                backgroundImage: `url('https://img.freepik.com/premium-photo/abstract-background-template-graphic-designs-layouts-vintage-retro-grunge-textured_7954-6809.jpg?w=1380')`,
            }}
        >
            {/* Unique Navbar */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
                <div className="container mx-auto p-4 flex flex-col md:flex-row justify-between items-center">
                    {/* Logo and Title */}
                    <div className="flex items-center space-x-2">
                        <img
                            src="https://cdn-icons-png.flaticon.com/128/1466/1466700.png"
                            alt="Logo"
                            className="w-10 h-10"
                        />
                        <h1 className="text-2xl font-bold text-blue-600">Easy Loan!</h1>
                    </div>

                    {/* Buttons with Hover Animation */}
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <Link to="login" className="relative px-4 py-2 text-blue-600 font-semibold rounded-lg overflow-hidden group">
                            <span className="relative z-10">Login</span>
                            <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-10 transition duration-300"></div>
                        </Link>
                        <Link to="register" className="relative px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg overflow-hidden group">
                            <span className="relative z-10">Register</span>
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition duration-300"></div>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section with Background Image */}
            <header className="relative flex flex-col md:flex-row items-center justify-center p-6 md:p-10 text-center">
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative z-10 md:w-1/2">
                    <h2 className="text-3xl md:text-4xl font-bold text-green">
                        Get Your Personal Loan Now!
                    </h2>
                    <p className="text-lg mt-3 text-black-200">
                        Quick approvals, flexible EMIs, and low interest rates.
                    </p>
                    <p className="text-lg mt-3 text-gray-600">
                        Whether it's for a car, home renovation, or personal expenses, we offer loans that suit your needs. Our easy application process ensures fast approval, and our team is here to assist you every step of the way.
                    </p>
                    <p className="text-lg mt-3 text-gray-600 mb-6">
    Apply now and take the first step toward achieving your financial goals!
</p>
                    <Link to="login" className="mt-10 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg overflow-hidden group">
                        <span className="relative z-10">Apply Now!</span>
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition duration-300"></div>
                    </Link>

                </div>

                <div className="relative z-10 md:w-1/2 mt-8 md:mt-0">
                    <img
                        src="https://img.freepik.com/free-vector/social-assistance-abstract-concept-vector-illustration-social-services-workers-low-income-care-about-seniors-volunteer-help-home-nursing-caregiver-support-disabled-person-abstract-metaphor_335657-1409.jpg?t=st=1738227034~exp=1738230634~hmac=b46e29f64f97146a74b31589731a6a9f915b7d21ad4d2b04d55522311e7227a2&w=740"
                        alt="Loan Illustration"
                        className="w-3/4 mx-auto rounded-lg "
                    />
                </div>
            </header>

            {/* Features Section */}
            <section className="py-12 px-4 md:px-6 text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-8">Why Choose Us?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-white shadow-lg rounded-lg transform hover:scale-105 transition duration-300">
                        <FaClock className="text-blue-600 text-5xl mx-auto mb-3" />
                        <h3 className="text-xl font-semibold">Fast Approvals</h3>
                        <p className="text-gray-600">Get approved within 24 hours.</p>
                    </div>
                    <div className="p-6 bg-white shadow-lg rounded-lg transform hover:scale-105 transition duration-300">
                        <FaMoneyCheck className="text-green-600 text-5xl mx-auto mb-3" />
                        <h3 className="text-xl font-semibold">Low Interest Rates</h3>
                        <p className="text-gray-600">Starting from just 10% annually.</p>
                    </div>
                    <div className="p-6 bg-white shadow-lg rounded-lg transform hover:scale-105 transition duration-300">
                        <FaShieldAlt className="text-red-600 text-5xl mx-auto mb-3" />
                        <h3 className="text-xl font-semibold">Secure & Trusted</h3>
                        <p className="text-gray-600">Your information is 100% safe.</p>
                    </div>
                </div>
            </section>

            {/* Apply Section with Gradient Background */}
            <section
                className="bg-gradient-to-r  text-black py-12 px-4 md:px-6 text-center"
            >
                <div className="relative z-10">
                    <h2 className="text-2xl md:text-3xl font-bold">Ready to Apply?</h2>
                    <p className="text-lg my-4">
                        Click below and get started on your journey to financial freedom.
                    </p>
                    <Link to="login" className=" mt-5 relative px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg overflow-hidden group">
                        <span className="relative z-10">Apply Now!</span>
                    </Link>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition duration-300"></div>

                </div>
                <div className="absolute inset-0 bg-black opacity-40"></div>
            </section>

            {/* Testimonials Section */}
            <section className="py-12 px-4 md:px-6 text-center bg-gradient-to-r">

                <h2 className="text-2xl md:text-3xl font-bold mb-8">What Our Clients Say</h2>

                <div className="flex flex-wrap justify-center gap-8">
                    <div className="w-full sm:w-1/3 p-4 bg-white shadow-lg rounded-lg transform hover:scale-105 transition duration-300">
                        <p className="italic text-gray-600">"LoanEase helped me get my loan approved in no time! The process was smooth and stress-free."</p>
                        <h4 className="mt-4 font-semibold text-blue-600">Vaibhav Kale</h4>
                        <p className="text-gray-500">Entrepreneur</p>
                    </div>
                    <div className="w-full sm:w-1/3 p-4 bg-white shadow-lg rounded-lg transform hover:scale-105 transition duration-300">
                        <p className="italic text-gray-600">"I got the best rates on my loan. Highly recommend LoanEase to anyone in need of financial assistance."</p>
                        <h4 className="mt-4 font-semibold text-blue-600">Ganesh Pawar</h4>
                        <p className="text-gray-500">Freelancer</p>
                    </div>
                    <div className="w-full sm:w-1/3 p-4 bg-white shadow-lg rounded-lg transform hover:scale-105 transition duration-300">
                        <p className="italic text-gray-600">"A very trustworthy platform. Fast, secure, and reliable."</p>
                        <h4 className="mt-4 font-semibold text-blue-600">Prajwal Rumale</h4>
                        <p className="text-gray-500">Small Business Owner</p>
                    </div>
                </div>
            </section>

            {/* Contact Us Section */}
            <section className="py-12 px-4 md:px-6 text-center  bg-gradient-to-r text-black">
                <h2 className="text-2xl md:text-3xl font-bold mb-8">Get in Touch</h2>
                <p className="text-lg mb-6">Have questions? We're here to help you. Reach out to us anytime.</p>
                <button className="bg-blue-600 px-6 py-2 rounded text-lg text-white font-semibold hover:bg-blue-700 transition duration-300">
                    Contact Us
                </button>

            </section>

            {/* Footer with Social Media Icons */}
            <footer className="bg-cover bg-center py-8 text-center text-white">
                <div className="container mx-auto">
                    <h3 className="text-xl font-semibold mb-4 text-black">Follow Us</h3>
                    <div className="flex justify-center space-x-6">
                        <a href="#" className="text-black hover:text-blue-600 transition-colors duration-300">
                            <FaFacebook size={30} />
                        </a>
                        <a href="#" className="text-black hover:text-blue-400 transition-colors duration-300">
                            <FaTwitter size={30} />
                        </a>
                        <a href="#" className="text-black hover:text-pink-500 transition-colors duration-300">
                            <FaInstagram size={30} />
                        </a>
                        <a href="#" className="text-black hover:text-blue-700 transition-colors duration-300">
                            <FaLinkedin size={30} />
                        </a>
                    </div>
                </div>
            </footer>

        </div>
    );
}

export default Landing;
