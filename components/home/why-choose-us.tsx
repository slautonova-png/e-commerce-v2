import { Truck, Shield, CreditCard, Headphones } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Island-Wide Delivery",
    description:
      "Fast delivery across Sri Lanka within 3-5 business days. Free shipping on orders over LKR 10,000.",
  },
  {
    icon: Shield,
    title: "Quality Guaranteed",
    description:
      "All our products are sourced from trusted manufacturers with quality assurance.",
  },
  {
    icon: CreditCard,
    title: "Flexible Payments",
    description:
      "Multiple payment options including cards, PayHere, and installment plans via Koko Pay and Mintpay.",
  },
  {
    icon: Headphones,
    title: "Customer Support",
    description:
      "Dedicated support team ready to help you with any questions or concerns.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 sm:py-24 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground">
            Why Choose Autonova?
          </h2>
          <p className="mt-2 text-muted-foreground">
            We are committed to providing the best shopping experience
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <feature.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
