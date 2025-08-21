"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cinzel, lora } from '@/lib/fonts';
import Image from 'next/image';

const AboutPage = () => {
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'vi' | 'en' | null;
    if (savedLanguage) setLanguage(savedLanguage);

    const handleLanguageChange = (event: CustomEvent) => {
      setLanguage(event.detail.language);
    };
    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => window.removeEventListener('languageChange', handleLanguageChange as EventListener);
  }, []);

  const content = {
    vi: {
      title: 'Về Weathered',
      subtitle: 'Câu chuyện của chúng tôi',
      historyTitle: 'Lịch sử hình thành',
      historyText: 'Weathered được thành lập vào năm 2020 với niềm đam mê mang đến những sản phẩm thời trang chất lượng cao, kết hợp giữa phong cách cổ điển và hiện đại. Chúng tôi bắt đầu từ một xưởng may nhỏ tại TP. Hồ Chí Minh, và giờ đây đã trở thành thương hiệu được yêu thích bởi sự tinh tế và bền vững.',
      missionTitle: 'Sứ mệnh của chúng tôi',
      missionText: 'Tại Weathered, chúng tôi cam kết tạo ra những sản phẩm không chỉ đẹp mà còn thân thiện với môi trường. Mỗi sản phẩm đều được thiết kế tỉ mỉ, sử dụng chất liệu bền vững và quy trình sản xuất có trách nhiệm với xã hội.',
      contactTitle: 'Liên hệ',
      contactText: 'Hãy kết nối với chúng tôi qua email hoặc số điện thoại để biết thêm về các bộ sưu tập mới nhất hoặc đặt hàng theo yêu cầu.',
      contactEmail: 'Email: nhatlinh807203@gmail.com',
      contactPhone: 'Điện thoại: +84 123 456 789',
      footer: 'Trân trọng,\nWeathered Team',
    },
    en: {
      title: 'About Weathered',
      subtitle: 'Our Story',
      historyTitle: 'Our History',
      historyText: 'Weathered was founded in 2020 with a passion for delivering high-quality fashion that blends classic and modern styles. Starting from a small workshop in Ho Chi Minh City, we have grown into a beloved brand known for sophistication and sustainability.',
      missionTitle: 'Our Mission',
      missionText: 'At Weathered, we are committed to creating products that are not only beautiful but also environmentally friendly. Each item is meticulously designed, using sustainable materials and socially responsible production processes.',
      contactTitle: 'Contact Us',
      contactText: 'Connect with us via email or phone to learn more about our latest collections or place custom orders.',
      contactEmail: 'Email: nhatlinh807203@gmail.com',
      contactPhone: 'Phone: +84 123 456 789',
      footer: 'Best regards,\nWeathered Team',
    },
  };

  return (
    <div className={`bg-white py-24 ${cinzel.variable} ${lora.variable}`}>
      <div className="container max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs uppercase tracking-widest text-gray-600 mb-3 block">
            {language === 'vi' ? 'GIỚI THIỆU' : 'ABOUT'}
          </span>
          <h2 className="text-4xl md:text-5xl text-black font-cinzel font-bold mb-4">
            {content[language].title}
          </h2>
          <span className="block w-16 h-[1px] bg-gray-900 mx-auto"></span>
        </motion.div>

        {/* History Section */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-2xl md:text-3xl text-black font-cinzel font-bold mb-4 text-center">
            {content[language].historyTitle}
          </h3>
          <p className="text-gray-600 text-base md:text-lg font-lora leading-relaxed text-center max-w-3xl mx-auto">
            {content[language].historyText}
          </p>
          <div className="mt-8 flex justify-center">
            <Image
              src="https://res.cloudinary.com/your-cloudinary-id/image/upload/v1234567890/weathered-workshop.jpg"
              alt="Weathered Workshop"
              width={600}
              height={400}
              className="rounded-lg shadow-md"
            />
          </div>
        </motion.section>

        {/* Mission Section */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl md:text-3xl text-black font-cinzel font-bold mb-4 text-center">
            {content[language].missionTitle}
          </h3>
          <p className="text-gray-600 text-base md:text-lg font-lora leading-relaxed text-center max-w-3xl mx-auto">
            {content[language].missionText}
          </p>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-2xl md:text-3xl text-black font-cinzel font-bold mb-4 text-center">
            {content[language].contactTitle}
          </h3>
          <p className="text-gray-600 text-base md:text-lg font-lora leading-relaxed text-center max-w-3xl mx-auto">
            {content[language].contactText}
          </p>
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-base font-lora">{content[language].contactEmail}</p>
            <p className="text-gray-600 text-base font-lora">{content[language].contactPhone}</p>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-gray-600 text-base font-lora whitespace-pre-line">
            {content[language].footer}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;