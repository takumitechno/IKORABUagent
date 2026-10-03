# 環 — MEGURI B2B onboarding / account bootstrap design

> **Superseded by [`meguri-b2b-onboarding-design-v2.md`](meguri-b2b-onboarding-design-v2.md)**
> (DOT audit PASS_WITH_CORRECTIONS, ONB-01 … ONB-10). This v1 text is kept unchanged as history.

Status: **design only**. No implementation, no Production change, no deploy, no
corporate-website change. Written for DOT audit and later Codex implementation.

Baselines inspected:

| Repo | Ref | Role |
|---|---|---|
| `IKORABUagent` | `12358ef` (`claude/ikolab-agent-startup-mgqk84`) | Control Plane, customer `/` and operator `/internal` dashboard |
| `Threads-` | `8590243` (`claude/divination-automation-system-ogue5r`) | Data Plane, source of truth for accounts, facts, research, publication |
| `Threads-` | `9e224f0` (`work/ai-unit-economics02a1-production-hardening`, **unmerged**) | AI usage ledger and `ai_cost_policies` |

---

## 0. Summary

Adding a customer account must mean **writing a versioned configuration
document**, not adding code. This design does that with four rules:

1. **One compiler, many inputs.** A customer answers business questions. A pure
   function `compile(submission, template, safety_floor) → AccountConfig vN`
   produces every internal object (persona, planning, funnel facts, research
   profile, publishing, approval, and cost policy). Verticals are *template
   data*, not `domains/<id>/` code packages.
2. **Three kinds of input, three trust levels.**
   - **Business facts** (offer URL, price, availability, affiliate status,
     credentials) are *never* defaulted or inferred. They go to
     `account_verified_facts` with provenance.
   - **Creative preferences** (topics, tone, persona) may start from a template
     default, but the customer must accept them.
   - **Operational policy** (frequency, windows, approval, budget) may be
     template-defaulted. A non-overridable safety floor bounds it.
3. **Shadow first, always.** Submission never publishes. Every account goes
   CONFIGURED → VALIDATED → SHADOW → REVIEW_REQUIRED → APPROVED → ACTIVE. The
   final step reuses the existing `accounts.arm()` gate.
4. **Tightening is always safe; loosening is reviewed.** Post-activation edits
   are classified SAFE / REVIEW / RESHADOW per field. Every change produces an
   immutable `AccountConfig` version that is stamped on everything it
   generates.

This extends the existing Data Plane and does not replace it. Section 13 lists
which existing objects each part reuses.

---

## 1. Current-state grounding (what DOT should audit against)

| Concern | What exists today | Gap for multi-vertical B2B |
|---|---|---|
| Account record | `production_accounts(account_id, handle, domain_id, status draft/ready/active, config_json)` (migration 0010) | `config_json` is mutable in place, so there is no versioning. No platform column. `status` doubles as the publish gate. |
| Account config shape | `config.persona / planning / funnel`, validated by `production/accounts.py::validate_config`. Facts are **banned** from config. | Hand-written JSON fixtures per account (`production/fixtures/acct_*.json`). |
| Persona trust | `persona.provenance ∈ owner_confirmed / operator_draft / synthetic_fixture / unrecorded`. Only the first two may reach the Writer. | No customer-facing confirmation flow. |
| Facts | `account_verified_facts(account_id, fact_key, fact_value, verified_by, verified_at, source_note)` | Funnel catalogue `production/funnel.py::FUNNEL_FACTS` is **fortune-specific** (`free_reading_*`). No fact history. |
| Planning | `production/planner.py`: roles reach/trust/desire/conversion, `cta_by_role`, `required_facts_by_role`, deterministic role pick | Ratios come from config. This is fine and reusable as is. |
| Style | StyleDNA (`research/style_dna.py`, numeric only) and Semantic Style (`production/semantic_style.py`, closed vocabulary) per account | Built from `account_research_posts`, a benchmark corpus with raw bodies, account-scoped. |
| Topic research | `research/` Benchmark Research Layer: manual intake is the primary path. `ResearchProvider` interface already declares `search_posts` for future web/news adapters. | No per-account topic, keyword, freshness, or cadence profile. **ResearchPacket / Research Intelligence v1 was not found in either repo on any branch** (see §14, assumption A1). |
| Domains | `domains/registry.py`: a new genre = a new code package. `research/materialize.py` already builds an **in-memory** `DomainConfig` from data. | Code-per-vertical. The design generalizes the materialize path. |
| Approval | `pipeline/approval_policy.py` MANUAL/AUTO/ESCALATE from **global** `config.APPROVAL_MODE`. Approvals bind to `content_hash` (`production/workflow.py`). | No per-account approval policy and no approver identity. |
| Live gate | `accounts.validate()` returns blocking items. `accounts.arm(confirm_handle=…)` and `disarm()`. Live publishing also needs an authorized publisher and `allow_live=True`. | No SHADOW stage and no activation checklist. |
| Tenancy | `organizations`, `users(org_id)`, `org_accounts`, `user_roles` (admin/editor/viewer), `user_account_memberships` (0021, 0024). `tenant-onboard` CLI. Control Plane: `dashboard-tenant.ts` and opaque workspace selectors in `customer-workspaces.ts`. | No onboarding submission object. `org_accounts` has no `UNIQUE(account_id)`. |
| Cost | Branch only: `ai_usage_events` and append-only `ai_cost_policies(account_id, feature, utc_daily_call_cap, …)` | No monthly budget or customer-facing cap. |
| Trust boundary | Control Plane never touches the Production DB; everything crosses the Bridge (`docs/current-architecture-and-operations.md`) | Must hold for onboarding too. |

**Placement decision.** All onboarding state (submissions, config versions,
facts, research profiles, lifecycle) lives in the **Data Plane**. The Control
Plane renders the customer form and the operator views, and calls new Bridge
endpoints. It stores nothing authoritative. This preserves the existing trust
boundary and the single-writer SQLite discipline.

---

## 2. Onboarding journey

### 2.1 Design changes to the proposed 12 steps

| Change | Why |
|---|---|
| Add **STEP 0 「はじめに」** (what to prepare, 10–20 min, save-and-resume) | Customers abandon when asked for a URL or affiliate rule they don't have to hand. |
| Business category (STEP 1) **selects the vertical template** | Every later step is pre-filled, so customers review defaults rather than invent answers. |
| Split **表現ルール (compliance)** out of 商品・導線 | PR disclosure and prohibited claims are activation-gating. They deserve their own screen and attestation. |
| Rename "Research設定" → **「参考にする情報」**, default 「おすすめ設定」 | Customers don't know what "Research" means. Most should accept the template. |
| Rename "AI / 運用予算" → **「月額の上限」**, show an estimated cost | Customers understand a monthly cap, not "external AI calls". |
| Split STEP 1 into org-level vs account-level steps | Customer B (5 Threads accounts plus Owned Media) answers company info once and copies account settings. |
| SHADOW is named **「お試し運用（投稿はされません）」** | Makes "nothing is published" explicit. |
| Account connection (OAuth) can happen **any time before VALIDATED** | Connecting needs the account owner. It must not block filling the form. |

### 2.2 Final flow

```
ORG LEVEL (once per organization)
  STEP 0  はじめに                       準備するもの・所要時間
  STEP 1  会社・事業                     → selects vertical template

ACCOUNT LEVEL (repeat per channel account; 「他のアカウントからコピー」 available)
  STEP 2  運用するアカウント               platform / handle / role / 接続
  STEP 3  届けたい相手                    audience
  STEP 4  発信テーマと話し方               pillars / tone / persona / NG
  STEP 5  目的と成果                      objective / KPI
  STEP 6  商品・サービスと導線             offers (repeater) / CTA
  STEP 7  表現ルール                      PR表記 / NG表現 / 注記
  STEP 8  参考にする情報                  research themes / sources (おすすめ可)
  STEP 9  投稿と確認のルール               frequency / windows / approval / pause
  STEP 10 月額の上限                      budget / on-cap behavior

  STEP 11 確認・送信                      summary + attestations
          ── system: 自動設定 → 検証 ── (CONFIGURED → VALIDATED, seconds–minutes)
  STEP 12 お試し運用（投稿はされません）     SHADOW: samples, schedule, cost estimate
  STEP 13 初回確認 → 運用開始              customer approval → operator sign-off → ACTIVE
```

UX rules:

- Each step saves independently (draft). Customers can leave and resume.
- Fields are marked 必須 (required to submit), **運用開始までに必須**
  (required before activation, so submit is allowed but activation is
  blocked), or 任意 (optional).
- Template defaults are shown with an 「おすすめ設定」 badge. Accepting them
  explicitly is recorded as `customer_accepted_default`.
- Every field has an 「わからない場合」 help link. **No business-fact field
  offers "おまかせ".**
- Progress shows *activation readiness* ("運用開始まであと3項目"), not just
  form completion.
- The form never shows internal names: agents, LAB, DOT, StyleDNA, packets,
  account IDs. See §7.3.

---

## 3. Exact form schema

### 3.1 Field-definition meta-schema

Every field is declared once in a versioned **field catalogue** (data file).
The form, the validator, the compiler, and the change classifier all read it.

```yaml
key: offer.url                       # stable dotted key (never renamed; deprecate instead)
scope: account                       # org | account | offer (repeater item)
step: 6
label_ja: 申込・購入ページのURL
help_ja: 投稿から案内するページです。ここに無いURLは投稿に書きません。
requirement: conditional             # always | for_activation | conditional | optional
required_when: "offer.type != 'none' and ops.cta_frequency != 'none'"
type: url
validation: [https_only, max_len:2048, no_unknown_shortener, reachability:warn]
example: https://example.com/lp/free-trial
kind: fact                           # fact | preference | policy | identity
defaultable: false                   # facts are never defaultable
change_class: RESHADOW_SCOPED        # see §9
destination: [FunnelFacts:offer.<id>.destination_url]
visibility: customer                 # customer | operator_only
```

`kind: fact` ⇒ `defaultable: false`. The catalogue loader enforces this, so a
template cannot supply a business fact.

### 3.2 Field types

`text`, `textarea`, `select`, `multiselect`, `tags` (list of short strings),
`url`, `url_list`, `handle`, `number`, `currency_jpy`, `date`, `date_range`,
`time_windows` (weekday × HH:MM ranges, Asia/Tokyo), `boolean`, `attestation`
(checkbox recorded with actor and time), `oauth_connect`, `user_picker`,
`repeater` (list of sub-records).

Common validation tokens: `len:a-b`, `count:a-b`, `item_len:≤n`,
`https_only`, `reachability:warn|block`, `handle_regex:<platform>`,
`unique_global` (no other org holds it), `no_pii_in_free_text:warn`,
`no_url_in_free_text`, `date>=today`.

### 3.3 STEP 1 — 会社・事業 (org scope)

| Key | Label (JA) | Help (JA) | Req | Type | Validation | Example | Destination |
|---|---|---|---|---|---|---|---|
| `business.company_name` | 会社名・屋号 | 契約者名。投稿で運営者名として使う場合があります。 | always | text | len:1-100 | 株式会社サンプル | Organization.name; VerifiedFact `org.operator_name` (customer_attested) |
| `business.brand_name` | SNSで名乗るブランド名・サービス名 | アカウント名とは別に、発信で使う名前があれば。 | always | text | len:1-60 | タク｜AI仕事術 | BusinessProfile.brand_name; Persona.self_name default |
| `business.category` | 業種・ジャンル | いちばん近いものを選んでください。後から変更できます。 | always | select | one of: fortune_relationships, ai_business, career_recruitment, ecommerce_products, local_business, owned_media, other | ai_business | BusinessProfile.category; **template_id** |
| `business.description` | 事業の内容 | 誰に何を提供しているかを、普段の言葉で。 | always | textarea | len:20-400; no_url_in_free_text | 会社員向けに、ChatGPTやClaudeを仕事で使う方法を発信し、講座を紹介しています。 | BusinessProfile.description (planning context only, **not** a claim source) |
| `business.offering_summary` | 主な商品・サービス（ひとことで） | 詳細はSTEP 6で入力します。 | always | text | len:1-120 | AI仕事術のオンライン講座 | BusinessProfile.offering_summary |
| `business.website` | 公式サイト | 情報の確認に使います。無ければ空欄で構いません。 | optional | url | https_only; reachability:warn | https://example.com | BusinessProfile.website; ResearchSources `official_site` allowlist |
| `business.region` | 活動地域 | 店舗や対応エリアがある場合は都道府県を選んでください。 | always | select+multiselect | 全国 / オンラインのみ / 都道府県(1-47) | 全国 | BusinessProfile.region; ResearchProfile.locale; PublishingPolicy.timezone (Asia/Tokyo) |
| `business.language` | 発信する言語 | 現在は日本語のみ対応しています。 | always | select | `ja` (MVP fixed) | 日本語 | WriterProfile.language |
| `business.regulated_flags` | あてはまる業種・表現（すべて選択） | 表現のチェックを強めます。該当しない場合は「該当なし」を選んでください。 | always | multiselect | must choose ≥1 (incl. 「該当なし」); 「該当なし」 is exclusive | アフィリエイト・PR投稿あり | ComplianceRules.regimes (薬機法 / 金融 / 職業安定法 / 医療 / 酒類 / 不動産 / 士業 / 景表法・ステマ / 未成年向け) |

### 3.4 STEP 2 — 運用するアカウント (account scope)

| Key | Label (JA) | Help (JA) | Req | Type | Validation | Example | Destination |
|---|---|---|---|---|---|---|---|
| `account.platform` | 媒体 | 現在はThreadsに対応しています。その他は準備中です。 | always | select | Threads (supported); X / Instagram / オウンドメディア → waitlist, blocks submit for that account only | Threads | ChannelAccount.platform |
| `account.handle` | アカウントID | @から始まるIDです。 | always | handle | handle_regex:threads (`^@?[A-Za-z0-9._]{1,30}$`); unique_global | @taku_ai_tech | ChannelAccount.handle (`production_accounts.handle`) |
| `account.display_name` | 表示名 | 画面での呼び名です。 | always | text | len:1-60 | タク｜AI仕事術×副業 | ChannelAccount.display_name |
| `account.status_now` | アカウントの状況 | | always | select | 既に運用中 / これから運用を始める | 既に運用中 | ChannelAccount.is_new; StyleSource selection |
| `account.purpose` | このアカウントの役割 | いちばん大事な役割を1つ。 | always | select | 新しい見込み客を集める / ファンとの関係づくり / 商品の販売 / 採用 / ブランド認知 / サイトへの集客 | 新しい見込み客を集める | Objective seed; WriterProfile.role_ratios default |
| `account.connect` | アカウントを接続 | 投稿と数値の取得に必要です。パスワードは当社に保存されません。 | for_activation | oauth_connect | scopes = publish + insights; identity must equal handle (`credentials.assert_identity_matches`) | (button) | ChannelConnection (`account credentials`, 0014) |
| `account.use_past_posts` | 過去の投稿を文体の参考にしてよいですか | 文体の分析だけに使い、文章をそのまま再利用することはありません。 | optional (default はい if 運用中) | boolean | — | はい | ResearchSources `own_account_history` (Manual Post Sync, `analyze_enabled=true`, `learn_enabled=false`) |

### 3.5 STEP 3 — 届けたい相手

| Key | Label (JA) | Help (JA) | Req | Type | Validation | Example | Destination |
|---|---|---|---|---|---|---|---|
| `audience.description` | どんな人に届けたいですか | 年齢・仕事・状況などを、普段の言葉で。 | always | textarea | len:20-400 | 仕事でAIを使いたいが、何から始めればいいか分からない30代の会社員 | Persona.audience; WriterProfile.target; ResearchProfile.relevance_context |
| `audience.age_bands` | 年代 | 特に決まっていなければ空欄で構いません。 | optional | multiselect | 10代…60代以上; **10代 + (酒類 / 金融 / 恋愛・出会い / 求人の一部) ⇒ error ONB-E031** | 20代, 30代 | Audience.demographics; ComplianceRules.minor_audience |
| `audience.gender_skew` | 性別の傾向 | | optional | select | 指定なし / 女性中心 / 男性中心 | 指定なし | Audience.demographics |
| `audience.problems` | 相手が抱えている悩み・困りごと | 3つ以上。投稿の切り口になります。 | always | tags | count:3-10; item_len:≤60 | AIを何から使えばよいか分からない | **planning.emotional_problems** (existing key) |
| `audience.desired_outcome` | 相手がなりたい状態 | | optional | tags | count:0-5; item_len:≤60 | 毎日の作業を30分減らしたい | planning.objective_by_role (desire) |
| `audience.purchase_intent` | 相手の検討段階 | いちばん多い段階を選んでください。 | always | select | まだ悩みに気づいていない / 情報を集めている / 比較・検討している / すぐ申し込みたい | 情報を集めている | WriterProfile.role_ratios default shift |
| `audience.not_target` | 届けたくない相手 | 例: 未成年、同業者 | optional | tags | count:0-10 | 未成年 | ComplianceRules.excluded_audiences; QA |

### 3.6 STEP 4 — 発信テーマと話し方

| Key | Label (JA) | Help (JA) | Req | Type | Validation | Example | Destination |
|---|---|---|---|---|---|---|---|
| `content.pillars` | 主な発信テーマ（3〜6個） | 比率は自動で整えます。変更もできます。 | always | tags + weight slider | count:3-6; item_len:≤30; weights sum>0 | AI初心者あるある / AI仕事術 / ChatGPT・Claude実体験 | **planning.topics**, **planning.content_pillar_ratios**; ResearchProfile.topics |
| `content.subtopics` | テーマごとの具体的な話題 | | optional | map pillar→tags | ≤10 per pillar | AI仕事術 → 議事録 / メール下書き | ResearchProfile.topics[].subtopics |
| `content.prohibited_topics` | 扱わない話題 | 無ければ「特になし」を選んでください。 | always | tags or 「特になし」 | explicit answer required | 政治 / 特定企業の批判 | ComplianceRules.prohibited_topics; ResearchProfile.exclude_topics |
| `content.tone` | 話し方の雰囲気 | 近いものを選び、必要なら補足してください。 | always | multiselect chips + text | 1-3 chips; text len:≤200 | 率直 / 親しみやすい（技術マウントはしない） | **persona.tone**, **persona.voice** |
| `content.stance` | 発信者の立ち位置 | | always | select | 会社・ブランドとして / 担当者個人として / キャラクターとして | 担当者個人として | Persona.stance |
| `content.persona_profile` | 発信者の人柄・世界観 | ここに書いた経歴や実績は、事実としては使いません。投稿で使いたい経歴はSTEP 6の「根拠」へ。 | conditional (stance ≠ 会社) | textarea | len:20-400; no_url_in_free_text | AIに詳しい先生ではなく、少し先を歩く案内役 | **persona.worldview** (style only, never a fact) |
| `content.first_person` | 一人称 | | optional | select | 私 / わたし / 僕 / 俺 / 当社 / 使わない | 僕 | Persona.first_person |
| `content.words_to_avoid` | 使わない言葉・表現 | | optional | tags | count:0-50 | 誰でも稼げる / 爆益 | ComplianceRules.banned_terms (QA prohibited-term rule) |
| `content.signature_phrases` | よく使う言葉・口ぐせ | | optional | tags | count:0-10 | 今日の一歩 | Persona.signature_phrases |
| `content.reference_accounts` | 雰囲気の参考にしたいアカウント | 文章をまねることはしません。文体や構成の傾向だけを参考にします。 | optional | repeater {handle/url, 参考にしたい点: 文体/構成/話題} | count:0-5; must not be the account itself | @example_ai, 文体 | ResearchSources.reference_accounts (manual intake → StyleDNA / Semantic Style); BenchmarkSimilarityGuard |
| `content.emoji` | 絵文字 | | optional | select | 使わない / 少し / 多め | 少し | WriterProfile.form |
| `content.length` | 投稿の長さ | | optional | select | 短め / おまかせ / 長め | おまかせ | WriterProfile.length_class |

### 3.7 STEP 5 — 目的と成果

| Key | Label (JA) | Help (JA) | Req | Type | Validation | Example | Destination |
|---|---|---|---|---|---|---|---|
| `objectives.primary` | いちばんの目的 | | always | select | 認知拡大 / フォロワー増加 / 反応（いいね・コメント）/ 問い合わせ / アフィリエイト成果 / 商品販売 / 採用応募 / サイトへの集客 | 認知拡大 | Objective.primary → KPI primary metric; role_ratios |
| `objectives.secondary` | その他の目的 | | optional | multiselect | ≤2; ≠ primary | フォロワー増加 | Objective.secondary |
| `objectives.targets` | 目標の数値（任意） | 目安として使います。成果を保証するものではありません。 | optional | repeater {metric, value, period} | value>0; period ∈ 月/四半期 | フォロワー +300 / 月 | KPI.targets (reports only, never post claims) |
| `objectives.baseline` | 現在の数値 | 接続後に自動で取得できる場合は不要です。 | optional | number | ≥0 | 1,200 | KPI.baseline (superseded by insights) |
| `objectives.measurement` | 成果の確認方法 | | conditional (primary ∈ 問い合わせ/アフィリエイト/販売/採用/集客) | select | UTM付きリンク / ASP管理画面 / フォーム件数 / 毎月手入力 | ASP管理画面 | FunnelFacts `conversion_measurement`; `attribution_window_days` |

### 3.8 STEP 6 — 商品・サービスと導線 (`offer` repeater, 0..n)

If `offer.type = 'none'` (導線は置かない), the compiler forces conversion
role ratio = 0 and every `cta_by_role = none`. The customer sees this stated.
(This matches today's `acct_taku_ai_tech` state `affiliate_not_configured`.)

| Key | Label (JA) | Help (JA) | Req | Type | Validation | Example | Destination |
|---|---|---|---|---|---|---|---|
| `offer.type` | 案内するものの種類 | | always (≥1 row) | select | 自社商品 / 自社サービス・予約 / アフィリエイト案件 / 求人 / 無料特典・LINE登録 / 問い合わせ / 導線は置かない | アフィリエイト案件 | Offer.type → required-fact set (§4.4) |
| `offer.name` | 名称 | | always | text | len:1-80 | AI仕事術講座 ベーシック | Fact `offer.<id>.name` |
| `offer.description` | 内容 | 投稿で説明してよい範囲で。 | always | textarea | len:10-400 | 全6回のオンライン講座 | Fact `offer.<id>.description` (customer_attested) |
| `offer.url` | 申込・購入ページのURL | ここに無いURLは投稿に書きません。 | conditional (CTA used) | url | https_only; no_unknown_shortener; reachability:block at VALIDATE | https://example.com/lp | Fact `offer.<id>.destination_url` (≈ `funnel_destination_url`) |
| `offer.profile_link` | プロフィールに置くリンク | 当社がプロフィールを書き換えることはありません。 | optional | url | https_only | https://lit.link/example | ChannelAccount.profile_link (reference only) |
| `offer.availability` | 受付状況 | | always | select (+ date_range) | 受付中 / 一時停止 / 期間限定(開始・終了日) | 受付中 | Fact `offer.<id>.available` (+ `start`/`end`) (≈ `free_reading_available`) |
| `offer.how_to_apply` | 申込・購入の手順 | 手順を推測して書くことはしません。 | conditional (CTA used) | text | len:5-200 | LPのフォームから申込 | Fact `offer.<id>.application_method` |
| `offer.conversion_event` | 成果とみなす行動 | | conditional (CTA used) | select | プロフィール閲覧 / リンククリック / 登録 / 申込 / 購入 / 応募 / 問い合わせ | 申込 | Fact `offer.<id>.conversion_goal` (≈ `primary_threads_goal`) |
| `offer.price` | 価格（投稿で触れる場合） | 投稿で価格に触れない場合は空欄。 | optional | currency_jpy + 税込/税別 | ≥0 | 9,800円（税込） | Fact `offer.<id>.price` (numeric supply) |
| `offer.provider` | 提供者・提供元 | | optional | text | len:≤80 | 株式会社サンプル | Fact `offer.<id>.provider` (identity supply) |
| `offer.affiliate.network` | ASP・提携先 | | conditional (type=アフィリエイト) | text | len:1-60 | A8.net | Fact `offer.<id>.affiliate_network` |
| `offer.affiliate.status` | 提携状況 | 「承認済み」になるまで、案内する投稿は作りません。 | conditional (type=アフィリエイト) | select | 承認済み / 申請中 / 未申請 | 承認済み | Fact `offer.<id>.affiliate_status`; **CTA allowed only if 承認済み** |
| `offer.affiliate.advertiser_rules` | 広告主の禁止事項 | 案件ページの「禁止事項」を貼り付けるか、「特記事項なし」を選んでください。 | conditional (type=アフィリエイト) | textarea or attestation | explicit answer | 「最安」「No.1」表記禁止 | ComplianceRules.offer_restrictions[offer_id] |
| `offer.eligibility` | 対象条件・お断り条件 | 例: 18歳以上、首都圏在住、未経験可 | conditional (type ∈ 求人 / 金融 / 年齢制限あり) | textarea | len:≤400 | 18歳以上・日本在住 | Fact `offer.<id>.eligibility`; QA |
| `offer.cta_phrase` | 案内の言い方（例） | 雰囲気の参考にします。 | optional | text | len:≤60; no_url_in_free_text | 詳しくはプロフィールのリンクから | WriterProfile.cta_style (preference, not fact) |
| `offer.cta_intensity` | 案内の強さ | | always | select | 控えめ / 標準 / 積極的 | 控えめ | planning.cta_by_role mapping |
| `offer.claims` | 投稿で使いたい実績・数字・お客様の声 | 根拠を添えてください。確認できたものだけ投稿に使います。 | optional | repeater {claim, evidence_note, evidence_url/file} | each claim len:≤120 | 受講者300名（2026年9月時点） | **pending** VerifiedFact → requires `operator_verified` before use |

### 3.9 STEP 7 — 表現ルール

| Key | Label (JA) | Help (JA) | Req | Type | Validation | Example | Destination |
|---|---|---|---|---|---|---|---|
| `compliance.pr_label` | PR表記 | 広告・アフィリエイトを含む投稿に付ける表記です（景品表示法のステルスマーケティング規制）。 | conditional (any offer type=アフィリエイト, or regulated_flags ∋ PR) — **cannot be turned off** | select | #PR / 広告 / プロモーション / 自由入力(≤12字) | #PR | ComplianceRules.pr_disclosure.label |
| `compliance.pr_position` | PR表記の位置 | | conditional (same) | select | 冒頭 (default, only option in MVP) | 冒頭 | ComplianceRules.pr_disclosure.position |
| `compliance.pr_scope` | PR表記を付ける投稿 | | conditional (same) | select | 案内を含む投稿 / 商品名に触れる投稿すべて (default) | 商品名に触れる投稿すべて | ComplianceRules.pr_disclosure.applies_to |
| `compliance.prohibited_claims` | 使わない主張 | 業種に合わせた候補を表示しています。すべて確認してください。 | always (checklist must be reviewed) | multiselect (template list) + tags | template items pre-checked; unchecking a floor item is impossible | 「必ず稼げる」「効果を保証」 | ComplianceRules.prohibited_claims → QA |
| `compliance.required_notes` | 必ず入れる注記 | | optional | tags | count:0-5; item_len:≤60 | 効果には個人差があります | ComplianceRules.required_notes (applies_to rule) |
| `compliance.legal_page` | 特定商取引法などの表示ページ | 販売を行う場合に。 | conditional (offer type ∈ 自社商品/サービス) | url | https_only | https://example.com/tokushoho | Fact `org.legal_notice_url` |
| `compliance.competitor_mentions` | 他社への言及 | | always | select | 言及しない (default) / 中立的な紹介ならよい | 言及しない | ComplianceRules.competitor_policy |

### 3.10 STEP 8 — 参考にする情報 (research)

| Key | Label (JA) | Help (JA) | Req | Type | Validation | Example | Destination |
|---|---|---|---|---|---|---|---|
| `research.mode` | 情報の集め方 | 迷ったら「おすすめ設定」で始めてください。 | always | select | おすすめ設定 / 自分で指定する | おすすめ設定 | ResearchProfile.template_ref |
| `research.themes` | 追いかけたいテーマ | 発信テーマから自動で入っています。 | always | tags | count:1-10 (pre-filled from pillars) | 生成AIの新機能 / 仕事効率化 | ResearchProfile.topics |
| `research.keywords` | キーワード | | optional | tags | count:0-30; item_len:≤30 | Claude / 議事録 自動化 | ResearchProfile.include_keywords (**tenant-private** queries) |
| `research.exclude_keywords` | 除外したい言葉 | 扱わない話題（STEP 4）も自動で除外します。 | optional | tags | count:0-50 | 仮想通貨 / 情報商材 | ResearchProfile.exclude_keywords |
| `research.preferred_sources` | よく見る情報源 | | optional | multiselect + url_list | types: 公式発表 / ニュース / 業界メディア / 公的統計 / 自社サイト; urls https_only, ≤20 | 公式発表, https://www.anthropic.com/news | ResearchSources (adapter + allow_domains) |
| `research.blocked_sources` | 使わない情報源 | | optional | url_list (domains) | ≤50 | example-matome.com | ResearchSources.deny_domains |
| `research.freshness` | 情報の新しさ | | always (template default) | select | 最新の話題中心（3日以内）/ 1か月以内 / 定番の話題中心 | 1か月以内 | ResearchProfile.freshness |
| `research.update_frequency` | 情報の更新頻度 | 頻度を上げると月額の目安が上がります。 | always (template default) | select | 毎日 / 週3回 / 週1回 | 週3回 | ResearchProfile.cadence; CostPolicy estimate |

### 3.11 STEP 9 — 投稿と確認のルール

| Key | Label (JA) | Help (JA) | Req | Type | Validation | Example | Destination |
|---|---|---|---|---|---|---|---|
| `ops.posts_per_week` | 1週間の投稿数 | | always | number | 1 ≤ n ≤ plan_max (MVP 21); ≤ window capacity (ONB-E061) | 7 | PublishingPolicy.posts_per_week |
| `ops.windows` | 投稿してよい時間帯 | | always | time_windows | ≥1 window; each ≥30 min; Asia/Tokyo | 平日 7:00-8:30, 12:00-13:00 / 土日 9:00-11:00 | PublishingPolicy.windows |
| `ops.min_spacing_minutes` | 投稿の最短間隔 | | optional (default 120) | number | 30-1440 | 120 | PublishingPolicy.min_spacing |
| `ops.blackout_dates` | 投稿しない日 | | optional | date list / date_range | — | 2026-12-31〜2027-01-03 | PublishingPolicy.blackouts |
| `ops.start_date` | 開始の希望日 | お試し運用（通常3日程度）の後になります。 | optional | date | date ≥ today + shadow_min_days | 2026-10-20 | PublishingPolicy.not_before |
| `ops.approval_mode` | 投稿前の確認 | 最初は「すべて確認」から始めます。実績ができたら変更できます。 | always | select | すべて確認してから投稿 (MANUAL) / 気になるものだけ確認 (ESCALATE) / 確認なし (AUTO: **disabled at onboarding**, shown with unlock condition) | すべて確認してから投稿 | ApprovalPolicy.mode |
| `ops.approvers` | 確認する担当者 | | always | user_picker | ≥1 user with content:review on this account and a verified email | 山田（編集者） | ApprovalPolicy.approvers |
| `ops.approval_deadline` | 確認の期限 | 期限を過ぎた投稿は**公開されません**（自動で投稿されることはありません）。 | always | select | 12時間 / 24時間 / 48時間 | 24時間 | ApprovalPolicy.deadline; `on_timeout = skip` (fixed) |
| `ops.cta_frequency` | 案内を入れる頻度 | 案内できる商品が「準備完了」の場合だけ有効になります。 | always | select | 入れない / 10投稿に1回 / 5投稿に1回 / 3投稿に1回 | 10投稿に1回 | **planning.role_ratios.conversion** |
| `ops.pause_rules` | 自動で一時停止する条件 | | always (defaults pre-checked) | multiselect | 否定的な反応の急増 / 確認待ちが3件以上たまった / 案内中の商品が終了 / 月額上限に到達 (always on) | (defaults) | PublishingPolicy.pause_rules |
| `ops.campaigns` | キャンペーン期間 | 期限や特典は「事実」として確認してから使います。 | optional | repeater {name, date_range, offer_ref, posts_per_week_override} | end ≥ start; offer_ref must exist | 秋の講座割 10/1-10/31 | Campaign + Facts `campaign.<id>.start/deadline` |
| `ops.notify_to` | お知らせの送り先 | | always | select | 登録メール (MVP) | 登録メール | NotificationPolicy |

### 3.12 STEP 10 — 月額の上限

| Key | Label (JA) | Help (JA) | Req | Type | Validation | Example | Destination |
|---|---|---|---|---|---|---|---|
| `cost.monthly_cap_jpy` | AI利用の月額上限 | 投稿数と情報の更新頻度から、目安の金額を表示しています。 | always | currency_jpy | integer ≥0; 0 ⇒ `cost.no_ai_mode` must be on (ONB-E071) | 5,000円 | CostPolicy.monthly_cap |
| `cost.on_cap` | 上限に達したとき | | always | select | その月は新しい投稿を作らない (default) / AIを使わない定型投稿だけ続ける (only if template supports) | 作らない | CostPolicy.on_cap |
| `cost.no_ai_mode` | AIを使わない運用 | 定型文と固定の情報源だけで運用します。表現の幅は狭くなります。 | optional | boolean | template must declare `supports_no_ai` | いいえ | CostPolicy.mode = `deterministic` (uses existing template wording path) |
| `cost.daily_call_cap` | 1日の上限回数（詳細設定） | 通常は変更不要です。 | optional, operator_only by default | number | ≥0 | (operator default) | `ai_cost_policies.utc_daily_call_cap` per feature |

Displayed, not entered: 「目安: 月 3,000〜4,500円」, computed from
posts/week × per-post call estimate × regeneration factor, plus research
cadence × per-cycle estimate. Prices come from `pricing.py`, the price table
version.

### 3.13 STEP 11 — 確認・送信

| Key | Label (JA) | Req | Type | Effect |
|---|---|---|---|---|
| `attest.facts_accurate` | 入力した商品・価格・条件などの情報は正確です | always | attestation | Facts written with `verified_by = customer:<user_id>`, provenance `customer_attested` |
| `attest.persona_confirmed` | 話し方・立ち位置の設定を確認しました | always | attestation | `persona.provenance = owner_confirmed`, `provenance_declared_by = customer:<user_id>`, date |
| `attest.defaults_accepted` | 「おすすめ設定」の内容を確認しました | if any default used | attestation | Each defaulted value recorded as `customer_accepted_default` |
| `attest.shadow_understood` | お試し運用中は投稿されないことを理解しました | always | attestation | informational |
| `attest.terms` | 利用規約・禁止事項に同意します | always | attestation | contract record |

The summary screen lists, per step, which values came from the customer and
which came from 「おすすめ設定」. It also shows **activation blockers** that
remain after submit (e.g., 「アカウント接続がまだです」).

---

## 4. Internal bootstrap model

### 4.1 Pipeline

```
OnboardingSubmission (draft answers, saved per step)
        │ submit
        ▼
compile(submission, VerticalTemplate@ver, SafetyFloor@ver)   ← pure, deterministic, no network
        │   → CompileReport {errors[], warnings[], provenance map}
        ▼
AccountConfig vN  (immutable JSON doc, status=candidate)
  + FactWrites    (to account_verified_facts, provenance-tagged)
        │
        ▼
validate(AccountConfig vN, live checks)   ← network: OAuth identity, URL reachability, source health, approver email
        │   → ValidationReport {blocking[], warnings[]}
        ▼
project(AccountConfig vN) → production_accounts.config_json (persona/planning/funnel, legacy shape)
                          → per-object rows (research profile, policies)
```

`compile` is the only code that turns answers into configuration. A new
vertical touches **template data and the field catalogue only**.

### 4.2 Object catalogue

Never shown to customers. "Storage" uses existing tables where possible.

| Object | Purpose | Generated from | Storage (existing / new) | Key invariants |
|---|---|---|---|---|
| **Organization** | Contracting customer | `business.company_name` (+ contract) | existing `organizations` | Operator creates it via `tenant-onboard` before the form opens (MVP). |
| **User / Role / Membership** | Who can see and do what | invite flow; `ops.approvers` | existing `users`, `user_roles`, `user_account_memberships` | Email is never in config or reports (existing PII rule). |
| **BusinessProfile** | Context for planning and research | STEP 1 | `AccountConfig.business` (org-level part copied per account at compile) | Context only. Never a claim source for posts. |
| **ChannelAccount** | One publishable account | STEP 2 | existing `production_accounts` + new columns `platform`, `lifecycle_state`, `active_config_version`, `candidate_config_version` | `handle` unique globally. Exactly one org (`org_accounts` gains `UNIQUE(account_id)`). |
| **ChannelConnection** | OAuth credential reference | `account.connect` | existing credential table (0014) + secret store | Secret material never leaves the Data Plane. Identity must match handle. |
| **AccountResearchProfile** | What topical research to do | STEP 8 + pillars + prohibited topics | `AccountConfig.research` + projection `account_research_profiles(account_id, version, …)` | Account-scoped. See §6. |
| **Persona** | Voice and worldview (how to write) | STEP 4 tone/stance/persona_profile/first_person/signature | `AccountConfig.persona` → `config_json.persona` | `provenance` required. `owner_confirmed` only via attestation. Contains no facts. |
| **WriterProfile** | Planning and form parameters | pillars, problems, purpose, intent, CTA freq, length, emoji, template | `AccountConfig.planning` → `config_json.planning` (exact existing keys: `topics`, `content_pillar_ratios`, `emotional_problems`, `templates`, `role_ratios`, `parts_by_role`, `cta_by_role`, `required_facts_by_role`, `objective_by_role`, `safety_constraints`) | Validated by the existing `validate_config`. Style references pin `style_profile_version` / `semantic_version`. |
| **StyleSource** | Where StyleDNA / Semantic Style come from | `account.use_past_posts`, `content.reference_accounts` | existing `account_research_posts` → `account_style_profiles` | Raw bodies stay in the research corpus. The Writer gets numbers and at most 3 retriever-selected examples (existing `writer.py` guard). |
| **Offer** | Something the account may lead to | STEP 6 repeater | `AccountConfig.offers[]` holds **only ids, type, and intensity** (no fact values) | Fact values live in `account_verified_facts` under `offer.<offer_id>.*`. |
| **FunnelFacts** | Verified business facts | STEP 6/7 fact fields, campaigns | existing `account_verified_facts` (key-namespaced) + new append-only `account_fact_events` | Never defaulted or inferred (existing `funnel.py` rule). Each fact has `verification_level`. |
| **ComplianceRules** | What must / must not be said | STEP 4 (prohibited topics, banned terms), STEP 7, regulated flags, safety floor | `AccountConfig.compliance` → compiled into `planning.safety_constraints` + QA rule params | Union of safety floor ∪ template ∪ customer. Customers can add but never remove floor items. |
| **ResearchSources** | Allowed adapters and domains | STEP 8 sources, website, reference accounts, own history | `AccountConfig.research.sources[]` | Adapter types are code (written once). Selection and params are data. |
| **PublishingPolicy** | When and how often | STEP 9 | `AccountConfig.publishing` | Windows × spacing must fit frequency. Pause rules always include the budget cap. |
| **ApprovalPolicy** | Who approves and how | `ops.approval_mode`, approvers, deadline | `AccountConfig.approval` (replaces global `APPROVAL_MODE` per account; global stays the fallback) | `on_timeout = skip` is fixed. AUTO is unavailable until track-record conditions are met (§9.4). Ramp: first N live posts are MANUAL regardless. |
| **CostPolicy** | Spending limits | STEP 10 + research cadence | `AccountConfig.cost` → append-only `ai_cost_policies` rows (branch 0027) per feature (`writer`, `research_classify`, `research_angle`, `qa_semantic`) | Cap reached ⇒ block or deterministic mode. Never overspend silently. |
| **NotificationPolicy** | Who hears about approvals and pauses | `ops.notify_to`, approvers | `AccountConfig.notifications` | At least 1 verified recipient. |

### 4.3 Field → object mapping (compiler rules, abridged)

| Compiler output | Rule |
|---|---|
| `planning.topics` | `content.pillars` labels, in order |
| `planning.content_pillar_ratios` | normalized pillar weights (equal weights if untouched) |
| `planning.emotional_problems` | `audience.problems` |
| `planning.templates` | from template `post_structures[]` (preference, defaultable); customer may deselect |
| `planning.role_ratios` | base from template, keyed by `account.purpose` × `audience.purchase_intent`; then **conversion = cta_frequency ratio** (入れない→0, 10投稿に1回→0.1, …); the others renormalized; **conversion forced 0 if no offer is `ready`** (§4.4) |
| `planning.cta_by_role` | `offer.cta_intensity`: 控えめ → {desire: none, conversion: soft_bridge}; 標準 → {desire: soft_bridge, conversion: direct}; 積極的 → same as 標準 plus higher conversion parts. All `none` if conversion = 0. |
| `planning.required_facts_by_role.conversion` | required-fact set of each `ready` offer type (§4.4), namespaced |
| `planning.objective_by_role` | template phrasing per role, with `audience.desired_outcome` merged into desire |
| `planning.safety_constraints` | rendered from ComplianceRules (floor + template + customer), in Japanese |
| `persona.voice` / `tone` / `worldview` | `content.tone` chips + text; `content.persona_profile`; `content.stance` |
| `persona.provenance` | `owner_confirmed` iff `attest.persona_confirmed`, else `operator_draft` if the operator authored it, else `unrecorded` |
| `funnel.destination` / `state` | human-readable summary for the legacy shape; `state = offer_not_configured` when there is no ready offer |
| `domain_id` | `template.engine_ref` if the template needs a code engine (e.g., `divination` for tarot/numerology), else `generic` (a DomainConfig compiled from AccountConfig; generalizes `research/materialize.py`) |

### 4.4 Generic funnel-fact catalogue

`production/funnel.py::FUNNEL_FACTS` becomes the fortune *extension* of a
generic catalogue. Existing keys stay valid as aliases, so no data migration
is needed for the current accounts.

| Generic fact (per offer) | Kind | Required for conversion when | Fortune alias |
|---|---|---|---|
| `offer.<id>.conversion_goal` | enum | always | `primary_threads_goal` |
| `offer.<id>.destination_url` | url | always | `funnel_destination_url` |
| `offer.<id>.available` | bool | always (must be true) | `free_reading_available` |
| `offer.<id>.application_method` | text | always | `free_reading_application_method` |
| `offer.<id>.provider` | text | when a post names who provides | `free_reading_provider` |
| `offer.<id>.price` | numeric | when posts mention price | — |
| `offer.<id>.affiliate_network` / `affiliate_status=approved` | text / enum | type = affiliate | — |
| `offer.<id>.eligibility` | text | type ∈ job, financial, age-restricted | — |
| `org.pr_disclosure_label` | text | any affiliate/sponsored offer | — |
| `campaign.<id>.start` / `deadline` | date | when posts mention a deadline | (`campaign_deadline`) |
| `*_conversion_rate`, `attribution_window_days` | rate / days | never required; measured only | same |

An offer is **ready** when every required fact exists with an adequate
verification level and `available = true`. Readiness is derived and never
stored.

**Verification levels** (new column `verification_level` on facts and events):

| Level | Who | Allowed for |
|---|---|---|
| `customer_attested` | customer, via the STEP 11 attestation | URLs (plus automated reachability), availability, application method, eligibility, PR label, provider name, price shown on their own LP |
| `operator_verified` | operator after checking evidence | numeric achievements (人数・実績・売上), testimonials, credentials or career claims, discounts and "No.1" style claims, anything under 薬機法 / 金融 regimes |
| `system_observed` | insights / measurement | conversion rates, follower counts (never as post claims unless re-attested) |

A Writer request needing a fact whose level is below the allowed level
fails with the existing `MissingVerifiedFact` path. There is no new failure
mode.

---

## 5. Lifecycle / state machine

### 5.1 Account lifecycle (`production_accounts.lifecycle_state`, new)

```
             save                submit            compile ok            validate ok
   (none) ──────▶ DRAFT ─────────▶ SUBMITTED ───────▶ CONFIGURED ─────────▶ VALIDATED
                    ▲                  │ compile errors      │ validate blocking │
                    │                  ▼                     ▼                   │ start shadow
                    └──────────── NEEDS_INPUT ◀──────────────┘                   ▼
                    customer edits ▲    ▲                                      SHADOW
                                   │    │ rejected (fix config)                  │ exit criteria met
                                   │    └───────────────────────────── REVIEW_REQUIRED
                                   │                                     │ customer ok + operator ok
                                   │                                     ▼
                                   │                                  APPROVED
                                   │                                     │ activation (arm, confirm handle)
                                   │                                     ▼
            RESHADOW change ───────┼──── candidate lane ──────────────  ACTIVE ◀────┐
                                   │                                     │ pause     │ resume (SAFE)
                                   │                                     ▼           │
                                   │                                   PAUSED ───────┘
                                   │                                     │
                 any state ──── operator hold ──▶ SUSPENDED ── operator release ──▶ previous non-active state
                 any state ──── offboard ──────▶ OFFBOARDED (terminal; credentials.forget)
```

### 5.2 Transition table

| From | To | Trigger / actor | Guard |
|---|---|---|---|
| — | DRAFT | org admin starts account onboarding | org exists; user is admin of org |
| DRAFT | SUBMITTED | customer submit | all `always` fields valid; attestations ticked |
| SUBMITTED | CONFIGURED | system `compile` | CompileReport.errors = ∅ |
| SUBMITTED / CONFIGURED / VALIDATED | NEEDS_INPUT | system | any blocking issue (§11). Issues stored with codes. |
| NEEDS_INPUT | SUBMITTED | customer resubmit | — |
| CONFIGURED | VALIDATED | system `validate` | ValidationReport.blocking = ∅ (connection, URLs, sources, approver, budget) |
| VALIDATED | SHADOW | system (auto) or operator | lifecycle ≠ ACTIVE; publisher **not constructible** for this account (§8.2) |
| SHADOW | REVIEW_REQUIRED | system | shadow exit criteria met (§8.3) |
| SHADOW | NEEDS_INPUT | system | shadow surfaced a blocking issue (e.g., 0 research items, QA hard-fail pattern) |
| REVIEW_REQUIRED | APPROVED | customer approves samples **and** operator signs off (MVP) | all gates G1–G13 (§8.4) green |
| REVIEW_REQUIRED | SHADOW | operator / customer 「もう一度お試し」 | config unchanged or SAFE-only edits |
| REVIEW_REQUIRED | NEEDS_INPUT | customer requests changes | — |
| APPROVED | ACTIVE | customer clicks 運用開始 + types handle; operator executes `arm()` (MVP) | gates re-checked at that instant (TOCTOU); `confirm_handle` matches |
| ACTIVE | PAUSED | customer, pause rule, budget cap, or kill switch | always allowed (safe direction; `disarm()`) |
| PAUSED | ACTIVE | customer resume | gates G2 (token), G9 (budget), G13 re-checked; no config change pending above SAFE |
| any | SUSPENDED | operator | reason code required; `disarm()` |
| SUSPENDED | prior state (≤ APPROVED) | operator | reason code; never straight back to ACTIVE without re-arm |
| any | OFFBOARDED | org admin request + operator | credentials forgotten; data retained per retention policy |

### 5.3 Mapping to the existing publish gate

`lifecycle_state` is the product state. Existing `status` stays the
**publish gate**, unchanged in meaning:

| lifecycle_state | `status` | Publish possible? |
|---|---|---|
| DRAFT … VALIDATED, NEEDS_INPUT | `draft` | no |
| SHADOW, REVIEW_REQUIRED, APPROVED | `ready` | no |
| ACTIVE | `active` (via existing `arm()`) | only with authorized publisher **and** `allow_live=True` (existing 3-key rule) |
| PAUSED, SUSPENDED | `ready` (via `disarm()`) | no |

Invariant for DOT: `status = active ⇒ lifecycle_state = ACTIVE`. The reverse
can be briefly false during `arm()`, so `arm()` is the single place where both
change, in one transaction.

### 5.4 Writes and the single-writer DB

Compile and project writes use one `BEGIN IMMEDIATE` transaction, like
`tenant_onboarding.onboard`. They are **queued and never applied while NIGHT
or another writer holds the database**. Onboarding is low-volume, so a short
apply queue is enough.

---

## 6. Research profile model (config-driven multi-vertical research)

### 6.1 Two research kinds (keep them separate)

| Kind | Input | Output | Existing |
|---|---|---|---|
| **Style research** | reference accounts, own past posts | StyleDNA / Semantic Style (numbers, closed vocab) | `account_research_posts`, `account_style_profiles`, semantic profiles |
| **Topic research** | themes, keywords, sources | **ResearchPacket** for Planning | Research Intelligence v1 (LAB, two accounts; not in inspected repos) |

This section is about topic research. Style research keeps its existing
pipeline. Only its *inputs* become configuration.

### 6.2 Layers

```
                    SHARED (tenant-neutral, only where safe)
  ┌──────────────────────────────────────────────────────────────────┐
  │ source_items  (raw normalized items; no account annotations)      │
  │ collection_runs (adapter, query_fingerprint, fetched_at)          │
  └──────────────────────────────────────────────────────────────────┘
                 ▲ fetch (deduped)              │ read-only reference
                 │                              ▼
                    ACCOUNT-SCOPED (always carries account_id)
  ┌──────────────────────────────────────────────────────────────────┐
  │ AccountResearchProfile vN                                         │
  │   → research_candidates (account_id, source_item_id, score, why)  │
  │   → research_packets    (account_id, profile_ver, config_ver, …)  │
  │   → content_plans       (existing; + packet_id, config_version)   │
  │   → Writer request      (existing guards)                         │
  └──────────────────────────────────────────────────────────────────┘
```

### 6.3 AccountResearchProfile (versioned with AccountConfig)

```yaml
account_id: acct_xxx
version: 3                      # = research section version inside AccountConfig
template_ref: ai_business@2
locale: {lang: ja, region: JP}
topics:
  - {id: t1, label: AI仕事術, weight: 0.25, intent: evergreen, subtopics: [議事録, メール下書き]}
  - {id: t2, label: 生成AIの新機能, weight: 0.15, intent: news}
include_keywords: [Claude, ChatGPT, 議事録 自動化]          # tenant-private
exclude_keywords: [仮想通貨, 情報商材]
exclude_topics: [政治]                                    # ← content.prohibited_topics
entities_watch: []                                        # brands/products to follow
reference_accounts:                                       # style research inputs
  - {platform: threads, handle: example_ai, purpose: style, intake: manual}
sources:
  - {adapter: official_announcements, allow_domains: [anthropic.com, openai.com], enabled: true}
  - {adapter: news_search, params: {lang: ja}, deny_domains: [example-matome.com], enabled: true}
  - {adapter: own_account_insights, enabled: true}         # read-only, own account
  - {adapter: manual_intake, enabled: true}                 # human-supplied items
freshness: {news_max_age_hours: 72, default_max_age_days: 30, evergreen_allowed: true}
cadence: {collect: 3x_week, packet: per_planning_cycle}
relevance: {method: deterministic_first, llm_classify: true, min_score: 0.55}
budget: {max_items_per_cycle: 200, max_llm_calls_per_cycle: 20}
```

**Source adapters are code, written once per source *type*.** Examples:
`official_announcements` (RSS/Atom allowlist), `news_search`,
`public_statistics`, `own_account_insights`, `manual_intake`,
`ecommerce_catalog_feed`, `job_market_feed`. They all implement the existing
`ResearchProvider` interface (`search_posts`). A vertical never adds an
adapter; it selects and parameterizes them. The existing integrity rules carry
over unchanged:

- No unofficial scraping.
- Third-party Threads accounts come only through `manual_intake`.
- Unavailable data raises `ResearchDataUnavailable`, never zero-filled.

### 6.4 When the raw cache is shared

A `source_item` is **shared** only if both conditions hold:

1. **Content is public and licence-safe** (`license_class = public_shared`).
   Customer uploads, own-account insights, and manual intake of competitors
   are `tenant_private`, with `owner_org_id` set and readable only within that
   org.
2. **The query that fetched it reveals nothing about the tenant.** Template-level
   queries (e.g., the `ai_business` template's public keyword list) are shared.
   A customer's own keywords may name an unreleased product or a competitor
   strategy, so they run as **tenant-private queries**. Their results go to the
   tenant-private cache even if the content is public.

Shared rows hold no account ids, scores, angles, or which tenant asked. Fetch
dedupe uses `query_fingerprint` only for shared queries.

### 6.5 Account-scoped stages

1. **Candidate selection** (`research_candidates`): for each item visible to
   the account (shared, or private to the same org), score against the profile:
   - Deterministic first: keyword/topic match, exclusions, freshness, domain
     allow/deny.
   - Then optional LLM classification within `budget.max_llm_calls_per_cycle`.
   - Record `matched_topics`, `matched_by`, `excluded_reason`.
2. **Packet building** (`research_packets`): select the top items per topic
   weight. For each item, frame an **account-specific angle** from Persona
   audience, WriterProfile pillars, and ComplianceRules. Stamp `account_id`,
   `profile_version`, `config_version`, and `cycle_id`. Record source refs
   (provenance), not copied bodies.
3. **Planning** reads packets **by account_id only** (store API requires it,
   as all production tables already do).
4. **Writer** receives the packet's angles and facts through the existing
   `GenerationRequest` guards: research leak and copy checks, and the
   verified-fact boundary.

### 6.6 One source item, several legitimate packets: 「AI面接対策」

Source item S: a public news article, "企業の一次面接でAI面接官の導入が進む
／応募者のAI活用対策も話題に". It was fetched once by a shared template query.

| | AI / business account (`acct_A`, org X) | Career / recruitment account (`acct_B`, org Y) |
|---|---|---|
| Profile match | topic 「AI仕事術」 (keyword: AI活用) | topic 「面接対策」 (keyword: 面接) |
| Exclusion check | no hit | excludes 「AI副業」, no hit |
| Candidate row | `(acct_A, S, 0.71, [AI仕事術])` | `(acct_B, S, 0.83, [面接対策])` |
| Packet angle | "AIで面接準備をするときの具体的な使い方と、やりすぎない線引き" | "AI面接が増える中で、応募者が準備すべきこと／企業側の見え方" |
| Compliance applied | acct_A: no 誇大な効率化 claims | acct_B: 職業安定法 regime; no 合格保証 |
| Packet id | `rp_A_…` (account_id = acct_A) | `rp_B_…` (account_id = acct_B) |

Why this is not contamination:

- The only shared thing is **S itself**, which is public, unannotated, and
  read-only.
- Each packet is derived solely from S plus *its own* account's profile. Neither
  packet references the other, and neither account's candidates, angles, or
  KPI are visible to the other.
- Learning is account-scoped: `acct_A`'s engagement on this topic never changes
  `acct_B`'s relevance scoring. Existing rule: learning only from
  `learn_enabled` content of the same account.

**Guards** (enforced, not conventional):

- `research_packets.account_id` must equal `profile.account_id` and the
  planning account. Store methods take `account_id` as a required argument.
- A packet item may reference only `public_shared` items, or `tenant_private`
  items whose `owner_org_id` equals the account's org.
- Building a Writer request asserts `packet.account_id == request.account_id`.
- **Later:** a cross-tenant originality check on outputs derived from the same
  `source_item_id`, so two tenants in one vertical never publish near-identical
  posts.

### 6.7 Migration from Research Intelligence v1 (LAB)

1. Express each of the two LAB accounts' current hard-coded research
   behaviour as an `AccountResearchProfile v1`.
2. **Golden parity:** for a frozen input set, the config-driven pipeline must
   produce the same candidate set and packet items as v1 (angles may differ
   only where LLM-generated). DOT reviews the diff.
3. Only then onboard a third account through configuration alone. That
   account is the proof that no per-vertical code is needed.

---

## 7. Vertical templates

### 7.1 Template = versioned data file

```yaml
template_id: career_recruitment
version: 1
engine_ref: null                      # or "divination" when a code engine is required
supports_no_ai: false
defaults:                             # preference / policy only; facts are impossible here
  content.pillars: [...]
  planning.templates: [...]           # post structures
  role_ratios_by_purpose: {...}
  research: {topics: [...], sources: [...], freshness: ..., cadence: ...}
  ops: {posts_per_week: 5, windows: [...], cta_frequency: "10投稿に1回"}
compliance:
  regimes: [職業安定法]
  prohibited_claims_suggested: [...]  # shown pre-checked; customer may add
  floor_additions: [...]              # become non-removable for this vertical
required_offer_facts_extra: {求人: [eligibility, employment_type, salary_range_verified]}
kpi_default: 応募数
cta_default: "求人ページから応募"
```

### 7.2 Precedence (merge order)

```
SafetyFloor (platform-wide, non-overridable)
   ∧  ( customer input  >  operator override (restricted fields)  >  template default  >  platform default )
```

- A template default is applied **only** when the customer left the field empty
  **and** the field is `defaultable`. Every applied default is recorded with
  provenance `template_default@<template>@<version>`. Customer acceptance
  (STEP 11) promotes it to `customer_accepted_default`.
- Templates **never** supply facts (catalogue-enforced, §3.1).
- AccountConfig pins `template_id@version`. **Publishing a new template
  version never mutates existing accounts.** It produces an optional "おすすめ
  設定の更新" proposal, which goes through §9 like any customer edit.
- Compliance floor items from a template can only be *added* to.

### 7.3 Starting templates

| | FORTUNE / RELATIONSHIPS | AI / BUSINESS | CAREER / RECRUITMENT | ECOMMERCE / PRODUCTS |
|---|---|---|---|---|
| Research topics | 月の巡り・季節の節目, 恋愛・人間関係の悩み, 自己理解 | 生成AI新機能, 仕事効率化, AI活用事例, 学び方 | 転職市場動向, 面接・書類対策, 職種別の働き方, 法改正 | 新商品・季節需要, 使い方・比較の疑問, レビュー傾向 |
| Source types | 暦・天文の公開データ, own insights, manual intake (style) | official announcements, tech news, own insights | 公的統計 (厚労省等), job-market feed, 業界ニュース | own catalog feed, own site, category news, review summaries (own products only) |
| Content pillars | 共感・気づき / 今日の指針 / 関係の読み解き / 鑑定の様子 (verified only) | 初心者あるある / 仕事術 / 実体験 / 学び方 | 市場の今 / 準備のコツ / 職種紹介 / よくある不安 | 使い方 / 選び方 / 舞台裏 / 季節の提案 |
| Default exclusions | 医療・法律の断定, 不安を煽る予言, 霊感商法的表現 | 投資・仮想通貨, 「誰でも稼げる」, 情報商材 | 差別的条件, 他社求人の批判, 合格保証 | 他社比較の断定, 医薬的効能 (unless permitted), 在庫・価格の推測 |
| Typical KPI | プロフィール閲覧 → LINE登録 → 無料鑑定申込 | フォロワー → リンククリック → アフィリエイト成果 | 応募数, 求人ページ流入 | 商品ページ流入, 購入 |
| Typical CTA | 「続きはプロフィールのLINEで」 (soft) | 「詳しい手順はプロフィールのリンクに」 | 「求人の詳細はこちらから応募できます」 | 「商品ページはプロフィールから」 |
| Compliance | 結果を保証しない; 恐怖訴求禁止; 架空の相談者・口コミ禁止 (existing common QA-1〜5・7 + `fortune_qa`); 特商法 for paid readings | ステマ規制 (#PR); 収益・成果の断定禁止; 実績は operator_verified | 職業安定法 (求人内容の的確表示, 虚偽・誇大禁止); 給与・条件は verified facts only; age/gender conditions checked | 景表法 (優良・有利誤認, 「最安」「No.1」 need evidence); 薬機法 for cosmetics/health; 価格・在庫は verified facts only; #PR when affiliate |
| engine_ref | `divination` (existing tarot/numerology engine, optional) | `generic` | `generic` | `generic` |

`local_business`, `owned_media`, and `other` fall back to a **generic template**:
minimal defaults plus the safety floor. Operator review is required before
SHADOW.

---

## 8. Shadow-first activation

### 8.1 States covered

CONFIGURED → VALIDATED → SHADOW → REVIEW_REQUIRED → APPROVED → ACTIVE (§5).

### 8.2 What SHADOW does and cannot do

| Does | Cannot (structurally) |
|---|---|
| run research collection per profile (real adapters, real budget) | construct a live publisher. The factory refuses when `lifecycle_state ≠ ACTIVE`, in addition to the existing `status`/`allow_live` keys. |
| build packets and plans (real planner) | enter the NIGHT03 batch. Shadow content ends in a terminal `shadow_reviewed` state and never reaches `approved` / `publish_ready`. |
| generate sample posts (real Writer, `lane = shadow`) | use publish-scope credentials. Only insights (read) scope is requested, for baseline. |
| run all QA (fortune_qa / semantic QA / similarity / research leak) | count toward KPI, learning, or daily publish caps (lesson from the Phase 1.4 DryRun bug) |
| record AI usage (`ai_usage_events`, feature-tagged) | promote a shadow sample into the live queue (see §8.5) |
| compute a schedule preview from PublishingPolicy | |
| compute a monthly cost estimate | |

### 8.3 Exit criteria (SHADOW → REVIEW_REQUIRED)

All of the following:

- At least **3 planning cycles** or **72 h**, whichever comes later
  (configurable per template).
- At least `max(6, 2 × pillars)` sample posts, **covering every enabled role
  and every pillar**. If CTA is enabled: at least 2 conversion samples per
  ready offer.
- At least 1 successful research collection per enabled adapter, or the
  adapter is marked unavailable with a reason.
- Cost estimate computed from actual shadow usage.

### 8.4 Activation gates (all must pass at APPROVED and again at the arm instant)

| Gate | Check | Source of truth |
|---|---|---|
| G1 Config | AccountConfig candidate compiles; `validate_config` problems = ∅ | compiler + `accounts.validate_config` |
| G2 Connection | publish + insights scopes granted; identity = handle; token valid ≥ 7 days | `credentials.readiness`, `assert_identity_matches` |
| G3 Research | ≥ 1 healthy allowed source; ≥ 1 non-empty packet in the last cycle | research runs |
| G4 Style | a StyleDNA profile exists, **or** the customer accepted a "template baseline style" (new accounts with no posts and no references) | `account_style_profiles` |
| G5 Persona | `persona.provenance ∈ {owner_confirmed}` for customer accounts | `accounts.persona_provenance` |
| G6 Funnel | every role with CTA ≠ none has all required facts at the required verification level; otherwise conversion ratio = 0 | `funnel.conversion_blockers`, §4.4 |
| G7 Compliance | PR label set when any affiliate/sponsored offer exists; regulated regimes have a reviewed prohibited-claims list; no floor violations | ComplianceRules |
| G8 Quality | final shadow samples: 100% pass hard QA; 0 research-leak or copy findings; first-pass QA rate ≥ 70% (template-tunable); regeneration cap never hit on > 20% of plans | `qa_results`, provenance guards |
| G9 Cost | projected monthly ≤ 80% of `monthly_cap`; no cap breach during shadow | `ai_usage_events` |
| G10 Approver | ≥ 1 approver with content:review and verified email; notification delivered (test) | tenancy tables |
| G11 Human review | customer approved the sample set (per-sample 👍 / 修正 / NG; ≥ 80% 👍, no NG left unaddressed) **and** operator sign-off | review records |
| G12 Policy | PublishingPolicy consistent (§11 E06x); schedule preview non-empty within the first 7 days | compiler |
| G13 Safety state | kill switch off; no unresolved partial publication for the account; not SUSPENDED | Data Plane safety state |

### 8.5 Activation action and the first live period

1. The customer clicks 「運用開始」 and types the account handle. This mirrors
   the `arm(confirm_handle)` pattern.
2. MVP: the operator executes the arm in `/internal` after a final review.
   Later, low-risk templates may skip the operator.
3. **Shadow samples are not queued.** Live content is generated fresh under
   the active config. A customer may mark a sample 「最初の投稿に使いたい」.
   That creates a *new* content version under the ACTIVE config, which goes
   through normal QA and approval.
4. **Ramp:** the first 10 live posts (or 14 days) are MANUAL, whatever the
   approval mode, at ≤ the configured frequency.

---

## 9. Post-activation editing rules

### 9.1 Principle

> **Tightening is always safe. Loosening is reviewed. Changing who / what /
> where we talk to is re-shadowed.**

Each field's `change_class` lives in the catalogue. A change set's class is
the **maximum** class of its fields, with one exception: a *restrictive*
change applies immediately as SAFE, whatever the field. Restrictive changes
are adding exclusions or banned words, removing or pausing an offer, lowering
frequency or budget, tightening approval, and pausing.

### 9.2 Classes

| Class | Effect | Who approves |
|---|---|---|
| **SAFE** | new version becomes active at the next cycle boundary (immediately for restrictive) | none (the change author, if an editor or admin) |
| **REVIEW** | new version is a *candidate*. A preview (2 samples, no publish, within budget) is shown. Active config continues until approved. | customer admin for preferences; **operator** for compliance-, fact- or approval-loosening |
| **RESHADOW** | candidate runs a full shadow lane in parallel; active continues under vN unless the change is restrictive. Exit criteria and gates as §8. | customer + operator |
| **RESHADOW_SCOPED** | shadow only the affected role (e.g., conversion). Other roles continue live. **MVP: treat as RESHADOW.** | customer + operator |

### 9.3 Classification table

| Change | Class | Note |
|---|---|---|
| Posting windows / hour | SAFE | revalidate window capacity |
| Blackout dates, campaign pause | SAFE | |
| Posts/week **decrease** | SAFE (restrictive) | |
| Posts/week **increase** within plan and budget | SAFE | cost estimate shown; if > budget → REVIEW (budget) |
| Add banned words / prohibited topics / research exclusions | SAFE (restrictive) | triggers re-QA of queued content (§9.5) |
| Add research keywords | SAFE | tenant-private; cost check |
| Add a new source adapter or allowed domain | REVIEW (operator) | licence / cost |
| Add subtopic within an existing pillar | SAFE | |
| Add / remove / rename a main pillar | REVIEW | preview samples |
| Tone wording tweak (chips unchanged) | REVIEW | |
| Tone chips / stance / persona profile change | RESHADOW | voice identity change |
| Reference accounts added or removed | REVIEW | StyleDNA recomputed → new style version pinned |
| **Target audience change** | RESHADOW | changes every plan |
| CTA phrase | REVIEW | |
| CTA frequency **decrease** / to 入れない | SAFE (restrictive) | |
| CTA frequency **increase** | REVIEW | |
| Offer: URL change (same offer) | REVIEW (operator if domain changes) | reachability re-check; queued CTA content re-QA |
| Offer: availability → 一時停止 / ended | SAFE (restrictive) | removes conversion from queue immediately |
| **Offer: new or replaced affiliate offer** | RESHADOW_SCOPED (conversion) | new facts and compliance; PR label |
| Price / eligibility fact change | REVIEW (operator if numeric claim) | |
| PR label text change | REVIEW (operator) | cannot be removed |
| Approval: tighten (AUTO → ESCALATE → MANUAL) | SAFE (restrictive) | |
| Approval: loosen | REVIEW (operator) + track record (§9.4) | |
| Approvers add / remove | SAFE, provided ≥ 1 remains (else blocked, E091) | |
| Budget decrease | SAFE (restrictive) | may auto-reduce cadence; customer warned |
| Budget increase | REVIEW (org admin only) | |
| Brand name / display name | REVIEW | |
| **Business category / template switch** | RESHADOW | |
| **Publishing platform change / add** | new ChannelAccount → full onboarding from STEP 2 | never an edit of an existing account |
| Company name | REVIEW (operator) | contract record |

### 9.4 Loosening approval to ESCALATE / AUTO: preconditions

- ESCALATE: ≥ 20 live posts approved, human reject rate ≤ 15% over the last 30
  days, 0 compliance incidents.
- AUTO: ≥ 50 live posts, reject rate ≤ 5%, 0 compliance incidents in 60 days,
  not in a regulated regime (薬機法 / 金融 / 医療), and operator approval.
- Any compliance incident or a reject-rate spike automatically tightens back to
  MANUAL (SAFE, restrictive).

### 9.5 Effect on already-queued content

Approvals already bind to `content_hash` (`workflow.py`). Add a
**config binding**: every content version records `config_version`. When a
change with class ≥ REVIEW, or any restrictive compliance or offer change,
becomes active:

1. Unpublished content (`human_approval_pending`, `approved`, `publish_ready`)
   generated under an older config is **re-run through QA with the new
   ComplianceRules and facts**.
2. Failures are invalidated and go back to approval (invalidate, like an edit
   does today). Passes keep their approval.
3. Published content is never touched.

---

## 10. Versioning / audit

### 10.1 AccountConfig versions (new, append-only)

```sql
-- design sketch, not a migration
account_config_versions(
  account_id, version, parent_version,
  status,             -- draft | candidate | shadowing | approved | active | superseded | rejected
  change_class,       -- SAFE | REVIEW | RESHADOW | RESHADOW_SCOPED | INITIAL | ROLLBACK
  config_json,        -- full document (business, persona, planning, offers[ids], compliance,
                      --   research, publishing, approval, cost, notifications)
  config_hash,
  diff_json,          -- field-key level: [{key, from, to, class}]; no fact values, no PII
  template_ref,       -- e.g. ai_business@2
  catalogue_version,  -- field catalogue version used to compile
  facts_digest,       -- hash of (fact_key, value, level) set at compile time
  provenance_json,    -- per field: customer_input | customer_accepted_default | template_default | operator_set
  created_by, created_at,          -- actor ref: user:<id> | operator:<id> | system:<component>
  approved_by, approved_at, activated_at, reason,
  PRIMARY KEY (account_id, version)
)  -- append-only: UPDATE allowed only on the status/approved_*/activated_* lifecycle columns,
   -- via a single store method; DELETE forbidden (trigger), same style as 0027.

account_fact_events(event_id, account_id, fact_key, value, verification_level,
                    actor, source_note, created_at, supersedes_event_id)   -- append-only
```

- `production_accounts.active_config_version` / `candidate_config_version` are
  the pointers. `config_json` on `production_accounts` is a **projection** of
  the active version's legacy sections (persona / planning / funnel), so every
  existing reader keeps working unchanged.
- `account_verified_facts` stays the current-value table. `account_fact_events`
  is its history.

### 10.2 Stamping (which content used which config)

Add `config_version` (and, for research, `packet_id`) to `content_plans`,
`content_versions`, `research_packets`, and `ai_usage_events` (via
`feature/plan_id` correlation). `publication_records` inherit it through
`content_id`. `content_plans` already records `style_profile_version`, and the
same pattern extends here.

That answers, for any published post: config vN, template@ver, facts digest,
style version, packet, approver, cost.

### 10.3 Rollback

Rollback is **forward-only**. Rolling back to vK creates vN+1 with vK's
content, `change_class = ROLLBACK`, and `parent_version = N`.

- Rolling back to a version that was previously ACTIVE is class REVIEW, not
  RESHADOW, **provided** its facts still validate. A campaign deadline may have
  passed or an offer may have ended. If they don't validate, the rollback is
  blocked with the failing facts named.
- History is never rewritten.

### 10.4 Audit events

- Every transition (lifecycle, config status, fact event, approval, arm/disarm)
  writes the existing `audit_events` (account-scoped).
- The Control Plane projects sanitized events into its existing append-only
  agent activity ledger for the operator `/internal` view.
- Customer view: 「変更履歴」, showing the date, who changed it, which settings
  (customer-facing labels), and status. No internal fields.

### 10.5 Deliberately not built

No event sourcing, no generic workflow engine, no per-field ACL, and no
bitemporal tables. One versions table, one fact-events table, and pointers.

---

## 11. Failure / incomplete onboarding (fail-closed)

### 11.1 Principles

- **Never guess required business facts.** Missing ⇒ the dependent capability
  is *disabled and named*, never defaulted. Example: no ready offer ⇒
  conversion = 0, with 「案内できる商品がまだありません」 shown.
- An issue blocks **only what it must**. Per-account independence: Customer A's
  Instagram being unsupported never blocks their Threads account.
- Every issue has a code, a severity (`block_submit`, `block_activation`, or
  `warn`), a customer message in plain Japanese with a 「直す」 deep link, and an
  operator-only detail.
- Validation lists **all** problems at once, as `validate_config` already does,
  not the first one.

### 11.2 Error catalogue

| Code | Condition | Detected at | Severity | Customer message (JA) | Fix |
|---|---|---|---|---|---|
| E001 | required field empty | submit | block_submit | 「◯◯」が未入力です | the field |
| E010 | unsupported platform | STEP 2 | block_submit (that account) | この媒体は現在準備中です。準備ができ次第お知らせします | choose Threads / waitlist |
| E011 | handle already linked to another org | STEP 2 / validate | block_submit | このアカウントは既に別の契約で登録されています。担当者にご連絡ください | operator |
| E012 | OAuth not connected | validate | block_activation | アカウントの接続がまだです | connect |
| E013 | OAuth identity ≠ handle | validate | block_activation | 接続したアカウントが入力したIDと違います | reconnect correct account |
| E014 | missing scopes / token expiring < 7d | validate / any time | block_activation (ACTIVE: auto PAUSE at expiry) | 接続の更新が必要です | reconnect |
| E020 | CTA enabled but no ready offer (missing offer facts) | compile | block_activation **for conversion only**; compiler sets conversion = 0 | 案内する商品の情報が足りないため、案内なしでお試し運用します。「申込方法」を入力すると案内を始められます | offer facts |
| E021 | affiliate status ≠ 承認済み | compile | same as E020 | 提携が承認されるまで、この案件は案内しません | update status |
| E022 | offer URL unreachable / non-https / unknown shortener | validate | block_activation | 申込ページが開けません | URL |
| E023 | claim needs operator verification | compile | warn (claim unusable until verified) | 実績「…」は確認中のため、確認が終わるまで投稿に使いません | evidence / operator |
| E030 | affiliate/sponsored offer without PR label | compile | block_submit | PR表記の設定が必要です | STEP 7 |
| E031 | minors in audience + age-restricted category | compile | block_submit | この業種では10代を対象にできません | audience |
| E032 | regulated regime without reviewed prohibited claims | compile | block_submit | 表現ルールの確認が必要です | STEP 7 |
| E033 | prohibited category (e.g., 投資助言, 医療行為の効能, アダルト, ギャンブル) | compile | block_submit → operator review | この内容は担当者の確認が必要です | operator |
| E040 | no allowed research source enabled / all unhealthy | validate / shadow | block_activation | 参考にする情報源がありません。「おすすめ設定」に戻すか、情報源を追加してください | STEP 8 |
| E041 | research produced 0 relevant items in shadow | shadow | block_activation | テーマに合う情報が見つかりませんでした。テーマやキーワードを広げてください | STEP 8 |
| E042 | include and exclude keyword conflict | compile | block_submit | 「◯◯」が追いかける言葉と除外する言葉の両方に入っています | STEP 8 |
| E050 | no style source and template baseline not accepted | validate | block_activation | 文体の参考がありません。「おすすめの文体で始める」を選ぶか、参考アカウントを追加してください | STEP 4 |
| E060 | windows empty | compile | block_submit | 投稿してよい時間帯を1つ以上選んでください | STEP 9 |
| E061 | posts/week > window capacity given min spacing | compile | block_submit | 時間帯に対して投稿数が多すぎます（最大◯件/週） | frequency or windows |
| E062 | start date before shadow can finish | compile | warn (auto-shift) | 開始日を◯月◯日に調整しました | — |
| E063 | campaign outside offer availability / end < start | compile | block_submit | キャンペーン期間を確認してください | STEP 9 |
| E064 | blackout covers all windows for > 14 days | compile | warn | — | — |
| E070 | budget below the minimum estimate for chosen frequency | compile | block_submit | 月額上限が目安（◯円〜）を下回っています。投稿数を減らすか上限を上げてください | STEP 9 / 10 |
| E071 | budget = 0 and no-AI mode off, or template doesn't support no-AI | compile | block_submit | 月額0円の場合は「AIを使わない運用」を選んでください（この業種では未対応です） | STEP 10 |
| E080 | approval mode AUTO requested at onboarding | compile | block_submit | 自動投稿は運用実績ができてから選べます | STEP 9 |
| E090 | no approver / approver lacks content:review / unverified email | validate | block_activation | 投稿を確認する担当者を設定してください | STEP 9 / invite |
| E091 | removing the last approver post-activation | edit | block (edit refused) | 確認担当者が1人以上必要です | — |
| E100 | persona not confirmed | submit | block_submit | 話し方の設定を確認してください | STEP 11 |
| E110 | shadow QA hard-fail pattern (e.g., > 30% hard fails) | shadow | block_activation → operator | お試し運用の品質確認で調整が必要になりました。担当者が確認します | operator / config |
| E120 | projected cost > 80% cap | shadow | block_activation | 想定の月額が上限に近いため、投稿数か上限の調整が必要です | STEP 9 / 10 |
| E130 | kill switch / partial publication pending | arm | block_activation | 現在、運用開始の準備中です（担当者対応中） | operator |
| E199 | internal error | any | block (retryable) | 一時的なエラーです。時間をおいて再度お試しください | — |

Operator-only detail for each code (e.g., which adapter failed, which QA rule)
is visible only in `/internal`.

---

## 12. Customer vs operator experience

### 12.1 Visibility

| Item | Customer | Operator |
|---|---|---|
| Onboarding progress / activation blockers | ✓ (plain JA) | ✓ + codes and detail |
| Connected accounts and connection health | ✓ (接続済み / 更新が必要) | ✓ + scopes, expiry, identity check |
| Sample posts (shadow) and review buttons | ✓ | ✓ + QA findings, provenance, cost per sample |
| Approval requests | ✓ | ✓ |
| Schedule (upcoming) | ✓ | ✓ |
| Published content and KPI | ✓ | ✓ |
| Account status (準備中 / お試し運用中 / 確認待ち / 運用中 / 一時停止中) | ✓ | ✓ + lifecycle_state, status, config versions |
| Change history | ✓ (labels only) | ✓ full diff, provenance, facts digest |
| Monthly usage vs cap | ✓ (金額と上限のみ) | ✓ ledger, per-feature, unknown-cost counts |
| Research | ✗ raw corpus, ✗ packets, ✗ internal topic buckets (matches existing commit "hide internal topic classification") | ✓ sanitized |
| Internal agent names, DOT, LAB, audit architecture, prompts, security internals | ✗ | operator `/internal` only, per existing UI boundary |
| Other tenants | ✗ (server-side enforced) | operator, audited |

### 12.2 Customer vocabulary map (enforced in UI copy review)

| Internal | Customer-facing |
|---|---|
| SHADOW | お試し運用（投稿はされません） |
| REVIEW_REQUIRED | 確認待ち |
| ACTIVE / PAUSED | 運用中 / 一時停止中 |
| ApprovalPolicy | 投稿前の確認ルール |
| CostPolicy / budget | 月額の上限 |
| ResearchProfile | 参考にする情報 |
| reference accounts | 雰囲気の参考にしたいアカウント |
| QA pass | 品質チェック済み (aggregate only) |
| VerifiedFact / provenance | 「確認済みの情報」/「確認中」 |
| role (reach/trust/desire/conversion) | not shown |
| account_id, org_id, config version numbers | not shown (opaque selectors as today) |

---

## 13. Multi-account / multi-tenant model

### 13.1 Entities

```
organizations (org_id)                                  existing
  ├── users (user_id, org_id, email)                    existing; MVP: a user belongs to exactly 1 org
  │     ├── user_roles (user_id, org_id, role)          existing: admin | editor | viewer
  │     └── user_account_memberships (user_id, account_id, role)   existing (account-level override)
  ├── org_accounts (org_id, account_id)                 existing; ADD UNIQUE(account_id)
  │     └── production_accounts (account_id, handle, platform*, lifecycle_state*, …)
  │           ├── credentials (account_id, purpose, …)  existing
  │           ├── account_config_versions*              new
  │           ├── account_verified_facts / account_fact_events*
  │           ├── research_candidates* / research_packets*
  │           └── all existing production tables (all carry account_id)
  ├── onboarding_submissions* (submission_id, org_id, account_id NULL until created, created_by, step_state_json, updated_at)
  └── org_budget* (org_id, monthly_cap)  — optional cap across accounts (Customer B)
source_items* (shared or tenant_private with owner_org_id)
(* = new)
```

### 13.2 Authorization (server-side only)

```
effective_role(user, account) =
    membership.role                       if user_account_memberships(user, account) exists
    else user_roles(user, org).role       if org_accounts(org = user.org, account) exists
    else NONE
```

This is the rule already documented in migration 0024 ("organization links
remain the backward-compatible authority").

| Permission | Min role | Notes |
|---|---|---|
| `dashboard:read` | viewer | existing |
| `content:review` (approve/reject) | editor | existing |
| `config:edit` SAFE / REVIEW preference fields | editor | |
| `config:edit_sensitive` (offers, facts, compliance, approval mode, budget, approvers) | admin | |
| `account:onboard`, `account:activate_request`, `account:pause` | admin (pause: editor) | pause is a safe direction |
| `org:users`, `org:billing` | admin (org-level role only, not membership) | |
| operator actions (arm, verify facts, sign-off, suspend) | **not a tenant role**: operator principal via `/internal` (Cloudflare Access allowlist) | service auth gets no implicit cross-tenant exception (existing `resolveTrustedTenantIdentity`) |

Enforcement points:

- The user identity comes only from the trusted identity resolution (Cloudflare
  Access email → Bridge `/autopilot/v2/tenant/resolve-identity`). Browser
  headers and query parameters are never read (existing).
- Account selection uses the existing AES-GCM opaque selector bound to
  user + org. Raw `account_id` / `org_id` in the request is rejected (existing).
- Every new Bridge onboarding/config route resolves `effective_role` itself.
  Every Store method takes `account_id`. Submissions are checked against
  `org_id`.

Examples:

- **Customer A:** org A, 1 admin, 3 accounts (Threads, plus X and Instagram on
  the waitlist). The admin sees 3 cards; 2 show 「準備中の媒体」.
- **Customer B:** org B, 5 Threads accounts and Owned Media (waitlist).
  - The agency-side editor gets `user_account_memberships` on accounts 1–3 only.
  - The org admin sees all 5.
  - An optional `org_budget` caps the total; per-account CostPolicies must sum
    to ≤ the org cap.

---

## 14. Assumptions and open questions for DOT

| # | Item |
|---|---|
| A1 | **ResearchPacket / Research Intelligence v1 / LAB are not present in `IKORABUagent` or any `Threads-` branch** at the inspected refs. This design assumes v1 produces an account-scoped packet consumed by planning, for two accounts (assumed `acct_8ssana`, fortune, and `acct_taku_ai_tech`, AI/affiliate). DOT should confirm the actual v1 contract so §6.7 parity can be defined against it. |
| A2 | `ai_cost_policies` / `ai_usage_events` live on the unmerged `work/ai-unit-economics02a1-production-hardening` branch. CostPolicy depends on it landing. |
| A3 | MVP platform is Threads only. X / Instagram / Owned Media appear as waitlist options. |
| Q1 | Should `owner_confirmed` require the customer *and* an operator for regulated verticals? The proposal is customer-only plus operator sign-off at G11. |
| Q2 | `users.org_id` is single-org. Agencies managing several client orgs need `org_memberships` later. Is this acceptable for MVP? |
| Q3 | Shadow minimum duration of 72 h. Is that acceptable commercially, or should it be 48 h for templates with proven parity? |
| Q4 | Operator sign-off at activation is mandatory in MVP. Which metric would justify removing it per template? |

---

## 15. MVP vs later scope

| Area | MVP | Later |
|---|---|---|
| Onboarding entry | operator creates org + admin (`tenant-onboard`); customer fills the form | self-serve signup, contract and billing |
| Platforms | Threads | X, Instagram, Owned Media (WordPress) |
| Templates | fortune, AI/business (from LAB accounts), generic fallback | career, ecommerce, local business; template upgrade proposals |
| Config | AccountConfig versions, compiler, validator, projection to legacy `config_json` | org-level offer library shared across accounts |
| Facts | generic catalogue + fortune aliases; customer_attested / operator_verified; fact events | evidence file storage, expiry reminders |
| Research | config-driven profile; adapters: manual_intake, own_account_insights, official_announcements (RSS allowlist); tenant-private cache only (or shared only for template queries) | news_search, public_statistics, job/catalog feeds; shared cache at scale; cross-tenant originality guard |
| Lifecycle | full state machine; SHADOW lane; gates G1–G13; operator arm | operator-less activation for proven templates |
| Editing | SAFE + REVIEW + RESHADOW (full); queued-content re-QA | RESHADOW_SCOPED (per-role shadow lanes) |
| Approval | per-account MANUAL / ESCALATE; ramp; approver list; skip-on-timeout | AUTO unlock flow; LINE/Slack approval |
| Cost | monthly cap → per-feature daily caps; block on cap | deterministic no-AI mode per template; org budget |
| Tenancy | existing tables + `UNIQUE(account_id)`; permission table above | agency multi-org users, SSO |
| Customer UI | onboarding form, shadow review, activation request, status, change history | in-app guided edits with live preview |

---

## 16. MVP build order

Each phase is additive and ships dark. It changes no live behaviour until an
explicit operator flag. Each phase ends with a DOT audit.

| # | Phase | Repo | Deliverable | Exit check |
|---|---|---|---|---|
| 0 | **Contracts** | Threads- (docs + data) | field catalogue v1 (YAML), AccountConfig JSON Schema, generic funnel-fact catalogue with fortune aliases, error-code catalogue | DOT schema review |
| 1 | **Parity compile** | Threads- | pure `compile()` + `validate_config` reuse. Express `acct_8ssana` and `acct_taku_ai_tech` as submissions. **compile(submission) == current `config_json`** (persona/planning/funnel) | golden test byte-equal (normalized) |
| 2 | **Versioning tables** | Threads- | migrations: `account_config_versions`, `account_fact_events`, `production_accounts` pointer + `lifecycle_state` + `platform` columns, `config_version` stamps, `org_accounts UNIQUE(account_id)`. Backfill v1 = current config for existing accounts. | migration dry run on a DB copy; readers unchanged |
| 3 | **Per-account policies** | Threads- | ApprovalPolicy (fallback to global `APPROVAL_MODE`), PublishingPolicy read path, CostPolicy (after A2 merges) | existing tests green; no behaviour change for existing accounts |
| 4 | **Research profile** | Threads- | AccountResearchProfile, candidates, packets for MVP adapters; LAB parity vs v1 | §6.7 parity signed off |
| 5 | **Lifecycle + SHADOW** | Threads- | state machine, publisher factory lifecycle guard, shadow lane (no NIGHT entry, no KPI), exit criteria, gate evaluator API | test: shadow account can never construct a live publisher |
| 6 | **Bridge endpoints** | Threads- | customer-safe projections: schema, submission save/submit, issues, activation checklist, shadow samples, review actions, config change proposals; operator: arm, verify fact, sign-off | contract tests (as `threads-bridge-contract` v1) |
| 7 | **Operator console** | IKORABUagent `/internal` | onboarding queue, issue detail, fact verification, shadow review, activation | operator dry run with a synthetic org |
| 8 | **Customer onboarding UI** | IKORABUagent customer surface | STEP 0–11 form, progress, blockers, save/resume | usability run: 10–20 min with one friendly customer |
| 9 | **Customer shadow review + activation request** | IKORABUagent | STEP 12–13 | first real customer in SHADOW → ACTIVE with operator arm |
| 10 | **Post-activation edits** | both | SAFE + REVIEW + RESHADOW flows, change history, queued-content re-QA | edit matrix tests per §9.3 |
| 11 | **Third vertical by config only** | data only | career_recruitment template; onboard a test account with **zero code changes** | git diff touches only template/catalogue data |

Phase 11 is the acceptance test for the core product principle.

---

## 17. What not to build yet

- Self-serve signup, payment, invoicing, plan management.
- Any publishing platform other than Threads.
- A generic workflow / BPMN engine, event sourcing, bitemporal history.
- Template marketplace or customer-authored templates.
- **Automatic extraction of offer facts from the customer's website or LP.**
  This would be guessing business facts. URL reachability checks only.
- LLM-generated personas presented as confirmed. Suggestions may exist only as
  `operator_draft` and must be explicitly confirmed by the customer.
- Cross-account or cross-tenant learning, global ranking models, shared KPI
  pools.
- Shared research analytics across tenants (who-researches-what).
- Customer access to raw research, packets, prompts, or QA internals.
- Per-field ACLs, custom roles, agency multi-org users, SSO/SAML.
- Partial (per-role) shadow lanes. Use full RESHADOW in MVP.
- AUTO approval at onboarding. Operator-less activation.
- Automatic profile/bio editing on the customer's social account.
- Unofficial scraping of any platform (existing rule; restated because
  multi-vertical research will tempt it).
