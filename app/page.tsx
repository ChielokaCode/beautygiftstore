import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import React, { type ReactNode } from "react";
import remarkGfm from "remark-gfm";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { PromoCountdown } from "@/components/PromoCountdown";
import { RecentOrderToast, type RecentOrder } from "@/components/RecentOrderToast";

const PHONE = "2349061815992";
const DEFAULT_MESSAGE =
  "Hello, I want to order the handcrafted wrist bead stack. Please help me place my order.";
const WHATSAPP_URL = `https://wa.me/${PHONE}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

// 23-hour promo deadline based on the current Lagos time supplied for this build.
// Update this absolute timestamp whenever you launch a new real promotion.
const PROMO_END_AT = "2026-08-14T06:18:00+01:00";


const recentOrders: RecentOrder[] = [
  { name: "Chiamaka N.", location: "Lekki, Lagos", stack: "Rose Crush Stack", time: "2 minutes ago" },
  { name: "Tunde A.", location: "Surulere, Lagos", stack: "Frozen Stack", time: "5 minutes ago" },
  { name: "Amarachi E.", location: "Yaba, Lagos", stack: "Crystal Tide Stack", time: "8 minutes ago" },
  { name: "Femi O.", location: "Ikeja, Lagos", stack: "Dark Royal Stack", time: "11 minutes ago" },
  { name: "Temilade K.", location: "Ajah, Lagos", stack: "Rose Crush Stack", time: "14 minutes ago" },
  { name: "Damilola S.", location: "Gbagada, Lagos", stack: "Frozen Stack", time: "18 minutes ago" },
  { name: "Kenechukwu M.", location: "Festac, Lagos", stack: "Crystal Tide Stack", time: "21 minutes ago" },
  { name: "Ifeoma C.", location: "Victoria Island, Lagos", stack: "Dark Royal Stack", time: "25 minutes ago" },
  { name: "Adebola R.", location: "Magodo, Lagos", stack: "Rose Crush Stack", time: "29 minutes ago" },
  { name: "Nneka U.", location: "Ikorodu, Lagos", stack: "Frozen Stack", time: "34 minutes ago" },
];

const stackCards = [
  {
    name: "Frozen",
    image: "/products/frozen_hand.jpeg",
    caption: "Soft icy blues, white beads and playful charms for that calm, pretty look.",
  },
  {
    name: "Dark Royal",
    image: "/products/dark-royal-card.jpg",
    caption: "Bold black and purple tones for the woman who likes deeper colours and attitude.",
  },
  {
    name: "Rose Crush",
    image: "/products/rose-crush-card.jpg",
    caption: "Pink, feminine and cute. Perfect for soft-girl energy and gift-worthy moments.",
  },
  {
    name: "Crystal Tide",
    image: "/products/crystal-tide-card.jpg",
    caption: "Fresh whites and cool aqua tones with clean, classy beachy energy.",
  },
] as const;

const detailGallery = [
  {
    title: "Frozen Bead Stack",
    image: "/products/frozen_detail.png",
  },
  {
    title: "Dark Royal Bead Stack",
    image: "/products/dark_royal_detail.png",
  },
  {
    title: "Rose Crush Bead Stack",
    image: "/products/rose_crush_detail.png",
  },
  {
    title: "Crystal Tide Bead Stack",
    image: "/products/crystal_tide_detail.png",
  },
] as const;

const testimonials = [
  {
    quote:
      "I ordered a custom Dark Royal bead stack for my sister's birthday and she absolutely loved it! The craftsmanship was incredible and the packaging was so pretty.",
    name: "Adaeze O.",
    city: "Lagos, Nigeria",
  },
  {
    quote:
      "The free perfume I got together with the Rose Crush is divine... long-lasting and so elegant. I've received so many compliments already. Will definitely be ordering again!",
    name: "Chioma N.",
    city: "Abuja, Nigeria",
  },
  {
    quote:
      "Best gift shop ever! I ordered a complete gift package for my wife's anniversary and she was thrilled. The attention to detail was amazing.",
    name: "Emeka T.",
    city: "Port Harcourt, Nigeria",
  },
] as const;

function withWhatsAppCtas(markdown: string) {
  return markdown
    .replace(
      /\*\*\[ORDER NOW BEFORE THE 100 SLOTS ARE GONE →\]\*\*/g,
      `[ORDER NOW BEFORE THE 100 SLOTS ARE GONE →](${WHATSAPP_URL})`,
    )
    .replace(
      /\*\*\[ORDER NOW AND LOCK IN YOUR PROMO PRICE →\]\*\*/g,
      `[ORDER NOW AND LOCK IN YOUR PROMO PRICE →](${WHATSAPP_URL})`,
    )
    .replace(
      /\*\*\[CLAIM YOUR WRIST STACK NOW →\]\*\*/g,
      `[CLAIM YOUR WRIST STACK NOW →](${WHATSAPP_URL})`,
    )
    .replace(
      /\*\*\[YES, I WANT THE WRIST STACK →\]\*\*/g,
      `[YES, I WANT THE WRIST STACK →](${WHATSAPP_URL})`,
    );
}

function getNodeText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(getNodeText).join("");
  }

  if (React.isValidElement<{ children?: ReactNode }>(node)) {
    return getNodeText(node.props.children);
  }

  return "";
}

function isShortPlainBlock(block: string) {
  const value = block.trim();

  return (
    value.length > 0 &&
    value.length <= 28 &&
    !value.includes("\n") &&
    !/[#*_[\]()>|`~]/.test(value) &&
    !value.startsWith("+") &&
    !value.startsWith("-")
  );
}

function compactShortParagraphRuns(markdown: string) {
  const blocks = markdown.split(/\n{2,}/);
  const output: string[] = [];

  for (let index = 0; index < blocks.length; ) {
    if (!isShortPlainBlock(blocks[index])) {
      output.push(blocks[index]);
      index += 1;
      continue;
    }

    let end = index;
    while (end < blocks.length && isShortPlainBlock(blocks[end])) {
      end += 1;
    }

    const run = blocks.slice(index, end);

    if (run.length >= 4) {
      output.push(run.map((block) => block.trim()).join(" "));
    } else {
      output.push(...run);
    }

    index = end;
  }

  return output.join("\n\n");
}

function MarkdownBlock({ markdown }: { markdown: string }) {
  const preparedMarkdown = withWhatsAppCtas(compactShortParagraphRuns(markdown));

  return (
    <div className="sales-copy">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => {
            const text = getNodeText(children).trim();
            const isStandaloneQuote =
              (text.startsWith('"') && text.endsWith('"')) ||
              (text.startsWith("“") && text.endsWith("”"));

            return (
              <p className={isStandaloneQuote ? "sales-quote" : undefined}>
                {children}
              </p>
            );
          },
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {preparedMarkdown}
      </ReactMarkdown>
    </div>
  );
}

function ProductImageCard({
  src,
  alt,
  title,
  caption,
  priority = false,
}: {
  src: string;
  alt: string;
  title: string;
  caption?: string;
  priority?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-[1.8rem] border border-rose-200/80 bg-white shadow-soft">
      <div className="product-image-frame relative aspect-[4/5] overflow-hidden bg-rose-50">
        <Image src={src} alt={alt} fill priority={priority} className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
      {(title || caption) && (
        <div className="p-4 sm:p-5">
          <h3 className="text-lg font-extrabold text-rose-950">{title}</h3>
          {caption ? <p className="mt-2 text-sm leading-6 text-rose-950/70">{caption}</p> : null}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const source = fs.readFileSync(
    path.join(process.cwd(), "content", "sales-copy.md"),
    "utf8",
  );

  const buyerMarker = "## First, Who This Letter Is Actually For";
  const productMarker = "## Meet the Handcrafted Wrist Stack";
  const frozenMarker = "## ❄️ Frozen";
  const pricingMarker = "## Let's Talk About the Price";
  const finalChoiceMarker = "## Ready to Choose Her Stack?";

  const buyerIndex = source.indexOf(buyerMarker);
  const productIndex = source.indexOf(productMarker);
  const frozenIndex = source.indexOf(frozenMarker);
  const pricingIndex = source.indexOf(pricingMarker);
  const finalChoiceIndex = source.indexOf(finalChoiceMarker);

  const heroCopy = source.slice(0, buyerIndex);
  const buyerStory = source.slice(buyerIndex, productIndex);
  const productIntro = source.slice(productIndex, frozenIndex);
  const designsAndStory = source.slice(frozenIndex, pricingIndex);
  const objectionsAndOffer = source.slice(pricingIndex, finalChoiceIndex);
  const finalClose = source.slice(finalChoiceIndex);

  return (
    <main className="page-frame min-h-screen overflow-hidden pb-24 md:pb-0">
      <PromoCountdown endAt={PROMO_END_AT} />
      <RecentOrderToast orders={recentOrders} />

      <section className="relative overflow-hidden px-4 pb-10 pt-12 sm:px-6 lg:px-8 lg:pt-20">
        <div className="absolute left-1/2 top-[-18rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-rose-200/50 blur-3xl" />
        <div className="relative mx-auto max-w-5xl">
          <MarkdownBlock markdown={heroCopy} />

          <div className="mx-auto mt-10 grid max-w-xl place-items-center gap-5">
  <ProductImageCard
    src="/products/bead_stacks.png"
    alt="Frozen handcrafted wrist bead stack worn on the wrist"
    title="A gift she can wear, enjoy and remember"
    caption=""
    priority
  />
</div>

          <div className="mt-8 flex justify-center">
            <WhatsAppButton label="Order Now on WhatsApp" />
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <MarkdownBlock markdown={buyerStory} />
          <MarkdownBlock markdown={productIntro} />

          <div className="mb-10 mt-10 rounded-[2rem] border border-rose-200/70 bg-white/70 p-5 shadow-soft backdrop-blur sm:p-8">
            <p className="mb-2 text-center text-xs font-extrabold uppercase tracking-[0.22em] text-rose-700">
              Product gallery
            </p>
            <h2 className="mb-7 text-center font-display text-3xl font-bold text-rose-950 sm:text-4xl">
              See Each Stack Clearly
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {stackCards.map((stack) => (
                <ProductImageCard
                  key={stack.name}
                  src={stack.image}
                  alt={`${stack.name} handcrafted wrist bead stack`}
                  title={stack.name}
                  caption={stack.caption}
                />
              ))}
            </div>
          </div>

          {/* <MarkdownBlock markdown={designsAndStory} /> */}

          <div className="mt-12 rounded-[2rem] border border-rose-200/70 bg-white/70 p-5 shadow-soft backdrop-blur sm:p-8">
            <div className="text-center">
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-rose-700">
                More product details
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-rose-950 sm:text-4xl">
                Close-Up Looks at the Bead Stacks
              </h2>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {detailGallery.map((item) => (
                <ProductImageCard
                  key={item.title}
                  src={item.image}
                  alt={item.title}
                  title={item.title}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-rose-200/70 bg-white/60 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-rose-700">
              Customer love
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-rose-950 sm:text-5xl">
              Real Reactions From Happy Customers
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-rose-950/65">
              These testimonials help buyers see the gifting experience, the product quality and the joy that comes with receiving it.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map((item) => (
              <div key={item.name} className="rounded-[1.8rem] border border-rose-200/80 bg-white p-6 shadow-soft">
                <p className="text-lg leading-8 text-rose-950/85">“{item.quote}”</p>
                <div className="mt-6 border-t border-rose-100 pt-4">
                  <p className="font-extrabold text-rose-950">{item.name}</p>
                  <p className="text-sm text-rose-950/60">{item.city}</p>
                </div>
              </div>
            ))}
          </div>

          {/* <div className="mt-14 text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-rose-700">
              WhatsApp screenshot testimonials
            </p>
            <h3 className="mt-3 text-2xl font-bold text-rose-950 sm:text-3xl">
              Add Your WhatsApp Screenshot Proof Here Later
            </h3>
          </div> */}

           {/* <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <ImagePlaceholder title="WHATSAPP TESTIMONIAL SCREENSHOT 1" aspect="phone" />
            <ImagePlaceholder title="WHATSAPP TESTIMONIAL SCREENSHOT 2" aspect="phone" />
            <ImagePlaceholder title="WHATSAPP TESTIMONIAL SCREENSHOT 3" aspect="phone" />
            <ImagePlaceholder title="WHATSAPP TESTIMONIAL SCREENSHOT 4" aspect="phone" />
          </div> */}

          <div className="mt-10 flex justify-center">
            <WhatsAppButton label="Claim Your Wrist Stack" />
          </div> 
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <MarkdownBlock markdown={objectionsAndOffer} />
        </div>
      </section>

      

      <div className="mx-auto mt-10 mb-20 max-w-5xl">
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
    <ProductImageCard
      src="/products/rose_crush.png"
      alt="Rose Crush handcrafted wrist bead stack"
      title="A gift she can wear, enjoy and remember"
      caption="Styled, polished and ready to make the first impression before she even says a word."
      priority
    />

    <ProductImageCard
      src="/products/Crystal_tide.png"
      alt="Crystal Tide handcrafted wrist bead stack"
      title="Gift-ready packaging"
      caption="Perfect for birthdays, anniversaries, thank-you gifts and surprise moments."
    />

    <ProductImageCard
      src="/products/dark_royal.png"
      alt="Dark Royal handcrafted wrist bead stack"
      title="Made to be noticed"
      caption="On the wrist, in pictures and in those moments when somebody asks where she got it from."
    />

    <ProductImageCard
      src="/products/Frozen.png"
      alt="Frozen handcrafted wrist bead stack"
      title="Made to turn a simple outfit into a complete look"
      caption="Beautifully handcrafted to add that extra touch of colour, detail and personality every time she wears it."
    />
  </div>
</div>

      <section id="order" className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[2.4rem] price-callout p-5 shadow-2xl sm:p-9 lg:p-12">
          <div className="text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-rose-100">
              Order before the offer closes
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-5xl">
              Choose Your Promo Package
            </h2>
          </div>

          <div className="mt-9 grid gap-5 lg:grid-cols-3">
            {[
              {
                qty: "1 Wrist Stack",
                normal: "₦50,000",
                price: "₦30,000",
                save: "Save ₦20,000",
                message: "Hello, I want to order 1 handcrafted wrist bead stack for ₦30,000. Please help me place my order.",
              },
              {
                qty: "2 Wrist Stacks",
                normal: "₦90,000",
                price: "₦55,000",
                save: "Save ₦35,000",
                message: "Hello, I want to order 2 handcrafted wrist bead stacks for ₦55,000. Please help me place my order.",
              },
              {
                qty: "3 Wrist Stacks",
                normal: "₦130,000",
                price: "₦80,000",
                save: "Save ₦50,000",
                message: "Hello, I want to order 3 handcrafted wrist bead stacks for ₦80,000. Please help me place my order.",
              },
            ].map((item) => (
              <div key={item.qty} className="rounded-[1.8rem] border border-white/15 bg-white/10 p-6 text-center backdrop-blur">
                <p className="font-bold text-rose-100">{item.qty}</p>
                <p className="mt-3 text-lg text-white/55 line-through">{item.normal}</p>
                <p className="mt-1 font-display text-4xl font-black text-white">{item.price}</p>
                <p className="mt-2 text-sm font-bold text-amber-200">{item.save}</p>
                <p className="mt-4 text-sm leading-6 text-white/75">Free gifts included • Free Lagos delivery</p>
                <WhatsAppButton
                  label="Order This Package"
                  message={item.message}
                  className="mt-6 w-full bg-white !text-rose-950 hover:bg-rose-50"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <MarkdownBlock markdown={finalClose} />
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-emerald-800/20 bg-white/95 p-3 shadow-[0_-10px_35px_rgba(0,0,0,.12)] backdrop-blur md:hidden">
        <WhatsAppButton label="Order Now on WhatsApp" className="w-full" />
      </div>
    </main>
  );
}
