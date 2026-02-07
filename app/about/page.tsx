import React from 'react';
import Link from 'next/link';
import { Heart, Globe, Users, TrendingUp, Award, Target, Zap, Music, Video, FileText, BarChart3, Mail, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'About Us | 100AFRO',
  description: 'Learn about 100AFRO, the world\'s leading destination for African entertainment, bridging the gap between the continent and the diaspora.',
};

export default function AboutPage() {
  return (
    <div className="bg-gray-900 min-h-screen pt-12 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            About 100AFRO
          </h1>
          <p className="text-gray-400 text-lg">
            The world&apos;s leading destination for African entertainment
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-afro-primary/10 to-afro-secondary/10 rounded-2xl p-6 lg:p-8 border border-afro-primary/20">
            <p className="text-gray-200 text-xl leading-relaxed font-serif">
              We are the pulse of African culture, delivering verified news, exclusive interviews, and premium video content to millions of readers worldwide. 100AFRO bridges the gap between the continent and the diaspora, celebrating the richness and diversity of African entertainment.
            </p>
          </section>

          {/* Mission */}
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Target className="text-afro-primary" size={24} />
              <h2 className="text-2xl font-display font-bold text-white">Our Mission</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              To be the premier global platform for African entertainment, connecting audiences worldwide with the latest news, music, videos, and cultural content from across the continent. We strive to amplify African voices, celebrate our heritage, and showcase the incredible talent that defines modern African entertainment.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Our mission extends beyond content delivery—we are building a community that honors tradition while embracing innovation, creating a space where African culture thrives and reaches new heights on the global stage.
            </p>
          </section>

          {/* What We Do */}
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="text-afro-primary" size={24} />
              <h2 className="text-2xl font-display font-bold text-white">What We Do</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              100AFRO provides comprehensive coverage of African entertainment across multiple platforms and formats:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="text-afro-primary" size={20} />
                  <h3 className="text-lg font-bold text-white">News & Editorial</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Breaking news, in-depth features, exclusive interviews, and thought-provoking articles covering the African entertainment industry.
                </p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <Video className="text-afro-primary" size={20} />
                  <h3 className="text-lg font-bold text-white">Video Content</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Curated video galleries featuring music videos, interviews, performances, and exclusive behind-the-scenes content.
                </p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <Music className="text-afro-primary" size={20} />
                  <h3 className="text-lg font-bold text-white">Music Charts</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Live music charts powered by Spotify, tracking the hottest tracks across Africa and the diaspora.
                </p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 className="text-afro-primary" size={20} />
                  <h3 className="text-lg font-bold text-white">Trending Topics</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Real-time tracking of trending topics, artists, and cultural movements shaping African entertainment.
                </p>
              </div>
            </div>
          </section>

          {/* Our Story */}
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="text-afro-primary" size={24} />
              <h2 className="text-2xl font-display font-bold text-white">Our Story</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              100AFRO was born from a simple yet powerful vision: to create a unified platform that celebrates and amplifies African entertainment on a global scale. Recognizing the gap between the continent and the diaspora, we set out to build a bridge that connects audiences, artists, and culture enthusiasts worldwide.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              What started as a passion project has grown into a trusted source of entertainment news and content, reaching millions of readers across the globe. We&apos;ve built our reputation on accuracy, authenticity, and an unwavering commitment to showcasing the best of African culture.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Today, 100AFRO stands as a testament to the power of African creativity and the global appetite for our rich cultural heritage. We continue to evolve, innovate, and expand our reach, always staying true to our mission of celebrating African excellence.
            </p>
          </section>

          {/* Our Values */}
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <Award className="text-afro-primary" size={24} />
              <h2 className="text-2xl font-display font-bold text-white">Our Values</h2>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-afro-primary pl-4">
                <h3 className="text-xl font-bold text-white mb-2">Authenticity</h3>
                <p className="text-gray-300">
                  We are committed to authentic storytelling and accurate reporting. Our content reflects the true diversity and richness of African entertainment, without sensationalism or misrepresentation.
                </p>
              </div>
              <div className="border-l-4 border-afro-secondary pl-4">
                <h3 className="text-xl font-bold text-white mb-2">Excellence</h3>
                <p className="text-gray-300">
                  We strive for excellence in everything we do—from the quality of our journalism to the user experience of our platform. We believe African content deserves world-class presentation.
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-xl font-bold text-white mb-2">Inclusivity</h3>
                <p className="text-gray-300">
                  We celebrate the diversity of African culture, representing voices from across the continent and diaspora. Our platform is a space where all African stories can be told and heard.
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="text-xl font-bold text-white mb-2">Innovation</h3>
                <p className="text-gray-300">
                  We embrace technology and innovation to deliver content in new and engaging ways, always looking for opportunities to enhance how audiences connect with African entertainment.
                </p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="text-xl font-bold text-white mb-2">Community</h3>
                <p className="text-gray-300">
                  We believe in the power of community. Our platform brings together fans, artists, and industry professionals, fostering connections and conversations that drive culture forward.
                </p>
              </div>
            </div>
          </section>

          {/* Our Reach */}
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="text-afro-primary" size={24} />
              <h2 className="text-2xl font-display font-bold text-white">Our Global Reach</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              With a presence spanning multiple continents, 100AFRO connects audiences worldwide:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-900 rounded-lg p-4 text-center border border-gray-700">
                <div className="text-3xl font-bold text-afro-primary mb-2">10M+</div>
                <div className="text-sm text-gray-400">Monthly Readers</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 text-center border border-gray-700">
                <div className="text-3xl font-bold text-afro-primary mb-2">50+</div>
                <div className="text-sm text-gray-400">Countries Reached</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 text-center border border-gray-700">
                <div className="text-3xl font-bold text-afro-primary mb-2">1000+</div>
                <div className="text-sm text-gray-400">Articles Published</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 text-center border border-gray-700">
                <div className="text-3xl font-bold text-afro-primary mb-2">24/7</div>
                <div className="text-sm text-gray-400">Content Updates</div>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <p className="text-sm text-gray-400 font-bold mb-2">Our Presence:</p>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="px-3 py-1 bg-afro-primary/20 text-afro-primary rounded-full">Lagos</span>
                <span className="px-3 py-1 bg-afro-primary/20 text-afro-primary rounded-full">London</span>
                <span className="px-3 py-1 bg-afro-primary/20 text-afro-primary rounded-full">New York</span>
                <span className="px-3 py-1 bg-afro-primary/20 text-afro-primary rounded-full">Johannesburg</span>
                <span className="px-3 py-1 bg-afro-primary/20 text-afro-primary rounded-full">Accra</span>
                <span className="px-3 py-1 bg-afro-primary/20 text-afro-primary rounded-full">Nairobi</span>
              </div>
            </div>
          </section>

          {/* What Makes Us Unique */}
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="text-afro-primary" size={24} />
              <h2 className="text-2xl font-display font-bold text-white">What Makes Us Unique</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-afro-primary/20 flex items-center justify-center">
                  <span className="text-afro-primary font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Comprehensive Coverage</h3>
                  <p className="text-gray-300 text-sm">
                    From breaking news to deep-dive features, we cover all aspects of African entertainment—music, film, fashion, sports, and culture.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-afro-primary/20 flex items-center justify-center">
                  <span className="text-afro-primary font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Real-Time Updates</h3>
                  <p className="text-gray-300 text-sm">
                    Our platform delivers live music charts, trending topics, and breaking news as they happen, keeping you ahead of the curve.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-afro-primary/20 flex items-center justify-center">
                  <span className="text-afro-primary font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Verified Content</h3>
                  <p className="text-gray-300 text-sm">
                    We prioritize accuracy and verification, ensuring our readers receive reliable, fact-checked information from trusted sources.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-afro-primary/20 flex items-center justify-center">
                  <span className="text-afro-primary font-bold">4</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Global Perspective</h3>
                  <p className="text-gray-300 text-sm">
                    We bridge the gap between the continent and diaspora, providing a platform that speaks to African audiences worldwide.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-afro-primary/20 flex items-center justify-center">
                  <span className="text-afro-primary font-bold">5</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Community Engagement</h3>
                  <p className="text-gray-300 text-sm">
                    Through polls, comments, and interactive features, we foster a vibrant community where voices are heard and opinions matter.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Join Us */}
          <section className="bg-gradient-to-br from-afro-primary/20 to-afro-secondary/20 rounded-2xl p-6 lg:p-8 border border-afro-primary/30">
            <div className="flex items-center gap-3 mb-4">
              <Users className="text-afro-primary" size={24} />
              <h2 className="text-2xl font-display font-bold text-white">Join Our Community</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              Whether you&apos;re a fan, artist, industry professional, or simply passionate about African entertainment, there&apos;s a place for you in the 100AFRO community. Subscribe to our newsletter, follow us on social media, or explore our team to learn more about the people behind the platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/team"
                className="inline-flex items-center gap-2 px-6 py-3 bg-afro-primary text-black font-bold rounded-lg hover:bg-white transition-colors"
              >
                Meet Our Team
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/careers"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
              >
                View Careers
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
              >
                Contact Us
                <Mail size={18} />
              </Link>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="text-afro-primary" size={24} />
              <h2 className="text-2xl font-display font-bold text-white">Get in Touch</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              Have questions, suggestions, or want to collaborate? We&apos;d love to hear from you.
            </p>
            <div className="bg-gray-900 rounded-lg p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-400 font-bold mb-1">General Inquiries:</p>
                <a href="mailto:info@100afro.com" className="text-afro-primary hover:underline">
                  info@100afro.com
                </a>
              </div>
              <div>
                <p className="text-sm text-gray-400 font-bold mb-1">Media & Press:</p>
                <a href="mailto:press@100afro.com" className="text-afro-primary hover:underline">
                  press@100afro.com
                </a>
              </div>
              <div>
                <p className="text-sm text-gray-400 font-bold mb-1">Partnerships:</p>
                <a href="mailto:partnerships@100afro.com" className="text-afro-primary hover:underline">
                  partnerships@100afro.com
                </a>
              </div>
              <div>
                <p className="text-sm text-gray-400 font-bold mb-1">Or visit our:</p>
                <Link href="/contact" className="text-afro-primary hover:underline">
                  Contact Page
                </Link>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-afro-primary hover:text-white font-bold transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

