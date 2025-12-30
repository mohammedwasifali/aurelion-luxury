import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';

const About = () => {
  return (
    <Layout>
      <section className="py-24 px-6 min-h-screen">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-primary uppercase tracking-[0.3em] text-sm font-body mb-4">
              Our Heritage
            </p>
            <h1 className="font-display text-4xl md:text-6xl text-foreground">
              The House of Aurelion
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <p className="font-elegant text-xl md:text-2xl text-muted-foreground leading-relaxed italic text-center">
              "Founded in 1892, AURELION has been the guardian of timeless elegance for over a century."
            </p>

            <div className="grid md:grid-cols-2 gap-12 mt-16">
              <div>
                <h2 className="font-display text-2xl text-foreground mb-4">Our Legacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  From the grand ateliers of Milan to the fashion capitals of the world, 
                  AURELION has dressed generations of discerning individuals who understand 
                  that true luxury lies not in excess, but in the perfect execution of craft.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4">Craftsmanship</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Every AURELION piece is the result of hundreds of hours of meticulous 
                  handwork. Our master artisans employ techniques passed down through 
                  generations, ensuring each garment is a work of art.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4">Materials</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We source only the finest materials from around the world—Italian 
                  lambskin, Japanese silk, Egyptian cotton, and Scottish cashmere. 
                  Each fabric is selected for its exceptional quality and beauty.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4">Philosophy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  At AURELION, we believe that luxury is not about following trends, 
                  but about creating pieces that transcend time. Our designs are meant 
                  to be treasured and passed down through generations.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-24 text-center border-t border-border/30 pt-16"
          >
            <p className="text-primary uppercase tracking-[0.3em] text-sm font-body mb-4">
              Visit Our Atelier
            </p>
            <p className="font-elegant text-lg text-muted-foreground">
              Via della Spiga 42, Milan, Italy
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
