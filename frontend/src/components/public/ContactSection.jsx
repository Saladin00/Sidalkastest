// src/components/public/ContactSection.jsx
import React from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export default function ContactSection() {
  return (
    <section
      id="kontak"
      className="py-20 px-6 md:px-12 bg-gradient-to-br from-sky-700 to-cyan-600 text-white text-center"
    >
      <h2 className="text-3xl font-bold mb-6">Kontak Layanan Cepat Tanggap Sosial</h2>
      <p className="text-cyan-100 max-w-2xl mx-auto mb-10">
        Hubungi kami untuk informasi, pengaduan, atau bantuan sosial. Tim Dinas
        Sosial siap melayani dengan cepat dan ramah.
      </p>

      <div className="flex flex-col md:flex-row justify-center gap-8 max-w-4xl mx-auto">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20 flex flex-col items-center"
        >
          <Phone size={28} className="mb-3 text-yellow-300" />
          <p className="font-semibold">Hotline</p>
          <p className="text-cyan-100 text-sm">0812-3456-7890</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20 flex flex-col items-center"
        >
          <Mail size={28} className="mb-3 text-yellow-300" />
          <p className="font-semibold">Email Resmi</p>
          <p className="text-cyan-100 text-sm">dinsos@indramayukab.go.id</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20 flex flex-col items-center"
        >
          <MessageCircle size={28} className="mb-3 text-yellow-300" />
          <p className="font-semibold">WhatsApp</p>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noreferrer"
            className="text-cyan-100 text-sm hover:underline"
          >
            Kirim Pesan
          </a>
        </motion.div>
      </div>

      <div className="mt-12 max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-lg border border-white/20">
        <iframe
          title="Lokasi Dinas Sosial"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.307155836021!2d108.321!3d-6.327!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sDinas%20Sosial%20Kabupaten%20Indramayu!5e0!3m2!1sen!2sid!4v00000000000"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </section>
  );
}
