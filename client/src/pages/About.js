import React from "react";
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube, FaLinkedin } from "react-icons/fa";

export default function About() {
  const founders = [
    { name: "Sufian Narwade", role: "Co-Founder & CEO", email: "sufian@showmint.com", initials: "SN" },
    { name: "Jyotprit Singh Arora", role: "Co-Founder & CTO", email: "jyotprit@showmint.com", initials: "JS" },
    { name: "Mohammed Zaid Khan", role: "Co-Founder & COO", email: "zaid@showmint.com", initials: "ZK" }
  ];

  return (
    <div className="max-w-3xl mx-auto my-8 p-10 bg-gradient-to-br from-purple-500 to-indigo-800 rounded-2xl text-white">
      <h1 className="text-3xl font-extrabold mb-4">About ShowMint</h1>
      <p className="mb-4">Your premier cinema booking platform delivering exceptional movie experiences.</p>
      <p className="mb-4">Contact: support@showmint.com</p>
      <h2 className="text-xl font-bold mt-8 mb-4">Founders</h2>
      <div className="flex flex-wrap gap-8 mb-8">
        {founders.map(f => (
          <div key={f.email} className="bg-white/10 rounded-2xl p-6 min-w-[220px] text-center">
            <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-purple-700 flex items-center justify-center text-3xl font-extrabold">{f.initials}</div>
            <div className="font-bold text-lg">{f.name}</div>
            <div className="opacity-85 text-sm">{f.role}</div>
            <div className="opacity-80 text-xs">{f.email}</div>
          </div>
        ))}
      </div>
      <h2 className="text-xl font-bold mb-2">Follow Us</h2>
      <div className="flex gap-4 text-2xl justify-center">
        <a href="https://instagram.com/showmint" target="_blank" rel="noreferrer"><FaInstagram /></a>
        <a href="https://facebook.com/showmint" target="_blank" rel="noreferrer"><FaFacebook /></a>
        <a href="https://twitter.com/showmint" target="_blank" rel="noreferrer"><FaTwitter /></a>
        <a href="https://youtube.com/showmint" target="_blank" rel="noreferrer"><FaYoutube /></a>
        <a href="https://linkedin.com/company/showmint" target="_blank" rel="noreferrer"><FaLinkedin /></a>
      </div>
    </div>
  );
}
