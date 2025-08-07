const Faq = () => {
  return <div className=" sm:py-48 py-20 bg-[url('/background.png')] bg-cover">
    <h1 className=" font-montserrat text-white text-3xl font-semibold sm:text-5xl text-center">Frequently asked <span className="text-yellow-500">questions</span></h1>

    <div className="max-w-4xl px-5 mx-auto mt-10 flex flex-col gap-5 py-10">
        <div className="collapse text-white collapse-plus bg-white/10 backdrop-blur-sm border border-hCard rounded-xl shadow-lg">
            <input type="radio" name="my-accordion-3" />
            <div className="collapse-title text-2xl font-montserrat font-semibold">1. How is my data protected?</div>
            <div className="collapse-content font-montserrat text-sm font-semibold text-hCard">
                Your privacy is very important. Be aware that you data and chat history are private. The OP Mental Performance Ai Coach does not store any of your data in the cloud. Additionally, the app was desinged to only store minimal data necessary to help you gain the most value from the app. All data stored is done so locally on your device.Click the "Sign Up" button in the top right corner and follow the registration process.
            </div>
        </div>
        <div className="collapse text-white collapse-plus bg-white/10 backdrop-blur-sm border border-hCard rounded-xl shadow-lg">
            <input type="radio" name="my-accordion-3" />
            <div className="collapse-title text-2xl font-montserrat font-semibold">2. Can I cancel anytime?</div>
            <div className="collapse-content font-montserrat text-sm font-semibold text-hCard">
                Yes, you can cancel your subscription at any time. Simply go to your account settings and follow the cancellation process. If you have any issues, feel free to contact our support team for assistance.
            </div>
        </div>
        <div className="collapse text-white collapse-plus bg-white/10 backdrop-blur-sm border border-hCard rounded-xl shadow-lg">
            <input type="radio" name="my-accordion-3" />
            <div className="collapse-title text-2xl font-montserrat font-semibold">3. Does the AI Coach Replace human coaching?</div>
            <div className="collapse-content font-montserrat text-sm font-semibold text-hCard">
                The OP Mental Performance Ai Coach is designed to complement human coaching, not replace it. While the AI Coach can provide valuable insights and support, human coaches bring empathy, understanding, and personal experience that an AI cannot replicate. We recommend using the AI Coach as a tool alongside traditional coaching methods for the best results.
            </div>
        </div>
        <div className="collapse text-white collapse-plus bg-white/10 backdrop-blur-sm border border-hCard rounded-xl shadow-lg">
            <input type="radio" name="my-accordion-3" />
            <div className="collapse-title text-2xl font-montserrat font-semibold">4. What genres or styles does it support?</div>
            <div className="collapse-content font-montserrat text-sm font-semibold text-hCard">
                The OP Mental Performance Ai Coach is designed to support a wide range of genres and styles. Whether you're into sports, music, art, or any other field, the AI Coach can provide tailored guidance and insights to help you improve your performance. Simply let the AI know your specific interests and goals, and it will adapt its coaching approach accordingly.
            </div>
        </div>
        
    </div>
  </div>;
};

export default Faq;
