# Ghosting Studios

Static one-page studio site at [ghostingstudios.com](https://ghostingstudios.com) — hosted on Cloudflare Pages.

## About Ghosting Studios

Ghosting Studios is a one-person independent software studio operating a small portfolio of useful, no-bullshit tools:

- **[zombiesub](https://zombiesub.com)** — free consumer subscription-renewal reminder. Forward a receipt, get a calendar invite + a one-click cancel link 3 days before each renewal. No account, no bank link, no upsell.
- **[inboxzombie](https://inboxzombie.com)** — B2B sibling of zombiesub for finance and AP teams. Multi-user, Stripe-billed, same subscription-tracking engine, different positioning.
- **[hero-proto](https://hero-proto.com)** — IT-themed gacha RPG. Collect heroes, build parties, run dungeons.

The studio is registered as **SMTPKELS** (Canadian sole proprietorship); "Ghosting Studios" is the DBA / public brand.

## Who we are

One operator. Designed, built, shipped, supported solo. No investors, no team, no roadmap deck. Products are funded by the people who use them — never by ads, data resale, or the usual subscription-trap garbage we built half the portfolio to fight.

The brand voice is dry, deadpan, occasionally morbid (tombstones, zombies, R·I·P). The name plays on both senses of *ghosting* — the supernatural kind and the dating-app kind. Both are useful metaphors for what these products help you do: stop paying for things you're done with.

## Stack

Single `index.html`. Privacy Policy at `#privacy`, Terms of Service at `#terms`. No framework, no build step.

## Deploy

```bash
npx wrangler pages deploy . --project-name=ghostingstudios
```

Custom domains: `ghostingstudios.com` + `www.ghostingstudios.com`.

## Contact

[hello@ghostingstudios.com](mailto:hello@ghostingstudios.com)
