import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, HeartPulse, User, ClipboardList } from 'lucide-react';
import './Signup.css';

const Signup = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const variants = {
    enter: (direction) => ({ x: direction > 0 ? 30 : -30, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? 30 : -30, opacity: 0 })
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        {/* Progress Header */}
        <div className="signup-header">
          <h2 className="signup-title">Patient Onboarding</h2>
          <p className="signup-subtitle">We’re here to support you every step of the way.</p>
          <div className="progress-track">
            <motion.div 
              className="progress-bar" 
              initial={{ width: 0 }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="form-wrapper">
          <AnimatePresence mode="wait" custom={step}>
            <motion.div
              key={step}
              custom={step}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {step === 1 && <PersonalInfo />}
              {step === 2 && <MedicalHistory />}
              {step === 3 && <LifestyleConsent />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Actions */}
        <div className="signup-footer">
          {step > 1 ? (
            <button onClick={prevStep} className="btn-back">
              <ChevronLeft size={18} /> Back
            </button>
          ) : <div />}
          
          <button onClick={nextStep} className="btn-next">
            {step === totalSteps ? 'Complete Signup' : 'Next Step'} 
            {step !== totalSteps && <ChevronRight size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

const PersonalInfo = () => (
  <div className="input-group">
    <div className="section-heading"><User size={20} /> <h3>Personal Details</h3></div>
    <input type="text" placeholder="Full Name" className="form-input" />
    <input type="date" className="form-input" title="Date of Birth" />
    <select className="form-input">
      <option value="">Select Gender</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="other">Non-binary / Other</option>
    </select>
  </div>
);

const MedicalHistory = () => (
  <div className="input-group">
    <div className="section-heading"><HeartPulse size={20} /> <h3>Medical Profile</h3></div>
    <select className="form-input">
      <option value="">Primary Diagnosis Site</option>
      <option value="tongue">Tongue</option>
      <option value="floor">Floor of Mouth</option>
      <option value="gums">Gums/Palate</option>
    </select>
    <select className="form-input">
      <option value="">Current Treatment Stage</option>
      <option value="new">Newly Diagnosed</option>
      <option value="active">Active Treatment</option>
      <option value="remission">Remission/Surveillance</option>
    </select>
    <input type="text" placeholder="Treating Hospital/Clinic" className="form-input" />
  </div>
);

const LifestyleConsent = () => (
  <div className="input-group">
    <div className="section-heading"><ClipboardList size={20} /> <h3>Final Steps</h3></div>
    <label className="checkbox-container">
      <input type="checkbox" />
      <span>I agree to the HIPAA-compliant data privacy terms.</span>
    </label>
    <label className="checkbox-container">
      <input type="checkbox" />
      <span>I consent to share my history with my care team.</span>
    </label>
  </div>
);

export default Signup;