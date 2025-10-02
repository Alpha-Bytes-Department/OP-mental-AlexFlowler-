const Faq = () => {
  return (
    <div className="sm:py-48 py-20 bg-[url('/background.png')] bg-cover">
      <h1 className="font-montserrat text-3xl font-semibold sm:text-5xl text-center bg-gradient-to-r from-[#8E7D3F] to-[#DBD0A6] bg-clip-text text-transparent">
        Frequently asked questions
      </h1>

      <div className="max-w-4xl px-5 mx-auto mt-10 flex flex-col gap-5 py-10">
        <div className="collapse collapse-plus bg-white/10 backdrop-blur-sm border border-hCard rounded-xl shadow-lg">
          <input type="radio" name="my-accordion-3" />
          <div className="collapse-title text-2xl font-montserrat font-semibold bg-gradient-to-r from-[#8E7D3F] to-[#DBD0A6] bg-clip-text text-transparent">
            1. How is my data protected?
          </div>
          <div className="collapse-content font-montserrat text-sm font-semibold bg-gradient-to-r from-[#8E7D3F] to-[#DBD0A6] bg-clip-text text-transparent">
            Your data is secured with end-to-end encryption, ensuring conversations are private. Our system is designed with a no-storage policy. Chat sessions have a 24-hr expiry, and are never written to a database or server. In addition, we deploy on HIPAA-eligible AWS infrastructure, protected by enterprise-grade firewalls, monitoring, and compliance controls to meet corporate security standards.
          </div>
        </div>

        <div className="collapse collapse-plus bg-white/10 backdrop-blur-sm border border-hCard rounded-xl shadow-lg">
          <input type="radio" name="my-accordion-3" />
          <div className="collapse-title text-2xl font-montserrat font-semibold bg-gradient-to-r from-[#8E7D3F] to-[#DBD0A6] bg-clip-text text-transparent">
            2. Can I cancel anytime?
          </div>
          <div className="collapse-content font-montserrat text-sm font-semibold bg-gradient-to-r from-[#8E7D3F] to-[#DBD0A6] bg-clip-text text-transparent">
            Yes, you can cancel your subscription at any time through your account settings. Your access will remain active until the end of your current monthly billing period, after which the subscription will not renew.
          </div>
        </div>

        <div className="collapse collapse-plus bg-white/10 backdrop-blur-sm border border-hCard rounded-xl shadow-lg">
          <input type="radio" name="my-accordion-3" />
          <div className="collapse-title text-2xl font-montserrat font-semibold bg-gradient-to-r from-[#8E7D3F] to-[#DBD0A6] bg-clip-text text-transparent">
            3. Does the Al Coach replace clinical therapy?
          </div>
          <div className="collapse-content font-montserrat text-sm font-semibold bg-gradient-to-r from-[#8E7D3F] to-[#DBD0A6] bg-clip-text text-transparent">
          No, the Al Coach is not a replacement for clinical treatment or mental health care. It is designed to support performance and overall wellbeing. It can not assess, diagnose, or treat medical or psychological conditions. For clinical concerns, we recommend seeking care from a licensed mental health professional.
          </div>
        </div>

        <div className="collapse collapse-plus bg-white/10 backdrop-blur-sm border border-hCard rounded-xl shadow-lg">
          <input type="radio" name="my-accordion-3" />
          <div className="collapse-title text-2xl font-montserrat font-semibold bg-gradient-to-r from-[#8E7D3F] to-[#DBD0A6] bg-clip-text text-transparent">
            4. Can my organization gain access to my chat history?
          </div>
          <div className="collapse-content font-montserrat text-sm font-semibold bg-gradient-to-r from-[#8E7D3F] to-[#DBD0A6] bg-clip-text text-transparent">
            No, your organization cannot access your chat history. Our platform is designed with a strict no-storage policy. Conversations are processed in real time, never saved to a database, and cannot be retrieved by employers or third parties.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
