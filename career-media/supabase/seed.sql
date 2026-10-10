-- このファイルは `npm run db:seed-sql` で content/ から生成されます。手で編集しないでください。
begin;

-- categories
insert into categories (slug, name, description, icon, sort_order) values ('mikeiken', '未経験転職', '未経験から正社員・新しい職種に挑戦するときの、最初の一歩と全体像。', 'compass', 1) on conflict (slug) do update set name = excluded.name, description = excluded.description, icon = excluded.icon, sort_order = excluded.sort_order;
insert into categories (slug, name, description, icon, sort_order) values ('shokushu', '職種を知る', '仕事内容・向き不向き・入社後の働き方など、職種ごとの違いを知る。', 'briefcase', 2) on conflict (slug) do update set name = excluded.name, description = excluded.description, icon = excluded.icon, sort_order = excluded.sort_order;
insert into categories (slug, name, description, icon, sort_order) values ('keiken', '経験の活かし方', 'アルバイト・接客・前職など、これまでの経験を転職で言葉にする。', 'sparkles', 3) on conflict (slug) do update set name = excluded.name, description = excluded.description, icon = excluded.icon, sort_order = excluded.sort_order;
insert into categories (slug, name, description, icon, sort_order) values ('shorui-mensetsu', '面接・書類', '履歴書・職務経歴書・面接で、伝え方に迷ったときに。', 'file-text', 4) on conflict (slug) do update set name = excluded.name, description = excluded.description, icon = excluded.icon, sort_order = excluded.sort_order;
insert into categories (slug, name, description, icon, sort_order) values ('hatarakikata', '年収・働き方', '給与・休日・勤務時間など、条件の見方と比べ方。', 'wallet', 5) on conflict (slug) do update set name = excluded.name, description = excluded.description, icon = excluded.icon, sort_order = excluded.sort_order;
insert into categories (slug, name, description, icon, sort_order) values ('junbi', '転職準備', '面談・応募の前に整理しておくこと、確認しておくこと。', 'list-checks', 6) on conflict (slug) do update set name = excluded.name, description = excluded.description, icon = excluded.icon, sort_order = excluded.sort_order;
insert into categories (slug, name, description, icon, sort_order) values ('seido', '制度・手続き', '失業手当・健康保険・年金・税金など、退職と転職のときに関わる国の制度と手続き。', 'building', 7) on conflict (slug) do update set name = excluded.name, description = excluded.description, icon = excluded.icon, sort_order = excluded.sort_order;
insert into categories (slug, name, description, icon, sort_order) values ('news', '転職ニュース・市場情報', '制度変更や市場の動きを、未経験転職者の目線で読み解く。', 'newspaper', 8) on conflict (slug) do update set name = excluded.name, description = excluded.description, icon = excluded.icon, sort_order = excluded.sort_order;

-- article: 26sai-mikeiken (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('26sai-mikeiken', 'article', '26歳で未経験の職種に転職するのは遅い？', '26歳で未経験の職種に移るのは遅いのか。求人では原則として年齢を制限できず、若い人を職務経験を問わず正社員として募集する例外もあります。「遅いかも」と感じる理由を分けて、職種の選び方と面接での伝え方まで整理します。', '「同い年の友だちは仕事に慣れてきたのに、自分はまだ別の仕事を考えている」「26歳から未経験の職種に行くのは、もう遅いのかな」。そう感じて、動き出せずにいる人もいると思います。

先に結論を言うと、26歳だから遅い、と年齢だけで決まるわけではありません。大事なのは、なぜその仕事を選ぶのかを自分の言葉で話せることと、入社後に育ててもらえる職場かを確かめることです。

## 26歳って、もう遅い？

まず知っておきたいのは、求人の募集や採用では、**原則として年齢を制限できない**ということです。2007年10月から、会社は人を募集・採用するとき、年齢にかかわりなく均等な機会を与えることが義務になっています。

ただし、例外もあります。そのひとつが、長く働いてもらうことを前提に、**若い人を職務経験を問わず正社員として募集する場合**です。「年齢制限あり」と書かれた求人の中には、経験のない人を入社後に育てる前提の募集もあります。上限の年齢は求人ごとに違うので、気になる求人は応募条件の欄を確認してみてください。

```figure
type: compare
title: 求人の年齢制限、原則と例外
columns:
  - label: 原則
    tone: mint
    items:
      - 年齢を制限できない
      - 2007年10月から、年齢にかかわりなく均等な機会を与える
  - label: 例外のひとつ
    tone: sand
    items:
      - 若い人を職務経験を問わず正社員として募集する場合
      - 上限の年齢は求人ごとに違う
```

## 「遅いかも」と感じるのはなぜ？

不安の中身を分けてみると、年齢そのものより、別のことが気になっている場合があります。

| 気になっていること | 確かめたいこと |
| --- | --- |
| 同い年の人と比べてしまう | 自分が数年後にどう働いていたいか |
| 正社員の経験が少ない | アルバイトや派遣で任されていた仕事を書き出せるか |
| やりたい仕事がはっきりしない | 「これは避けたい」という条件なら挙げられるか |
| 一から覚えられるか不安 | 研修の内容や、最初に任される仕事 |

表の右側は、どれも今から準備できることです。「遅い」と感じたときほど、どこが不安なのかを一つずつ分けてみましょう。

## 未経験の職種、どう選ぶ？

候補をしぼるときは、次の3つを手がかりにすると考えやすくなります。

1. **今までの経験とつながるか**: たとえば接客で身についた「お客さまの話を聞く力」は、カスタマーサポートや営業でも使います
2. **働き方の希望に合うか**: 土日休み、夜勤なし、転勤なしなど、ゆずれない条件
3. **入社後に育ててもらえるか**: 研修の期間、最初に任される仕事、質問できる先輩がいるか

職種ごとの仕事内容は[職種比較](/jobs)で、研修の確かめ方は[未経験求人の「研修あり」で確認すべきこと](/articles/mikeiken-kenshu-kakunin)で紹介しています。

## 面接で「なぜ今？」と聞かれたら

職種を変える転職では、面接で「なぜ今、この仕事なのか」を聞かれることがあります。年齢を気にして謝るように話す必要はありません。**きっかけ → 今までの経験 → これからやりたいこと**の順で話すと伝わりやすくなります。

```figure
type: steps
title: 「なぜ今？」はこの順で話す
items:
  - label: きっかけ
    text: その仕事に興味を持った理由
  - label: 今までの経験
    text: これまでの仕事で身についたこと
  - label: これからやりたいこと
    text: 入社後に取り組みたいこと
```

> 話し方の例：販売の仕事を4年続ける中で、お客さまの困りごとを聞いて解決する場面にやりがいを感じてきました。その経験を、電話やメールで一人ひとりの問題を解決するカスタマーサポートの仕事で活かしたいと考え、応募しました。入社後は研修で商品の知識を身につけ、まずは一人で対応できる内容を増やしていきたいです。

志望動機の組み立て方は[未経験職種の志望動機、何を書けばいい？](/articles/shiboudouki-mikeiken)も参考にしてください。

## 今週からできること

いきなり応募しなくても、準備は少しずつ進められます。

- 今までの仕事で任されていたことを5つ書き出す
- 気になる職種を2〜3個にしぼって、仕事内容を調べる
- ゆずれない条件（休み・給料・勤務地など）を3つまでに決める
- 「なぜその仕事を選ぶのか」を3文で書いてみる

何から始めるか迷ったら、[未経験転職は何から始める？](/articles/mikeiken-tenshoku-hajimekata)で全体の流れを確認できます。焦って決めるより、準備を一つずつ進めるほうが、自分に合う仕事を選びやすくなります。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['mikeiken-tenshoku-hajimekata', 'shiboudouki-mikeiken', 'mikeiken-kenshu-kakunin']::text[], '{}'::text[], array['mikeiken-shokushu', 'yaritai']::text[], array['seishain-keiken-sukunai', 'hajimete']::text[], array['26歳。', '今から別の職種って遅い？']::text[], null, true, '[{"q":"26歳で未経験の職種に応募すると、年齢だけで落とされませんか？","a":"求人の募集・採用では、原則として年齢を制限できないことになっています。選考で自分から伝えられるのは、これまでの仕事で任されていたこと、その仕事を選んだ理由、入社後に学ぶ姿勢などです。どこを重く見るかは求人ごとに違うので、準備できることから整えておきましょう。"},{"q":"求人票に「○歳以下」と書かれているのはなぜですか？","a":"年齢制限が例外として認められる場合があるためです。そのひとつが、長く働いてもらうことを前提に、若い人を職務経験を問わず正社員として募集するケースです。上限の年齢は求人ごとに違うので、応募条件の欄を確認してください。"},{"q":"正社員の経験が少なくても、未経験の職種に応募できますか？","a":"正社員の経験が少ないことだけで決まるわけではありません。アルバイトや派遣での経験も、担当した仕事や工夫したことを具体的に書けば、伝える材料になります。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「26歳は遅いか」を年齢の問題として答えず、法律上は年齢で一律に区切れないことを示したうえで、不安の中身を分けて準備に落とし込む","quotes":[{"source_url":"https://www.mhlw.go.jp/qa/koyou/kinshi/qa.html","text":"雇用対策法の改正により2007年10月から、事業主は労働者の募集・採用について年齢にかかわりなく均等な機会を与えなければならず、年齢制限の禁止が義務化された。合理的な理由がある場合は例外的に年齢制限が認められ、その場合を省令で定めている","used_in":"26歳って、もう遅い？"},{"source_url":"https://jsite.mhlw.go.jp/niigata-hellowork/jigyounushi/jigyounushi/nenrei.html","text":"例外事由3号のイは、長期勤続によるキャリア形成を図る観点から、若年者等を期間の定めのない労働契約の対象として募集・採用する場合で、職務経験は問えない","used_in":"26歳って、もう遅い？"}],"not_used":["年齢別の転職者数や未経験転職の成功率などの統計は使っていない","面接の話し方の例は仮の経歴をもとにした例文","年齢制限禁止のパンフレット（index03_0001.pdf）は正式な題名を確認できなかったため出典から外した"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = '26sai-mikeiken' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '労働者の募集・採用における年齢制限禁止に関するQ&A', '厚生労働省', 'https://www.mhlw.go.jp/qa/koyou/kinshi/qa.html', '2026-10-06'::date, '募集・採用での年齢制限は原則禁止で、2007年10月から義務化されたこと。例外として年齢制限が認められる場合があること', 0 from articles where slug = '26sai-mikeiken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '募集・採用における年齢制限禁止について', 'ハローワーク新潟（新潟労働局）', 'https://jsite.mhlw.go.jp/niigata-hellowork/jigyounushi/jigyounushi/nenrei.html', '2026-10-06'::date, '例外事由（3号のイ）として、長期勤続によるキャリア形成のため若年者等を職務経験不問・期間の定めのない雇用で募集する場合', 1 from articles where slug = '26sai-mikeiken';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = '26sai-mikeiken' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"063a36f39cec2230f5d1f09297ddfdfc57443cd57905f6692c3e56082f739d23","findings":[]}'::jsonb from articles where slug = '26sai-mikeiken';
update articles set status = 'published' where slug = '26sai-mikeiken';

-- article: agent-mendan-mae (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('agent-mendan-mae', 'article', 'エージェント面談の前に決めておくこと・決めなくていいこと', '人材紹介会社のキャリアアドバイザーとの面談は、すべてを決めてから臨む必要はありません。事前に決めておくと面談が進めやすくなること、面談で一緒に考えればいいこと、面談で聞いておきたいことを整理しました。', '転職エージェント（人材紹介会社）のキャリアアドバイザーとの面談を前に、「何を話せばいいのか」「志望動機を固めてから行くべきか」と悩む人は多いものです。

結論から言うと、面談の前にすべてを決めておく必要はありません。むしろ、**決めておいたほうがいいこと**と**面談で一緒に考えればいいこと**を分けておくと、面談の時間を有効に使えます。

```figure
type: compare
title: 面談の前に「決めること」「決めなくていいこと」
columns:
  - label: 決めておくこと
    tone: mint
    items:
      - 転職したい時期の目安
      - ゆずれない条件を1〜2個
      - 経歴の事実
      - 話しにくいことの扱い
  - label: 決めなくていいこと
    tone: sky
    items:
      - 志望する職種を1つに絞ること
      - 完璧な志望動機や自己PR
      - 応募するかどうか
```

## 人材紹介会社の面談でできること

まず、面談で何ができるのかを確認しておきましょう。人材紹介会社のキャリアアドバイザーは、一般的に次のようなサポートを担当します。

- これまでの経験と希望条件の整理
- 希望や経験に合いそうな求人の紹介
- 応募書類の書き方や面接の準備のアドバイス
- 面接日程の調整や、条件面の確認・調整

求職者が支払う費用については、職業安定法にもとづく有料職業紹介事業では、原則として求職者から手数料を受け取ることはできず、採用した企業が紹介手数料を支払うしくみになっています。

## 面談の前に決めておくこと

### 1. 転職したい時期の目安

「3か月以内に働き始めたい」「年内に決まればいい」など、大まかな時期を決めておきましょう。時期によって、紹介される求人や応募の進め方が変わります。

### 2. ゆずれない条件を1〜2個

勤務地、休日、年収など、「これが満たされないなら応募しない」という条件を1〜2個に絞っておきます。多すぎると求人の幅が狭まるので、それ以外は「できれば」の条件として伝えれば十分です。

### 3. 経歴の事実

これまでの職歴の期間、雇用形態、担当していた仕事は、正確に答えられるよう確認しておきましょう。日付があいまいな場合は、給与明細や雇用保険の記録などで確かめておくと安心です。

### 4. 話しにくいことの扱い

短期離職や空白期間など、話しにくいことがあれば、どこまで話すかを考えておきましょう。ただし、キャリアアドバイザーは事情を踏まえて求人や伝え方を考えるので、正確に伝えたほうが結果的に自分に合ったサポートを受けやすくなります。経歴の整理のしかたは[転職回数が気になるときに整理したいこと](/articles/tenshoku-kaisu-kininaru)も参考にしてください。

## 面談の前に決めなくていいこと

### 志望する職種を1つに絞ること

未経験からの転職では、どの職種が合うかは調べたり話したりする中で見えてくることが多いものです。「営業とカスタマーサポートで迷っている」という状態のままで構いません。

### 完璧な志望動機や自己PR

志望動機は、応募する求人が決まってから考えるものです。面談の段階では、「なぜ転職したいか」「何を大事にしたいか」を自分の言葉で話せれば十分です。

### 応募するかどうか

紹介された求人に応募するかどうかは、面談のあとで決めて大丈夫です。気になる点があれば、その場で質問しましょう。

## 面談で聞いておきたいこと

面談は、キャリアアドバイザーから質問される場であると同時に、自分から質問できる場でもあります。

- 自分の経験や希望だと、どんな職種や求人が考えられるか
- 未経験で入社した人が多い職場の特徴は何か
- 求人票だけでは分からない、職場の雰囲気や働き方
- 研修の内容や、入社後のフォローの体制（[研修の確認ポイント](/articles/mikeiken-kenshu-kakunin)）
- 年収や休日などの条件の、ほかの求人との比べ方（[比べ方の例](/articles/donichi-yasumi-nenshu-hikaku)）

```figure
type: checklist
title: 面談で聞いておきたいこと
items:
  - 自分の経験や希望で考えられる職種や求人
  - 未経験で入社した人が多い職場の特徴
  - 求人票だけでは分からない職場の雰囲気や働き方
  - 研修の内容と、入社後のフォローの体制
  - 年収や休日などの条件の、ほかの求人との比べ方
```

## 相談先が許可を受けた事業者か確認するには

人材紹介を行う事業者は、厚生労働大臣の許可を受けて事業を行っています。許可番号は「13-ユ-000000」のような形式で、事業者のサイトなどに記載されています。

厚生労働省の「人材サービス総合サイト」では、許可番号や事業者名から職業紹介事業者を検索できます。初めて利用する相談先なら、一度確認しておくと安心です。

面談の前に、自分の希望や経験をざっくり整理しておきたい場合は、[条件整理チェック](/check)を使ってみてください。整理した結果は、そのまま面談で話す材料になります。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['mikeiken-tenshoku-hajimekata', 'donichi-yasumi-nenshu-hikaku', 'mikeiken-kenshu-kakunin', 'tenshoku-agent-merit', 'mensetsu-renshu-pro']::text[], '{}'::text[], array['yaritai']::text[], array['hajimete']::text[], array['エージェント面談の前、', '何を決めておく？']::text[], null, true, '[{"q":"人材紹介会社に相談すると、お金はかかりますか？","a":"職業安定法にもとづく有料職業紹介事業では、原則として求職者から手数料を受け取ることはできず、紹介手数料は採用した企業が支払うしくみです。一部の職業では例外もあるため、気になる場合は相談先に確認しましょう。"},{"q":"面談を受けたら、必ず応募しないといけませんか？","a":"面談を受けることと応募することは別です。紹介された求人に応募するかどうかは自分で決められます。合わないと感じた求人は、理由を添えて断って構いません。"},{"q":"相談先が許可を受けた事業者かどうかは、どうやって確かめられますか？","a":"厚生労働省の「人材サービス総合サイト」で、職業紹介事業の許可番号や事業者名から検索できます。"}]'::jsonb, null, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'agent-mendan-mae' and c.slug = 'junbi' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'agent-mendan-mae' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業安定法', 'e-Gov法令検索（デジタル庁）', 'https://laws.e-gov.go.jp/law/322AC0000000141', '2026-10-06'::date, '有料職業紹介事業の手数料に関する規定', 0 from articles where slug = 'agent-mendan-mae';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '人材サービス総合サイト（職業紹介事業所検索）', '厚生労働省', 'https://jinzai.hellowork.mhlw.go.jp/JinzaiWeb/GICB101010.do?action=transition&screenId=GICB101010&params=1', '2026-10-06'::date, '職業紹介事業者の許可番号の確認方法', 1 from articles where slug = 'agent-mendan-mae';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'agent-mendan-mae' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"70413fd5cd5b39e9fb378d830fe7b08182a39477f5d574bdbf37ac716a973836","findings":[]}'::jsonb from articles where slug = 'agent-mendan-mae';
update articles set status = 'published' where slug = 'agent-mendan-mae';

-- article: agent-soudan-nani (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('agent-soudan-nani', 'article', '転職エージェントに、何を相談すればいい？相談できることと伝え方の例', '転職エージェント（人材紹介会社）には、求人の紹介だけでなく、やりたい仕事の整理や書類・面接の準備、聞きにくい条件の確認も相談できます。場面ごとに相談できることを整理し、そのまま使える相談の言い方の例を紹介します。', '「転職エージェントに登録したけど、何を相談すればいいか分からない」「こんなことを聞いていいのかな」。初めての転職だと、相談すること自体にためらいがあるかもしれません。

転職エージェント（人材紹介会社）のキャリアアドバイザーには、求人を紹介してもらうだけでなく、**迷っていることをそのまま**相談できます。面談の前に何を決めておくかは[エージェント面談の前に決めておくこと・決めなくていいこと](/articles/agent-mendan-mae)にまとめているので、この記事では、相談できることと、そのまま使える言い方の例を紹介します。

## 相談できるのは、求人の紹介だけじゃない

一般的には、次のような場面で相談できます。サポートの範囲は会社によって違うので、最初に「どこまで手伝ってもらえますか？」と聞いておくと安心です。

| 場面 | 相談できることの例 |
| --- | --- |
| 希望の整理 | どんな職種が合いそうか、条件の優先順位のつけ方 |
| 求人選び | 経験や希望に合いそうな求人の紹介、求人票の読み方 |
| 書類 | 履歴書・職務経歴書の書き方、志望動機の見直し |
| 面接 | 聞かれやすい質問、話す内容の練習 |
| 条件・日程 | 面接日程の調整、給与や入社日などの確認 |

## 「やりたいことが分からない」も相談していい

やりたい仕事がはっきりしていなくても大丈夫です。そのときは、**これまでやってきたこと**と、**今の働き方で変えたいこと**を伝えると、話が進みやすくなります。

```figure
type: compare
title: 伝えると話が進みやすいこと
columns:
  - label: これまでやってきたこと
    tone: sand
    items:
      - 今までの仕事や任されていたこと
      - 例：飲食店で4年ほど接客
  - label: 今の働き方で変えたいこと
    tone: mint
    items:
      - 休み・給料・仕事内容など
      - 例：土日に休める仕事に変えたい
```

> 飲食店で4年ほど接客をしてきました。土日に休める仕事に変えたいのですが、事務と営業のどちらが合うのか分かりません。私の経験だと、どんな仕事が考えられますか？

> 正社員で働いたことがなく、何から始めればいいか分かりません。アルバイトでは販売を3年していました。応募できそうな仕事の種類から教えてもらえますか？

ひとりで考えるときの手がかりは[やりたい仕事が分からない。自分に合う仕事の探し方3ステップ](/articles/shigoto-sagashikata)でも紹介しています。

## 書類・面接は「具体的に」お願いする

書類や面接の相談は、何をしてほしいかを具体的に伝えると、返ってくるアドバイスも具体的になります。

- 「職務経歴書を書いてみたので、アルバイトの経験が伝わる書き方になっているか見てもらえますか？」
- 「この会社の面接で、聞かれやすいことがあれば教えてください」
- 「志望動機を1分で話す練習に付き合ってもらえますか？」

## 聞きにくい条件ほど、先に聞く

給料や休み、残業のことは、面接では聞きにくいと感じる人も多いはずです。こうした条件は、応募の前にアドバイザーに聞いてみましょう。

- 「年間休日と、月の残業時間の目安は分かりますか？」
- 「この求人の月給には、固定残業代が含まれていますか？」
- 「未経験で入った人は、入社後にどんな研修を受けていますか？」

```figure
type: checklist
title: 応募の前にアドバイザーに聞く条件
items:
  - 年間休日と、月の残業時間の目安
  - 月給に固定残業代が含まれているか
  - 未経験で入った人が入社後に受けている研修
```

なお、2024年4月から、求人の募集や職業紹介のときに明示される労働条件に「業務の変更の範囲」「就業場所の変更の範囲」などが加わっています。くわしくは[求人で明示される労働条件が増えた（2024年4月）](/news/news-roudou-jouken-meiji)を確認してください。

## 合わないと思ったら、理由を添えて伝える

紹介された求人に応募するかどうかは、自分で決められます。合わないと感じたときは、理由を一言添えて断ると、次に紹介される求人が希望に近づきやすくなります。

> この求人は通勤に1時間半かかるので、今回は見送らせてください。片道1時間以内だとありがたいです。

担当者と話しにくいと感じたときは、担当を変えてもらえるかを問い合わせてみるのもひとつの方法です。

## 登録・相談の前に、ここだけ確認

相談を始める前に、次の3つを見ておくと安心です。

| 確認すること | どこで・どう見る？ |
| --- | --- |
| 許可を受けた事業者か | 厚生労働省の「人材サービス総合サイト」で検索する |
| 手数料や就職実績の情報 | 同じサイトの事業者の情報で見る |
| 利用規約 | 違約金の有無、個人情報を誰に・いつまで提供するか |

有料で職業紹介を行う事業者は、厚生労働大臣の許可を受ける必要があります。また、有料職業紹介事業者は原則として求職者から手数料を受け取ってはいけないとされています（芸能家やモデルなど、一部の職業には例外があります）。

利用規約の確認は、厚生労働省の求職者向けリーフレットでもすすめられています。分からない言葉があれば、登録前にそのまま質問して大丈夫です。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['agent-mendan-mae', 'shigoto-sagashikata', 'mensetsu-junbi-mikeiken', 'tenshoku-agent-merit', 'kigyou-erabi-soudan']::text[], '{}'::text[], array['yaritai', 'seishain']::text[], array['hajimete', 'freeter']::text[], array['エージェントに', '何を相談する？']::text[], null, false, '[{"q":"やりたい仕事が決まっていなくても、相談していいですか？","a":"大丈夫です。これまでの経験と、今の働き方で変えたいことを伝えると、考えられる職種や求人を一緒に整理しやすくなります。"},{"q":"紹介された求人を断るときは、どう伝えればいいですか？","a":"「通勤に1時間半かかるので見送ります。片道1時間以内だとありがたいです」のように、断る理由と、次に希望する条件をセットで伝えると、次に紹介される求人が希望に近づきやすくなります。"},{"q":"登録する前に、確認しておくことはありますか？","a":"厚生労働省のリーフレットでは、登録するときに利用規約をよく読み、違約金の有無や、自分の個人情報が誰に・いつまで提供されるかを確認するよう案内されています。許可を受けた事業者かどうかは、厚生労働省の「人材サービス総合サイト」で調べられます。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"既存の agent-mendan-mae（面談前に決めること）と重ならないよう、面談の場で「何を・どう頼むか」に絞り、場面ごとの相談内容と、そのまま使える相談の言い方の例を中心にする。実在の事業者名は出さない","quotes":[{"source_url":"https://jsite.mhlw.go.jp/ishikawa-roudoukyoku/hourei_seido_tetsuzuki/roudousha_haken/syoukai_gaiyou.html","text":"有料職業紹介事業は手数料または報酬を受けて行う職業紹介事業で、厚生労働大臣の許可が必要。求職者からの手数料徴収は原則禁止で、芸能家・モデル、年収700万円超の経営管理者・科学技術者・熟練技能者などに例外がある","used_in":"登録・相談の前に、ここだけ確認"},{"source_url":"https://www.mhlw.go.jp/content/000851397.pdf","text":"求職者向けリーフレット。人材サービス総合サイト（厚生労働省運営）で、許可を受けた職業紹介事業者かどうか、手数料や就職実績などの情報を確認できると案内。求職登録時には利用規約をよく確認し、特に違約金や自分の個人情報の取り扱い（誰に提供されるか、いつまで提供されるかなど）を確認する","used_in":"登録・相談の前に、ここだけ確認／FAQ"},{"source_url":"https://jinzai.hellowork.mhlw.go.jp/JinzaiWeb","text":"労働者派遣事業・職業紹介事業の許可・届出事業所を検索できる厚生労働省のサイト","used_in":"登録・相談の前に、ここだけ確認"},{"source_url":"https://www.mhlw.go.jp/content/001114167.pdf","text":"2024年4月から、募集広告や職業紹介を受ける際に明示される労働条件に、従事すべき業務の変更の範囲、就業場所の変更の範囲、有期労働契約を更新する場合の基準が追加","used_in":"聞きにくい条件ほど、先に聞く"}],"not_used":["転職エージェントの利用者数や、利用した場合の内定率などの統計は使っていない","サポートの範囲は事業者によって違うため、一般的な例として書き、最初に確認するようすすめた"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'agent-soudan-nani' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業紹介事業とは', '石川労働局', 'https://jsite.mhlw.go.jp/ishikawa-roudoukyoku/hourei_seido_tetsuzuki/roudousha_haken/syoukai_gaiyou.html', '2026-10-06'::date, '有料職業紹介事業には厚生労働大臣の許可が必要なこと、求職者からの手数料の徴収は原則禁止で、芸能家・モデルなど一部の職業に例外があること', 0 from articles where slug = 'agent-soudan-nani';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業紹介事業者を利用するときに知っておきたいこと（求職者の皆さまへ）', '厚生労働省・都道府県労働局', 'https://www.mhlw.go.jp/content/000851397.pdf', '2026-10-06'::date, '人材サービス総合サイトで許可を受けた職業紹介事業者かどうかや、手数料・就職実績などの情報を確認できること、登録時に利用規約で違約金や個人情報の取り扱いを確認すること', 1 from articles where slug = 'agent-soudan-nani';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '人材サービス総合サイト', '厚生労働省', 'https://jinzai.hellowork.mhlw.go.jp/JinzaiWeb', '2026-10-06'::date, '許可を受けた職業紹介事業者を検索できるサイトであること', 2 from articles where slug = 'agent-soudan-nani';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '企業から受ける労働条件明示のルールが変わります！（求職者向けリーフレット）', '厚生労働省', 'https://www.mhlw.go.jp/content/001114167.pdf', '2026-10-06'::date, '2024年4月から、募集広告や職業紹介の際に明示される労働条件に、業務・就業場所の変更の範囲などが追加されたこと', 3 from articles where slug = 'agent-soudan-nani';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'agent-soudan-nani' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"18d62a062882409bb02cf13967f6754eeeb7ca54b352f2be45b5134aa0cfcb19","findings":[]}'::jsonb from articles where slug = 'agent-soudan-nani';
update articles set status = 'published' where slug = 'agent-soudan-nani';

-- article: ai-shigoto-mikeiken (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('ai-shigoto-mikeiken', 'article', 'AIで変わる仕事を、未経験転職者はどう見るべきか', '「AIに仕事を奪われる」という話を聞くと、これから選ぶ職種に不安を感じるかもしれません。職種名ではなく仕事の中の作業（タスク）に分けて考えると、変わりやすい部分と変わりにくい部分が見えてきます。職種選びと面接での確認のしかたを整理します。', 'ニュースやSNSで「AIに仕事を奪われる」という言葉を目にすると、これから選ぶ職種が数年後もあるのか、不安になるかもしれません。

ただ、こうした話は職種の名前だけで語られることが多く、実際に仕事選びに使うには大ざっぱすぎます。未経験から転職先を選ぶときは、**仕事を作業（タスク）に分けて考える**と、冷静に判断しやすくなります。

```figure
type: steps
title: AIの影響は「作業」に分けて考える
items:
  - label: 作業に分ける
    text: 例：データ入力、書類のチェック、電話の取り次ぎ
  - label: 変わりやすさを見る
    text: 決まった手順の作業か、人の判断が要る作業か
  - label: 担当する作業を確かめる
    text: その会社で、どの作業を担当するのか
```

## 職種ではなく「作業」で考える

どんな仕事も、いくつもの作業の組み合わせでできています。たとえば事務の仕事なら、データの入力、書類のチェック、電話の取り次ぎ、来客対応、社内からの相談への対応などです。

AIなどの道具で変わりやすいのは、こうした作業のうち、次のような特徴を持つものです。

- 決まった手順やルールで繰り返す作業
- 文章や資料の下書き、要約、翻訳
- 大量の情報から必要なものを探す作業

一方で、次のような作業は人が担う部分が残りやすいと考えられます。

- 相手の状況や気持ちをくみ取って対応を決める
- 社内外の人と調整し、合意をつくる
- 対面でのやりとりや、現場での判断
- 最終的な判断と、その結果への責任

```figure
type: compare
title: 変わりやすい作業・人が担う部分が残りやすい作業
columns:
  - label: 道具で変わりやすい
    tone: sky
    items:
      - 決まった手順やルールで繰り返す作業
      - 文章や資料の下書き、要約、翻訳
      - 大量の情報から必要なものを探す作業
  - label: 人が担う部分が残りやすい
    tone: mint
    items:
      - 相手の状況や気持ちをくみ取って対応を決める
      - 社内外の人と調整し、合意をつくる
      - 対面でのやりとりや、現場での判断
      - 最終的な判断と、その結果への責任
```

厚生労働省の職業情報提供サイト（job tag）では、職業ごとの仕事内容が作業やスキルの単位で紹介されています。気になる職種の作業を一度並べてみると、どの部分が道具に置き換わりそうか、自分で考える材料になります。

## 職種ごとに見ると、どう変わりそうか

代表的な職種で、変わりやすい作業と人に残りやすい作業を整理してみます。これは将来を予測するものではなく、考え方の例です。

| 職種 | 道具で効率化されやすい作業 | 人が担う部分が残りやすい作業 |
| --- | --- | --- |
| 営業 | 提案資料のたたき台づくり、商談記録の要約 | 相手の課題を聞き出す、関係づくり、条件の調整 |
| カスタマーサポート | よくある質問への一次回答、対応履歴の整理 | 複雑な問い合わせ、感情的になっている相手への対応 |
| ITサポート | 手順書の検索、定型の設定作業 | 原因が分からないトラブルの切り分け、利用者への説明 |
| 事務 | データ入力、書類の定型チェック | 例外への対応、社内の調整、来客・電話対応 |

どの職種にも、効率化されやすい作業と人が担う作業の両方があります。大事なのは、職種名で一喜一憂するより、**その会社でどの作業を担当するのか**を確認することです。

## 未経験転職者が今からできること

### AIツールを「使う側」の経験を持っておく

文章の下書きや調べもので、実際にAIツールを使ってみましょう。便利な点だけでなく、間違った情報を出すことがある、という注意点も体験として知っておくと、仕事で使うときの判断に役立ちます。

### 人と関わる経験を言葉にしておく

接客や調整、後輩への説明といった経験は、道具では置き換えにくい部分につながります。経験の言葉にしかたは[接客経験は転職でどう活かせる？](/articles/sekkyaku-keiken-ikasu)で紹介しています。

### 学び直しの制度も知っておく

スキルを身につけるための講座については、雇用保険の教育訓練給付制度など、公的な支援のしくみもあります。制度の変更点は[教育訓練給付の拡充についての解説](/news/news-kyouiku-kunren-kyufu)にまとめています。

## 面接や面談で確認したいこと

AIによる変化が気になるなら、応募先に次のような質問をしてみるのもひとつの方法です。

- 業務の中で、どんなツールやシステムを使っていますか
- ここ数年で、仕事の進め方が変わったことはありますか
- 新しいツールの使い方は、どのように覚えていくことが多いですか

こうした質問への答えから、会社が変化にどう向き合っているかが見えてきます。

AIの影響は、職種によっても会社によっても違います。漠然とした不安で選択肢を狭めるより、作業に分けて考え、確認すべきことを確認する。それが、変化の大きい時代に仕事を選ぶうえでの現実的な向き合い方です。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['eigyo-cs-it-support-chigai', 'mikeiken-tenshoku-hajimekata', 'news-kyouiku-kunren-kyufu']::text[], array['sonota']::text[], array['mikeiken-shokushu', 'yaritai']::text[], '{}'::text[], array['AIで変わる仕事、', '今から選んで大丈夫？']::text[], null, false, '[{"q":"AIが普及すると、未経験で入れる仕事はなくなりますか？","a":"仕事の中の一部の作業はAIなどの道具に置き換わっていく可能性がありますが、職種そのものがすぐになくなるとは限りません。どの作業が変わりやすく、どの作業が人に残りやすいかを分けて考えることが大切です。"},{"q":"転職前にAIツールを勉強しておいたほうがいいですか？","a":"専門的な勉強は必須ではありませんが、文章の下書きや調べものにAIツールを使ってみる経験は、どの職種でも役に立ちやすいです。使ってみて気づいた便利な点や注意点は、面接で話せる材料にもなります。"}]'::jsonb, null, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'ai-shigoto-mikeiken' and c.slug = 'shokushu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'ai-shigoto-mikeiken' and c.slug = 'news' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '情報通信白書', '総務省', 'https://www.soumu.go.jp/johotsusintokei/whitepaper/', '2026-10-06'::date, 'AIなどデジタル技術の利用状況に関する公的な情報源の紹介', 0 from articles where slug = 'ai-shigoto-mikeiken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業情報提供サイト（job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/', '2026-10-06'::date, '職業を作業（タスク）やスキルの単位で調べる方法', 1 from articles where slug = 'ai-shigoto-mikeiken';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'ai-shigoto-mikeiken' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"a8238a65f4b2c2b65c1acc408ed695771bb8c8ff9e5adbb2bd209fafc2dd2e61","findings":[]}'::jsonb from articles where slug = 'ai-shigoto-mikeiken';
update articles set status = 'published' where slug = 'ai-shigoto-mikeiken';

-- article: butsuryu-soko-shigoto (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('butsuryu-soko-shigoto', 'article', '物流・倉庫の仕事内容は？ピッキング・検品・在庫管理・フォークリフトの違いと未経験からの始め方', '物流倉庫の仕事は、荷物を受け入れる・保管する・集める・確かめる・送り出す、の流れで分かれています。ピッキング・検品・在庫管理・フォークリフトの仕事の違い、フォークリフトに必要な資格、未経験から働くときに求人で確認することを紹介します。', '「人と話すより、黙々と手を動かす仕事がしたい」「未経験でも始めやすい仕事を探している」。そんなときに候補に入りやすいのが、物流倉庫の仕事です。

先に結論を言うと、倉庫の仕事は**荷物を受け入れる → しまう → 集める → 確かめる → 送り出す**という流れの中で、担当が分かれています。ピッキングや検品は資格がなくても始められる仕事が多い一方、**フォークリフトの運転には資格が必要**です。

この記事で分かること：

- 倉庫の仕事の**流れ**と、それぞれの担当の違い
- ピッキング・検品・在庫管理・フォークリフトの**仕事内容**
- フォークリフトに必要な**資格**（技能講習・特別教育）
- 未経験から応募する前に**確認すること**

## 物流・倉庫の仕事はどんな流れ？

厚生労働省の職業情報提供サイト（job tag）では、倉庫作業員を、倉庫で貨物や荷物の搬入・搬出、積み卸し、開梱（こん）や詰め替えなどをする仕事として紹介しています。倉庫の中の仕事は、おおまかに次の順番で進みます。

```figure
type: steps
title: 倉庫の中の仕事の流れ
items:
  - label: 入庫（荷受け）
    text: トラックで届いた荷物を受け取り、数や中身を確かめる
  - label: 保管
    text: 決められた棚や場所にしまい、記録する
  - label: ピッキング
    text: 注文の伝票どおりに、商品を棚から集める
  - label: 検品・梱包
    text: 集めた商品の品名・数を確かめ、箱に詰める
  - label: 出荷
    text: 配送先ごとに仕分け、決まった時刻に送り出す
```

job tag では、出庫のときは配送先ごとに仕分けし、指定された時刻に合わせて出庫すると説明されています。倉庫の仕事は「時間までに、正しいものを、正しい数だけ」送り出すことが中心です。

## それぞれの仕事の内容

### ピッキング

注文の伝票やリストを見て、棚から商品を集める仕事です。job tag では、伝票の数量どおりに発送先ごとの商品を集めること、集め方には**発送先ごとに集める方式**と、**まとめて集めてから後で振り分ける方式**があることが紹介されています。

倉庫では、ハンディターミナル（バーコードを読み取る小さな端末）で商品を確認する仕組みが広まっていると、job tag で説明されています。端末の画面に出る「どの棚の、どの商品を、いくつ」という指示に沿って動く形が多くなります。

### 検品

届いた商品や、出荷する商品が**正しいか**を確かめる仕事です。品名・数・傷や汚れがないか、食品なら賞味期限などを見ます。job tag のピッキング作業員の説明でも、入庫時にバーコードで商品を確認して受け入れ、賞味期限の長さなどで仕分けて棚にしまう流れが紹介されています。

ミスが少ないこと、確認の手順を飛ばさないことが大切にされる仕事です。

### 在庫管理

倉庫に**何が、どこに、いくつあるか**を正しく保つ仕事です。job tag では、倉庫作業員の管理する事柄として、荷物の保管場所の管理、在庫管理、商品の日付の管理、入庫した順番の管理などが挙げられています。また、端末の指示データに沿って荷物を出し入れし、記録をつけることも説明されています。

現場で棚卸し（在庫の数を数えて記録と合わせる作業）を担当したり、パソコンで入出庫のデータを扱ったりと、職場によって事務の要素が加わることもあります。

### フォークリフト

フォークリフトで重い荷物を運んだり、積み下ろしたりする仕事です。job tag では、入庫のときにトラックで運ばれた荷物を保管場所へ運び、出荷のときは荷物をトラックの後ろまで運ぶ仕事として紹介されています。1日は、出勤後の**始業前点検**と、指示書で当日の荷下ろしや出荷の内容を確認するところから始まります。

## フォークリフトは資格が必要

ピッキングや検品と違い、フォークリフトの運転は**資格が必要な仕事**です。厚生労働省の資料では、次のように分けられています。

| フォークリフトの大きさ | 必要なもの |
| --- | --- |
| 最大荷重1トン以上 | フォークリフト運転技能講習の修了 |
| 最大荷重1トン未満 | 特別教育の修了（技能講習の修了でもよい） |

注意したいのは、次の2点です。

- **自動車の運転免許とは別のもの**です。普通自動車免許を持っていても、技能講習などを修了していなければ倉庫でフォークリフトを運転できません
- 反対に、技能講習などを修了しただけでは**公道を走ることはできません**

技能講習の時間数は、持っている運転免許や経験によってコースが分かれています。日程や申し込みは、講習を行う登録教習機関に問い合わせます。入社後に会社の費用で取らせてくれる職場もあるので、先に取るかどうかは求人を見てから考えても遅くありません。資格を取る前に考えたいことは、[未経験の転職に資格は必要？](/articles/mikeiken-shikaku)にまとめています。

## 未経験から始めるとき、向いている人・合わないと感じやすい場面

### 向いている人

- 決められた手順を、ていねいに繰り返せる
- 数字や品番を見比べるのが苦にならない
- 体を動かす仕事が好き

### 合わないと感じやすい場面

- 立ち仕事・歩き回る時間が長い職場がある
- 重い荷物を扱うかどうかは、扱う商品によって大きく違う
- 出荷の締め切り時刻の前は、急いで作業する時間帯がある
- 冷蔵・冷凍の倉庫など、温度の管理された場所で働くこともある

接客や販売の経験がある人は、**商品を正しく扱うこと**や**レジや品出しで数を確かめてきたこと**が、検品や在庫管理と重なります。面接では、たとえば次のように伝えられます。

> 「コンビニで品出しと発注を担当していました。賞味期限の古いものを前に出す、発注した数と届いた数を確かめる、といった作業を毎日していました。倉庫の仕事でも、数と期限の確認を丁寧に続けたいと考えています。」（仮の例です）

## 応募前に、求人で確認すること

同じ「倉庫内作業」でも、扱う商品や時間帯、雇用の形で働き方はかなり変わります。求人を見るときは、次の項目を確認しましょう。

```figure
type: checklist
title: 倉庫の求人で確認すること
items:
  - 担当する仕事（ピッキング・検品・在庫管理・フォークリフト）
  - 扱う商品（食品・日用品・衣類・部品など）と重さ
  - 勤務時間帯（日勤・夜勤・交替制）と休みの曜日
  - 常温か、冷蔵・冷凍の倉庫か
  - フォークリフトの資格が必要か、入社後に取れるか
  - 正社員・契約社員・派遣・パートのどれか
  - 入社後に教えてもらう期間と、ひとりで担当するまでの流れ
```

求人に書かれていないことは、面接や職場見学で聞いてかまいません。質問の例です。

- 「1日の作業は、ピッキングと検品のどちらが中心になりますか」
- 「扱う荷物で、いちばん重いものはどのくらいですか」
- 「フォークリフトの資格を取る支援はありますか」
- 「入社後、慣れるまでは先輩と一緒に作業する期間がありますか」

### 雇用の形は先に決めておく

倉庫の仕事は、正社員のほか、派遣・契約社員・パートの求人も多い仕事です。雇用の形によって、任される仕事の範囲（作業だけか、在庫管理や現場のまとめ役までか）が変わることもあります。いま派遣で働いていて、正社員を考えている場合は、[派遣から正社員を考えるとき、最初に確認したいこと](/articles/haken-seishain)も参考にしてください。

「研修あり」と書かれた求人で何を確かめればいいかは、[未経験求人の「研修あり」で確認すべきこと](/articles/mikeiken-kenshu-kakunin)にまとめています。倉庫の仕事は、どの担当で、どの時間帯に、どんな商品を扱うかで中身が変わります。その3つを先に決めてから求人を比べると、自分に合う職場を選びやすくなります。', 'review', false, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '物流・倉庫の仕事内容は？ピッキング・検品と未経験の始め方', '物流・倉庫の仕事を未経験から考える人へ。入庫から出荷までの流れ、ピッキング・検品・在庫管理・フォークリフトの仕事の違い、フォークリフトに必要な技能講習と特別教育、求人や面接で確認したい勤務時間・雇用の形を紹介します。', array['haken-seishain', 'mikeiken-shikaku', 'mikeiken-kenshu-kakunin', 'seizou-koujou-shigoto', 'driver-shigoto']::text[], array['sonota']::text[], array['mikeiken-shokushu', 'seishain']::text[], array['freeter', 'haken']::text[], array['倉庫の仕事って、', '未経験でもできる？']::text[], null, false, '[{"q":"倉庫の仕事は、資格がなくても始められますか？","a":"ピッキングや検品、仕分けなどの倉庫内の作業は、資格がなくても応募できる求人が多い仕事です。ただし、フォークリフトの運転は資格が必要な仕事で、最大荷重1トン以上のものは技能講習、1トン未満のものは特別教育の修了が必要です。求人の応募資格の欄で、資格が必要かどうかを確認しましょう。"},{"q":"フォークリフトの資格は、普通自動車免許があれば不要ですか？","a":"いいえ。倉庫や工場の中でフォークリフトを運転するには、自動車の運転免許とは別に、技能講習（最大荷重1トン以上）や特別教育（1トン未満）の修了が必要です。逆に、技能講習などを修了しただけでは公道を走ることはできません。講習の日程や申し込みは、登録教習機関などに問い合わせます。"},{"q":"倉庫の仕事でも、正社員を目指せますか？","a":"倉庫の仕事には、正社員のほか、派遣・契約社員・パートなどの求人もあります。同じ「倉庫内作業」でも雇用の形によって、担当する仕事の範囲や、在庫管理・現場のまとめ役などを任されるかどうかが変わることがあります。求人票の雇用形態と、入社後に任される仕事の範囲を面接で確認しましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「倉庫の仕事」をひとまとめにせず、入庫→保管→ピッキング→検品→出荷の流れの中で、どの仕事が何をするかを分けて見せる。資格が必要なのはフォークリフトだけ、という線引きを正確に書き、未経験の人が求人で確認すべきこと（時間帯・扱う商品・雇用の形）に落とす","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/485","text":"倉庫において貨物・資材・荷物の搬入・搬出、積み卸し、積み直し、開梱・詰め替えなどの作業に従事する。管理事項には荷物の保管場所の管理、在庫管理、商品日付管理、入庫順管理などがある。入庫・出庫・保管作業ではコンピュータ端末の指示データに基づいてフォークリフトなどを利用して貨物を出し入れし、貨物の記録を行う。出庫時は配送先ごとに仕分けし、指定時刻に合わせて出庫する（job tag へ直接接続できなかったため、検索結果に表示されたページ内容で確認）","used_in":"物流・倉庫の仕事はどんな流れ？ / 在庫管理"},{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/486","text":"入庫時にバーコードで商品を確認して受け入れ、賞味期限の長短などで仕分けて棚に格納し、伝票の数量どおりに発送先ごとの商品を集める。発送先ごとに集める方式と、まとめて集めて後で振り分ける方式がある。ハンディターミナルでバーコード管理するシステムが普及している（検索結果で確認）","used_in":"ピッキング / 検品"},{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/237","text":"倉庫や工場でフォークリフトを操作し、荷物の運搬や積み下ろしを行う。入庫・荷受けではトラックで運ばれた荷物を保管場所へ運び、出荷では保管中の荷物をトラックの後部まで運ぶ。出勤後に始業前点検を行い、指示書で当日の内容を確認する（検索結果で確認）","used_in":"フォークリフト"},{"source_url":"https://www.mhlw.go.jp/content/11300000/000628483.pdf","text":"最大荷重1トン以上のフォークリフトの運転業務は技能講習の修了が必要。1トン未満は特別教育の修了でよい。これらの資格等だけでは公道上の走行はできない（PDF へ直接接続できなかったため、検索結果に表示された内容で確認）","used_in":"フォークリフトは資格が必要"}],"not_used":["倉庫作業員の賃金や求人倍率の数字は、job tag のページを直接開いて確認できなかったため書かない","技能講習の時間数・費用は受講コース（持っている免許や経験）によって違い、一次情報で確認しきれなかったため書かない","夜勤や交替制の有無は倉庫によって違うため断定せず、求人での確認のしかたを書くにとどめた"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'butsuryu-soko-shigoto' and c.slug = 'shokushu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'butsuryu-soko-shigoto' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '倉庫作業員 - 職業詳細（職業情報提供サイト job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/485', '2026-10-09'::date, '倉庫作業員の仕事内容（搬入・搬出、積み卸し、開梱・詰め替え）、保管場所の管理・在庫管理・商品日付管理・入庫順管理などの管理事項、端末の指示データに基づきフォークリフトなどで貨物を出し入れし記録すること、配送先ごとに仕分けて指定時刻に合わせて出庫すること', 0 from articles where slug = 'butsuryu-soko-shigoto';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ピッキング作業員 - 職業詳細（職業情報提供サイト job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/486', '2026-10-09'::date, '入庫時にバーコードで商品を確認して受け入れ、賞味期限などで仕分けて棚に格納すること、伝票の数量どおりに発送先ごとの商品を集めること、ピッキングの2つの方式、ハンディターミナルによるバーコード管理', 1 from articles where slug = 'butsuryu-soko-shigoto';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'フォークリフト運転作業員 - 職業詳細（職業情報提供サイト job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/237', '2026-10-09'::date, 'フォークリフトで荷物の運搬・積み下ろしをする仕事であること、入庫・出荷での動き、始業前点検と指示書の確認から1日が始まること', 2 from articles where slug = 'butsuryu-soko-shigoto';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'フォークリフト（安全衛生教育の資料）', '厚生労働省', 'https://www.mhlw.go.jp/content/11300000/000628483.pdf', '2026-10-09'::date, '最大荷重1トン以上のフォークリフトの運転は技能講習の修了が必要で、1トン未満は特別教育の修了でよいこと、これらの資格だけでは公道を走行できないこと', 3 from articles where slug = 'butsuryu-soko-shigoto';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'butsuryu-soko-shigoto' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"643ce6cb744d6c1fe44253ff48b9097efe47ad93ca0b0072cf9230fb6f2f2b57","findings":[]}'::jsonb from articles where slug = 'butsuryu-soko-shigoto';
update articles set status = 'published' where slug = 'butsuryu-soko-shigoto';

-- article: callcenter-shigoto (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('callcenter-shigoto', 'article', 'コールセンターの仕事内容は？受信と発信の違い・向き不向きと、接客経験の活かし方', 'コールセンターの仕事は、電話やメールでお客さまに応対し、聞き取った内容をパソコンに入力する仕事です。受信（インバウンド）と発信（アウトバウンド）の違い、向き不向き、接客経験の活かし方、応募前に求人で確認することを紹介します。', '「接客の仕事から離れたいけど、人と話すことはきらいじゃない」。そんなときに候補に挙がりやすいのが、コールセンターの仕事です。求人もよく見かけますが、実際に何をするのか、電話ばかりでつらくないのか、イメージしにくい人も多いはずです。

先に結論を言うと、コールセンターの仕事は**お客さまの話を聞き、パソコンに入力し、必要なら担当者につなぐ仕事**です。受信（かかってきた電話に出る）と発信（こちらからかける）で中身がかなり違うので、まずはどちらの求人かを見分けるところから始めましょう。

この記事で分かること：

- コールセンターの**仕事内容**と、受信・発信の違い
- **向いている人**と、合わないと感じやすい場面
- **接客経験の活かし方**と、面接での伝え方の例
- 応募前に**求人で確認すること**

## コールセンターの仕事は「聞く・入力する・つなぐ」

厚生労働省の職業情報提供サイト（job tag）では、コールセンターオペレーターを、電話やファックス、インターネット、メールなどを通じてお客さまと応対する仕事として紹介しています。仕事の中身として挙げられているのは、次のようなものです。

- お客さまからの注文や質問に応対する
- 必要なことを聞き取りながら、パソコンに入力する
- 聞き取った内容を復唱して確認する
- クレーム（苦情）に応対する
- 内容に応じて、ほかの担当者に電話をつなぐ
- 仕事の終わりに、電話の件数や結果を上司に報告する

1本の電話の流れにすると、たとえばこんな形です（仮の例です）。

> お客さま「先週注文した商品が、まだ届かないんですが」
> オペレーター「ご不便をおかけしております。確認いたしますので、ご注文のときのお名前とお電話番号を教えていただけますか」（聞き取りながら画面で注文を検索）
> オペレーター「〇〇様、〇月〇日のご注文ですね。発送の状況をお調べします」（状況を確認し、分からなければ担当部署へ取り次ぐ）

話しながら画面を見て、入力する。この「同時に進める」動きが、コールセンターの基本になります。金融・保険、小売、メーカー、サービス業など、いろいろな業種の会社がコールセンターを置いているので、扱う商品やサービスによって覚えることも変わります。

## 受信（インバウンド）と発信（アウトバウンド）の違い

job tag でも、コールセンターの仕事は、お客さまから電話がかかってくる**インバウンド**と、お客さまに電話をかける**アウトバウンド**の2つに分けられています。

```figure
type: compare
title: 受信と発信の違い
columns:
  - label: 受信（インバウンド）
    tone: sky
    items:
      - かかってきた電話に出る
      - 注文の受付、問い合わせへの回答
      - 困っている人の話を聞く場面が多い
  - label: 発信（アウトバウンド）
    tone: sand
    items:
      - こちらから電話をかける
      - 案内、勧誘、アンケート、予約の確認など
      - 断られる場面もある
```

求人では「受電」「インバウンド」「お問い合わせ対応」と書かれていれば受信、「架電」「発信」「アウトバウンド」「テレアポ」と書かれていれば発信のことが多いです。両方を担当する職場もあるので、仕事内容の欄をよく読みましょう。

## 向いている人・合わないと感じやすい場面

### 向いている人

- 相手の話を最後まで聞き、要点をつかむのが得意
- 落ち着いた声で、ていねいな言葉づかいができる
- マニュアルや決まった手順に沿って進めるのが苦にならない
- 話しながらメモをとったり、入力したりするのに慣れている

### 合わないと感じやすい場面

- 一日の多くの時間、席について電話と画面に向き合う
- 相手の顔が見えないので、声だけで気持ちをくみ取る必要がある
- 発信の仕事では、断られることが続く日もある
- 怒っているお客さまの電話を受けることもある

「自分に向いているか」は、仕事内容の一つひとつを見て、**どの場面なら疲れにくいか**で考えると判断しやすくなります。営業やITサポートとの違いも比べたいときは、[営業・カスタマーサポート・ITサポートの違い](/articles/eigyo-cs-it-support-chigai)が参考になります。

## 接客経験はどう活かせる？

店頭での接客と電話の応対は、重なる部分が多い仕事です。

| 接客でやってきたこと | コールセンターで活きる場面 |
| --- | --- |
| お客さまの要望を聞いて商品を案内した | 問い合わせの内容を聞き取り、答えを案内する |
| レジや予約の受付をした | 注文や申し込みを、聞きながら正確に入力する |
| 苦情を受けて、店長に引き継いだ | クレームに応対し、必要なら上の人につなぐ |
| 混雑時も順番に対応した | 電話が続くときも、一件ずつ落ち着いて応対する |

一方で、電話では**表情や身ぶりが使えない**こと、**パソコンの入力を同時に進める**ことが、店頭とは違います。面接では、重なる部分を具体的に話し、違う部分は「どう慣れていくか」を添えると伝わりやすくなります。

> 「カフェで接客の仕事をしてきました。忙しい時間帯でも、注文を復唱して聞き間違いを防ぐことを心がけていました。電話では表情が見えない分、声のトーンと言葉で安心してもらえるよう、研修で応対の型を早く覚えたいと考えています。」（仮の例です）

接客経験の言葉にし方は、[接客経験は転職でどう活かせる？](/articles/sekkyaku-keiken-ikasu)でも職種別に紹介しています。

## 未経験でも大丈夫？入社後の流れ

job tag では、コールセンターオペレーターになるのに学歴や資格は特に必要ないとされています。入社後は、扱う商品やサービスの知識を学び、ロールプレイ（練習の応対）を経て、上の立場の人の指導を受けながら、ひとりで応対できるようになっていく流れが紹介されています。

研修の長さや内容、ひとりで電話を受け始める時期は、会社によって違います。「研修あり」と書かれている求人の確かめ方は、[未経験求人の「研修あり」で確認すべきこと](/articles/mikeiken-kenshu-kakunin)にまとめています。

### クレームが不安なら、体制を確認する

クレームへの応対は、コールセンターの仕事のひとつです。ただ、ひとりで抱え込むものではありません。2026年10月1日からは、カスタマーハラスメント（お客さまなどからの度を越えた言動）への対策が、事業主の義務になりました。会社は、働く人が相談できる体制を整えるなどの対策をとる必要があります。

面接では、遠慮せずに次のように聞いてみましょう。

> 「対応が難しいお電話のときは、どなたに、どのように引き継ぐ流れになっていますか。」

## 応募前に、求人で確認すること

job tag では、24時間365日対応のコールセンターもあり、交替制の勤務になる場合があると紹介されています。土日休みを希望する人は特に、勤務時間とシフトを先に確かめておきましょう。

```figure
type: checklist
title: コールセンターの求人で確認すること
items:
  - 受信・発信のどちらか、両方か
  - 扱う商品やサービスの内容
  - 勤務時間とシフト、土日祝の出勤
  - 研修の長さと、ひとりで応対し始める時期
  - 困ったときに引き継げる人がいるか
  - 電話の件数などの目標があるか
  - 正社員・契約社員・派遣など雇用の形
```

求人に書かれていないことは、面接で質問してかまいません。たとえば次のような聞き方があります。

- 「一日に受ける電話の件数や、目標の決め方を教えていただけますか」
- 「入社後、ひとりで電話を受け始めるまでに、どのような練習がありますか」
- 「シフトはどのくらい前に決まりますか。土日の出勤はどのくらいありますか」

コールセンターの求人は、同じ「オペレーター」でも、受信か発信か、扱う商品は何か、シフトはどうかで働き方が大きく変わります。仕事内容の欄を読み比べ、自分が続けやすい条件かどうかを確かめてから応募しましょう。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, 'コールセンターの仕事内容｜受信・発信の違いと向き不向き', 'コールセンターの仕事内容を、受信（インバウンド）と発信（アウトバウンド）に分けて紹介します。向いている人・合わないと感じやすい場面、接客経験の活かし方と伝え方の例、応募前に求人で確認することが分かります。', array['eigyo-cs-it-support-chigai', 'sekkyaku-keiken-ikasu', 'mikeiken-kenshu-kakunin', 'jiko-pr-mikeiken', 'eigyo-jimu-shigoto']::text[], array['customer-support']::text[], array['mikeiken-shokushu']::text[], array['sekkyaku', 'hajimete']::text[], array['コールセンターって、', '接客経験が活きる？']::text[], null, false, '[{"q":"コールセンターの仕事に、資格や経験は必要ですか？","a":"厚生労働省の職業情報提供サイト（job tag）では、コールセンターオペレーターになるのに学歴や資格は特に必要ないとされています。入社後に商品やサービスの知識を学び、ロールプレイ（練習の応対）や上の立場の人の指導を受けてから、ひとりで応対するのが一般的な流れです。研修の期間や内容は会社によって違うので、求人や面接で確認しましょう。"},{"q":"受信（インバウンド）と発信（アウトバウンド）は、どちらが未経験向きですか？","a":"どちらが向いているかは人によって違います。受信はかかってきた問い合わせや注文に答える仕事、発信はこちらから電話をかけて案内や勧誘、アンケートなどを行う仕事です。「困っている人の話を聞くのが苦にならない」なら受信、「断られても気持ちを切り替えられる」なら発信、のように、自分が疲れにくい場面で考えるのがおすすめです。"},{"q":"クレームの電話がつらそうで不安です。","a":"クレームへの応対は仕事内容のひとつです。ただ、ひとりで抱え込む仕事ではなく、対応が難しいときは上の立場の人に引き継ぐのが一般的です。2026年10月1日からは、カスタマーハラスメント（顧客などからの度を越えた言動）への対策が事業主の義務になりました。面接で「難しい電話のときは、どう引き継ぎますか」と聞いてみると、職場の体制が分かります。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"コールセンターを「受信」と「発信」に分けて、1本の電話の流れ（聞く→入力→確認→つなぐ）で仕事内容を具体的に見せる。接客経験と重なる部分・重ならない部分を分け、求人で確認することを質問例つきで示す","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/64","text":"コールセンターで、電話やファックス、インターネット、Eメールなどの通信メディアを通じてお客と応対する。業務は顧客から電話がかかってくるインバウンド業務と、顧客に電話をかけるアウトバウンド業務の2つに分けられる。タスクとして、注文や質問への応対、必要事項を聞き取りながらのパソコン入力、聞き取った情報の復唱確認、クレーム応対、他の担当者への取り次ぎ、業務終了時の架電件数や予約結果の報告がある（job tag へ直接接続できなかったため、検索結果に表示されたページ内容で確認）","used_in":"コールセンターの仕事は「聞く・入力する・つなぐ」"},{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/64","text":"入職に学歴や資格は特に必要とされない。入職後は商品・サービスの知識を学び、ロールプレイなどを経て、スーパーバイザーの指導を受けてから単独で応対する。24時間365日対応のコールセンターもあり、交替制勤務になる場合がある。金融・保険業、小売業、製造業、サービス業など多様な業種の企業・団体が設置し、職場は全国に広がっている（検索結果で確認）","used_in":"未経験でも大丈夫？入社後の流れ / 応募前に、求人で確認すること"},{"source_url":"https://www.mhlw.go.jp/web_magazine/series/20260820.html","text":"令和8年10月1日から、カスタマーハラスメント対策が事業主の義務となった（mhlw.go.jp へ直接接続できなかったため、検索結果に表示された内容で確認）","used_in":"クレームが不安なら、体制を確認する"},{"source_url":"https://www.no-harassment.mhlw.go.jp/foundation/law-amendment/","text":"改正労働施策総合推進法により、事業主は、顧客等の言動で社会通念上許容される範囲を超え、労働者の就業環境が害されることのないよう、雇用管理上必要な措置を講じる必要がある（検索結果で確認）","used_in":"クレームが不安なら、体制を確認する"}],"not_used":["コールセンターの賃金・労働時間の数字は、地域や雇用形態で大きく変わるため書かない","「テレコミュニケーター検定」などの民間検定は、job tag の関連資格欄で確認できなかったため扱わない","受信と発信のどちらが離職しやすいか等の評価は、公的な根拠を確認できなかったので書かない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'callcenter-shigoto' and c.slug = 'shokushu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'callcenter-shigoto' and c.slug = 'keiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'コールセンターオペレーター - 職業詳細（職業情報提供サイト job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/64', '2026-10-09'::date, '仕事内容（受信・発信の2種類、聞き取りながらのパソコン入力、復唱確認、クレーム応対、担当者への取り次ぎ、終業時の報告）、入職に学歴・資格が特に必要ないこと、入社後の研修の流れ、24時間365日のセンターでは交替制勤務があること、設置している業種', 0 from articles where slug = 'callcenter-shigoto';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '従業員を守るために ― カスタマーハラスメント対策の新ルール（厚生労働省 Webマガジン）', '厚生労働省', 'https://www.mhlw.go.jp/web_magazine/series/20260820.html', '2026-10-09'::date, '2026年10月1日から、カスタマーハラスメント対策が事業主の義務になったこと', 1 from articles where slug = 'callcenter-shigoto';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '改正労働施策総合推進法等特設ページ（あかるい職場応援団）', '厚生労働省', 'https://www.no-harassment.mhlw.go.jp/foundation/law-amendment/', '2026-10-09'::date, 'カスタマーハラスメント対策として、事業主が雇用管理上必要な措置（相談体制の整備など）を講じる必要があること', 2 from articles where slug = 'callcenter-shigoto';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'callcenter-shigoto' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"6f6bdec2c46e0aa2ea7cb5ea95b634b93f98944a16ceba85b5476a87659b936a","findings":[]}'::jsonb from articles where slug = 'callcenter-shigoto';
update articles set status = 'published' where slug = 'callcenter-shigoto';

-- article: dainishinsotsu-nansai (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('dainishinsotsu-nansai', 'article', '第二新卒って何歳まで？使える場面と探し方', '第二新卒は、何歳までと一律に決まった言葉ではなく、学校を卒業しておおむね3年以内の人を指すことが多い呼び方です。年齢より卒業からの年数で考える理由、新卒の枠に応募できる場合、求人の探し方を整理します。', '求人を見ていると「第二新卒歓迎」という言葉をよく目にします。でも、自分がそれに当てはまるのか、何歳までなのか、はっきり分からない人も多いのではないでしょうか。

先に結論を言うと、第二新卒は**何歳までと一律に決まっている言葉ではありません**。会社や求人サイトによって指す範囲が少し違い、一般には「学校を卒業しておおむね3年以内」の人を指すことが多い呼び方です。

## 第二新卒って、そもそも何？

第二新卒は、学校を卒業していったん就職し、数年のうちに転職を考える人を指して使われることが多い言葉です。似た言葉と並べると、違いが分かりやすくなります。

| 呼び方 | よく指している人 |
| --- | --- |
| 新卒 | 卒業する年度に就職活動をしている学生 |
| 第二新卒 | 卒業後に一度就職し、おおむね3年以内に転職を考える人 |
| 既卒 | 卒業後、正社員として就職していない人 |

どれも、会社や求人サイトによって指す範囲が少しずつ違います。気になる求人では、「応募条件」の欄を確かめるのがいちばん確実です。

## 何歳まで？年齢より「卒業からの年数」で考える

第二新卒かどうかは、年齢より**卒業してからの年数**で考えると分かりやすくなります。

たとえば22歳で大学を卒業した場合、卒業から3年以内なら25歳前後までが目安です。18歳で高校を卒業した場合なら、21歳前後までになります。同じ25歳でも、卒業した学校や年齢によって、卒業からの年数は人それぞれです。

```figure
type: stats
title: 卒業から3年以内の目安
items:
  - value: "25"
    unit: 歳前後
    label: 22歳で大学を卒業
    note: 卒業から3年以内なら
  - value: "21"
    unit: 歳前後
    label: 18歳で高校を卒業
    note: 卒業から3年以内なら
```

求人によっては「卒業後3年以内」「社会人経験3年未満」など、年数で条件が書かれていることもあります。年齢だけで「自分はもう対象外」と決めずに、条件の書き方を見てみましょう。

## 新卒の枠に、まだ応募できる？

厚生労働省は、若者の雇用についての指針で、**卒業後少なくとも3年間は新卒の採用枠に応募できるようにすること**を会社に求めています。そのため、新卒向けの募集でも「卒業後3年以内の方も応募可」などと書かれていることがあります。

ただし、これは会社に努力を求めるもので、すべての会社が受け付けているわけではありません。一度就職したことがある人も応募できるかどうかも、求人ごとに確かめる必要があります。募集要項の「既卒可」などの記載や、問い合わせ先で確認しましょう。

## 第二新卒の求人、どう探す？

探し方は主に3つあります。

- **求人サイト**: 「第二新卒歓迎」「未経験歓迎」「既卒可」などの条件で検索する
- **新卒応援ハローワーク**: 大学・短大・高専・専修学校などの学生や、卒業後おおむね3年以内の人の就職を支援するハローワークです。東京の窓口では、卒業後3年以内なら在職中の人や、一度就職して辞めた人も利用できると案内されています。卒業から3年以上たっている人には、近くのハローワークや「わかものハローワーク」の利用が案内されています
- **人材紹介会社**: 担当者と面談しながら求人を紹介してもらう方法です。面談前の準備は[エージェント面談の前に決めておくこと・決めなくていいこと](/articles/agent-mendan-mae)で紹介しています

```figure
type: compare
title: 第二新卒の求人の主な探し方
columns:
  - label: 求人サイト
    tone: sky
    items:
      - 「第二新卒歓迎」「既卒可」などの条件で検索
  - label: 新卒応援ハローワーク
    tone: mint
    items:
      - 卒業後おおむね3年以内の人の就職を支援
  - label: 人材紹介会社
    tone: sand
    items:
      - 担当者と面談しながら求人を紹介してもらう
```

## 早く辞めることが気になったら

第二新卒の転職では、「すぐ辞めたと思われないか」が気になる人も多いと思います。面接では、辞める理由を前の会社への不満だけで終わらせず、**次の仕事で何をしたいか**につなげて話すのがポイントです。

> 話し方の例：入社して2年、店舗で接客を担当しました。お客さまの問い合わせに対応するうちに、一人ひとりの困りごとにじっくり向き合う仕事がしたいと考えるようになり、カスタマーサポートを志望しています。

経歴の整理のしかたは[転職回数が気になるときに整理したいこと](/articles/tenshoku-kaisu-kininaru)も参考にしてください。卒業から3年以上たっていても、未経験から応募できる中途採用の求人はあります。年齢で迷ったときは[26歳で未経験の職種に転職するのは遅い？](/articles/26sai-mikeiken)も読んでみてください。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['26sai-mikeiken', 'agent-mendan-mae', 'tenshoku-kaisu-kininaru', 'souki-rishoku-tenshoku']::text[], '{}'::text[], array['mikeiken-shokushu']::text[], array['dainishinsotsu', 'hajimete']::text[], array['第二新卒って', '何歳まで？']::text[], null, false, '[{"q":"第二新卒は何歳までですか？","a":"何歳までと一律には決まっていません。学校を卒業しておおむね3年以内の人を指すことが多く、年齢より卒業からの年数で考えると分かりやすくなります。たとえば22歳で大学を卒業した場合、25歳前後までが目安です。応募できるかどうかは、求人ごとの応募条件で確認しましょう。"},{"q":"一度就職していても、新卒の枠に応募できますか？","a":"厚生労働省の指針では、卒業後少なくとも3年間は新卒の採用枠に応募できるよう、会社に努めることを求めています。ただし、すべての会社が受け付けているわけではなく、職歴のある人も応募できるかどうかは求人ごとに確かめる必要があります。募集要項の「既卒可」などの記載を確認してください。"},{"q":"卒業して3年以上たっていたら、もう応募できる求人はありませんか？","a":"そんなことはありません。「第二新卒歓迎」と書かれていなくても、未経験から応募できる中途採用の求人はあります。言葉の区切りにしばられず、仕事内容と応募条件で探してみてください。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「何歳まで」の答えを年齢で出さず、卒業からの年数と応募条件で考える。既存の review 記事 dainishinsotsu-tenshoku-timing（動くタイミング）とは別に、言葉の意味と使える場面・探し方に絞る","quotes":[{"source_url":"https://www.mhlw.go.jp/stf/houdou/2r9852000000wgq1.html","text":"青少年雇用機会確保指針を改正し、事業主は学校等の卒業者が新卒の採用枠に応募できるよう応募条件を設定し、少なくとも卒業後3年間は応募できるようにすることとした","used_in":"新卒の枠に、まだ応募できる？"},{"source_url":"https://jsite.mhlw.go.jp/tottori-roudoukyoku/hourei_seido_tetsuzuki/shokugyou_shoukai/22seishonen_shishin.html","text":"青少年の雇用の促進等に関する法律に基づく指針で、学校卒業見込者の採用枠について、既卒者が卒業後少なくとも3年間は応募できるように努めることとされている","used_in":"新卒の枠に、まだ応募できる？"},{"source_url":"https://jsite.mhlw.go.jp/tokyo-hellowork/kyushokusha/tokyo_shinsotsu/jobseeker.html","text":"大学・大学院・短大・高専・専修学校（専門課程）の学生と、卒業後おおむね3年以内の人が利用できる。卒業後3年以内であれば、在職中や就職後に離職した人も利用できる。卒業後3年を超える人などには、最寄りのハローワークやわかものハローワークの利用を案内している","used_in":"第二新卒の求人、どう探す？"}],"not_used":["第二新卒の採用数や求人倍率などの統計は使っていない","「第二新卒」の意味は公的な出典で確認できなかったため、一般的な使われ方として説明し、応募条件で確かめるよう書いた。「法律で年齢が決められた区分ではない」という記述は出典がないため削除","年齢の目安は卒業年齢からの計算例として示した"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'dainishinsotsu-nansai' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'dainishinsotsu-nansai' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '青少年雇用機会確保指針の改正について（報道発表）', '厚生労働省', 'https://www.mhlw.go.jp/stf/houdou/2r9852000000wgq1.html', '2026-10-06'::date, '卒業後少なくとも3年間は新卒の採用枠に応募できるようにすることを、事業主に求める指針の内容', 0 from articles where slug = 'dainishinsotsu-nansai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '青少年雇用機会確保指針について', '鳥取労働局', 'https://jsite.mhlw.go.jp/tottori-roudoukyoku/hourei_seido_tetsuzuki/shokugyou_shoukai/22seishonen_shishin.html', '2026-10-06'::date, '若者雇用促進法に基づく指針で、既卒者が卒業後少なくとも3年間は新卒の採用枠に応募できるよう努めることとされていること', 1 from articles where slug = 'dainishinsotsu-nansai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '東京新卒応援ハローワーク（求職者の方へ）', '東京労働局', 'https://jsite.mhlw.go.jp/tokyo-hellowork/kyushokusha/tokyo_shinsotsu/jobseeker.html', '2026-10-06'::date, '東京新卒応援ハローワークは大学・短大・高専・専修学校などの学生と卒業後おおむね3年以内の人が利用でき、在職中や一度就職して離職した人も利用できること。卒業後3年を超える人には近くのハローワークやわかものハローワークを案内していること', 2 from articles where slug = 'dainishinsotsu-nansai';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'dainishinsotsu-nansai' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"7a9436ee01d99d44edd6acd9af2840174eb0d2ce9eaec523d8872b34756799cd","findings":[]}'::jsonb from articles where slug = 'dainishinsotsu-nansai';
update articles set status = 'published' where slug = 'dainishinsotsu-nansai';

-- article: dainishinsotsu-tenshoku-timing (review)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('dainishinsotsu-tenshoku-timing', 'article', '第二新卒の転職、動き始めるタイミングはいつがいい？', '入社1〜3年目で転職を考え始めたときに、在職中に動くか退職してから動くか、どの時期に動くかを判断するための材料を整理します。', '（査読待ちのサンプル記事です。status が review のため、公開ページ・検索・サイトマップには表示されません。）

入社して1〜3年ほどで「この仕事を続けていいのか」と考え始める人は少なくありません。第二新卒の転職では、動き始めるタイミングによって、選べる進め方が変わります。

## 在職中に動くか、退職してから動くか

在職中に活動すれば収入が途切れない一方で、面接の日程調整がしにくくなります。退職してから活動する場合は時間を確保しやすい一方で、収入が途切れる期間の生活費を考えておく必要があります。

2025年4月以降に自己都合で退職した場合、雇用保険の基本手当の給付制限期間は原則1か月になりました。ただし、受給には条件があるため、自分が対象になるかは事前に確認しましょう。', 'review', false, null, '2026-10-06'::timestamptz, null, null, null, null, null, array['mikeiken-tenshoku-hajimekata', 'agent-mendan-mae']::text[], '{}'::text[], array['yametai']::text[], array['dainishinsotsu']::text[], array['第二新卒の転職、', 'いつ動き始める？']::text[], null, false, '[]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","reviewer_todo":"退職後に活動する場合の生活費の目安について、出典付きの記述を追加するか検討"}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'dainishinsotsu-tenshoku-timing' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'dainishinsotsu-tenshoku-timing' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '雇用保険制度の改正内容について', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000160564.html', '2026-10-06'::date, '自己都合退職時の給付制限期間', 0 from articles where slug = 'dainishinsotsu-tenshoku-timing';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'dainishinsotsu-tenshoku-timing' on conflict do nothing;

-- article: donichi-yasumi-nenshu-hikaku (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('donichi-yasumi-nenshu-hikaku', 'article', '「土日休み」と「年収」をどう比較する？求人票の数字の読み方', '「年収は高いけれど休みが少ない」「土日休みだけど年収は少し低い」。迷ったときは、年間休日・労働時間・年収の内訳をそろえて比べると判断しやすくなります。求人票の数字の読み方と、時給換算での比べ方を紹介します。', '求人を比べていると、「年収は高いけれど休みが少ない」「土日休みだけど年収は少し低い」という選択に迷うことがあります。

どちらが正解というものはありませんが、比べ方を少し工夫すると、自分に合うほうが見えやすくなります。ポイントは、**数字の条件をそろえてから比べる**ことです。

## まずは「年間休日」で休みを数える

「土日休み」と書かれていても、祝日や夏季・年末年始の休みがあるかどうかで、1年間の休みの日数は変わります。求人票では、**年間休日の日数**を確認しましょう。

目安として、1年はおよそ52週なので、毎週土日が休みなら104日です。これに祝日や夏季・年末年始の休暇が加わると、120日前後になる会社が多くなります。

```figure
type: stats
title: 年間休日の目安
items:
  - value: "104"
    unit: 日
    label: 毎週土日が休み
    note: 1年はおよそ52週
  - value: "120"
    unit: 日前後
    label: 祝日なども休み
    note: 祝日や夏季・年末年始の休暇が加わる
```

休日の書き方にも注意が必要です。**完全週休2日制**は毎週2日の休みがあることを指しますが、**週休2日制**は月に1回以上、週2日休める週があるという意味で、毎週とは限りません。

```figure
type: compare
title: 似ているけれど意味が違う
columns:
  - label: 完全週休2日制
    tone: mint
    items:
      - 毎週2日の休みがある
  - label: 週休2日制
    tone: sand
    items:
      - 月に1回以上、週2日休める週がある
      - 毎週とは限らない
```

なお、労働基準法では、会社は少なくとも毎週1日（または4週間で4日以上）の休日を与えることになっていて、労働時間は原則として1日8時間・1週40時間までと定められています。年間休日が少ない求人は、1日の所定労働時間が短く設定されていることもあるので、あわせて確認しましょう。

## 年収は「内訳」まで見る

年収の欄には、いくつかの要素が合算されていることがあります。

| 年収に含まれやすいもの | 確認したいこと |
| --- | --- |
| 基本給 | 月給のうち、基本給はいくらか |
| 固定残業代 | 何時間分の残業代が含まれているか、超えた分は追加で支払われるか |
| 各種手当 | 住宅手当・資格手当など、誰でも受け取れるものか |
| 賞与（ボーナス） | 「前年実績」なのか、支給が決まっているのか |

特に**固定残業代**は、年収を比べるときに見落としやすいポイントです。たとえば同じ月給25万円でも、そのうち5万円が固定残業代なら、基本給は20万円になります。賞与が基本給をもとに計算される会社では、この差が年収にも影響します。

## 時給に換算してそろえて比べる

休日と年収のどちらを優先するか迷ったら、**1時間あたりの金額**に換算すると比べやすくなります。

計算はシンプルです。

```figure
type: equation
title: 1時間あたりの金額の出し方
terms:
  - 年収
  - ÷
  - 年間の勤務日数 × 1日の所定労働時間
  - =
  - 1時間あたりの金額
```

年間の勤務日数は「365日 − 年間休日」で求められます。具体的な例で比べてみましょう。

| | 求人A | 求人B |
| --- | --- | --- |
| 年収 | 300万円 | 320万円 |
| 年間休日 | 120日 | 105日 |
| 年間の勤務日数 | 245日 | 260日 |
| 1日の所定労働時間 | 8時間 | 8時間 |
| 年間の労働時間 | 1,960時間 | 2,080時間 |
| 1時間あたり | 約1,531円 | 約1,538円 |

年収では20万円の差がありますが、1時間あたりに直すとほとんど同じです。この場合、「休みが15日多いこと」と「年収が20万円高いこと」のどちらを取るかは、生活の中で何を大事にしたいかで決めることになります。

実際には残業時間も影響するので、平均の残業時間が分かる場合はそれも加えて計算してみてください。

## 数字だけでは分からないこと

時給換算は便利ですが、数字だけでは比べられないこともあります。

- **休みの曜日**: 家族や友人と休みが合うか、平日休みのほうが都合がいいか
- **休みの取りやすさ**: 有給休暇を取りやすい雰囲気か、繁忙期はいつか
- **これからの伸び**: 昇給のしくみや、経験を積んだあとの年収の幅

こうした点は求人票に書かれていないことも多いので、面接や、人材紹介会社のキャリアアドバイザーとの面談で確認しましょう。面談前の準備は[エージェント面談前に決めておくこと・決めなくていいこと](/articles/agent-mendan-mae)で紹介しています。

「休み」と「年収」のどちらを優先するかに正解はありません。数字の条件をそろえて比べたうえで、自分の生活に合うほうを選ぶことが、入社後の「こんなはずじゃなかった」を減らす近道です。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['mikeiken-tenshoku-hajimekata', 'agent-mendan-mae', 'news-roudou-jouken-meiji']::text[], '{}'::text[], array['donichi', 'kyuryo']::text[], '{}'::text[], array['土日休みと年収、', 'どう比べればいい？']::text[], null, true, '[{"q":"「週休2日制」と「完全週休2日制」は何が違いますか？","a":"一般的に、完全週休2日制は毎週2日の休みがあることを指します。週休2日制は、月に1回以上は週2日の休みがある週があるという意味で使われ、毎週2日休めるとは限りません。休日の欄は、年間休日数とあわせて確認しましょう。"},{"q":"固定残業代が含まれている求人は避けたほうがいいですか？","a":"固定残業代そのものが問題というわけではありません。基本給と固定残業代がそれぞれいくらか、何時間分の残業が含まれているか、それを超えた分が追加で支払われるかを確認し、ほかの求人とそろえて比べることが大切です。"}]'::jsonb, null, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'donichi-yasumi-nenshu-hikaku' and c.slug = 'hatarakikata' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'donichi-yasumi-nenshu-hikaku' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '労働基準法', 'e-Gov法令検索（デジタル庁）', 'https://laws.e-gov.go.jp/law/322AC0000000049', '2026-10-06'::date, '法定労働時間（第32条）と法定休日（第35条）', 0 from articles where slug = 'donichi-yasumi-nenshu-hikaku';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年4月から労働条件明示のルールが変わります', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_32105.html', '2026-10-06'::date, '労働条件の明示事項', 1 from articles where slug = 'donichi-yasumi-nenshu-hikaku';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'donichi-yasumi-nenshu-hikaku' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"b1d498b4643ad0202c2784e1071b99853b161e35e2afafef1a0a5fe1dc8629b6","findings":[]}'::jsonb from articles where slug = 'donichi-yasumi-nenshu-hikaku';
update articles set status = 'published' where slug = 'donichi-yasumi-nenshu-hikaku';

-- article: donichi-yasumi-shigoto (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('donichi-yasumi-shigoto', 'article', '「土日休み」を優先すると、どんな仕事がある？', '接客や販売の仕事から、土日休みの仕事に移りたいと考えている人へ。土日休みになりやすい仕事の考え方、事務・カスタマーサポート・ITサポートでの違い、求人票の休日欄の読み方、面接での確認のしかたを紹介します。', '接客や販売の仕事は、土日や祝日が忙しくなりやすく、友人や家族と休みが合わないことに悩む人もいます。「次は土日休みの仕事にしたい」というのは、転職を考えるきっかけとして自然なことです。

ただ、土日休みかどうかは、職種の名前だけでは決まりません。同じ職種でも、会社や部署によって休みの曜日は違います。ここでは、土日休みになりやすい仕事の考え方と、求人票・面接での確かめ方を紹介します。

## 土日休みになりやすい仕事って？

ひとつの目安になるのが、**誰に合わせて働く仕事か**という見方です。

- 相手が会社（取引先や社内の人）の仕事は、相手の営業日に合わせて平日が中心になりやすい
- 相手が一般のお客さまの仕事は、お客さまが動く土日や祝日にも営業していることがある

```figure
type: compare
title: 誰に合わせて働く仕事か
columns:
  - label: 相手が会社
    tone: mint
    items:
      - 取引先や社内の人の営業日に合わせる
      - 平日が中心になりやすい
  - label: 相手が一般のお客さま
    tone: sand
    items:
      - お客さまが動く日に合わせる
      - 土日や祝日にも営業していることがある
```

この見方で、事務・カスタマーサポート・ITサポートの3つを見てみると、次のようになります。あくまで考え方の例で、実際は会社によって違います。

| 職種 | 平日中心になりやすい例 | 土日の勤務がありうる例 |
| --- | --- | --- |
| 事務 | 社内の事務や、取引先とのやりとりが中心の営業事務 | 店舗や施設の事務、土日も営業しているサービスの事務 |
| カスタマーサポート | 会社向けのサービスの問い合わせ窓口 | 個人向けで、土日も受け付けている窓口（シフト制のことも） |
| ITサポート | 社内のパソコンやシステムを支える社内ヘルプデスク | 夜間・休日も動いているシステムの対応、利用者向けの窓口 |

カスタマーサポートやITサポートは、窓口の受付時間やシステムの動いている時間によって、休みの曜日が変わります。職種ごとの仕事内容や入社前に確認したいことは、[職種比較ページ](/jobs)にまとめています。

## 求人票の休日欄はどう読む？

土日休みかどうかは、求人票の休日の欄で確かめます。見るポイントは3つです。

```figure
type: checklist
title: 求人票の休日欄で見るポイント
items:
  - 「毎週2日」休めるか（完全週休2日制か）
  - 休みの曜日が書かれているか（土・日、土日祝休み）
  - 年間休日の日数（毎週土日なら約104日）
```

**1. 「毎週2日」休めるか**

「完全週休2日制」は、毎週2日の休みがあることを指します。「週休2日制」とだけ書かれている場合は、毎週2日休めるとは限りません。ハローワークの求人票では、週休二日制の欄が「毎週」なら曜日に関わらず毎週2日の休み、「その他」なら毎週2日とは限らない、という書き方になっています。

**2. 休みの曜日が書かれているか**

毎週2日休める場合でも、休みが土日とは限りません。「完全週休2日制（土・日）」「土日祝休み」のように曜日まで書かれているかを見ます。曜日の書きがない場合や「シフト制」とある場合は、平日が休みになることもあります。

**3. 年間休日の日数**

毎週土日が休みなら、土日だけで1年に約104日（52週 × 2日）になります。年間休日がこれより少ない場合は、土曜日に出勤する週があるなど、毎週土日休みではない可能性があります。祝日や夏季・年末年始の休みがあれば、その分だけ増えます。反対に、毎週2日休みとは限らない求人でも、長期休暇が多くて年間休日は多い、ということもあるので、「週休2日制」の書き方と年間休日は**セットで**見ましょう。日数をそろえて年収と比べる方法は[「土日休み」と「年収」をどう比較する？](/articles/donichi-yasumi-nenshu-hikaku)で紹介しています。

なお、労働基準法で会社に求められている休日は、毎週少なくとも1日（または4週間で4日以上）です。土日休みかどうかは法律で決まっているわけではなく、会社ごとのルールなので、求人ごとに確かめる必要があります。

## 面接で確認したいこと

求人票に「土日休み」と書かれていても、実際の働き方は面接や面談で聞いておくと安心です。たとえば次のような聞き方があります。

- 「土曜日や日曜日に出勤する日はありますか。ある場合は月に何日くらいですか」
- 「繁忙期や月末に休日出勤はありますか。その場合、代わりの休みは取れますか」
- 「研修期間中も、休みの曜日は同じですか」
- 「将来、部署が変わった場合に、シフト勤務になる可能性はありますか」

最後の質問は、2024年4月から求人の募集時などに明示されるようになった「業務の変更の範囲」とも関係します。詳しくは[求人で明示される労働条件が増えた（2024年4月）](/news/news-roudou-jouken-meiji)で紹介しています。

## 接客から移るときに考えておきたいこと

土日休みの仕事に移ると、働き方は大きく変わります。休みの曜日以外にも、次の点を考えておくと、移ったあとのギャップが小さくなります。

- **給料とのバランス**：シフト手当や休日出勤の手当がなくなると、給料が変わることがあります。今の給料にこうした手当がいくら含まれているか、給与明細で見ておきましょう。
- **働く姿勢の変化**：立ち仕事が中心の働き方から、座ってパソコンに向かう時間が長い働き方に変わります。
- **接客の経験の活かし方**：お客さまの話を聞く、分かりやすく説明するといった経験は、カスタマーサポートや事務の電話対応などにつながります。伝え方は[接客経験は転職でどう活かせる？](/articles/sekkyaku-keiken-ikasu)で紹介しています。

土日休みを優先すると決めたら、まずは興味のある職種を2〜3つに絞り、求人票の休日欄を同じ見方で比べてみてください。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['donichi-yasumi-nenshu-hikaku', 'eigyo-cs-it-support-chigai', 'sekkyaku-keiken-ikasu']::text[], array['jimu', 'customer-support', 'it-support']::text[], array['donichi', 'office']::text[], array['sekkyaku']::text[], array['土日休みにしたい。', 'どんな仕事がある？']::text[], null, false, '[{"q":"「完全週休2日制」なら土日休みですか？","a":"そうとは限りません。完全週休2日制は毎週2日の休みがあることを指しますが、休みの曜日は会社によって違います。「完全週休2日制（土・日）」のように曜日が書かれているか、シフト制ではないかを確認しましょう。"},{"q":"事務職なら土日休みですか？","a":"平日が中心の会社もありますが、店舗や施設の事務、土日も営業しているサービスの事務などでは、土日の勤務やシフトがあることもあります。求人票の休日欄と、面接での確認をあわせて判断しましょう。"},{"q":"年間休日が何日あれば、毎週土日休みといえますか？","a":"毎週土日が休みなら、土日だけで1年に約104日になります。これより少ない場合は、土曜日に出勤する週があるなど、毎週土日休みではない可能性があります。祝日や長期休暇が休みかどうかも、休日欄で確かめてください。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"職種名で決めつけず、「誰に合わせて働く仕事か」という見方と、求人票・面接での確かめ方を示す","quotes":[{"source_url":"https://jsite.mhlw.go.jp/chiba-roudoukyoku/content/contents/K_ex_mikata_R020106.pdf","text":"「週休二日制」欄は、完全週休二日制なら「毎週」、それ以外の形の週休二日制なら「その他」、週休二日制でなければ「なし」。「毎週」は曜日に関わらず毎週必ず2日休み、「その他」は毎週必ず2日休みとは限らない。年末年始や夏季休暇などを合わせたものが年間休日数で、週休二日制と年間休日の2つはセットで見る","used_in":"求人票の休日欄はどう読む？"},{"source_url":"https://laws.e-gov.go.jp/law/322AC0000000049","text":"第35条 使用者は、労働者に対して、毎週少くとも1回の休日を与えなければならない。4週間を通じ4日以上の休日を与える使用者には適用しない","used_in":"求人票の休日欄はどう読む？"},{"source_url":"https://www.mhlw.go.jp/stf/newpage_32105.html","text":"2024年4月1日から、労働条件の明示事項に就業場所・業務の変更の範囲が追加された。変更の範囲は将来の配置転換などの見込みも含む","used_in":"面接で確認したいこと"}],"not_used":["職種別の土日休みの割合や年間休日の平均などの統計値は使っていない。職種ごとの表は一般的な考え方として「会社によって違う」と明記"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'donichi-yasumi-shigoto' and c.slug = 'hatarakikata' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'donichi-yasumi-shigoto' and c.slug = 'shokushu' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '求人票の見方', '千葉労働局（厚生労働省）', 'https://jsite.mhlw.go.jp/chiba-roudoukyoku/content/contents/K_ex_mikata_R020106.pdf', '2026-10-06'::date, 'ハローワークの求人票の「週休二日制」欄（「毎週」は曜日に関わらず毎週2日の休み、「その他」は毎週2日とは限らない）と、週休二日制と年間休日数をセットで見ること', 0 from articles where slug = 'donichi-yasumi-shigoto';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '労働基準法', 'e-Gov法令検索（デジタル庁）', 'https://laws.e-gov.go.jp/law/322AC0000000049', '2026-10-06'::date, '法定休日（第35条：毎週少なくとも1回、または4週間を通じて4日以上）', 1 from articles where slug = 'donichi-yasumi-shigoto';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年4月から労働条件明示のルールが変わります', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_32105.html', '2026-10-06'::date, '2024年4月から明示事項に「就業場所・業務の変更の範囲」が加わったこと', 2 from articles where slug = 'donichi-yasumi-shigoto';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'donichi-yasumi-shigoto' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"6bf9078eec6931802c6cdd5cd61706694a68774286289e0079a0f98a64f81960","findings":[]}'::jsonb from articles where slug = 'donichi-yasumi-shigoto';
update articles set status = 'published' where slug = 'donichi-yasumi-shigoto';

-- article: driver-shigoto (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('driver-shigoto', 'article', 'ドライバーの仕事内容と必要な免許は？準中型・中型・大型・二種の違いと、2024年4月からの働き方の確認', 'ドライバーの仕事は、荷物を運ぶトラック・配送と、人を乗せるタクシー・バスで、必要な免許が変わります。準中型・中型・大型・第二種免許の違いと受験資格、2024年4月からの時間外労働の上限と改善基準告示、求人で確認することを紹介します。', '「運転が好き」「ひとりで黙々と動ける仕事がいい」。そう考えたときに候補に入りやすいのが、ドライバーの仕事です。一方で、「どの免許が必要？」「長時間労働って本当？」と迷う人も多い仕事です。

先に結論を言うと、ドライバーの仕事は、**荷物を運ぶ仕事（配送・トラック）**と**人を乗せる仕事（タクシー・バス）**で必要な免許が変わります。運転できる車の大きさによって、準中型・中型・大型の免許があり、お客さんを乗せて運賃を受け取る仕事には第二種免許が必要です。働き方については、**2024年4月から時間外労働の上限と、拘束時間などの新しい基準**が適用されています。

この記事で分かること：

- 配送・トラック・タクシーの**仕事内容**の違い
- 準中型・中型・大型・第二種の**免許の違い**と受験資格
- **2024年4月から**の時間外労働の上限と改善基準告示
- 応募前に**確認すること**

## ドライバーの仕事にはどんな種類がある？

### 荷物を運ぶ：配送・トラック

厚生労働省の職業情報提供サイト（job tag）では、トラックドライバーの仕事は荷物の種類や運ぶ距離によって変わり、**小型トラックはコンビニ配送や宅配便など近距離**、**大型トラックは都市と都市のあいだなど長距離・大量の輸送**に使われると紹介されています。

1日の流れは、たとえば次のとおりです。

1. 決められた時刻に、荷主（荷物を出す会社）の出荷場所へ行く
2. 伝票と荷物を照らし合わせて、トラックに積み込む
3. 目的地まで運転し、荷物を下ろす
4. 受け取りの確認（サインなど）をもらう

運転だけでなく、**荷物の積み込み・荷下ろし**も仕事に含まれることが多いので、どこまでを担当するかは求人で確認しましょう。

### 人を乗せる：タクシー・バス

job tag では、タクシー運転手を、乗客を目的地まで安全に運び、料金メーターに表示された運賃を受け取る仕事として紹介しています。働くには**普通第二種運転免許**が必要です。勤務の形は、昼の勤務・夜の勤務のほか、大都市では1回の勤務が長い代わりに翌日が休みになる**隔日勤務**の形もあると説明されています。

## 免許の種類と受験資格

運転できる車の大きさは、車両総重量（車と荷物を合わせた重さの上限）などで区切られています。警察庁の資料をもとに整理すると、次のとおりです。

| 免許 | 運転できる車（車両総重量） | 受験資格 |
| --- | --- | --- |
| 普通免許 | 3.5トン未満 | 18歳以上 |
| 準中型免許 | 7.5トン未満（最大積載量4.5トン未満） | 18歳以上 |
| 中型免許 | 11トン未満 | 20歳以上・普通免許などを取って2年以上 |
| 大型免許 | 11トン以上 | 21歳以上・普通免許などを取って3年以上 |
| 第二種免許 | お客さんを乗せて運賃を受け取る運転 | 21歳以上・普通免許などを取って3年以上 |

ポイントは次の3つです。

- **準中型免許は、普通免許を持っていなくても18歳から取れます**。小型〜中くらいのトラックの配送で使われる免許です
- **普通免許は、取った時期によって運転できる範囲が違います**。自分の免許で運転できる車は、免許証の「免許の条件等」の欄で確認しましょう
- **大型・中型・第二種には受験の特例があります**。2022年5月13日から、教習所で決められた特別な教習を受けると、**19歳以上・普通免許などを取って1年以上**で受験できるようになりました

```figure
type: steps
title: 運転できる車が広がる順番
items:
  - label: 普通免許
    text: 18歳以上。3.5トン未満の車
  - label: 準中型免許
    text: 18歳以上。7.5トン未満の車
  - label: 中型免許
    text: 原則20歳以上・2年以上。11トン未満
  - label: 大型免許
    text: 原則21歳以上・3年以上。11トン以上
```

job tag では、トラックドライバーについて、採用のときに免許を持っていなくても、**入社後に準中型・中型・大型の免許を取って働く道がある**と紹介されています。会社が免許の費用を出す制度があるか、取ったあとに一定期間働く決まりがあるかは、会社によって違うので確認しましょう。資格を先に取るべきか迷ったら、[未経験の転職に資格は必要？](/articles/mikeiken-shikaku)も参考になります。

## 2024年4月から、働き方はどう変わった？

ドライバーは長時間労働になりやすいと言われてきた仕事です。**2024年4月から**、トラックなど自動車を運転する仕事にも時間外労働の上限規制が適用され、特別な事情がある場合でも**時間外労働は年960時間まで**になりました。

### 改善基準告示とは

ドライバーには、時間外労働の上限とは別に、「改善基準告示」（自動車運転者の労働時間等の改善のための基準）というルールがあります。厚生労働省の案内では、トラックドライバーについて、2024年4月から次の基準になっています。

| 項目 | 基準 |
| --- | --- |
| 1年の拘束時間 | 原則3,300時間以内（労使協定で3,400時間以内） |
| 1か月の拘束時間 | 原則284時間以内（労使協定で年6か月まで310時間） |
| 1日の休息期間 | 継続11時間以上を基本とし、9時間を下回らない |

**拘束時間**は、仕事を始めてから終わるまでの時間で、運転だけでなく荷物の積み下ろしや荷物を待つ時間、休憩も含みます。**休息期間**は、仕事が終わってから次の仕事を始めるまでの、自由に使える時間のことです。タクシーやバスにも、それぞれ別の基準があります。

これらは法律や基準の上限で、実際の働き方は会社や担当するルートによって違います。求人や面接では、上限の数字よりも「実際にどのくらいか」を聞きましょう。

### 給料のしくみも確認する

job tag では、トラックドライバーの給料はほとんどの会社が月給制である一方、**歩合給や時間外手当の占める割合が比較的大きい**と紹介されています。時間外労働の上限ができたことで、残業代の多さを前提にした給料の見込みは変わりうるので、**基本給・手当・歩合・残業代の内訳**を確かめておくことが大切です。固定残業代がある求人の読み方は、[固定残業代（みなし残業）がある求人の見方](/articles/koteizangyo-kyujin)にまとめています。

## 向いている人・合わないと感じやすい場面

### 向いている人

- 時間を守って、予定どおりに動くのが得意
- ひとりで判断しながら、落ち着いて運転できる
- 道や地図を覚えるのが苦にならない

### 合わないと感じやすい場面

- 荷物の積み下ろしで体を使う仕事が多い
- 渋滞や天候で予定が崩れることがある
- 長距離の仕事では、家に帰れない日がある
- 早朝や夜の時間帯に働く仕事もある

接客の経験がある人は、配送先やお客さんへの**あいさつや受け答え**、**時間を守る意識**が活かせます。面接では、たとえば次のように伝えられます。

> 「コンビニで3年間アルバイトをして、納品の時間に合わせて品出しを終わらせることを意識してきました。配送の仕事でも、時間を守ることと、届け先での気持ちのよいあいさつを大事にしたいと考えています。」（仮の例です）

## 応募前に、確認すること

```figure
type: checklist
title: ドライバーの求人で確認すること
items:
  - 運転する車の大きさと、必要な免許
  - 免許の取得支援があるか、条件はあるか
  - 近距離か長距離か、1日の配送件数の目安
  - 積み込み・荷下ろしを自分でするか
  - 出勤・帰りの時刻と、実際の拘束時間
  - 基本給・手当・歩合・残業代の内訳
  - 雇用契約か、業務委託の契約か
```

特に軽自動車などの配送の求人では、会社に雇われる「雇用」ではなく、個人で仕事を受ける**業務委託**の形もあります。どちらの契約かによって、給料の決まり方や保険の扱いが変わるので、応募する前に確かめましょう。

面接での質問の例です。

- 「1日の出発と帰りの時刻は、だいたい何時くらいですか」
- 「荷物を待つ時間は、1日にどのくらいありますか」
- 「入社後、ひとりで担当するまでに、先輩と同乗する期間はありますか」
- 「中型免許の取得を支援する制度はありますか」

内定をもらったあとは、労働条件通知書で給料の内訳や勤務時間が求人の内容と合っているかを確認します。見方は[内定をもらったら、承諾の前に確認すること](/articles/naitei-shodaku-mae)を参考にしてください。ドライバーの仕事は、運転する車と運ぶもの（荷物か人か）、走る距離で働き方が大きく変わります。自分の免許と、希望する働き方を先に整理してから求人を比べましょう。', 'review', false, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, 'ドライバーの仕事と必要な免許は？働き方の確認点', '未経験からドライバーを考える人へ。配送・トラック・タクシーの仕事の違い、準中型・中型・大型・第二種免許で運転できる車と受験資格、2024年4月からの時間外労働の上限（年960時間）と改善基準告示、求人で確認することを紹介します。', array['mikeiken-shikaku', 'koteizangyo-kyujin', 'naitei-shodaku-mae', 'butsuryu-soko-shigoto', 'seko-kanri-mikeiken']::text[], array['sonota']::text[], array['mikeiken-shokushu', 'kyuryo']::text[], array['hajimete', 'freeter']::text[], array['ドライバーの仕事、', 'どの免許が必要？']::text[], null, false, '[{"q":"普通免許しか持っていなくても、ドライバーの仕事はできますか？","a":"普通免許で運転できる範囲の車（小型の配送車など）を使う仕事なら応募できる求人があります。職業情報提供サイト（job tag）では、トラックドライバーについて、採用のときに免許がなくても入社後に準中型・中型・大型の免許を取って働く道があると紹介されています。普通免許は取った時期によって運転できる範囲が違うので、免許証の「免許の条件等」の欄も確認しましょう。"},{"q":"タクシーの運転手になるには、どんな免許が必要ですか？","a":"お客さんを乗せて運賃を受け取る仕事には、普通第二種免許が必要です。第二種免許の受験資格は原則21歳以上・普通免許などを取ってから3年以上ですが、2022年5月13日からは、特別な教習を受けると19歳以上・1年以上で受験できる特例ができました。入社後に会社の支援で取る形の求人もあるので、求人票で確認しましょう。"},{"q":"2024年4月から、トラックドライバーの働き方は何が変わりましたか？","a":"トラックドライバーなど自動車を運転する仕事にも、時間外労働の上限規制が適用され、特別な事情がある場合でも時間外労働は年960時間までになりました。あわせて、拘束時間（仕事を始めてから終わるまでの時間）や休息期間の基準を定めた「改善基準告示」も見直され、1年の拘束時間は原則3,300時間以内、1か月は原則284時間以内などとされています。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"ドライバーを「荷物を運ぶ（第一種免許）」と「人を運ぶ（第二種免許）」に分け、免許の段階と受験資格を一覧で示す。2024年4月からの上限規制と改善基準告示は数字を正確に引きつつ、求人で何を確かめるか（拘束時間・休息・給与の内訳・雇用か業務委託か）に落とす","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/477","text":"小型トラックはコンビニ配送や宅配便など近距離向け、大型トラックは都市間など長距離・大量輸送向け。指定時刻に荷主の出荷場所へ行き、伝票と荷物を照合して積み込み、目的地で荷下ろしして受領確認を取る。採用時に免許を持っていなくても、入社後に準中型、中型、大型免許を取得して働くことができる。給料はほとんどの会社が月給制だが、歩合給や時間外手当の占める割合が比較的大きい（job tag へ直接接続できなかったため、検索結果に表示されたページ内容で確認）","used_in":"ドライバーの仕事にはどんな種類がある？ / 給料のしくみ"},{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/188","text":"乗客を希望する目的地まで安全に輸送し、料金メーターに表示された運賃を受け取る。普通第二種運転免許が必要。勤務形態は昼夜の勤務のほか、大都市では隔日勤務制をとるケースもある（検索結果で確認）","used_in":"ドライバーの仕事にはどんな種類がある？"},{"source_url":"https://www.npa.go.jp/koutsuu/menkyo/kaisei_doukouhou/leaflet_B.pdf","text":"普通免許は車両総重量3.5トン未満・18歳以上。準中型免許は車両総重量7.5トン未満（最大積載量4.5トン未満）・18歳以上で普通免許がなくても取得できる。中型免許は車両総重量11トン未満・20歳以上かつ普通免許等保有2年以上。大型免許は車両総重量11トン以上・21歳以上かつ保有3年以上（PDF へ直接接続できなかったため、検索結果に表示された警察庁資料の内容で確認。準中型の重量は同じく警察庁の「準中型免許で運転できる自動車」の資料の検索結果でも確認）","used_in":"免許の種類と受験資格"},{"source_url":"https://www.npa.go.jp/bureau/traffic/jyuken_tokurei.html","text":"第二種免許・大型免許の受験資格（21歳以上かつ普通免許等保有3年以上）及び中型免許の受験資格（20歳以上かつ普通免許等保有2年以上）を、一定の教習を修了した方は19歳以上かつ普通免許等保有1年以上に引き下げる特例。2022年5月13日施行（検索結果で確認）","used_in":"免許の種類と受験資格"},{"source_url":"https://driver-roudou-jikan.mhlw.go.jp/truck/notice","text":"2024年4月から時間外労働の上限（年960時間）がトラック運転者にも適用。改正改善基準告示では、1年の拘束時間は原則3,300時間以内（労使協定により3,400時間以内）、1か月は原則284時間以内（労使協定により年6か月まで310時間）。1日の休息期間は継続11時間以上与えるよう努めることを基本とし、9時間を下回らない（検索結果で確認）","used_in":"2024年4月から、働き方はどう変わった？"}],"not_used":["ドライバーの平均年収・労働時間の数字は、job tag のページを直接開いて確認できなかったため書かない","2017年3月より前に取得した普通免許で運転できる範囲（車両総重量の上限）は、一次情報の該当箇所を確認しきれなかったため数字を書かず、免許証の条件欄の確認をすすめるにとどめた","タクシー・バスの改善基準告示の具体的な数字はトラックと異なり、記事が長くなるため扱わず、「別に基準がある」とした","軽貨物の業務委託（個人事業主）の契約上の注意点は、法令の一次情報を確認していないため、雇用か業務委託かを確認する項目にとどめた"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'driver-shigoto' and c.slug = 'shokushu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'driver-shigoto' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'トラックドライバー - 職業詳細（職業情報提供サイト job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/477', '2026-10-09'::date, '小型トラックはコンビニ配送や宅配便など近距離、大型トラックは長距離・大量輸送に使われること、伝票と荷物の照合・積み込み・荷下ろし・受領確認の流れ、入社後に準中型・中型・大型の免許を取って働く道があること、歩合給や時間外手当の占める割合が比較的大きいこと', 0 from articles where slug = 'driver-shigoto';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'タクシー運転手 - 職業詳細（職業情報提供サイト job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/188', '2026-10-09'::date, '乗客を目的地まで安全に運び運賃を受け取る仕事であること、普通第二種運転免許が必要なこと、昼・夜の勤務のほか大都市では隔日勤務の形があること', 1 from articles where slug = 'driver-shigoto';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '免許の区分、受験資格等の改正概要について', '警察庁', 'https://www.npa.go.jp/koutsuu/menkyo/kaisei_doukouhou/leaflet_B.pdf', '2026-10-09'::date, '普通免許（車両総重量3.5トン未満・18歳以上）、準中型免許（車両総重量7.5トン未満・最大積載量4.5トン未満・18歳以上）、中型免許（車両総重量11トン未満・20歳以上で普通免許等の保有2年以上）、大型免許（車両総重量11トン以上・21歳以上で保有3年以上）の区分', 2 from articles where slug = 'driver-shigoto';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '第二種免許等の受験資格の見直しについて', '警察庁', 'https://www.npa.go.jp/bureau/traffic/jyuken_tokurei.html', '2026-10-09'::date, '第二種免許・大型免許の受験資格が原則21歳以上かつ普通免許等の保有3年以上、中型免許が20歳以上かつ2年以上であること、特例教習の修了で19歳以上かつ1年以上に引き下げられること、2022年5月13日施行', 3 from articles where slug = 'driver-shigoto';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'トラック運転者の改善基準告示', '厚生労働省', 'https://driver-roudou-jikan.mhlw.go.jp/truck/notice', '2026-10-09'::date, '2024年4月からトラック運転者に時間外労働の上限（年960時間）が適用されたこと、改善基準告示で1年の拘束時間は原則3,300時間以内（労使協定で3,400時間）、1か月は原則284時間以内（年6か月まで310時間）、休息期間は継続11時間以上を基本とし9時間を下回らないこと', 4 from articles where slug = 'driver-shigoto';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'driver-shigoto' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"ca34f757cee751ecf2e01a3c37aa8bf1374bc30f25d33f50584023745128fdba","findings":[]}'::jsonb from articles where slug = 'driver-shigoto';
update articles set status = 'published' where slug = 'driver-shigoto';

-- article: eigyo-cs-it-support-chigai (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('eigyo-cs-it-support-chigai', 'article', '営業・カスタマーサポート・ITサポートの違いは？仕事内容と向き不向きを比べる', '未経験歓迎の求人で目にすることが多い「営業」「カスタマーサポート」「ITサポート」。人と話す量、パソコン作業、数字の目標という3つの軸で、仕事内容の違いと入社前に確認したいことを整理します。', '未経験歓迎の求人を探していると、「営業」「カスタマーサポート」「ITサポート」という職種をよく目にします。どれも人と関わる仕事ですが、1日の過ごし方や求められることはかなり違います。

この記事では、3つの職種を**人と話す量・パソコン作業・数字の目標**の3つの軸で比べながら、それぞれの仕事内容と、入社前に確認しておきたいことを整理します。

## 3つの職種をざっくり比べる

まずは全体像です。あくまで一般的な傾向で、会社や配属先によって大きく変わる点には注意してください。

| 比べる軸 | 営業 | カスタマーサポート | ITサポート |
| --- | --- | --- | --- |
| 主な相手 | 取引先・見込み客 | 商品やサービスの利用者 | 社内の社員・取引先の担当者 |
| 人と話す量 | 多い（外出・訪問もある） | 多い（電話・メール・チャット） | 中くらい（対面と電話・チャット） |
| パソコン作業 | 中くらい（資料・報告） | 多い（対応記録・検索） | 多い（設定・調査・記録） |
| 数字の目標 | あることが多い（売上・件数） | あることもある（対応件数・満足度） | 少なめ（対応時間などの指標） |

## 営業：相手の困りごとを聞き、提案する仕事

営業は、自社の商品やサービスを取引先に提案し、契約につなげる仕事です。未経験から入りやすい職種の一つで、求人の数も多い傾向があります。

営業と一口に言っても、スタイルは大きく分かれます。

- **新規開拓**: まだ取引のない会社や個人に電話・訪問してアプローチする
- **既存顧客の担当（ルート営業）**: すでに取引のある会社を定期的に訪問し、追加の提案や困りごとの相談にのる
- **反響営業**: 問い合わせをくれた人に対応する

同じ「営業」でも、新規開拓とルート営業では1日の過ごし方も、精神的な負担の種類も違います。求人では、**営業先が新規か既存か**、**個人向けか法人向けか**を必ず確認しましょう。

数字の目標があることが多いのも営業の特徴です。目標の立て方や、達成できなかったときにどうフォローされるかは、面接や面談で聞いておきたいポイントです。

## カスタマーサポート：利用者の疑問や困りごとに応える仕事

カスタマーサポートは、商品やサービスを使っている人からの問い合わせに対応する仕事です。電話・メール・チャットなど、対応する手段は会社によって違います。

仕事の中心は、相手の状況を正確に聞き取り、マニュアルや社内の情報を調べて答えることです。対応内容は記録として残すため、話しながらパソコンに入力する場面も多くあります。

経験を積むと、よくある質問をまとめたり、問い合わせの傾向をほかの部署に伝えて商品の改善につなげたりと、仕事の幅が広がることもあります。

入社前には次の点を確認しておくと安心です。

- 電話・メール・チャットのどれが中心か
- 1日の対応件数の目安と、対応時間の指標があるか
- 難しい問い合わせを相談できる先輩や上司がいるか
- シフト制か固定の勤務時間か

```figure
type: checklist
title: カスタマーサポートで入社前に確認すること
items:
  - 電話・メール・チャットのどれが中心か
  - 1日の対応件数の目安と、対応時間の指標があるか
  - 難しい問い合わせを相談できる先輩や上司がいるか
  - シフト制か固定の勤務時間か
```

## ITサポート：パソコンやシステムの困りごとを解決する仕事

ITサポート（ヘルプデスク）は、社員や取引先から寄せられる「パソコンが動かない」「システムにログインできない」といった困りごとに対応する仕事です。パソコンの設定作業や、アカウントの管理を担当することもあります。

ITの知識は必要ですが、未経験可の求人では入社後に研修やマニュアルで身につける前提のものもあります。大事なのは、知らないことを調べて試す習慣と、相手が何に困っているかを聞き取る力です。

ITサポートでの経験を足がかりに、サーバーやネットワークの管理など、より専門的な仕事へ進む人もいます。将来の広がりを考えるなら、**研修の内容**と**キャリアの道筋**を確認しておきましょう。研修の確認ポイントは[未経験求人で研修について確認すべきこと](/articles/mikeiken-kenshu-kakunin)にまとめています。

## どう選ぶ？迷ったときの考え方

3つの職種で迷ったら、次の問いに答えてみてください。

- 人と話すことと、黙々と作業することのどちらが長く続けやすいか
- 数字の目標があることは、やる気につながるか、負担になるか
- 将来、専門的な知識やスキルを身につけたいか

たとえば「人と話すのは好きだが、目標の数字に追われるのは苦手」なら、カスタマーサポートやルート営業が候補になるかもしれません。「パソコンでの作業が好きで、手に職をつけたい」なら、ITサポートが合う可能性があります。

```figure
type: compare
title: 迷ったときの考え方の例
columns:
  - label: 話すのは好き・数字の目標は苦手
    tone: sky
    items:
      - カスタマーサポート
      - ルート営業
  - label: パソコン作業が好き・手に職
    tone: mint
    items:
      - ITサポート
```

ただし、ここで挙げたのは一般的な傾向です。同じ職種名でも、会社によって仕事の範囲は大きく違います。2024年4月からは、求人や労働契約の際に「業務の変更の範囲」も明示されるようになったので、入社後にどんな仕事に変わる可能性があるかも確認できます。

ほかの職種も含めた比較は[職種比較ページ](/jobs)で、これまでの経験との相性は[条件整理チェック](/check)で整理できます。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['sekkyaku-keiken-ikasu', 'ai-shigoto-mikeiken', 'mikeiken-kenshu-kakunin']::text[], array['eigyo', 'customer-support', 'it-support']::text[], array['mikeiken-shokushu', 'yaritai']::text[], '{}'::text[], array['営業・サポート・IT、', 'どこが違う？']::text[], null, true, '[{"q":"人と話すのが苦手でも、営業はできますか？","a":"営業にもいろいろなスタイルがあり、初対面の人に次々と電話をかける仕事もあれば、決まった取引先と長く付き合う仕事もあります。「話すのが苦手」の中身が、初対面が苦手なのか、断られるのがつらいのかによって、向き不向きは変わります。求人では営業先が新規か既存かを確認しましょう。"},{"q":"ITサポートは、パソコンに詳しくないと応募できませんか？","a":"未経験可の求人では、入社後の研修や先輩の同行で知識を身につける前提のものもあります。ただし、パソコンの基本操作に抵抗がないことや、新しい知識を自分で調べる習慣は求められることが多いです。研修の内容は応募前に確認しておきましょう。"},{"q":"カスタマーサポートとコールセンターは同じ仕事ですか？","a":"重なる部分は多いですが、同じとは限りません。電話の受付が中心の仕事もあれば、メールやチャットでの対応、マニュアル作成、ほかの部署への改善提案まで担当する仕事もあります。求人の仕事内容欄で、対応する手段と範囲を確認しましょう。"}]'::jsonb, null, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'eigyo-cs-it-support-chigai' and c.slug = 'shokushu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'eigyo-cs-it-support-chigai' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業情報提供サイト（job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/', '2026-10-06'::date, '各職種の仕事内容・求められるスキルの確認', 0 from articles where slug = 'eigyo-cs-it-support-chigai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年4月から労働条件明示のルールが変わります', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_32105.html', '2026-10-06'::date, '業務の変更の範囲が明示されるようになった点', 1 from articles where slug = 'eigyo-cs-it-support-chigai';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'eigyo-cs-it-support-chigai' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"2c83f465050bfd8ca6a1d7c0518201d0ee23c22cef967171ecfacdaf7d501bb7","findings":[]}'::jsonb from articles where slug = 'eigyo-cs-it-support-chigai';
update articles set status = 'published' where slug = 'eigyo-cs-it-support-chigai';

-- article: eigyo-jimu-shigoto (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('eigyo-jimu-shigoto', 'article', '営業事務ってどんな仕事？一般事務との違い・1日の流れと、応募前に求人で確認すること', '営業事務は、営業担当の依頼を受けて見積書や受注の入力、取引先からの問い合わせ対応などを行い、営業活動を支える仕事です。一般事務との違い、1日の流れの例、よく使うスキル、未経験で応募する前に求人で確認しておきたいことをまとめました。', '「事務の仕事がしたい」と求人を探していると、「一般事務」と並んで「営業事務」という職種名をよく見かけます。営業と付いているけれど、営業をするのか、事務なのか。迷う人は多いと思います。

先に結論を言うと、営業事務は**営業担当の後ろで、見積書や受注の入力、取引先からの問い合わせ対応などを引き受けて、営業の仕事を支える事務**です。一般事務と比べると、**取引先とのやりとりと、数字や期限を扱う場面が多い**のが特徴です。

この記事で分かること：

- 営業事務の**仕事の中身**と、一般事務との違い
- **1日の流れの例**
- よく使う**スキル**
- 未経験で応募する前に、**求人で確認すること**と面接での質問例

## 営業事務って、どんな仕事？

厚生労働省の職業情報提供サイト（job tag）では、営業事務は「営業担当の指示を受けて資料や見積書を作り、顧客への対応や管理の仕事を通して営業活動を補佐する仕事」と説明されています。別名として「営業アシスタント」「受発注管理事務員」も挙げられています。

主な仕事は次のようなものです。

- 見積書・納品書・請求書などの書類を作る
- 受注（注文）の情報をシステムに入力する
- 取引先からの電話やメールの問い合わせに答える
- 在庫を確認し、足りないときは営業担当と納期を調整する
- 仕入先への発注書を作る
- 契約・売上・入金の状況を管理する

job tag によると、仕事の中身は会社の規模や業種で変わります。営業部全体の契約や売上、入金の管理が中心の職場もあれば、営業担当一人ひとりのサポート（電話・メール対応や書類づくり）が中心の職場もあります。

## 一般事務とは何が違う？

一般事務は、特定の分野に限らず、書類の作成・整理、データ入力、電話の取り次ぎ、来客対応など、会社全体を支える定型的な事務を担当します。営業事務は、そのうち**営業部門の仕事に関わる事務を専門に受け持つ**イメージです。

```figure
type: compare
title: 一般事務と営業事務の違い
columns:
  - label: 一般事務
    tone: sky
    items:
      - 社内のいろいろな部署を支える
      - 書類の整理・データ入力・電話の取り次ぎ
      - やりとりの相手は社内が中心
  - label: 営業事務
    tone: mint
    items:
      - 営業部門を支える
      - 見積書・受注入力・納期の調整
      - 取引先とのやりとりも多い
```

違いをもう少し具体的に言うと、次の2つです。

- **やりとりする相手**：営業事務は、取引先から「この商品はいつ届きますか」「見積もりを出し直してほしい」といった問い合わせを直接受けることが多くなります
- **数字と期限**：見積もりの金額、注文の数量、納期など、間違えると取引先に迷惑がかかる数字を扱います。正確さと、期限を守るための段取りが大切になります

どちらが向いているかは人によります。人と話すのが苦にならず、「頼まれたことを早く正確に返す」のが好きな人は、営業事務も候補に入れてみてください。事務職の種類全体は[未経験で事務職を目指す前に知っておきたいこと](/articles/jimu-mikeiken-mae)で比べています。

## 1日の流れの例

job tag に載っている仕事の例をもとに、営業担当をサポートする職場の1日を組み立てると、次のようになります（時間の配分や順番は職場によって違います）。

```figure
type: steps
title: 営業事務の1日の例
items:
  - label: 朝
    text: メールを確認し、営業担当からの依頼を整理する
  - label: 午前
    text: 見積書を作り、営業担当に確認してもらう
  - label: 昼すぎ
    text: 取引先の問い合わせに答え、在庫と納期を確認する
  - label: 夕方
    text: 受注の情報を入力し、日報をまとめる
```

この流れのあいだに、電話の対応や、急ぎの見積もりの依頼が入ってきます。営業担当が外出しているときは、取引先からの電話を受けて用件をメモし、あとで伝える役割も担います。

> 取引先：「先週お願いした注文、納品日を早められますか？」
> 営業事務：「確認いたします。担当の〇〇が外出しておりますので、在庫を確認したうえで、本日中に〇〇からご連絡いたします。」

このように、**その場で答えられることと、営業担当に確認することを分けて返す**のが、営業事務の日常的なやりとりです。

## よく使うスキル

job tag では、営業事務に求められることとして、ビジネスマナー、相手の要望を正確に聞き取る力、納期や契約のスケジュールの管理、見積書や請求書を扱うためのパソコンの操作が挙げられています。外資系の会社などでは、英語が必要な場合もあります。

これを、ふだんの仕事に置き換えるとこうなります。

| スキル | 仕事での場面の例 |
| --- | --- |
| パソコンの操作 | 表計算ソフトで見積書の金額を計算する、受注を入力する |
| 聞き取る力 | 電話で品名・数量・希望の納期を聞き漏らさずにメモする |
| 段取り | 複数の営業担当からの依頼を、期限の近い順に片づける |
| 言葉づかい | 取引先への電話やメールで、敬語を使って用件を伝える |

接客や販売の仕事をしてきた人は、「お客様の話を聞いて、確認してから答える」「混んでいるときに優先順位をつける」経験が、そのまま営業事務の電話対応や段取りにつながります。経験の伝え方は[接客経験は転職でどう活かせる？](/articles/sekkyaku-keiken-ikasu)を参考にしてください。パソコンに自信がない人は、[PCが得意じゃなくても、事務職は目指せる？](/articles/pc-nigate-jimu)で練習のしかたを紹介しています。

## 未経験で応募する前に、求人で確認すること

job tag では、営業事務になるのに特別な学歴や資格は必要とされず、入社後に職場で教わりながら社内のシステムや仕事の進め方を覚えていくのが一般的とされています。雇用形態は正社員・契約社員・パートのほか、派遣で働く人もいます。

ただ、同じ「営業事務」でも、求人によって仕事の範囲はかなり違います。応募する前に、次の点を確かめておきましょう。

```figure
type: checklist
title: 営業事務の求人で確認すること
items:
  - 何人の営業担当をサポートするか
  - 取引先との電話・メールはどのくらいあるか
  - 扱う商品やサービスは何か
  - 使うソフト（表計算・受発注システム）
  - 個人の売上目標があるか
  - 雇用形態と、研修・教わり方
```

求人票に書かれていないことは、面接で聞いてみましょう。

> 「1日の仕事のうち、取引先との電話やメールはどのくらいの割合でしょうか。」
> 「最初はどのような仕事から担当し、どなたに教わる形になりますか。」
> 「見積書や受注の入力には、どのようなソフトを使っていますか。」

job tag では、営業事務は一般に残業が少なく、週休2日制が基本とされています。ただし、月末や繁忙期の忙しさ、休日の決まり方は会社ごとに違います。休日や残業の時間は、求人票の記載と、内定後に受け取る労働条件の書面で確かめてください。

## まとめ：営業事務は「営業の仕事を、事務で支える」

- 営業事務は、見積書や受注の入力、取引先からの問い合わせ対応などで営業を支える仕事
- 一般事務との違いは、取引先とのやりとりと、数字や期限を扱う場面が多いこと
- 特別な資格がなくても目指せるが、仕事の範囲は求人ごとに違うので、求人票と面接で確かめる

「人と話すことも、パソコンでの作業も、どちらも少しずつやりたい」という人にとって、営業事務は検討しやすい職種のひとつです。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '営業事務の仕事内容｜一般事務との違いと1日の流れ', '営業事務はどんな仕事？見積書や受注入力、取引先からの問い合わせ対応など仕事の中身と、一般事務との違い、1日の流れの例、使うスキル、未経験で応募する前に求人で確認したいことと面接での質問例を紹介します。', array['jimu-mikeiken-mae', 'pc-nigate-jimu', 'sekkyaku-keiken-ikasu', 'keiri-mikeiken', 'mikeiken-shikaku']::text[], array['jimu', 'eigyo']::text[], array['office', 'mikeiken-shokushu']::text[], array['sekkyaku', 'pc-mikeiken']::text[], array['営業事務って、', '一般事務と何が違う？']::text[], null, false, '[{"q":"営業事務は、営業のノルマがありますか？","a":"営業事務は営業担当を支える仕事で、job tag（厚生労働省の職業情報提供サイト）でも、見積書の作成や受注の入力、問い合わせ対応などが仕事の中心とされています。ただ、職場によっては電話での受注や簡単な提案を任されることもあります。不安なときは、面接で「個人の売上目標はありますか」と聞いて確かめましょう。"},{"q":"営業事務と営業アシスタントは違う仕事ですか？","a":"job tag では、営業アシスタントは営業事務の別名として挙げられています。求人では会社ごとに呼び方が違うだけのことも多いので、職種名よりも「仕事内容」の欄に何が書かれているかを見て判断しましょう。"},{"q":"未経験でも営業事務に応募できますか？","a":"job tag では、営業事務になるのに特別な学歴や資格は必要とされず、入社後に職場で教わりながら社内のシステムや仕事の進め方を覚えていくのが一般的とされています。応募条件は求人ごとに違うので、「未経験可」かどうかと、求められるパソコン操作のレベルを確認しましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"営業事務を「営業の後ろで社外とやりとりする事務」と位置づけ、一般事務との違いを「相手（社内か取引先か）」「数字と期限」で見せる。1日の流れは job tag の例をもとに時刻を入れずに示し、求人の読み方と面接での質問例につなげる","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/431","text":"営業担当者の指示を受けて資料や見積書を作成し、顧客対応や管理業務を行って営業活動を補佐する。職場によって、契約・売上・入金の管理など営業全体の管理が中心の場合と、顧客からの電話・メール対応、見積書・納品書の作成など営業担当の直接のサポートが中心の場合がある。仕事の例として、営業担当からのメールの確認、顧客からの問い合わせ対応と在庫の確認、欠品時の納期調整、受注情報の入力と日報の作成、仕入先への発注書・販売先への見積書の作成など。別名に営業アシスタント、受発注管理事務員。（job tag への直接接続ができなかったため、検索結果に表示されたページの内容で確認）","used_in":"営業事務って、どんな仕事？ / 1日の流れの例"},{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/431","text":"特別な学歴や資格は必要とされず、入社後に OJT で社内システムや実務を覚えるのが一般的。ビジネスマナー、顧客の要望を正確に聞き取る力、納期や契約のスケジュール管理、見積書や請求書を扱うためのパソコンのスキルが求められる。外資系などでは英語が必要な場合もある。雇用形態は正社員・契約社員・パートのほか派遣もある。残業は一般に少なく、週休2日制が基本とされる","used_in":"よく使うスキル / 未経験で応募する前に、求人で確認すること"},{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/428","text":"一般事務は特定の分野に限らず定型的な事務を行う。書類の作成・整理、伝票の作成、データ入力、郵便物の仕分け、電話の取り次ぎ、来客対応など。入職にあたって学歴や資格は特に求められず、補助的な業務から経験を積む","used_in":"一般事務とは何が違う？"}],"not_used":["営業事務の平均年収・求人倍率などの数字は、年度で変わり、求人ごとの差も大きいため書かない","「営業事務は女性が多い」という job tag の記述は、読者を属性で分ける書き方になるため使わない","1日の流れの具体的な時刻は出典にないため入れず、「朝・午前・昼すぎ・夕方」の書き方にとどめた","MOS などの資格の評価は会社によって違うため、資格の紹介は最小限にした"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'eigyo-jimu-shigoto' and c.slug = 'shokushu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'eigyo-jimu-shigoto' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '営業事務 - 職業詳細（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/431', '2026-10-09'::date, '営業事務の仕事内容（見積書・納品書の作成、受注情報の入力、在庫確認と納期の調整、契約・売上・入金の管理、問い合わせ対応）、別名（営業アシスタント・受発注管理事務員）、入職に特別な学歴・資格は不要で入社後に覚えていくこと、求められる力、雇用形態や働き方の特徴', 0 from articles where slug = 'eigyo-jimu-shigoto';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '一般事務 - 職業詳細（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/428', '2026-10-09'::date, '一般事務は特定の分野に限らず、書類の作成・整理、伝票、データ入力、電話の取り次ぎ、来客対応など定型的な事務を行うこと（営業事務との違いの説明）', 1 from articles where slug = 'eigyo-jimu-shigoto';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'eigyo-jimu-shigoto' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"522c91468b5a343bfe30255e5b374e3bf39bf0e0af1ea708c82f06ca0fa3c90d","findings":[]}'::jsonb from articles where slug = 'eigyo-jimu-shigoto';
update articles set status = 'published' where slug = 'eigyo-jimu-shigoto';

-- article: eigyo-kowai (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('eigyo-kowai', 'article', '営業が怖い人へ。不安を分けて確認したい仕事内容と面接での質問例', '「ノルマがきつそう」「飛び込みや電話が怖い」。営業と一口に言っても、新規か既存か、会社か個人か、訪問か電話・オンラインかで、仕事の中身は大きく変わります。何が怖いのかを分けて、求人票や面接で確認したいことを質問例つきで紹介します。', '「営業はノルマがきつそう」「知らない人に電話するのが怖い」。営業の仕事に少し興味があっても、そんなイメージで候補から外している人もいると思います。

ただ、営業と一口に言っても、**誰に・どうやって・何を目標に**売るかで、仕事の中身はかなり違います。怖いと感じる理由を分けてみると、「この営業なら大丈夫かも」「これは避けたい」が見えてきます。

## 営業の何が怖い？まずは不安を分けてみる

当てはまるものを、紙やメモに書き写して印をつけてみてください。

- 毎月の数字の目標（ノルマ）に届かなかったらどうしよう
- 知らない会社や家に、いきなり訪問するのが怖い
- 1日に何十件も電話をかけるのがつらそう
- 断られ続けると落ち込みそう
- 成果によって給料が大きく変わるのが不安

印がついたものが、求人票や面接で確認したいポイントです。全部に印がついても大丈夫です。ここから、ひとつずつ確かめ方を紹介します。

## 営業の種類で、中身はかなり違う

厚生労働省の職業情報提供サイト「job tag」の「営業の仕事」では、営業のやり方の違いとして次のようなものが紹介されています。

| 営業のやり方 | 相手 | 特徴 |
| --- | --- | --- |
| 新規開拓営業 | 商品やサービスをまだ知らない相手 | 断られることが多い |
| ルート営業 | すでに取引のある相手 | 同じ相手をくり返し訪ね、信頼関係をつくる |
| 反響営業 | 問い合わせや資料請求をくれた相手 | 相手からの連絡をきっかけに始まる |

さらに、相手が**会社（法人）か個人か**、会いに行くのか、電話やオンラインで話すのか（インサイドセールスと呼ばれることもあります）でも、1日の過ごし方は変わります。相手が個人の場合は、相手の都合に合わせて夜や休日に商談が入ることもあるので、休日の欄も見ておきましょう。

「営業＝飛び込みや電話」というイメージがあるなら、それは営業のやり方のひとつです。求人票の仕事内容に「既存のお客さま中心」「問い合わせへの対応から」などと書かれていないかも見てみてください。

## 不安ごとに、何を確認する？

```figure
type: checklist
title: 不安ごとの確認ポイント
items:
  - ノルマが怖い → 目標の決め方と、届かなかったときのフォロー
  - 飛び込みや電話が怖い → 新規と既存の割合、1日の件数の目安
  - 断られるのが怖い → 先輩の商談に同行する期間
  - 給料が不安 → 固定給とインセンティブの割合
```

**ノルマが怖い**なら、目標の決め方を聞きましょう。個人の目標かチームの目標か、月ごとか、未経験で入った人の最初の目標はどうしているか。目標があること自体より、**届かなかったときにどうフォローしてもらえるか**が大切です。

**飛び込みや電話が怖い**なら、新規と既存のお客さまの割合と、1日の訪問件数や電話の件数の目安を確認します。

**断られるのが怖い**なら、先輩の商談に同行する期間や、断られたあとに一緒に振り返る機会があるかを聞いてみましょう。

**給料が不安**なら、固定給とインセンティブ（成果に応じた手当）の割合を確認します。たとえば、次の2つの求人を比べてみます（数字は説明のための例です）。

| | 求人A | 求人B |
| --- | --- | --- |
| 固定給（月） | 24万円 | 20万円 |
| インセンティブ | 成果に応じて上乗せ | 成果に応じて上乗せ（Aより多め） |
| 成果がなかった月 | 24万円 | 20万円 |

Bは成果が出れば上回ることもありますが、成果がなかった月は4万円の差になります。**固定給だけで毎月の生活費を払えるか**を基準にすると、自分に合うほうを選びやすくなります。

なお、労働基準法第27条では、歩合給（出来高払制）で働く人についても、会社は働いた時間に応じた一定額の賃金を保障しなければならないと定められています。ただ、条文には「いくら保障するか」の具体的な金額は書かれていません。生活の目安にするのは、あくまで求人票に書かれた固定給の額です。

## 面接で聞いておきたい質問

- 営業先は、新規と既存のお客さまでどのくらいの割合ですか
- 未経験で入社した方は、最初の3か月でどのような目標を持つことが多いですか
- 先輩の商談への同行は、どのくらいの期間ありますか
- 給与のうち、固定給とインセンティブはどのくらいの割合ですか
- 目標に届かなかった月は、どのようなフォローがありますか

聞きにくいと感じたら、「早く一人で動けるようになりたいので」と前置きすると、前向きな質問として伝わりやすくなります。

## 接客の経験は、どこにつながる？

常連さんの好みを覚えて商品をすすめていた人は、同じ相手をくり返し訪ねるルート営業に近い動き方をしてきています。来店したお客さまの話を聞いて合う商品を案内していた人は、問い合わせから始まる反響営業に近い経験があると言えます。

```figure
type: compare
title: 接客の経験は、どの営業に近い？
columns:
  - label: 常連さんに商品をすすめた
    tone: sand
    items:
      - 同じ相手をくり返し訪ねる
      - ルート営業に近い動き方
  - label: 来店客に合う商品を案内した
    tone: mint
    items:
      - 問い合わせから始まる
      - 反響営業に近い経験
```

営業の仕事内容や入社前に確認したいことは、[職種比較ページの営業](/jobs#hojin-eigyo)でもまとめています。経験の伝え方は[接客経験は転職でどう活かせる？](/articles/sekkyaku-keiken-ikasu)を参考にしてください。

確かめたうえで「やっぱり営業は合わない」と思ったら、それも大事な判断です。人と話す経験を活かせるほかの仕事は、[営業・カスタマーサポート・ITサポートの違い](/articles/eigyo-cs-it-support-chigai)で比べられます。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['eigyo-cs-it-support-chigai', 'sekkyaku-keiken-ikasu', 'mikeiken-kenshu-kakunin', 'fudousan-eigyo']::text[], array['eigyo']::text[], array['mikeiken-shokushu', 'kyuryo']::text[], array['sekkyaku', 'hajimete']::text[], array['営業って怖い？', '中身を分けて考える。']::text[], null, false, '[{"q":"ノルマがない営業の仕事はありますか？","a":"営業は、売上や契約件数などの目標が置かれていることが多い仕事です。目標があるかどうかより、個人の目標かチームの目標か、未経験で入った人の最初の目標はどう決めるか、届かなかったときにどんなフォローがあるかを確認しておくことが大切です。"},{"q":"インセンティブの割合が高い求人は避けたほうがいいですか？","a":"一概には言えません。労働基準法第27条では、歩合給（出来高払制）で働く人についても、会社は働いた時間に応じた一定額の賃金を保障しなければならないと定められていますが、条文に具体的な金額は書かれていません。成果がなかった月でも固定給だけで生活できるかを、求人票で確認しましょう。"},{"q":"人見知りでも営業の仕事はできますか？","a":"話し上手かどうかより、相手の話を聞いて困りごとを整理する場面も多い仕事です。すでに取引のある相手をくり返し訪ねるルート営業や、問い合わせをくれた相手に案内する反響営業など、営業のやり方ごとに自分に合いそうかを考えてみましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「営業が怖い」を、ノルマ・飛び込み・電話・断られる・給料の振れ幅に分け、営業のやり方の違いと、不安ごとの確認のしかた・質問例を示す。eigyo-cs-it-support-chigai（3職種の比較）とは重ならないよう、営業の中の違いと不安の分解に絞る","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/User/SaleOccupations","text":"新規開拓営業は商品やサービスを知らない相手にも販売するため断られることが多い。ルート営業はすでに取引がある顧客を回り、信頼関係を築いて困りごとを聞き出す。反響営業は問い合わせや資料請求をくれた顧客に対する営業活動。","used_in":"営業の種類で、中身はかなり違う"},{"source_url":"https://laws.e-gov.go.jp/law/322AC0000000049","text":"第27条 出来高払制その他の請負制で使用する労働者については、使用者は、労働時間に応じ一定額の賃金の保障をしなければならない。","used_in":"不安ごとに、何を確認する？"}]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'eigyo-kowai' and c.slug = 'shokushu' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '営業の仕事', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/SaleOccupations', '2026-10-06'::date, '新規開拓営業・ルート営業・反響営業の違い（相手、断られることの多さ、信頼関係づくり）', 0 from articles where slug = 'eigyo-kowai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '労働基準法', 'e-Gov法令検索（デジタル庁）', 'https://laws.e-gov.go.jp/law/322AC0000000049', '2026-10-06'::date, '出来高払制の保障給（第27条）。条文に保障額の具体的な数字がないこと', 1 from articles where slug = 'eigyo-kowai';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'eigyo-kowai' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"306c820e0f8a97ca633209c36c25709e82f1b5604a9acdf24ebe637e259c7b13","findings":[]}'::jsonb from articles where slug = 'eigyo-kowai';
update articles set status = 'published' where slug = 'eigyo-kowai';

-- article: freeter-seishain-hajimeni (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('freeter-seishain-hajimeni', 'article', 'フリーターから正社員を目指すとき、最初に確認したいこと', 'アルバイトから正社員を目指すときは、雇用形態による働き方の違いを知り、アルバイト経験や空白期間をどう伝えるかを整理しておくことが大切です。求人の探し方の使い分けとあわせて紹介します。', 'アルバイトを続けながら「そろそろ正社員として働きたい」と考え始めたとき、何から確認すればいいのか迷う人は多いと思います。

フリーターから正社員を目指す道はひとつではありません。ここでは、最初に確認しておきたい**働き方の違い**、**経験の伝え方**、**求人の探し方**の3つを整理します。

## 正社員とアルバイトの働き方の違い

まず、雇用形態によって何が変わるのかを確認しておきましょう。会社によって制度は違いますが、一般的には次のような違いがあります。

| 項目 | 正社員 | アルバイト・パート |
| --- | --- | --- |
| 契約期間 | 期間の定めがないことが多い | 期間の定めがあることが多い |
| 給与 | 月給制が多い | 時給制が多い |
| 賞与・昇給 | 制度がある会社が多い | 会社による |
| 仕事の範囲 | 担当や役割が広がっていく | 決まった業務が中心になりやすい |
| 異動・転勤 | ある場合がある | 少ないことが多い |

正社員になると、収入が安定しやすく、仕事の範囲が広がっていく一方で、責任や異動の可能性も増えることがあります。2024年4月からは、労働契約を結ぶときに「就業場所・業務の変更の範囲」が明示されるようになったので、入社後に勤務地や仕事内容が変わる可能性も確認できます。

また、契約社員として採用され、その後に正社員を目指す働き方もあります。この場合は、契約期間や更新の上限、正社員への登用の実績も確認しておきましょう。

## アルバイト経験は「中身」で伝える

アルバイトでの経験も、正社員の選考で十分に伝えられる材料になります。ポイントは、「アルバイトをしていました」で終わらせず、**どんな業務を、どのくらいの期間、どう工夫して担当したか**を具体的に伝えることです。

```figure
type: steps
title: アルバイト経験は「中身」で伝える
items:
  - label: どんな業務を
    text: 例：発注と新人教育
  - label: どのくらいの期間
    text: 例：コンビニで3年間
  - label: どう工夫して担当したか
    text: 例：作業のミスを減らすための工夫
```

- 長く続けたアルバイトがあれば、その期間と任されていたこと
- 新人への説明やシフト調整など、ほかの人をサポートした経験
- 売上や作業のミスを減らすために工夫したこと

たとえば「コンビニで3年間、発注と新人教育を担当した」という経験は、数字を扱う仕事や人に教える仕事につながります。経験の分解のしかたは[接客経験は転職でどう活かせる？](/articles/sekkyaku-keiken-ikasu)で詳しく紹介しています。

## 空白期間は「事実 → 今の状態」で伝える

アルバイトをしていない期間や、仕事をしていなかった期間がある場合は、隠さずに事実を簡潔に伝えましょう。説明の順番は次の通りです。

1. その期間に何をしていたか（勉強、家庭の事情、体調を整えていたなど）
2. 今は働く準備ができていること
3. これからどんな仕事をしたいか

```figure
type: equation
title: 空白期間は「事実 → 今の状態」で伝える
terms:
  - その期間に何をしていたか
  - →
  - 今は働く準備ができている
  - →
  - これからどんな仕事をしたいか
```

長い説明はいりません。大切なのは、空白期間そのものよりも「これから」の話につなげることです。

## 求人の探し方を使い分ける

正社員の求人を探す方法はいくつかあり、それぞれ特徴があります。

| 探し方 | 特徴 |
| --- | --- |
| ハローワーク | 地域の求人が多く、窓口で職業相談もできる公的なサービス |
| 求人サイト | 自分のペースで多くの求人を見比べられる |
| 人材紹介会社（転職エージェント） | 担当者が経験や希望を聞いたうえで求人を紹介し、書類・面接の準備や日程調整もサポートする |

どれか一つに絞る必要はありません。自分で探す時間が取りにくい人や、何が自分に合うか分からない人は、人に相談できる方法を組み合わせると進めやすくなります。民間の人材紹介会社を利用するときは、厚生労働省の「人材サービス総合サイト」で、許可を受けた事業者かどうかを確認できます。

## 最初の一歩は「整理」から

正社員を目指すと決めたら、まずは自分の希望条件と経験を整理するところから始めましょう。[未経験転職は何から始める？](/articles/mikeiken-tenshoku-hajimekata)では、最初に整理したい5つのことを紹介しています。

整理したことをもとに、自分の場合はどんな選択肢がありそうかを人に相談してみるのも、遠回りに見えて近道になることがあります。', 'review', true, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['mikeiken-tenshoku-hajimekata', 'sekkyaku-keiken-ikasu', 'agent-mendan-mae', 'hellowork-tsukaikata', 'tenshoku-agent-merit']::text[], '{}'::text[], array['seishain', 'mensetsu']::text[], array['freeter', 'seishain-keiken-sukunai']::text[], array['フリーターから正社員、', '最初に何を確認する？']::text[], null, false, '[{"q":"アルバイト経験しかないと、正社員の書類選考に通らないのでしょうか？","a":"アルバイト経験しかないことだけで判断されるわけではありません。未経験者を対象にした求人では、これまでの経験の中身や、働くことへの姿勢、入社後に学ぶ意欲などもあわせて見られます。担当していた業務を具体的に書くことが大切です。"},{"q":"空白期間があるのですが、どう説明すればいいですか？","a":"空白期間に何をしていたのかを、事実として簡潔に伝えましょう。資格の勉強や家庭の事情など理由はさまざまです。そのうえで「今は働く準備ができていること」「これから何をしたいか」を添えると、前向きに伝わりやすくなります。"}]'::jsonb, null, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'freeter-seishain-hajimeni' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'freeter-seishain-hajimeni' and c.slug = 'keiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年4月から労働条件明示のルールが変わります', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_32105.html', '2026-10-06'::date, '契約期間・更新上限など、雇用形態にかかわる労働条件の明示', 0 from articles where slug = 'freeter-seishain-hajimeni';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ハローワークインターネットサービス', '厚生労働省', 'https://www.hellowork.mhlw.go.jp/', '2026-10-06'::date, '公的な求人検索・職業相談の窓口の紹介', 1 from articles where slug = 'freeter-seishain-hajimeni';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '人材サービス総合サイト（職業紹介事業所検索）', '厚生労働省', 'https://jinzai.hellowork.mhlw.go.jp/JinzaiWeb/GICB101010.do?action=transition&screenId=GICB101010&params=1', '2026-10-06'::date, '民間の職業紹介事業者の許可の確認方法', 2 from articles where slug = 'freeter-seishain-hajimeni';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'freeter-seishain-hajimeni' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"31f52731be4cdbbdcab5ed08608df8c99a3fe191c9e1a820264dc3bbf7430e37","findings":[]}'::jsonb from articles where slug = 'freeter-seishain-hajimeni';
update articles set status = 'published' where slug = 'freeter-seishain-hajimeni';

-- article: fudousan-eigyo (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('fudousan-eigyo', 'article', '不動産営業の仕事内容は？賃貸仲介と売買仲介の違い・宅建士の役割・歩合の給与の確認と接客経験の活かし方', '不動産営業は、住まいや土地を借りたい・買いたい・売りたい人の相談に乗り、取引をまとめる仕事です。賃貸仲介と売買仲介の違い、宅地建物取引士（宅建士）の役割と試験、歩合がある給与の確認のしかた、接客経験の伝え方を紹介します。', '「接客の経験を活かして、もっと給料を上げたい」。そう考えたときに候補に入りやすいのが、不動産営業です。一方で、「歩合って不安定じゃない？」「宅建がないと無理？」と迷う人も多い仕事です。

先に結論を言うと、不動産営業は**住まいや土地を借りたい・買いたい・売りたい人の相談に乗り、取引をまとめる仕事**です。宅地建物取引士（宅建士）の資格は入社の条件ではないことが多く、働きながら目指せます。給与に歩合がある求人では、**固定給と歩合の中身**を応募前に確かめることが大切です。

この記事で分かること：

- 不動産営業の**仕事内容**と、賃貸仲介・売買仲介の違い
- **宅建士**の役割と、試験の受け方
- **歩合がある給与**の確認のしかた
- **接客経験**の活かし方と、面接での伝え方の例

## 不動産営業の仕事内容は？

厚生労働省の職業情報提供サイト（job tag）では、住宅・不動産営業を、住宅や土地の購入・売却・賃貸を考えている人に接し、さまざまな要望に応えながら取引をまとめる仕事として紹介しています。物件を案内し、契約の条件を説明し、書類を準備して、契約までを進めます。

働く会社は、不動産会社のほか、住宅メーカーや建設会社などがあります。新人のうちは新しいお客さまを見つけることから始めることが多く、お客さまからの紹介や広告を見た問い合わせから仕事が広がることもあると、job tag で説明されています。

### 賃貸仲介と売買仲介の違い

仲介（間に入って取引をまとめる仕事）は、大きく賃貸と売買に分かれます。

```figure
type: compare
title: 賃貸仲介と売買仲介の違い
columns:
  - label: 賃貸仲介
    tone: sky
    items:
      - 部屋を借りたい人に物件を紹介する
      - 店舗に来た人の相談から始まることが多い
      - 1件の契約までの期間が比較的短い
  - label: 売買仲介
    tone: sand
    items:
      - 家や土地を売りたい人・買いたい人をつなぐ
      - 住宅ローンや税金の話も関わる
      - 1件の金額が大きく、検討期間が長くなりやすい
```

賃貸仲介の1日は、たとえば次のような流れです。

1. 来店や問い合わせのお客さまから、希望の場所・家賃・広さを聞く
2. 条件に合う物件を探して提案し、内見（部屋の見学）に案内する
3. 申し込みを受けたら、貸主（大家さんや管理会社）と条件を調整する
4. 宅建士が重要事項を説明し、契約の手続きを進める

売買仲介では、売りたい人から物件を預かって買う人を探したり、買いたい人に物件を提案したりします。金額が大きいぶん、お客さまが決めるまでに時間がかかり、住宅ローンなどの手続きの相談にも乗ります。

## 宅建士はどんな位置づけ？

### 宅建士だけができる仕事がある

job tag では、宅建士が取引の条件や代金の支払い方法などの**重要事項を十分に説明したうえで、手続きを進める**と紹介されています。また、不動産の取引をする会社の事務所には、**業務に従事する人5名に1名以上の割合で、専任の宅建士を置く必要がある**とされています。

そのため、宅建士の資格は、入社のときに必須ではなくても、**仕事を進めるうえで有利**な資格として位置づけられています。資格がない間は、宅建士の先輩と組んで、重要事項の説明の部分をお願いする形になります。

### 試験は誰でも受けられる

宅建士の試験を行う不動産適正取引推進機構の案内では、**日本国内に住んでいる人なら、年齢や学歴に関係なく受験できる**とされています。試験は50問の四肢択一式です。合格したあと、宅建士として登録するには一定の条件があるので、試験の案内で確かめておきましょう。

入社前に勉強を始めるか、入社してから仕事と並行して目指すかは、どちらの道もあります。会社によって、受験の費用の補助や、合格したときの資格手当があるかどうかが違うので、求人や面接で確認しましょう。資格を先に取るか迷ったときは、[未経験の転職に資格は必要？](/articles/mikeiken-shikaku)も参考になります。

## 給料はどう決まる？歩合の確認のしかた

job tag では、住宅・不動産営業について、**売上に応じた歩合給が付く場合もある**と紹介されています。歩合給とは、売上や契約件数などの成果に応じて払われる給料のことです。

求人の給与の欄は、たとえば次のような形で書かれます。

> 月給〇〇万円（固定給）＋歩合給（契約件数・売上に応じて支給）（仮の例です）

この形の求人を見るときは、次の点を確かめましょう。

- **固定給はいくらか**：歩合がゼロの月でも受け取れる金額
- **歩合の計算のしかた**：売上の何に対して、どう計算するか。いつの給料に反映されるか
- **固定残業代が含まれているか**：含まれている場合は、何時間分か（見方は[固定残業代（みなし残業）がある求人の見方](/articles/koteizangyo-kyujin)を参照）
- **試用期間中の給与**：入社直後の給与の決まり方が違う場合がある

### 「歩合だけ」の求人で知っておきたいこと

厚生労働省の解説では、会社に雇われて歩合給（出来高払制）で働く人について、労働基準法第27条により、**働いた時間に応じて一定の賃金を保障しなければならない**とされています。また、歩合給にも**最低賃金**が適用されます。

ただし、保障される金額の決まり方は会社によって違います。「売れなかった月はいくらになるか」は、聞きにくくても面接や内定後の条件の確認で確かめておきましょう。

## 休日と働く時間

job tag では、お客さまの都合に合わせて日曜や祝日に訪問したり、物件を案内したりする必要があるため、**労働時間や休日は不規則**になると説明されています。住まいを探す人は、仕事が休みの土日に動くことが多いためです。

平日に休みを取る会社もあれば、決まった曜日を休みにしている会社もあります。土日休みを優先したい場合は、不動産営業のほかの仕事も含めて比べてみましょう。考え方は[「土日休み」を優先すると、どんな仕事がある？](/articles/donichi-yasumi-shigoto)にまとめています。

## 接客経験はどう活かせる？

不動産営業は、お客さまの希望を聞き取り、合うものを提案する仕事です。接客や販売の経験とつながる部分があります。

| 接客・販売でしてきたこと | 不動産営業でつながる場面 |
| --- | --- |
| お客さまの好みを聞いて商品を提案した | 希望の条件を聞き取り、物件を提案する |
| 迷っているお客さまの背中を押さず、比べる材料を出した | 複数の物件の良い点・気になる点を伝える |
| リピーターのお客さまの名前や好みを覚えていた | 入居後や購入後の相談、紹介につなげる |
| 売上目標を意識して働いた | 契約件数や売上の目標に向けて動く |

面接では、たとえば次のように伝えられます。

> 「アパレル販売で、お客さまの話を聞いて、予算と好みに合う服を2〜3点に絞って提案してきました。不動産営業でも、住まいの希望をていねいに聞き取り、比べやすい形で物件を提案したいと考えています。宅建士の試験に向けて、勉強を始めています。」（仮の例です）

営業そのものに不安がある場合は、[営業が怖い人へ](/articles/eigyo-kowai)で、不安を分けて確認する方法を紹介しています。

## 応募前に確認すること

```figure
type: checklist
title: 不動産営業の求人で確認すること
items:
  - 賃貸仲介・売買仲介・新築の販売のどれか
  - 来店のお客さま中心か、こちらから探すか
  - 固定給の金額と、歩合の計算のしかた
  - 固定残業代の有無と、何時間分か
  - 休みの曜日と、月の休日の数
  - 宅建士の受験の支援や資格手当があるか
  - 入社後、先輩と一緒に動く期間
```

面接での質問の例です。

- 「入社1年目の方は、どのような流れで仕事を覚えていますか」
- 「歩合給は、どのような基準で計算されますか」
- 「宅建士の資格を取るための支援はありますか」

不動産営業は、同じ名前でも、扱う物件や給与のしくみ、休みの取り方で働き方が大きく変わる仕事です。求人の言葉だけで判断せず、数字と条件を一つずつ確かめてから応募先を選びましょう。', 'review', false, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '不動産営業の仕事内容は？宅建士と歩合の確認点', '不動産営業を考える人へ。賃貸仲介と売買仲介の仕事の違い、宅地建物取引士だけができる仕事と試験の受け方、歩合給がある求人で確かめたい固定給と保障給、休日の考え方、接客経験の活かし方と面接での伝え方の例を紹介します。', array['eigyo-kowai', 'sekkyaku-keiken-ikasu', 'donichi-yasumi-shigoto', 'shoyo-kyujin-mikata']::text[], array['eigyo']::text[], array['kyuryo', 'mikeiken-shokushu']::text[], array['sekkyaku', 'hajimete']::text[], array['不動産営業、', '歩合ってどうなの？']::text[], null, false, '[{"q":"宅建士の資格がなくても、不動産営業はできますか？","a":"職業情報提供サイト（job tag）では、住宅・不動産営業に入るときに特別な資格は必要ないとしたうえで、宅地建物取引士の資格を取ると仕事を進めるうえで有利だと紹介しています。契約の前の重要事項の説明は宅建士が行う仕事なので、資格がない間は、宅建士の先輩と組んで仕事を進める形になります。"},{"q":"宅建士の試験は、誰でも受けられますか？","a":"試験を行う不動産適正取引推進機構の案内では、日本国内に住んでいる人なら、年齢や学歴に関係なく受験できるとされています。50問の四肢択一式の試験です。合格後に宅建士として登録するには一定の条件があるので、試験の案内で確認しましょう。"},{"q":"歩合給だけの求人は、売れないと給料がゼロになりますか？","a":"会社に雇われて歩合給（出来高払制）で働く場合、労働基準法第27条により、会社は働いた時間に応じて一定の賃金を保障しなければならないとされています。最低賃金も適用されます。求人を見るときは、固定給がいくらで、歩合がどう計算されるかを確認しましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"不動産営業を「賃貸仲介」と「売買仲介」の流れの違いで見せ、宅建士は入社の条件ではなく、働きながら目指す資格として位置づける。歩合の給与は「固定給＋歩合の中身」「保障給」「休日」の3点を求人で確かめる形に落とし、接客経験の伝え方の例をつける","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/Occupation/Detail?occupationId=59","text":"住宅や土地の購入あるいは売却・賃貸を考えている客に接し、様々な要望に応えながら取引をまとめる。宅地建物取引士が取引の条件や代金の支払方法、その他重要事項について十分に説明した上で手続を進める。「宅地建物取引士」（業務に従事する者5名に1名以上の割合で専任の宅地建物取引士を事務所に設置する必要がある）の資格を取得すると仕事を進める上で有利である。顧客の都合に合わせて日曜、祝日に訪問したり現地に案内することが必要なので、労働時間・休日は不規則である。売上に応じた歩合給が付く場合もある（job tag へ直接接続できなかったため、検索結果に表示されたページ内容で確認）","used_in":"不動産営業の仕事内容は？ / 宅建士はどんな位置づけ？ / 休日と働く時間"},{"source_url":"https://www.retio.or.jp/exam/exam_detail/","text":"日本国内に居住する方であれば、年齢、学歴等に関係なく、誰でも受験できる。ただし、合格後、資格登録に当たっては一定の条件（宅建業法第18条）がある。試験は50問・四肢択一式（検索結果で確認）","used_in":"宅建士はどんな位置づけ？"},{"source_url":"https://www.startup-roudou.mhlw.go.jp/qa/zigyonushi/chingin/q14.html","text":"歩合給制は売上高や契約件数などの成果に応じて賃金を支払う制度で、出来高払制とも呼ばれる。労基法27条では、出来高払制で使用する労働者について、労働時間に応じて一定の賃金を保障しなければならないと定めている。出来高払制にも最低賃金法が適用される（検索結果で確認）","used_in":"給料はどう決まる？歩合の確認のしかた"}],"not_used":["job tag の年収・求人賃金の全国平均の数字は、年齢の高い人を含む平均で、未経験から入る人の給与の目安にはならないため書かない","保障給の水準（平均賃金の6割程度など）は通達や解説による目安で、条文に数字の定めがないため書かない","仲介手数料の上限など、お客さま側の制度は読者の最初の疑問から外れるため扱わない","賃貸仲介と売買仲介の割合や、どちらが未経験者に多いかといった統計は確認できなかったので書かない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'fudousan-eigyo' and c.slug = 'shokushu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'fudousan-eigyo' and c.slug = 'keiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '住宅・不動産営業 - 職業詳細（職業情報提供サイト job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/Occupation/Detail?occupationId=59', '2026-10-09'::date, '住宅や土地の売買・賃貸を考える客に接して取引をまとめる仕事であること、物件の案内・契約条件の説明・書類の作成などの仕事、宅建士が重要事項を説明してから手続きを進めること、入職時に資格は不要で宅建士の資格があると有利なこと、事務所には業務に従事する者5名に1名以上の割合で専任の宅建士を置く必要があること、日曜・祝日の対応で労働時間・休日が不規則なこと、歩合給が付く場合があること', 0 from articles where slug = 'fudousan-eigyo';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '宅建試験の概要・受験資格（宅地建物取引士資格試験）', '一般財団法人 不動産適正取引推進機構', 'https://www.retio.or.jp/exam/exam_detail/', '2026-10-09'::date, '日本国内に居住していれば年齢・学歴等に関係なく受験できること、合格後の資格登録には一定の条件があること、50問・四肢択一式の試験であること', 1 from articles where slug = 'fudousan-eigyo';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '歩合給制とはどのような制度ですか？制度の概要や留意点を教えてください。（スタートアップ労働条件）', '厚生労働省', 'https://www.startup-roudou.mhlw.go.jp/qa/zigyonushi/chingin/q14.html', '2026-10-09'::date, '歩合給制は売上や契約件数などの成果に応じて支払う制度であること、労働基準法第27条により労働時間に応じた一定の賃金を保障しなければならないこと、歩合給にも最低賃金が適用されること', 2 from articles where slug = 'fudousan-eigyo';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'fudousan-eigyo' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"9d98abeb46a5f6a85ff37908e58ac962432fad845eb6ca153cb44c56989eadfd","findings":[]}'::jsonb from articles where slug = 'fudousan-eigyo';
update articles set status = 'published' where slug = 'fudousan-eigyo';

-- article: fukuri-kousei-mikata (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('fukuri-kousei-mikata', 'article', '求人の「福利厚生」はどう見る？社会保険と会社独自の制度の違い、住宅手当・交通費・退職金の確かめ方', '求人の福利厚生は、法律で加入が決まっている社会保険（法定福利）と、会社が独自に用意する制度（法定外福利）に分けて読むと分かりやすくなります。「社会保険完備」の意味、住宅手当・交通費・退職金・研修で確かめること、面接での聞き方の例を紹介します。', '求人の「福利厚生」の欄には、「社会保険完備」「交通費支給」「住宅手当あり」「退職金制度あり」「研修制度充実」など、たくさんの言葉が並びます。項目が多いほど良い会社に見えますが、それだけで比べるのは難しいところです。

先に結論を言うと、福利厚生は**2つに分けて読む**と分かりやすくなります。

- **法律で加入が決まっているもの（法定福利）**：健康保険・厚生年金保険・雇用保険・労災保険など。**加入できるか・いつから加入するか**を確かめる
- **会社が独自に用意するもの（法定外福利）**：住宅手当・退職金・研修など。**自分が対象になるか・条件と金額**を確かめる

この記事で分かること：

- 「社会保険完備」の意味と、求人票で見るところ
- 住宅手当・交通費・退職金・研修で**確かめること**
- 面接や書面での**確認のしかた**

## 法律で決まっている福利厚生（法定福利）

### 社会保険の4つ

一般に「社会保険完備」と書かれているときは、次の4つに加入できることを指して使われています。

| 保険 | どんなときに役立つか |
| --- | --- |
| 健康保険 | 病院にかかったとき、病気やけがで休んだときなど |
| 厚生年金保険 | 老後や、障害が残ったときなどの年金 |
| 雇用保険 | 仕事を辞めたときの失業手当、職業訓練の給付など |
| 労災保険 | 仕事中や通勤中のけが・病気 |

求人の募集では、**健康保険・厚生年金・労災保険・雇用保険の適用**に関することを示すことになっています。ハローワークの求人票なら「加入保険等」の欄、求人サイトなら「待遇・福利厚生」の欄などに書かれていることが多いです。

日本年金機構によると、株式会社などの**法人の事業所**は、健康保険・厚生年金保険の適用事業所です。また、パートやアルバイトでも、1週間の所定労働時間と1か月の所定労働日数が、同じ職場で同じような仕事をしている通常の働く人の**4分の3以上**であれば、加入の対象になります。

### 確かめたいこと

社会保険は「あるかないか」より、**いつから入れるか**を確かめておきたいところです。

- 入社日から加入するか
- 試用期間中も加入するか
- 求人票と労働条件通知書で、加入する保険が同じか

試用期間中の社会保険の扱いは、[試用期間って何？](/articles/shiyou-kikan)で詳しく紹介しています。

アルバイトや派遣から正社員になると、給料から健康保険料や厚生年金保険料が引かれるようになり、額面と手取りの差が大きくなることがあります。手取りで比べる考え方は、[手取り20万円から転職を考えるとき、何を比べればいい？](/articles/tedori-20man-hikaku)を参考にしてください。

## 会社が独自に用意する福利厚生（法定外福利）

ここから先は、**会社によって、あるかどうかも中身も違う**ものです。求人に書いてあっても、自分が対象になるか、条件は何かを確かめましょう。

```figure
type: compare
title: 福利厚生は2つに分けて読む
columns:
  - label: 法定福利
    tone: sky
    items:
      - 健康保険・厚生年金保険
      - 雇用保険・労災保険
      - 加入の有無と時期を確かめる
  - label: 法定外福利
    tone: sand
    items:
      - 住宅手当・退職金・研修など
      - 会社によって中身が違う
      - 対象・条件・金額を確かめる
```

### 住宅手当・家賃補助・社宅

- **対象**：賃貸だけか、持ち家でも出るか。世帯主だけか
- **条件**：会社から一定の距離に住むこと、などの決まりがあるか
- **金額**：月給に含まれているのか、月給とは別に出るのか

求人の「月給」に住宅手当が含まれている場合、対象にならないと月給がその分少なくなることがあります。月給の内訳も見ておきましょう。

### 交通費（通勤手当）

- 「全額支給」か「上限あり」か。上限があるなら、いくらまでか
- 「規定により支給」とだけある場合は、規定の中身を確認する
- 定期代として出るのか、出社した日数分の実費か

### 退職金

退職金は、**すべての会社にあるわけではありません**。会社が退職金の制度を設ける場合は、対象になる人の範囲や計算のしかたなどを**就業規則**に定めることになっています（労働基準法第89条）。

- 何年以上働くと対象になるか
- 自己都合で辞めた場合の扱い
- 会社独自の制度か、外部の制度を使っているか

中小企業では、国の制度である**中小企業退職金共済（中退共）**を使って退職金を用意している会社もあります。中退共は、退職金制度を自社だけで持つのが難しい中小企業のための制度で、掛金は全額会社が負担し、退職するときは中退共から本人に直接支払われます。

### 研修・資格取得の支援

- 入社後の研修の期間と内容
- 資格の受験料や講座の費用を会社が出してくれるか（全額か一部か、合格したときだけか）

未経験の仕事に入るときは、とくに大事な項目です。研修の中身の確かめ方は、[未経験求人の「研修あり」で確認すべきこと](/articles/mikeiken-kenshu-kakunin)にまとめています。

### そのほかの制度

特別休暇（夏季休暇・慶弔休暇など）、社員食堂や食事の補助、健康づくりの補助、福利厚生サービスの会員制度など、会社によってさまざまです。**使う人がどのくらいいるか**、**自分の働き方でも使えるか**（店舗勤務でも使えるか、など）を聞いてみると、実際の役立ち方が分かります。

## どうやって確かめる？

```figure
type: checklist
title: 福利厚生で確かめたいこと
items:
  - 社会保険は入社日から加入か
  - 住宅手当の対象と金額
  - 交通費の上限と支給のしかた
  - 退職金は何年以上で対象か
  - 研修や資格の費用の扱い
  - 求人票と労働条件通知書が同じか
```

### 面接・内定後の質問の例

- 「住宅手当について、対象になる条件を教えていただけますか」
- 「交通費は、上限や支給方法の決まりがありますか」
- 「退職金制度は、何年目から対象になりますか」
- 「入社後に資格を取る場合、費用の補助はありますか」

条件のことばかり質問すると気が引ける場合は、最終面接や内定後の条件確認の場でまとめて聞く方法もあります。

### 書面で確かめる

内定後は、労働条件通知書（雇用契約書）で、社会保険の加入と、手当・退職金などの扱いを確認します。書面に書かれていない制度は、**就業規則**や賃金規程で決まっていることが多いので、「入社前に就業規則を見せていただくことはできますか」と聞いてみるのも方法の一つです。

## まとめ

- 福利厚生は「法定福利（社会保険）」と「法定外福利（会社独自の制度）」に分けて読む
- 社会保険は、加入できるかに加えて、いつから加入するかを確かめる
- 住宅手当・交通費・退職金・研修は、対象・条件・金額を確かめる
- 項目の多さより、自分が実際に使えるかどうかで比べる', 'review', false, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '求人の福利厚生の見方｜社会保険と住宅手当・退職金', '求人の福利厚生欄はどこを見ればいい？法定福利（健康保険・厚生年金・雇用保険・労災保険）と会社独自の制度の違い、「社会保険完備」の意味、住宅手当・交通費・退職金・研修で確かめること、面接や書面での確認のしかたを紹介します。', array['tedori-20man-hikaku', 'shiyou-kikan', 'mikeiken-kenshu-kakunin', 'shoyo-kyujin-mikata', 'taishokukin-kakunin']::text[], '{}'::text[], array['kyuryo']::text[], array['hajimete', 'freeter']::text[], array['福利厚生の欄、', 'どこを見ればいい？']::text[], null, false, '[{"q":"求人に「社会保険完備」とあるのは、どういう意味ですか？","a":"一般には、健康保険・厚生年金保険・雇用保険・労災保険に加入できることを指して使われています。求人では、これらの保険の適用に関することを示すことになっているので、求人票の「加入保険等」の欄も見ておきましょう。加入する時期（入社日からか、試用期間中も加入するか）も確かめておくと安心です。"},{"q":"退職金は、どの会社にもあるものですか？","a":"すべての会社にあるわけではありません。退職金は、会社が制度を設けている場合に、就業規則にルールを定めるものです。中小企業では、国の制度である中小企業退職金共済（中退共）を使って退職金を用意している会社もあります。求人に「退職金あり」とあれば、何年以上働くと対象になるかを確かめましょう。"},{"q":"住宅手当は誰でももらえますか？","a":"会社によって条件が違います。賃貸に住んでいる人だけ、世帯主だけ、会社から一定の距離に住んでいる人だけ、などの条件を決めていることがあります。求人に「住宅手当あり」とあっても、自分が対象になるか、いくら出るかは面接や内定後の条件確認で聞いておきましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"福利厚生欄を「法律で決まっているもの」と「会社が独自に用意するもの」に分け、前者は加入の有無と時期、後者は対象・条件・金額を確かめる、という読み方を示す。項目の多さより、自分が使えるかで見る","quotes":[{"source_url":"https://www.check-roudou.mhlw.go.jp/study/roudousya_roudoujouken.html","text":"ハローワークへ求人を申し込む場合や、求人情報誌・ホームページで募集する場合、会社は労働時間や賃金などを明示する義務を負う（職業安定法第5条の3）。健康保険、厚生年金、労働者災害補償保険及び雇用保険の適用に関する事項も、募集時に明示すべき事項に含まれる（直接接続できなかったため、検索結果に表示された記述で確認）","used_in":"法律で決まっている福利厚生（法定福利）"},{"source_url":"https://www.nenkin.go.jp/service/kounen/tekiyo/jigyosho/20150518.html","text":"株式会社などの法人の事業所（事業主のみの場合を含む）は適用事業所となる。適用事業所に常用的に使用される70歳未満の方は被保険者となる。パートタイマー・アルバイト等でも、1週間の所定労働時間および1か月の所定労働日数が、同じ事業所で同様の業務に従事している通常の労働者の4分の3以上である場合は被保険者となる（直接接続できなかったため、検索結果に表示された記述で確認）","used_in":"法律で決まっている福利厚生（法定福利）"},{"source_url":"https://www.mhlw.go.jp/bunya/roudoukijun/taisilyokukin_kyousai/ippanchuutai/","text":"中小企業退職金共済制度は、単独では退職金制度を設けることが難しい中小企業について、事業主の相互共済の仕組みと国の援助によって退職金制度を確立するもの。掛金は全額事業主負担で、退職時は中退共から従業員に直接支払われる（直接接続できなかったため、検索結果に表示された記述で確認）","used_in":"退職金"},{"source_url":"https://laws.e-gov.go.jp/law/322AC0000000049","text":"第八十九条第三号の二：退職手当の定めをする場合においては、適用される労働者の範囲、退職手当の決定、計算及び支払の方法並びに退職手当の支払の時期に関する事項（e-Gov への直接接続ができなかったため、検索結果に表示された条文の解説で確認）","used_in":"退職金"}],"not_used":["法定外福利費の平均額や、住宅手当・退職金がある会社の割合などの統計は、調査年で変わるため書かない","短時間労働者の社会保険の適用拡大（企業規模要件の段階的な引き下げ）は、この記事の読者（正社員の求人を見る人）には細かすぎるため扱わない","通勤手当の非課税限度額は、記事の目的（求人の読み方）から外れるため扱わない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'fukuri-kousei-mikata' and c.slug = 'hatarakikata' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'fukuri-kousei-mikata' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '労働条件の明示（しっかり学ぼう！働くときの基礎知識｜確かめよう労働条件）', '厚生労働省', 'https://www.check-roudou.mhlw.go.jp/study/roudousya_roudoujouken.html', '2026-10-09'::date, '求人の募集時に、健康保険・厚生年金・労災保険・雇用保険の適用に関する事項を明示することになっていること', 0 from articles where slug = 'fukuri-kousei-mikata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '適用事業所と被保険者', '日本年金機構', 'https://www.nenkin.go.jp/service/kounen/tekiyo/jigyosho/20150518.html', '2026-10-09'::date, '法人の事業所は健康保険・厚生年金保険の適用事業所となること。パート・アルバイトでも、所定労働時間・日数が通常の労働者の4分の3以上なら被保険者になること', 1 from articles where slug = 'fukuri-kousei-mikata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '一般の中小企業退職金共済制度のしくみ', '厚生労働省', 'https://www.mhlw.go.jp/bunya/roudoukijun/taisilyokukin_kyousai/ippanchuutai/', '2026-10-09'::date, '中退共は、単独で退職金制度を持つことが難しい中小企業のための国の退職金制度で、掛金は全額事業主が負担すること', 2 from articles where slug = 'fukuri-kousei-mikata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '労働基準法（昭和二十二年法律第四十九号）第八十九条', 'e-Gov法令検索（デジタル庁）', 'https://laws.e-gov.go.jp/law/322AC0000000049', '2026-10-09'::date, '退職手当の定めをする場合は、対象者の範囲や計算・支払いの方法などを就業規則に記載すること', 3 from articles where slug = 'fukuri-kousei-mikata';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'fukuri-kousei-mikata' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"064c7d6475416de98b9c650eee7ae95650dff5ba75e328653c3975829a958be6","findings":[]}'::jsonb from articles where slug = 'fukuri-kousei-mikata';
update articles set status = 'published' where slug = 'fukuri-kousei-mikata';

-- article: gentei-seishain (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('gentei-seishain', 'article', '限定正社員（勤務地・職務・短時間）とは？普通の正社員との違いと、応募前に確認すること', '限定正社員（多様な正社員）は、期間の定めのない正社員でありながら、勤務地・仕事の内容・勤務時間のどれかが限られている働き方です。厚生労働省の資料をもとに、3つの種類、普通の正社員や契約社員との違い、給料や転換制度など応募前に確認することを紹介します。', '「正社員になりたい。でも転勤はできない」「決まった仕事だけを続けたい」「フルタイムは難しい」。そんな希望があるときに、選択肢の一つになるのが**限定正社員**です。

先に結論を言うと、限定正社員は、**期間の定めのない正社員でありながら、勤務地・仕事の内容・勤務時間のどれかが限られている働き方**です。厚生労働省は「多様な正社員」と呼んでいます。ただし、給料や昇進、普通の正社員に変われるかどうかは会社によって違うので、**何が限られていて、何が普通の正社員と違うのか**を書面で確かめることが大事です。

この記事で分かること：

- 限定正社員の**3つの種類**
- 普通の正社員・契約社員との**違い**
- 求人での**見分け方**
- 応募前に**確認すること**と質問例

## 限定正社員の3つの種類

厚生労働省の資料では、多様な正社員を、主に次の3つに分けて説明しています。

| 種類 | どんな働き方か |
| --- | --- |
| 勤務地限定正社員 | 転勤するエリアが限られている、引っ越しを伴う転勤がない、または転勤がまったくない |
| 職務限定正社員 | 担当する仕事の内容や範囲が、ほかの仕事とはっきり分けて限られている |
| 勤務時間限定正社員 | 所定労働時間がフルタイムではない、または残業が免除されている |

求人では、「地域限定正社員」「エリア職」「勤務地限定社員」「職種限定」「短時間正社員」など、会社ごとにいろいろな呼び方がされています。勤務地と仕事の内容の両方を限定するなど、組み合わせている会社もあります。

## 普通の正社員・契約社員とどう違う？

いちばん大事なのは、限定正社員は**雇用の期間に定めがない**という点です。そのうえで、普通の正社員が「会社の決めた場所・仕事・時間で働く」前提なのに対して、限定正社員はそのどれかが限られています。

```figure
type: compare
title: 普通の正社員と限定正社員
columns:
  - label: 普通の正社員
    tone: sky
    items:
      - 雇用の期間の定めなし
      - 転勤や仕事の変更がありうる
      - フルタイムで働く
  - label: 限定正社員
    tone: mint
    items:
      - 雇用の期間の定めなし
      - 勤務地・仕事・時間のどれかが限定
      - 給料や昇進の扱いは会社による
```

契約社員は、多くの場合「1年」など契約の期間が決まっていて、更新しながら働きます。勤務地が決まっている、という点では似ていても、期間の定めがあるかどうかで立場が違います。契約社員と正社員の違いや、契約社員から期間の定めのない雇用に変わる「無期転換ルール」は、[契約社員と正社員は何が違う？](/articles/muki-tenkan-keiyaku)で紹介しています。

### 限定正社員のよいところ・気をつけたいところ

- **よいところ**：転勤なしで暮らしを変えずに働ける、慣れた仕事を続けられる、家庭の事情に合わせて時間を短くできる、など
- **気をつけたいところ**：会社によっては、普通の正社員より給料や賞与が低めに決められていたり、昇進できる役職に上限があったりする

厚生労働省の有識者懇談会の報告書（2014年7月）では、限定正社員と普通の正社員の**処遇のバランス**をとることが望ましいとされています。たとえば、勤務地限定でも仕事の内容が普通の正社員と同じなら、賃金の差を小さくすることが望ましい、という考え方です。とはいえ、実際の決め方は会社によって違うので、確認が必要です。

## 求人での見分け方

2024年4月から、求人の段階で**就業場所の変更の範囲**と**業務の変更の範囲**が示されるようになりました。限定正社員かどうかは、ここを見ると読み取りやすくなります。

たとえば、次のように読めます。

- 就業場所の変更の範囲が「〇〇県内の店舗」→ 勤務地が県内に限られている
- 業務の変更の範囲が「雇入れ直後の業務と同じ」→ 仕事の内容が限られている
- 所定労働時間が「1日〇時間」で、ほかの正社員より短い → 勤務時間が限られている

労働条件通知書の見方は、[内定をもらったら、承諾の前に確認すること](/articles/naitei-shodaku-mae)にまとめています。

## 応募前に確認すること

報告書では、限定の内容を**書面ではっきりさせる**ことが、あとのトラブルを防ぐことにつながるとされています。また、その限定が**当面のものか、将来にわたるものか**も明らかにすることが望ましいとされています。

```figure
type: checklist
title: 限定正社員で確認したいこと
items:
  - 何が限定されているか（場所・仕事・時間）
  - 限定は当面だけか、ずっとか
  - 給料・賞与・昇進の、普通の正社員との差
  - 普通の正社員に変われる制度があるか
  - 事業所が閉鎖されたときの扱い
  - 限定の内容が書面に書かれているか
```

### 普通の正社員に変われる？

報告書では、限定正社員と普通の正社員のあいだで**行き来できる転換制度**を設けることが望ましいとされています。たとえば、子育てのあいだは短時間正社員で働き、その後フルタイムに戻る、といった使い方です。制度があるか、実際に使った人がいるかを聞いておくと、将来の働き方を考えやすくなります。

### 事業所がなくなったら？

勤務地限定の場合、「働いている店舗や事業所がなくなったらどうなるの？」と心配になるかもしれません。厚生労働省の通知では、勤務地や仕事が限定されていても、**事業所の閉鎖や仕事の廃止があっただけで、直ちに解雇が認められるわけではない**とされ、配置転換など解雇を避ける努力が求められると整理されています。ただ、会社によって対応は違うので、気になる場合は面接で聞いておきましょう。

## 面接での質問の例

- 「勤務地限定の場合、異動はどの範囲までありますか」
- 「限定正社員と、全国転勤のある正社員とでは、給料や賞与の決め方に違いはありますか」
- 「入社後に、限定のない正社員コースへ変わることはできますか。実際に変わった方はいらっしゃいますか」
- 「短時間正社員の場合、賞与や昇給、退職金はフルタイムの方と同じ制度が使えますか」

伝え方の例：

> 「家族の事情で、当面は〇〇（地域）を離れずに働きたいと考えています。勤務地を限定した働き方で、長く働きながら仕事の幅を広げていきたいです。」

アルバイトやフリーターから正社員を目指すときの全体の進め方は[フリーターから正社員を目指すとき、最初に確認したいこと](/articles/freeter-seishain-hajimeni)、店舗で働く正社員の場合は[販売・接客の仕事で正社員を目指すという選択](/articles/hanbai-seishain)も参考になります。

## まとめ

- 限定正社員は、期間の定めのない正社員で、勤務地・仕事・勤務時間のどれかが限られている
- 呼び方は会社によっていろいろ。求人の「変更の範囲」や所定労働時間で読み取る
- 給料・昇進・転換制度・事業所閉鎖時の扱いは会社によって違う
- 限定の内容が当面のものか将来にわたるものか、書面で確かめる', 'review', false, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '限定正社員とは？勤務地・職務・短時間の違いと確認点', '勤務地限定・職務限定・勤務時間限定の「限定正社員（多様な正社員）」とは？厚生労働省の資料をもとに、普通の正社員や契約社員との違い、求人での見分け方、給料・昇進・転換制度など応募前に確認すること、面接での質問例を紹介します。', array['muki-tenkan-keiyaku', 'freeter-seishain-hajimeni', 'hanbai-seishain', 'tenkin-kinmuchi-kakunin']::text[], '{}'::text[], array['seishain']::text[], array['freeter', 'haken', 'seishain-keiken-sukunai']::text[], array['転勤なしの正社員、', '普通の正社員と違う？']::text[], null, false, '[{"q":"限定正社員は、契約社員と何が違いますか？","a":"大きな違いは、雇用の期間に定めがあるかどうかです。限定正社員は期間の定めのない雇用で、勤務地や仕事の内容、勤務時間のどれかが限られています。契約社員は、多くの場合「1年」など契約の期間が決まっていて、更新しながら働きます。求人や労働条件通知書の「契約期間」の欄で確かめましょう。"},{"q":"勤務地限定の正社員は、働いている事業所がなくなったら解雇されますか？","a":"厚生労働省の通知では、勤務地や職務が限定されていても、事業所の閉鎖や職務の廃止があっただけで直ちに解雇が認められるわけではなく、配置転換など解雇を避ける努力が求められると整理されています。とはいえ、会社によって対応は違うので、気になる場合は事業所が閉鎖されたときの扱いを面接で確認しておくと安心です。"},{"q":"限定正社員から、普通の正社員に変わることはできますか？","a":"会社によって違います。限定正社員と普通の正社員のあいだで行き来できる転換制度を設けている会社もあれば、ない会社もあります。厚生労働省の資料では、転換制度を設けることが望ましいとされています。入社前に、転換の制度があるか、実際に使った人がいるかを聞いておきましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「転勤なしの正社員」「短時間の正社員」を探す読者に向けて、限定正社員を「無期雇用＋何かが限られている」と一言で示し、契約社員との違い、処遇・転換・事業所閉鎖時の扱いなど会社で違う点を確認項目にする","quotes":[{"source_url":"https://part-tanjikan.mhlw.go.jp/tayou/pdf/pamphlet.pdf","text":"勤務地限定正社員は、転勤するエリアが限定されていたり、転居を伴う転勤がなかったり、あるいは転勤が一切ない正社員。職務限定正社員は、担当する職務内容や仕事の範囲が他の業務と明確に区別され、限定されている正社員。勤務時間限定正社員は、所定労働時間がフルタイムではない、あるいは残業が免除されている正社員（直接接続できなかったため、検索結果に表示された記述で確認）","used_in":"限定正社員の3つの種類"},{"source_url":"https://www.mhlw.go.jp/file/05-Shingikai-11201000-Roudoukijunkyoku-Soumuka/0000052523.pdf","text":"限定の内容を書面で明示することが紛争の未然防止につながり、限定が当面のものか将来にわたるものかも明らかにすることが望ましい。いわゆる正社員との処遇の均衡（勤務地限定で職務がいわゆる正社員と同じ場合は賃金差を小さくするなど）や、相互の転換制度が望ましい（直接接続できなかったため、検索結果に表示された記述で確認）","used_in":"応募前に確認すること"},{"source_url":"https://www.mhlw.go.jp/web/t_doc?dataId=00tc0305&dataType=1&pageNo=2","text":"勤務地や職務が限定されていても、事業所の閉鎖や職務の廃止だけで直ちに解雇が有効になるわけではなく、配置転換などの解雇回避の努力が求められる。限定の程度によって求められる努力の程度は変わる（直接接続できなかったため、検索結果に表示された記述で確認）","used_in":"事業所がなくなったら？"},{"source_url":"https://www.mhlw.go.jp/content/001114167.pdf","text":"2024年4月から、募集広告や職業紹介を受ける際に、求人企業などから明示される労働条件が追加される（従事すべき業務の変更の範囲、就業場所の変更の範囲など）（直接接続できなかったため、検索結果に表示された資料の題名と記述で確認）","used_in":"求人での見分け方"}],"not_used":["限定正社員を導入している企業の割合や、いわゆる正社員との賃金差の数字は、調査で違い年によって変わるため書かない","解雇の有効性に関する裁判例は、個別の事情で判断が変わるため紹介しない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'gentei-seishain' and c.slug = 'hatarakikata' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'gentei-seishain' and c.slug = 'seido' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '「多様な正社員」制度（職務・勤務地・時間を限定した多様な正社員）パンフレット', '厚生労働省', 'https://part-tanjikan.mhlw.go.jp/tayou/pdf/pamphlet.pdf', '2026-10-09'::date, '勤務地限定正社員・職務限定正社員・勤務時間限定正社員の3つの種類の説明', 0 from articles where slug = 'gentei-seishain';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '「多様な正社員」の普及・拡大のための有識者懇談会 報告書（2014年7月）', '厚生労働省', 'https://www.mhlw.go.jp/file/05-Shingikai-11201000-Roudoukijunkyoku-Soumuka/0000052523.pdf', '2026-10-09'::date, '限定の内容を書面で明示し、限定が当面のものか将来にわたるものかも明らかにすることが望ましいこと。処遇の均衡、いわゆる正社員との転換制度が望ましいとされていること', 1 from articles where slug = 'gentei-seishain';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '多様な正社員に係る「雇用管理上の留意事項」等について（平成26年7月30日基発0730第1号）', '厚生労働省', 'https://www.mhlw.go.jp/web/t_doc?dataId=00tc0305&dataType=1&pageNo=2', '2026-10-09'::date, '勤務地や職務が限定されていても、事業所閉鎖や職務の廃止で直ちに解雇が有効になるわけではなく、配置転換など解雇回避の努力が求められると整理されていること', 2 from articles where slug = 'gentei-seishain';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年4月から、募集広告や職業紹介を受ける際に、求人企業などから明示される労働条件が追加されます。企業から受ける労働条件明示のルールが変わります！（求職者向けリーフレット）', '厚生労働省', 'https://www.mhlw.go.jp/content/001114167.pdf', '2026-10-09'::date, '2024年4月から、求人の段階で就業場所・業務の変更の範囲が示されるようになったこと', 3 from articles where slug = 'gentei-seishain';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'gentei-seishain' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"46a8e6d35fe56bbfb5c101fa6439c98ce64b8c55eafe682ff27563c384da7c77","findings":[]}'::jsonb from articles where slug = 'gentei-seishain';
update articles set status = 'published' where slug = 'gentei-seishain';

-- article: gyaku-shitsumon (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('gyaku-shitsumon', 'article', '面接の逆質問、何を聞けばいい？聞くとよいこと・避けたいことと未経験向けの質問例', '面接の最後の「何か質問はありますか？」は、入社後に自分が働けるかを確かめる時間です。質問の作り方、研修・最初の仕事・評価についての未経験向けの質問例、避けたい質問、給料や休みの聞き方、質問がなくなったときの言い方を紹介します。', '面接の最後に「何か質問はありますか？」と聞かれて、何を聞けばいいのか分からず「特にありません」と答えてしまった。そんな経験がある人もいるかもしれません。

先に結論を言うと、逆質問は**「入社したら、自分はここで働けそうか」を確かめる時間**です。求人票を読んで分からなかったことを、**自分が働く場面を思い浮かべた質問**に直して聞くと、意欲も伝わり、自分の判断材料にもなります。

この記事で分かること：

- 逆質問の**作り方**（求人票から作る手順）
- 研修・最初の仕事・評価についての**未経験向けの質問例**（仮の例）
- **避けたい質問**と、給料や休みの**聞き方**
- 質問が**なくなったとき**の言い方

## そもそも逆質問は何のため？

ハローワーク札幌の面接対策のページでは、面接でよく出る質問のひとつに「何か質問はありませんか」を挙げ、仕事の内容や労働条件で聞きたいことは事前にまとめておくようにすすめています。つまり、逆質問は「おまけ」ではなく、準備しておく質問のひとつです。

逆質問には、2つの意味があります。

- **会社にとって**：応募者がどのくらい仕事を調べ、入社後のことを考えているかが分かる
- **あなたにとって**：求人票だけでは分からない、働き方や職場の様子を確かめられる

未経験の仕事に応募するときは、特に2つめが大事です。入ってから「思っていた仕事と違った」とならないよう、気になることはこの時間に聞いておきましょう。

## 逆質問は「求人票」から作る

いきなり質問を考えようとすると、思いつかないものです。手元の求人票や会社のホームページから作ると、迷わずにすみます。

```figure
type: steps
title: 逆質問の作り方
items:
  - label: 読む
    text: 求人票と会社のホームページを読む
  - label: 書き出す
    text: 読んでも分からなかったこと、気になったことをメモする
  - label: 直す
    text: 「自分が入社したら」の形の質問に言い換える
  - label: しぼる
    text: 面接官の立場で答えられるものを選ぶ
```

たとえば求人票に「入社後は研修あり」とだけ書かれていたら、「研修あり」から次のように質問を作ります。

- 気になったこと：研修のあと、すぐ一人で仕事をするのか
- 質問にすると：「研修が終わったあと、一人で電話を受けるようになるまでは、どなたかがそばについてくださるのでしょうか」

「研修はありますか？」のように、求人票に書いてあることをそのまま聞くのではなく、**書いてあることの先**を聞くのがポイントです。

## 未経験向けの質問例（仮の例）

ここからは、未経験の仕事に応募するときに聞いておきたいことを、テーマ別に紹介します。事務職やカスタマーサポートに応募する場合の仮の例です。応募する仕事に合わせて言い換えてください。

### 研修・教わり方について

- 「研修は、座学と実際の仕事を見ながら覚えるのと、どちらが中心ですか」
- 「分からないことがあったとき、最初はどなたに聞くことが多いですか」
- 「マニュアルや手順書のようなものはありますか」

研修の中身で確かめたいことは、[未経験求人の「研修あり」で確認すべきこと](/articles/mikeiken-kenshu-kakunin)でくわしく紹介しています。

### 最初の仕事について

- 「入社してすぐの時期は、どんな作業から担当することが多いですか」
- 「今いる方の中で、未経験から入った方はどんな流れで仕事を覚えていきましたか」
- 「このポジションで、最初につまずきやすいのはどんなところですか」

「つまずきやすいところ」を聞いておくと、入社前に何を練習しておけばいいかが分かります。

### 評価・成長について

- 「この仕事で、どんな働き方をしている方が評価されていますか」
- 「評価の面談は、どのくらいの間隔で行われていますか」
- 「経験を積んだあと、どんな仕事を任されるようになる方が多いですか」

評価のしくみは会社によって大きく違います。分かりにくければ「たとえば、入社して一年ほどたった方はどんな仕事をしていますか」のように、**具体的な人の例**で聞くと答えてもらいやすくなります。

### 職場について

- 「チームは何人くらいで、どんな方が働いていますか」
- 「一日の中で、忙しくなる時間帯はありますか」

## 避けたい質問

山形のハローワークの面接対策の資料では、逆質問で「特にありません」としないこと、調べれば分かる質問は避けることが挙げられています。ほかにも、次のような質問は避けたほうが無難です。

| 避けたい質問 | 理由 | 言い換えるなら |
| --- | --- | --- |
| 「御社はどんな事業をしていますか」 | ホームページを見れば分かる | 「〇〇の事業で、この部署はどんな役割ですか」 |
| 「研修はありますか」 | 求人票に書いてあることが多い | 「研修のあとは、どなたに教わりますか」 |
| 面接中に説明されたこと | 話を聞いていなかったと思われる | 説明の続きとして、もう一歩くわしく聞く |
| 「はい・いいえ」で終わる質問 | 話が広がらない | 「どんな」「どのように」で聞く |

## 給料・休み・残業はどう聞く？

給料や休み、残業は、働き続けるうえで大事な条件です。聞いてはいけないわけではありません。ただ、逆質問がこればかりだと「条件だけで選んでいる」と受け取られることもあるので、**求人票を読んだうえで、確かめたいこと**として聞きます。

- 「求人票に残業は月平均で記載がありましたが、忙しくなる時期はありますか」
- 「土日休みと伺っていますが、休日に出勤が必要になることはありますか」
- 「試用期間中と、そのあとで、働き方や条件に違いはありますか」

条件は、内定のあとに受け取る労働条件通知書でもう一度確認しましょう。見るところは[内定をもらったら、承諾の前に確認すること](/articles/naitei-shodaku-mae)で紹介しています。ハローワークの求人で、求人票と実際の条件が違うと感じたときは、「ハローワーク求人ホットライン」に申し出ることもできます。

## 質問がなくなったときの言い方

用意していた質問が、面接の中ですべて説明されてしまうこともあります。そのときは、無理に質問をひねり出すより、**聞きたかったことが分かった**と伝えるほうが自然です。

> 「仕事の流れや研修について、くわしく教えていただいたので、今は大丈夫です。お話を伺って、入社後の働き方がよく分かりました。」

ひとつだけ追加で聞けそうなら、面接中に出てきた話を広げます。

> 「先ほど、問い合わせの多い時期があると伺いましたが、その時期はどのように乗り切っていますか。」

## 最後に、結果の連絡時期を確かめる

ハローワーク札幌のページでは、面接が終わっても気を抜かず、採否の結果がいつ分かるかを確認したうえで、お礼のひとことを忘れないようにとしています。連絡の時期が分かっていると、ほかの応募先との予定も立てやすくなります。

```figure
type: checklist
title: 面接に持っていく逆質問メモ
items:
  - 求人票を読んで分からなかったことを書いた
  - 研修・最初の仕事・評価の質問を用意した
  - 調べれば分かる質問を外した
  - 条件の質問は「確かめたいこと」の形にした
  - 結果の連絡時期を聞くことをメモした
```

メモは見ても構いませんが、読み上げるのではなく、確かめる程度にしておきましょう。面接全体の準備は[未経験職種の面接、何を準備する？](/articles/mensetsu-junbi-mikeiken)で紹介しています。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '面接の逆質問、何を聞く？未経験向けの質問例と避けたい質問', '面接の最後の「何か質問はありますか？」に何を聞けばいいかを紹介します。求人票から質問を作る手順、研修・最初の仕事・評価についての未経験向けの質問例、避けたい質問、給料や休みの聞き方、質問がなくなったときの言い方が分かります。', array['mensetsu-junbi-mikeiken', 'mikeiken-kenshu-kakunin', 'naitei-shodaku-mae', 'mensetsu-yokukiku-shitsumon', 'web-mensetsu-junbi']::text[], '{}'::text[], array['mensetsu', 'mikeiken-shokushu']::text[], array['hajimete', 'seishain-keiken-sukunai']::text[], array['「何か質問は？」', '何を聞けばいい？']::text[], null, false, '[{"q":"逆質問で「特にありません」と答えると、落ちますか？","a":"それだけで結果が決まるとは言えません。ただ、ハローワークの面接対策の資料では、逆質問で「特にありません」とはしないようにすすめています。面接の中で疑問が解消した場合は、「〇〇について詳しく教えていただいたので、今は大丈夫です」と、聞きたかったことが分かったと伝えるとよいでしょう。"},{"q":"給料や休み、残業のことを逆質問で聞いてもいいですか？","a":"働くうえで大事な条件なので、確かめて構いません。求人票に書いてあることをそのまま聞くのではなく、「求人票に月平均の残業時間が書かれていましたが、忙しい時期はありますか」のように、読んだうえで確かめたいことを聞くと伝わりやすくなります。条件は内定後に受け取る労働条件通知書でも確認しましょう。"},{"q":"逆質問はいくつ用意すればいいですか？","a":"決まった数はありませんが、面接の途中で説明されて聞く必要がなくなることもあるので、複数用意しておくと安心です。面接官の話を聞いて解消したものは、当日に聞かずに省きます。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"逆質問を「意欲を見せる場」だけでなく「自分が入社後に働けるかを確かめる時間」と位置づけ、求人票から質問を作る手順と、未経験者が知りたい研修・最初の仕事・評価の質問例を中心にまとめる。既存記事（mensetsu-junbi-mikeiken）の4つの質問例と重ならない例にする","quotes":[{"source_url":"https://jsite.mhlw.go.jp/hokkaido-hellowork/list/sapporo/kyusyokusya/mitiannai-1/mensetsu.html","text":"面接でよくでる質問として「何か質問はありませんか」を挙げ、仕事の内容や労働条件等で聞きたいことは事前にまとめておくとよい、面接が終わっても気を抜かず、採否の結果がいつわかるのか確認したのち「ありがとうございました」「よろしくお願いします」の一言を忘れずに、としている（この環境から jsite.mhlw.go.jp に直接接続できなかったため、検索結果に表示されたページの抜粋で確認）","used_in":"そもそも逆質問は何のため？／最後に、結果の連絡時期を確かめる"},{"source_url":"https://jsite.mhlw.go.jp/yamagata-hellowork/content/contents/002350381.pdf","text":"逆質問では「特にありません」とはしない、調べれば分かる質問は避ける（直接開けなかったため、検索結果の抜粋で確認）","used_in":"避けたい質問／質問がなくなったときの言い方／FAQ"},{"source_url":"https://www.hellowork.mhlw.go.jp/member/hotline.html","text":"ハローワークの求人票の内容と実際の労働条件が異なる場合は「ハローワーク求人ホットライン」に申し出ることができ、担当のハローワークが事実を確認のうえ会社に是正指導を行う（直接開けなかったため、検索結果の抜粋で確認）","used_in":"給料・休み・残業はどう聞く？"}],"not_used":["「逆質問は3つ用意する」「逆質問で合否が決まる割合」などの数や割合は、公的な根拠を確認できなかったので書かない","ホットラインの電話番号は変わる可能性があるため本文に書かず、ページ名の案内にとどめた","面接の段階（一次・最終）ごとに面接官が誰かは会社によって違うため、断定せず「誰が面接官かを見て変える」にとどめた"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'gyaku-shitsumon' and c.slug = 'shorui-mensetsu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'gyaku-shitsumon' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'さぁ！面接です', '北海道労働局（ハローワーク札幌）', 'https://jsite.mhlw.go.jp/hokkaido-hellowork/list/sapporo/kyusyokusya/mitiannai-1/mensetsu.html', '2026-10-09'::date, '面接でよく出る質問に「何か質問はありませんか」があること。仕事の内容や労働条件で聞きたいことは事前にまとめておくこと。面接の最後に採否の結果がいつ分かるかを確認すること', 0 from articles where slug = 'gyaku-shitsumon';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '面接対策', '山形労働局（ハローワーク）', 'https://jsite.mhlw.go.jp/yamagata-hellowork/content/contents/002350381.pdf', '2026-10-09'::date, '逆質問で「特にありません」とはしないこと、調べれば分かる質問は避けること', 1 from articles where slug = 'gyaku-shitsumon';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ハローワークの求人票と実際が異なる旨の申し出等について（ハローワーク求人ホットライン）', '厚生労働省（ハローワークインターネットサービス）', 'https://www.hellowork.mhlw.go.jp/member/hotline.html', '2026-10-09'::date, 'ハローワークの求人票の内容と実際の条件が違う場合に、ハローワーク求人ホットラインに申し出られること', 2 from articles where slug = 'gyaku-shitsumon';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'gyaku-shitsumon' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"7ec266a65856b81af2b875f7dc33611f05cc9ed9b21e3b032145929504705633","findings":[]}'::jsonb from articles where slug = 'gyaku-shitsumon';
update articles set status = 'published' where slug = 'gyaku-shitsumon';

-- article: haken-seishain (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('haken-seishain', 'article', '派遣から正社員を考えるとき、最初に確認したいこと', '派遣から正社員を目指す道は、今の派遣先での直接雇用、紹介予定派遣、ほかの会社への応募などいくつかあります。派遣と正社員の違い、同じ職場で働ける期間のルール、給料の比べ方、派遣での経験の伝え方を整理します。', '派遣で働いていて、「このまま続けていいのかな」「そろそろ正社員になりたい」と考え始めた人もいると思います。派遣から正社員を目指す道はひとつではありません。最初に、**派遣と正社員の違い**と、**どんな道があるか**を確認しておきましょう。

## 派遣と正社員、何が違う？

いちばん大きな違いは、**誰に雇われているか**です。派遣社員は派遣会社（派遣元）に雇われて、別の会社（派遣先）で働きます。正社員は、働いている会社に直接雇われます。会社によって違いはありますが、一般的には次のような違いがあります。

| 項目 | 派遣社員 | 正社員 |
| --- | --- | --- |
| 雇っている会社 | 派遣会社（派遣元） | 働いている会社 |
| 契約期間 | 期間の定めがあることが多い | 期間の定めがないことが多い |
| 給与 | 時給制が多い | 月給制が多い |
| 賞与・昇給 | 契約や派遣会社による | 会社の制度による（求人票で確認） |
| 仕事の範囲 | 契約で決まった業務が中心 | 異動や担当の変更がある会社もある |

## 派遣から正社員になる道は？

主に次の3つがあります。

1. **今の派遣先に直接雇ってもらう**: 派遣先が社員を募集するときに応募する方法です。派遣先は、同じ事業所で1年以上続けて働いている派遣社員に、正社員の募集情報を知らせることになっています
2. **紹介予定派遣で働く**: 派遣先に直接雇われることを前提に、まず派遣で働く方法です。派遣の期間は6か月までで、通常の派遣では原則できない事前の面接なども認められています。会社と本人の双方が合意すれば、派遣先に直接雇用されます
3. **ほかの会社の正社員求人に応募する**: 派遣で身についた経験を活かして、別の会社に応募する方法です

```figure
type: compare
title: 派遣から正社員になる3つの道
columns:
  - label: 今の派遣先に直接雇用
    tone: mint
    items:
      - 派遣先が社員を募集するときに応募する
      - 同じ事業所で1年以上なら募集情報が届く
  - label: 紹介予定派遣
    tone: sky
    items:
      - 直接雇用を前提に、まず派遣で働く
      - 派遣の期間は6か月まで
      - 双方が合意すれば直接雇用
  - label: ほかの会社に応募
    tone: sand
    items:
      - 派遣で身についた経験を活かす
```

紹介予定派遣で直接雇用になる場合も、正社員なのか契約社員なのかは求人によって違います。始める前に、直接雇用後の雇用形態と給与を確認しておきましょう。

## 同じ職場で3年たつとどうなる？

派遣には期間のルールがあります。同じ派遣先の同じ部署（組織単位）で、同じ人が派遣として働ける期間は、原則として**3年まで**です。2015年9月30日に施行された改正労働者派遣法で決められたルールです。

```figure
type: stats
title: 派遣の期間のルール
items:
  - value: "3"
    unit: 年まで
    label: 同じ部署で働ける期間
    note: 原則。2015年9月30日施行の改正労働者派遣法
```

同じ部署で3年続けて働く見込みがある人には、派遣会社が次のような措置をとることになっています。

- 派遣先に、直接雇ってもらうよう依頼する
- 新しい派遣先を紹介する
- 派遣会社で、期間の定めのない雇用にする
- そのほか、安定して働き続けるための措置

今の職場で正社員を目指したいなら、こうした節目の前に、派遣会社の担当者へ希望を伝えておくと相談しやすくなります。

## 給料はどう比べる？

派遣の時給と正社員の月給は、そのままでは比べにくいので、**1年間の金額**にそろえてみましょう。数字はすべて仮の例です。

| | 派遣（時給制） | 正社員（月給制） |
| --- | --- | --- |
| 月の金額 | 時給1,500円 × 8時間 × 20日 = 24万円 | 月給22万円 |
| 12か月分 | 24万円 × 12 = 288万円 | 22万円 × 12 = 264万円 |
| 賞与 | なし | 年44万円 |
| 1年間の合計 | 288万円 | 308万円 |

この例では、月の金額は派遣のほうが高いのに、賞与を入れると正社員が上回ります。反対に、賞与がない、または少ない求人なら、派遣のほうが高くなることもあります。時給制は、祝日などで働く日が少ない月は収入が減る点も考えておきましょう。年収の内訳の見方は[「土日休み」と「年収」をどう比較する？](/articles/donichi-yasumi-nenshu-hikaku)で紹介しています。

## 派遣の経験はどう伝える？

派遣で働いた経験も、正社員の選考で伝えられる経験です。職務経歴書では、**派遣元・派遣先・期間・担当した仕事**を分けて書くと伝わりやすくなります。

> 書き出し例：2024年4月〜2026年3月　〇〇株式会社（派遣元）より、食品メーカーの営業部へ派遣
>
> - 受注データの入力と、納期についての電話対応
> - 表計算ソフトでの在庫表の更新と、週1回の集計
> - 新しく入った派遣社員への業務の説明

アルバイトから正社員を目指すときの考え方は[フリーターから正社員を目指すとき、最初に確認したいこと](/articles/freeter-seishain-hajimeni)も参考になります。正社員を目指す人向けの記事は[正社員になりたい](/concerns/seishain)にまとめています。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['freeter-seishain-hajimeni', 'donichi-yasumi-nenshu-hikaku', 'mikeiken-tenshoku-hajimekata', 'gentei-seishain']::text[], '{}'::text[], array['seishain', 'kyuryo']::text[], array['haken']::text[], array['派遣から正社員、', '何から考える？']::text[], null, false, '[{"q":"紹介予定派遣とは何ですか？","a":"派遣先の会社に直接雇われることを前提に、まず派遣社員として働く方法です。派遣で働く期間は6か月までで、その間に会社と本人の双方が、仕事や職場が合うかを確かめます。双方が合意すれば直接雇用になります。直接雇用後が正社員か契約社員かは求人によって違うので、始める前に確認しましょう。"},{"q":"同じ派遣先で3年働くとどうなりますか？","a":"同じ派遣先の同じ部署（組織単位）で、同じ人が派遣として働ける期間は、原則として3年までです。3年続けて働く見込みがある人には、派遣会社が、派遣先への直接雇用の依頼、新しい派遣先の紹介、派遣会社での期間の定めのない雇用などの措置をとることになっています。"},{"q":"派遣の経験は、職務経歴書にどう書けばいいですか？","a":"派遣元（派遣会社）と派遣先、働いた期間、担当した仕事を分けて書くと伝わりやすくなります。派遣先の会社名を書いてよいか迷うときは、「食品メーカーの営業部」のように業種と部署で書く方法もあります。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"派遣から正社員への道を3つに分け、期間のルールと雇用安定措置を「自分から相談できる節目」として示す。給料は時給と月給を年額にそろえて比べる","quotes":[{"source_url":"https://www.mhlw.go.jp/file/06-Seisakujouhou-11650000-Shokugyouanteikyokuhakenyukiroudoutaisakubu/0000097169.pdf","text":"同一の派遣労働者を派遣先の事業所における同一の組織単位に対し派遣できる期間は3年が限度。同一の組織単位に継続して3年間派遣される見込みがある人には、派遣元から派遣先への直接雇用の依頼、新たな派遣先の提供、派遣元での無期雇用、その他安定した雇用の継続を図るための措置が講じられる","used_in":"同じ職場で3年たつとどうなる？"},{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000077386.html","text":"平成27年労働者派遣法改正法は2015年9月11日成立、9月30日施行。派遣労働者の雇用の安定とキャリアアップを図る改正で、派遣労働者向けのQ&Aなどを掲載","used_in":"同じ職場で3年たつとどうなる？"},{"source_url":"https://www.mhlw.go.jp/content/001370982.pdf","text":"紹介予定派遣は、派遣元が派遣の開始前または開始後に派遣労働者と派遣先に職業紹介を行う（予定する）もの。同一の派遣労働者について派遣期間は6か月以内。派遣先は面接・履歴書の受付など派遣労働者を特定する行為を行える","used_in":"派遣から正社員になる道は？"},{"source_url":"https://www.mhlw.go.jp/mobile/m/job/040104.html","text":"紹介予定派遣以外の派遣では、派遣先が派遣労働者を特定することを目的とする事前面接などは原則禁止","used_in":"派遣から正社員になる道は？"},{"source_url":"https://www.rodo.co.jp/faq/193836/","text":"派遣先は、同一の事業所等で1年以上継続して受け入れている派遣労働者がいる場合、その事業所等で通常の労働者（正社員）を募集するときは、募集情報をその派遣労働者に周知しなければならない（派遣法40条の5）","used_in":"派遣から正社員になる道は？"}],"not_used":["派遣社員の平均時給や正社員の平均年収などの統計は使っていない。給料の比較表は仮の数字","職務経歴書の書き出し例の派遣元は「〇〇株式会社」とし、実在の会社名は使っていない","content/001370982.pdf は紹介予定派遣の検索で繰り返し結果に出たが、正式な題名は確認できていないため、題名は内容を表す仮のものにした"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'haken-seishain' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '派遣で働く皆さまへ～平成27年労働者派遣法改正法が成立しました～', '厚生労働省', 'https://www.mhlw.go.jp/file/06-Seisakujouhou-11650000-Shokugyouanteikyokuhakenyukiroudoutaisakubu/0000097169.pdf', '2026-10-06'::date, '同じ組織単位で派遣として働ける期間は原則3年までであること、3年見込みの人への雇用安定措置（直接雇用の依頼・新たな派遣先の提供・派遣元での無期雇用など）', 0 from articles where slug = 'haken-seishain';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '平成27年労働者派遣法改正法の概要', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000077386.html', '2026-10-06'::date, '派遣で働ける期間のルールが、2015年9月30日施行の改正労働者派遣法で決められたこと', 1 from articles where slug = 'haken-seishain';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '紹介予定派遣に関する資料（PDF）', '厚生労働省', 'https://www.mhlw.go.jp/content/001370982.pdf', '2026-10-06'::date, '紹介予定派遣の派遣期間は同じ派遣労働者について6か月以内であること、派遣先による面接・履歴書の受付などが認められていること', 2 from articles where slug = 'haken-seishain';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '事前面接などは原則禁止されています', '厚生労働省', 'https://www.mhlw.go.jp/mobile/m/job/040104.html', '2026-10-06'::date, '通常の派遣では、派遣先が派遣労働者を特定する目的の事前面接などは原則禁止であること', 3 from articles where slug = 'haken-seishain';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '募集情報提供とは？ 派遣先へ求められる措置', '労働新聞社', 'https://www.rodo.co.jp/faq/193836/', '2026-10-06'::date, '派遣先は、同じ事業所で1年以上続けて働いている派遣労働者に、正社員の募集情報を知らせる義務があること（労働者派遣法第40条の5）', 4 from articles where slug = 'haken-seishain';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'haken-seishain' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"bd4cba542caceea2f150b031c418dad2c5aa4e314d1c04b2023fc99aa25c938e","findings":[]}'::jsonb from articles where slug = 'haken-seishain';
update articles set status = 'published' where slug = 'haken-seishain';

-- article: hanbai-seishain (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('hanbai-seishain', 'article', '販売・接客の仕事で正社員を目指すという選択｜変わることと求人の確認ポイント', '別の職種に移るだけが転職ではありません。慣れた販売・接客の仕事で正社員を目指す道もあります。アルバイトと正社員で変わること、時給と月給の比べ方、店長候補などの求人で確認したい休日・シフト・異動の範囲、アルバイト経験の伝え方を整理します。', '「接客の仕事は好き。でも、アルバイトのままでいいのかな」。そう感じて転職を考えるとき、別の職種に移ることだけが選択肢ではありません。**慣れた販売・接客の仕事で、正社員を目指す**という道もあります。

経験をそのまま活かせる一方で、正社員になると任される仕事や働き方も変わります。応募する前に、何が変わるのかと、求人で確認したいことを整理しておきましょう。

## アルバイトと正社員、何が変わる？

会社によって違いますが、変わりやすいのは次のような点です。

| | アルバイト（例） | 正社員（例） |
| --- | --- | --- |
| 給料 | 時給。入った時間で月の収入が変わる | 月給。賞与（ボーナス）がある会社も |
| 仕事の範囲 | 接客・レジ・品出しが中心 | 売上の管理、シフトづくり、スタッフの教育なども |
| 働く時間 | 希望を出してシフトに入る | 店の営業時間に合わせた早番・遅番など |
| 働く場所 | 決まった店舗 | ほかの店舗への異動がある会社も |

厚生労働省の職業情報提供サイト「job tag」の「衣料品販売」では、正社員は店の営業時間に合わせて早番・遅番で働くことや、土日祝日も営業する店が多いため交代で休みを取ることが紹介されています。経験を積むと、商品の仕入れや在庫の管理を任されることもあります。

## 給料はどう比べる？

時給と月給はそのままでは比べにくいので、同じ単位にそろえます。

たとえば、時給1,200円で1日8時間、月22日働いている場合、月の収入は1,200円×8時間×22日＝21万1,200円です（交通費や深夜の手当などは除く）。

```figure
type: equation
title: 時給を月の収入にそろえる
terms:
  - 時給1,200円
  - ×
  - 1日8時間
  - ×
  - 月22日
  - =
  - 月21万1,200円
```

正社員の月給と比べるときは、次の点もそろえて見ましょう。

- 月給に**固定残業代**が含まれていないか
- **賞与**があるか。あるなら「前年実績」なのか
- **年間休日**は何日か

休みと年収の比べ方は、[「土日休み」と「年収」をどう比較する？](/articles/donichi-yasumi-nenshu-hikaku)で時給換算の計算例つきで紹介しています。

## 店長候補などの求人で、確認したいことは？

販売職の正社員の求人には、「店長候補」と書かれたものもあります。応募前や面接で、次の点を確認しておきましょう。

- **休日**: 年間休日は何日か。土日に休める日は月に何回くらいか。希望休はどう出すか
- **勤務時間**: 早番・遅番の時間帯。開店前や閉店後の作業はどのくらいあるか
- **異動の範囲**: どの地域の店舗に異動する可能性があるか
- **店長になったあとの給与**: 役職手当や、残業代の扱いはどうなるか

```figure
type: checklist
title: 店長候補の求人で確認したいこと
items:
  - 年間休日と、土日に休める日の月の回数
  - 希望休の出し方
  - 早番・遅番の時間帯と、開店前・閉店後の作業
  - 異動する可能性がある店舗の地域
  - 店長になったあとの役職手当や残業代の扱い
```

異動の範囲は、2024年4月から求人の募集時などに「就業場所の変更の範囲」として示されるようになりました。くわしくは[求人で明示される労働条件が増えた（2024年4月）](/news/news-roudou-jouken-meiji)で紹介しています。

店長の給与については、厚生労働省が、労働基準法の「管理監督者」に当たるかどうかは、店長などの役職名ではなく、仕事の内容や責任と権限、働き方、待遇などの実態で判断されるとしています。「店長になったら、給与のしくみはどう変わりますか」と面接で聞くのは、失礼なことではありません。

## アルバイト経験は、どう見られる？

アルバイトの経験をどう評価するかは、会社によって違います。同じ業界の経験として見てくれる会社もあれば、正社員としての経験とは分けて考える会社もあります。

どちらの場合も、**何年、どんな仕事を任されていたか**を具体的に書くと伝わりやすくなります。書き出し例は次のとおりです（自分の経験に置きかえて使ってください）。

> アパレル店で3年間アルバイトとして働き、2年目からは新人スタッフへのレジ指導と、週ごとの商品の発注を担当しました。

今の職場に正社員登用の制度がある場合は、登用の条件や時期を店長に聞いてみるのも一つの方法です。アルバイト経験や空白期間の伝え方は、[フリーターから正社員を目指すとき、最初に確認したいこと](/articles/freeter-seishain-hajimeni)でも紹介しています。

## その先の選択肢は？

販売の正社員として経験を積んだあと、店長やエリアの担当、本部での仕入れや販売促進、スタッフの採用・教育などの仕事に進む道がある会社もあります。接客で身につけた経験は、営業やカスタマーサポートなど別の職種にもつながります。

ひとりで決めきれないときは、わかものハローワークで相談する方法もあります。正社員を目指すおおむね35歳未満の人を対象に、担当者が無料で相談にのってくれます。

「今の仕事を続ける」か「まったく別の仕事に移る」かの二択ではなく、慣れた仕事で正社員になるという選択肢も入れて、比べてみてください。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['freeter-seishain-hajimeni', 'sekkyaku-keiken-ikasu', 'donichi-yasumi-nenshu-hikaku']::text[], array['hanbai']::text[], array['seishain', 'kyuryo']::text[], array['freeter', 'sekkyaku']::text[], array['販売・接客のまま、', '正社員になる道。']::text[], null, false, '[{"q":"アルバイトの経験は、正社員の応募で経験として見てもらえますか？","a":"会社によって扱いが違います。同じ業界の経験として見てくれる会社もあれば、正社員としての経験とは分けて考える会社もあります。どちらの場合も、何年、どんな仕事を任されていたかを具体的に書くと伝わりやすくなります。"},{"q":"店長になると、残業代は出なくなるのですか？","a":"店長という役職名だけで決まるわけではありません。厚生労働省は、労働基準法の「管理監督者」に当たるかどうかは、役職名ではなく、仕事の内容や責任と権限、働き方、待遇などの実態で判断されるとしています。店長になったあとの給与のしくみは、入社前に確認しておきましょう。"},{"q":"正社員になると、転勤や異動はありますか？","a":"会社によって違います。2024年4月から、求人の募集時などに「就業場所の変更の範囲」が示されるようになったので、どの地域の店舗に異動する可能性があるかを求人票や面接で確認しましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"別職種への転職だけでなく、慣れた販売・接客で正社員を目指す選択肢を示す。アルバイトと正社員の違い、時給と月給のそろえ方、店長候補求人の確認点（休日・シフト・異動の範囲・店長後の給与）、アルバイト経験の伝え方。評価は会社によると明記する","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/73","text":"勤務時間は店舗の営業時間に合わせ、正社員は早番・遅番の2交替制が一般的。土日祝日も営業している店が多く、交代で休みを取って週休2日を確保する。経験を積むと商品の仕入れや在庫管理を任されることもある。","used_in":"アルバイトと正社員、何が変わる？"},{"source_url":"https://www.mhlw.go.jp/stf/newpage_32105.html","text":"2024年4月1日から職業安定法施行規則の改正により、求職者に明示する労働条件に就業場所・業務の変更の範囲などが追加された。","used_in":"店長候補などの求人で、確認したいことは？"},{"source_url":"https://www.mhlw.go.jp/bunya/roudoukijun/dl/kanri.pdf","text":"管理監督者に当てはまるかどうかは、役職名ではなく、その職務内容、責任と権限、勤務態様等の実態によって判断する。店長を管理職と位置づけていても、十分な権限や相応の待遇がなければ管理監督者には当たらず、残業手当を支払わなくてよいことにはならない。","used_in":"店長候補などの求人で、確認したいことは？"},{"source_url":"https://www.mhlw.go.jp/houdou/2008/09/h0909-2.html","text":"2008年9月9日、多店舗展開する小売業・飲食業等の店舗の店長等について、管理監督者に当たるかどうかの具体的な判断要素を整理した通達を発出。","used_in":"店長候補などの求人で、確認したいことは？"},{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000181329.html","text":"わかものハローワークは、正社員を目指す若者（おおむね35歳未満）を対象に、担当者制による職業相談などを無料で行っている。","used_in":"その先の選択肢は？"}]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'hanbai-seishain' and c.slug = 'shokushu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'hanbai-seishain' and c.slug = 'keiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '衣料品販売 - 職業詳細（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/73', '2026-10-06'::date, '正社員は店の営業時間に合わせて早番・遅番で働くこと、土日祝日も営業する店が多く交代で休みを取ること、経験を積むと仕入れや在庫管理を任されることがあること', 0 from articles where slug = 'hanbai-seishain';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年4月から労働条件明示のルールが変わります', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_32105.html', '2026-10-06'::date, '2024年4月から、募集時などに就業場所・業務の変更の範囲が明示されるようになったこと', 1 from articles where slug = 'hanbai-seishain';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '労働基準法における管理監督者の範囲の適正化のために', '厚生労働省', 'https://www.mhlw.go.jp/bunya/roudoukijun/dl/kanri.pdf', '2026-10-06'::date, '管理監督者に当たるかは役職名ではなく、職務内容・責任と権限・勤務態様・待遇などの実態で判断されること', 2 from articles where slug = 'hanbai-seishain';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '多店舗展開する小売業、飲食業等の店舗における管理監督者の範囲の適正化について', '厚生労働省', 'https://www.mhlw.go.jp/houdou/2008/09/h0909-2.html', '2026-10-06'::date, '小売業などの店長について、管理監督者に当たるかの判断要素が示されていること', 3 from articles where slug = 'hanbai-seishain';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'わかものハローワーク', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000181329.html', '2026-10-06'::date, '正社員を目指すおおむね35歳未満の若者を対象に、担当者制の職業相談などを無料で行っていること', 4 from articles where slug = 'hanbai-seishain';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'hanbai-seishain' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"f572e125cc6c44fba1dcbd78da233a92784d6fd70b0e940b2b2bcf3fa8922bd3","findings":[]}'::jsonb from articles where slug = 'hanbai-seishain';
update articles set status = 'published' where slug = 'hanbai-seishain';

-- article: hello-training (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('hello-training', 'article', 'ハロートレーニング（公共職業訓練）とは？未経験の仕事のスキルを無料で学ぶ流れ', 'ハロートレーニングは、国や都道府県が行う公的な職業訓練の愛称です。仕事を探している人向けの訓練は受講料が無料（テキスト代などは自己負担）で、雇用保険を受け取っている人は訓練中も基本手当を受け取れる場合があります。訓練の種類と、ハローワークでの申し込みの流れを整理します。', '「事務やITの仕事に移りたいけど、スクールに通うお金はない」。そんなときに調べてほしいのが、**ハロートレーニング**です。

先に結論です。

- ハロートレーニングは、国や都道府県が行う公的な職業訓練の愛称です
- 仕事を探している人向けの訓練（離職者訓練・求職者支援訓練）は、受講料が無料です。テキスト代などは自己負担になります
- 申し込みの窓口はハローワークです。雇用保険を受け取っている人は、条件を満たすと訓練中も基本手当などを受け取れます

ここでは、訓練の種類と、申し込みから受講までの流れを見ていきます。

## ハロートレーニングってどんな訓練？

ハロートレーニングは、仕事に必要なスキルや知識を身につけるための、公的な職業訓練です。キャリアアップや、希望する仕事への就職を目指す人を対象にしています。

訓練は、国（ポリテクセンターなど）や都道府県（職業能力開発校など）の施設で行う「施設内訓練」と、都道府県などから委託を受けた民間の専門学校やスクールなどで行う「委託訓練」があります。施設内訓練では、機械や電気、住まいに関わる技能の科目などが多く、委託訓練では、介護や情報処理などのコースが開かれています。

## 訓練にはどんな種類がある？

ハロートレーニングには、対象になる人ごとに次のような種類があります。

| 種類 | 主な対象 | 受講料 |
| --- | --- | --- |
| 離職者訓練（公共職業訓練） | 主に雇用保険を受け取っている求職者 | 無料（テキスト代などは自己負担） |
| 求職者支援訓練 | 主に雇用保険を受け取れない求職者 | 無料（テキスト代などは自己負担） |
| 在職者訓練 | 働いている人 | 有料 |
| 学卒者訓練 | 高校を卒業した人など | 有料 |
| 障害者訓練 | 障害のある人 | ― |

この記事で主に取り上げるのは、仕事を辞めて次の仕事を探している人向けの**離職者訓練**です。訓練期間はおおむね3か月〜2年で、コースによって違います。

雇用保険を受け取れない人（フリーターなど）向けの**求職者支援訓練**は、民間の訓練機関が行う2〜6か月のコースが中心です。収入などの条件を満たすと、月10万円の職業訓練受講給付金を受け取りながら通える場合があります。

## 雇用保険を受け取っている人の訓練中のお金

雇用保険の基本手当（いわゆる失業手当）を受け取っている人が、ハローワークの**受講指示**を受けて公共職業訓練を受けると、次のような手当があります。

```figure
type: checklist
title: 受講指示を受けたときの主な手当
items:
  - 訓練中も基本手当が支給される
  - 給付日数が終わっても訓練終了日まで支給される
  - 受講手当（日額500円・上限20,000円）
  - 通所手当（交通費・上限は月42,500円）
```

受講手当は訓練を受けた日に1日500円で、40日分（20,000円）までです。通所手当は、訓練施設までの距離や交通手段に応じて支給され、上限は月42,500円です。

また、正当な理由のない自己都合で辞めた人には、通常は1か月などの給付制限があります。2025年4月1日以降に受講を始めた公共職業訓練などを受けている場合は、この給付制限が解除されるしくみがあります。

ただし、受講指示を受けるには、基本手当の給付日数が一定以上残っていることなどの条件があります。手当がいつまで出るかは人によって違うので、訓練を申し込む前にハローワークで確認してください。

## 申し込みから受講までの流れ

申し込みの手順は地域やコースで少しずつ違いますが、おおまかには次の流れです。

```figure
type: steps
title: ハロートレーニングを受けるまでの流れ
items:
  - label: ハローワークで相談
    text: 求職の申込みをして、訓練について相談する
  - label: コースを選ぶ
    text: 見学などで訓練の中身を確かめる
  - label: 受講を申し込む
    text: 受講申込書をハローワークに出す
  - label: 選考を受ける
    text: 書類・面接・筆記試験など
  - label: 合格後の手続き
    text: ハローワークで受講の手続きをする
```

いくつか気をつけたいことがあります。

- **すぐには申し込めないことがある**：ハローワークでの職業相談を重ねてから申し込む地域もあります。気になるコースの締切から逆算して、早めに相談を始めましょう
- **定員と選考がある**：コースには定員があり、書類や面接、筆記試験などの選考があります。訓練のあとにどんな仕事に就きたいかを、面接の前に整理しておきましょう
- **開講の時期が決まっている**：コースごとに開講月が決まっているので、辞める時期と訓練の始まる時期がずれることがあります

コースの一覧は、住んでいる地域の労働局やハローワークのページ、ハローワークの窓口で確認できます。

## 教育訓練給付金・求職者支援訓練とはどう違う？

「無料の訓練」と「費用の一部が戻る制度」は混同しやすいので、違いを整理しておきます。

| 制度 | 費用 | 主な対象 |
| --- | --- | --- |
| 公共職業訓練（離職者訓練） | 受講料は無料（テキスト代などは自己負担） | 主に雇用保険を受け取っている求職者 |
| 求職者支援訓練 | 受講料は無料（テキスト代などは自己負担） | 主に雇用保険を受け取れない求職者 |
| 教育訓練給付金 | 自分で講座の費用を払い、修了後などに一部が戻る | 雇用保険に入っていた期間などの条件を満たす人 |

教育訓練給付金は、厚生労働大臣が指定した講座を自分で選んで申し込み、費用の一部（一般教育訓練なら20％、上限10万円）が雇用保険から支給される制度です。ハロートレーニングのように受講料が最初から無料になるわけではありませんが、指定された講座の中から自分で講座を選んで申し込める、という違いがあります。

どれが自分に合うかは、雇用保険を受け取っているか、仕事を続けながら学びたいか、どのくらいの期間を学ぶことに使えるかで変わります。迷ったら、ハローワークの職業訓練の窓口で、3つを並べて相談してみてください。

## 申し込む前に整理しておきたいこと

訓練は数か月から長いものでは2年かかります。申し込む前に、次の3つを書き出しておくと、コースを選びやすくなり、選考の面接でも話しやすくなります。

1. 訓練のあと、どんな仕事に応募したいか（職種と働き方）
2. その仕事の求人で、どんなスキルや資格が求められているか
3. 訓練中の生活費は、手当や貯金でまかなえるか

「やりたい仕事がまだはっきりしない」という人も、ハローワークの職業相談でコースを見ながら考えることができます。未経験から目指しやすい仕事は[未経験のIT、どんな仕事から始まる？](/articles/mikeiken-it-hajimari)や[PCが得意じゃなくても、事務職は目指せる？](/articles/pc-nigate-jimu)でも紹介しています。仕事を辞める前に確認しておきたいことは[今の仕事を辞めたいとき、先に確認しておきたいこと](/articles/yametai-mae-kakunin)にまとめています。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-07'::timestamptz, 'ハロートレーニングとは｜無料の職業訓練の種類と申し込みの流れ', '公的職業訓練「ハロートレーニング」の種類（離職者訓練・求職者支援訓練など）、受講料無料でテキスト代は自己負担になる点、雇用保険を受け取っている人の訓練中の手当、ハローワークでの申し込みから受講までの流れを整理します。', array['mikeiken-it-hajimari', 'pc-nigate-jimu', 'yametai-mae-kakunin']::text[], '{}'::text[], array['mikeiken-shokushu', 'yaritai']::text[], array['hajimete', 'pc-mikeiken']::text[], array['未経験の仕事のスキル、', '無料で学べる訓練']::text[], 'graduation', false, '[{"q":"失業手当（基本手当）を受け取っていなくても、ハロートレーニングは受けられますか？","a":"受けられる訓練があります。公共職業訓練（離職者訓練）は主に雇用保険を受け取っている人が対象ですが、雇用保険を受け取れない人には求職者支援訓練があり、収入などの条件を満たすと職業訓練受講給付金も受け取れます。どちらが合うかはハローワークで相談してください。"},{"q":"訓練中に失業手当の日数が終わったらどうなりますか？","a":"ハローワークの受講指示を受けて公共職業訓練などを受けている場合は、所定給付日数分の支給が終わったあとも、訓練が終わる日まで基本手当が支給されるしくみがあります。受講指示を受けるには、支給残日数などの条件があるので、申し込む前にハローワークで確認しましょう。"},{"q":"働きながら受けられる訓練はありますか？","a":"在職者訓練は働いている人向けの訓練ですが、受講料は有料です。雇用保険に入っていない働き方の人は、働きながら求職者支援訓練を受けられる場合もあります。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「未経験の仕事に行きたいけど、スクールにお金はかけられない」人に、公的な訓練の入口を示す。地域ごとに違う細かい手順は書かず、ハローワークで確かめる流れにする","quotes":[{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/jinzaikaihatsu/rishokusha.html","text":"公共職業訓練（離職者訓練）は、主に雇用保険を受給している求職者の方を対象に、就職に必要な職業スキルや知識を習得するための訓練を無料（テキスト代等は自己負担）で実施","used_in":"ハロートレーニングってどんな訓練？"},{"source_url":"https://jsite.mhlw.go.jp/hokkaido-roudoukyoku/content/contents/002175939.pdf","text":"離職者訓練は対象がハローワークの求職者で無料（テキスト代等は実費負担）、訓練期間は概ね3月〜2年。求職者支援訓練は2〜6か月","used_in":"訓練にはどんな種類がある？"},{"source_url":"https://www.mhlw.go.jp/content/11601000/001145178.pdf","text":"受講手当は日額500円で上限は20,000円（40日分）、通所手当は上限月額42,500円","used_in":"雇用保険を受け取っている人の訓練中のお金"},{"source_url":"https://jsite.mhlw.go.jp/aichi-hellowork/content/contents/001725208.pdf","text":"受講あっせん（受講指示）を受けると、所定給付日数分の支給を終了した後も、訓練終了日まで基本手当が支給される","used_in":"雇用保険を受け取っている人の訓練中のお金"}],"not_used":["受講指示を受けるための支給残日数の具体的な条件は、地域の案内で表現が分かれ、全国共通の数字を確認しきれなかったので書かない","訓練の就職率などの実績の数字は年度で変わるため書かない","申し込みまでに必要な職業相談の回数や写真のサイズなど、ハローワークごとに違う手順は書かない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'hello-training' and c.slug = 'seido' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'hello-training' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ハロートレーニングについて知る（ハロトレ特設サイト）', '厚生労働省', 'https://www.mhlw.go.jp/hellotraining/about/', '2026-10-07'::date, 'ハロートレーニングは公的職業訓練の愛称であること、離職者訓練・求職者支援訓練・在職者訓練・学卒者訓練・障害者訓練の種類', 0 from articles where slug = 'hello-training';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ハロートレーニング（離職者訓練・求職者支援訓練）', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/jinzaikaihatsu/rishokusha.html', '2026-10-07'::date, '公共職業訓練（離職者訓練）は主に雇用保険を受給している求職者を対象に、無料（テキスト代等は自己負担）で行われること', 1 from articles where slug = 'hello-training';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ハロートレーニング（公共職業訓練・求職者支援訓練）の全体像', '北海道労働局', 'https://jsite.mhlw.go.jp/hokkaido-roudoukyoku/content/contents/002175939.pdf', '2026-10-07'::date, '離職者訓練の訓練期間が概ね3か月〜2年であること、求職者支援訓練の期間が2〜6か月であること、学卒者訓練・在職者訓練は有料であること、訓練コースの例', 2 from articles where slug = 'hello-training';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ハロートレーニング（公的職業訓練）Q＆A', '愛知労働局', 'https://jsite.mhlw.go.jp/aichi-roudoukyoku/kunren_seido.html', '2026-10-07'::date, '施設内訓練（ポリテクセンターや都道府県の職業能力開発校など）と委託訓練の違い、訓練コースの例', 3 from articles where slug = 'hello-training';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '受講中の給付金について', '東京労働局', 'https://jsite.mhlw.go.jp/tokyo-roudoukyoku/hourei_seido_tetsuzuki/shokugyou_kunren/newpage_00010.html', '2026-10-07'::date, '雇用保険の受給資格者が訓練中に受け取れる基本手当・受講手当（日額500円）・通所手当（上限月42,500円）', 4 from articles where slug = 'hello-training';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '雇用保険制度の概要（職業安定分科会 資料）', '厚生労働省', 'https://www.mhlw.go.jp/content/11601000/001145178.pdf', '2026-10-07'::date, '技能習得手当のうち受講手当は日額500円で上限20,000円（40日分）であること', 5 from articles where slug = 'hello-training';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '受講あっせん（受講指示）のメリット', '愛知労働局・ハローワーク', 'https://jsite.mhlw.go.jp/aichi-hellowork/content/contents/001725208.pdf', '2026-10-07'::date, '受講指示を受けると、所定給付日数分の支給が終わったあとも訓練終了日まで基本手当が支給されること', 6 from articles where slug = 'hello-training';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業訓練（ハロートレーニング）申込みの流れについて', 'ハローワーク上野（東京労働局）', 'https://jsite.mhlw.go.jp/tokyo-hellowork/list/ueno/kyushokusha/hellotraining.html', '2026-10-07'::date, '求職申込み・職業相談、受講申込み、選考（書類・面接・筆記など）、合格後のハローワークでの手続き、受講開始という流れ', 7 from articles where slug = 'hello-training';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '令和７年４月以降に教育訓練等を受ける場合、給付制限が解除され、基本手当を受給できます', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000160564_00045.html', '2026-10-07'::date, '2025年4月以降に公共職業訓練等を受けた（受けている）場合に、自己都合離職の給付制限が解除されること', 8 from articles where slug = 'hello-training';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '教育訓練給付金', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/jinzaikaihatsu/kyouiku.html', '2026-10-07'::date, '教育訓練給付金は厚生労働大臣が指定した講座の費用の一部（一般教育訓練は20％、上限10万円）を支給する制度であること', 9 from articles where slug = 'hello-training';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'hello-training' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"8c8ac3370c400ef4ce89ac5007ff360bd1633bdee83984401fba3e04cfe95d2d","findings":[]}'::jsonb from articles where slug = 'hello-training';
update articles set status = 'published' where slug = 'hello-training';

-- article: hellowork-tsukaikata (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('hellowork-tsukaikata', 'article', 'ハローワークの使い方は？求職申込みから紹介状・書類の添削・面接練習まで、在職中に使うときのことも', 'ハローワークは、求職申込みをすると、求人の検索だけでなく、職業相談、紹介状を使った応募、応募書類の添削や面接に向けた相談まで、無料で使えます。在職中でも相談できます。求職申込みのしかた、相談で聞けることと切り出し方の例、紹介状とオンライン自主応募の違いを紹介します。', 'ハローワークは名前を知っていても、「失業した人が行くところ」「何をしてくれるのかよく分からない」と感じている人は多いかもしれません。

先に結論を言うと、ハローワークは**求職申込みをすれば、求人を探すだけでなく、職業相談、紹介状を使った応募、応募書類の添削や面接に向けた相談まで、無料で使える窓口**です。仕事を辞めていなくても相談できます。

ハローワークと転職サイト・転職エージェントの違いは[転職サイト・転職エージェント・ハローワークの違いは？](/articles/tenshoku-service-chigai)で紹介しています。この記事では、ハローワークを**実際にどう使うか**に絞って、順番に説明します。

## ハローワークでできること

主にできることは、次のとおりです。

| できること | 中身 |
| --- | --- |
| 求人を探す | ハローワークに出ている求人を、窓口やパソコン・スマホで検索する |
| 職業相談 | どんな仕事が合うか、求人の内容、応募のしかたなどを職員に相談する |
| 紹介を受けて応募する | 職員が会社に連絡し、紹介状を出してもらって応募する |
| 応募書類・面接の相談 | 履歴書・職務経歴書の添削や、面接に向けた相談を受ける |
| セミナー | 応募書類の作り方やビジネスマナーなどの講座を受ける |

利用は無料です。セミナーの内容や開催日は窓口ごとに違うので、利用するハローワークで確認しましょう。

## 在職中でも使える？

使えます。在職中でも職業相談を受けられると案内している労働局があります。夜間や土曜日に相談を受け付けている窓口もあるので、仕事の休みに合わせて行けるかを確認しておきましょう。

働きながら転職活動をする場合の進める順番や時間の作り方は、[働きながらの転職活動、何から？](/articles/zaishoku-tenshoku-susumekata)で紹介しています。

## 使い方の流れ

はじめて使うときは、次の順番で進めるとスムーズです。

```figure
type: steps
title: ハローワークの使い方の流れ
items:
  - label: 求職申込み
    text: オンラインで事前に登録してから窓口へ
  - label: 求人を探す
    text: 窓口やマイページで検索する
  - label: 職業相談
    text: 気になる求人や悩みを職員に相談する
  - label: 紹介状で応募
    text: 職員が会社に連絡し、紹介状を出す
  - label: 書類と面接の相談
    text: 添削や面接に向けた相談を受ける
```

### 1. まず求職申込みをする

職業相談などを受けるには、求職申込み（求職登録）が必要です。窓口で申し込むほか、ハローワークインターネットサービスから事前にオンラインで登録しておくこともできます。事前に希望の職種や勤務時間などを入力しておくと、窓口での手続きが進めやすくなります。

求職申込みをすると、求職番号が書かれた「ハローワーク受付票」を使って手続きをします。必要な持ち物は、雇用保険の手続きもするかどうかなどで変わるので、行く前に利用するハローワークに確認しておくと安心です。

### 2. 求人を探す

求人は窓口でも、パソコンやスマホからでも探せます。求職者マイページを開設すると、自宅から求人を検索したり、検索条件を保存したりできます。

気になる求人は、**求人番号を控えておきましょう**。窓口で相談したり、紹介状をもらったりするときに使います。

### 3. 職業相談で聞いてみる

職業相談では、求人の内容だけでなく、「どんな仕事が合いそうか」「未経験で応募できる求人はあるか」といったことも相談できます。うまく話せるか不安なら、次のように切り出してみてください（仮の例）。

> 「販売の仕事を3年ほどしていて、土日休みの事務の仕事に移りたいと考えています。未経験でも応募できる求人があるか、相談させてください。」

> 「この求人に興味があるのですが、仕事内容の『一般事務など』の中身がよく分かりません。会社に確認していただくことはできますか。」

**今の仕事・やりたいこと・困っていること**の3つを短く伝えると、相談が進めやすくなります。

## 紹介状とオンライン自主応募の違い

ハローワークの求人に応募する方法は、大きく2つあります。

| 応募のしかた | どうやって？ | 注意すること |
| --- | --- | --- |
| 紹介状で応募 | 窓口などで職員が会社に連絡し、紹介状を出す | 原則はこの方法 |
| オンライン自主応募 | 「オンライン自主応募可」の求人に、マイページから直接応募する | ハローワークの紹介にはあたらない |

### 紹介状をもらって応募する

窓口で応募したい求人票か、求人番号を控えたメモを見せると、職員が応募条件を確認し、会社に連絡したうえで紹介状を渡してくれます。オンラインや電話の相談で紹介を受けた場合は、マイページから紹介状を受け取れることもあります。

紹介状をもらうときは職員が応募条件を確認するので、気になる点（勤務時間、休日、未経験でも応募できるかなど）があれば、そのときに相談しておきましょう。応募前に疑問を減らしておくと、面接で慌てずに済みます。

### オンライン自主応募は、再就職手当に注意

オンライン自主応募は手軽ですが、ハローワークの職業紹介にはあたりません。そのため、**「ハローワークの紹介」を条件にしている再就職手当などの給付の対象にならない**ことがあります。仕事を辞めて失業手当を受けている人は、とくに注意しましょう。再就職手当のしくみは[再就職手当とは？](/articles/saishushoku-teate)で紹介しています。

## 応募書類の添削・面接の相談

ハローワークでは、希望に応じて履歴書や職務経歴書の添削、面接に向けた相談を受けられます。面接の練習を予約制で行っている窓口もあります。

相談に行くときは、次のものを持っていくと話が早く進みます。

```figure
type: checklist
title: 書類・面接の相談に持っていくもの
items:
  - 書きかけの履歴書・職務経歴書
  - 応募したい求人の求人票（求人番号）
  - 聞きたいことのメモ
  - 面接で聞かれて困った質問のメモ
```

切り出し方の例（仮の例）：

> 「この求人に応募しようと思っています。職務経歴書を書いてみたのですが、接客の経験がうまく伝わっているか見ていただけますか。」

## 20代なら、若者向けの窓口もある

正社員を目指すおおむね35歳未満の人は、「わかものハローワーク」や、ハローワークの中の若者向けの窓口も使えます。担当者制で、職業相談から応募準備のサポートまで無料で受けられます。同じ担当者に続けて相談できるので、何度か通って準備を進めたい人に向いています。

パソコンなどのスキルを身につけてから応募したい場合は、ハローワークで職業訓練の相談もできます。訓練のしくみは[ハロートレーニング（公共職業訓練）とは？](/articles/hello-training)で紹介しています。', 'review', false, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, 'ハローワークの使い方｜求職申込み・紹介状・面接練習', 'ハローワークは何ができて、どう使う？求職申込み（オンラインの事前登録）、求人の探し方、職業相談での切り出し方の例、紹介状とオンライン自主応募の違い、応募書類の添削や面接の相談、在職中でも使えるかを紹介します。', array['tenshoku-service-chigai', 'hello-training', 'saishushoku-teate', 'mensetsu-ochita-furikaeri', 'shorui-senkou-tooranai']::text[], '{}'::text[], array['seishain']::text[], array['hajimete', 'freeter']::text[], array['ハローワークって、', '何ができるの？']::text[], null, false, '[{"q":"働きながらでも、ハローワークを使えますか？","a":"使えます。在職中でも職業相談を受けられると案内している労働局があります。相談を受けるには求職申込み（求職登録）が必要で、窓口のほか、ハローワークインターネットサービスから事前にオンラインで登録しておく方法もあります。夜間や土曜日に相談を受け付けている窓口もあるので、利用するハローワークで確認しましょう。"},{"q":"ハローワークの求人に応募するには、必ず窓口に行く必要がありますか？","a":"ハローワークの求人に応募するときは、原則として紹介状が必要で、窓口で受け取るほか、オンラインで紹介を受けられる場合もあります。また、「オンライン自主応募可」の求人には、求職者マイページから直接応募できます。ただし、オンライン自主応募はハローワークの紹介にあたらないので、再就職手当など「ハローワークの紹介」を条件にする給付の対象にならないことに注意しましょう。"},{"q":"ハローワークで面接の練習はできますか？","a":"ハローワークでは、希望に応じて応募書類の添削や面接に向けた相談を無料で受けられます。面接の練習を予約制で行っている窓口もあります。実施の有無や予約のしかたは窓口によって違うので、職業相談のときに「面接の練習をお願いできますか」と聞いてみましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「ハローワークとは何か・転職サイトやエージェントとの違い」は既存記事 tenshoku-service-chigai に任せ、この記事は「実際にどう使うか」の手順に絞る。求職申込み→求人検索→職業相談→紹介状で応募→書類・面接の相談の順に、窓口での切り出し方の例と、紹介状とオンライン自主応募の違い（再就職手当への影響）を具体的に示す","quotes":[{"source_url":"https://www.mhlw.go.jp/content/11600000/001441500.pdf","text":"ご希望等に応じて応募書類（履歴書・職務経歴書など）の添削や面接に向けた相談も行っております。ご利用は無料。応募書類の作成方法、ビジネスマナーなど様々な就職セミナーを実施（官公庁サイトに直接接続できなかったため、検索結果の記載で確認）","used_in":"応募書類の添削・面接の相談"},{"source_url":"https://www.hellowork.mhlw.go.jp/member/mem_possible.html","text":"求職者マイページを開設すると、自宅のパソコン等から、求人情報検索（検索条件の保存など）、求人への直接応募（オンライン自主応募）、求職活動状況の確認などを利用できる。オンライン自主応募は職業紹介にあたらないため、ハローワークの紹介を要件とする再就職手当等の対象外（検索結果の記載で確認）","used_in":"紹介状とオンライン自主応募の違い"},{"source_url":"https://jsite.mhlw.go.jp/hyogo-roudoukyoku/newpage_00391.html","text":"在職中の方も、相談は可能です。ハローワークでの相談を希望される方は、ハローワークの求職登録が必要です。ハローワークインターネットサービスから事前に求職登録（オンライン登録）を行うこともできる（検索結果の記載で確認）","used_in":"在職中でも使える？／まず求職申込みをする"},{"source_url":"https://jsite.mhlw.go.jp/saitama-hellowork/content/contents/002731646.html","text":"求人に応募するには「紹介状」が必要です。ご希望の求人票またはその求人番号を控えたメモ等を受付にお持ちください。窓口の担当者が応募条件等を確認、求人者へ連絡のうえ、紹介状をお渡しします（検索結果の記載で確認。ページ題名は直接読めなかったため、内容に沿った題名で記録した）","used_in":"紹介状をもらって応募する"},{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000181329.html","text":"正社員を目指す若者（おおむね35歳未満）を対象に、担当者制による職業相談から応募準備のサポート、就職後の職場定着支援まで一貫した支援を無料で実施（検索結果の記載で確認）","used_in":"20代なら若者向けの窓口も"}],"not_used":["拠点数や就職者数などの数字は年度で変わるため書かない","求職申込みに必要な持ち物は窓口や手続き（雇用保険の手続きをするかどうか）で変わるため、具体的に並べず「窓口で確認」とした","夜間・土曜の開庁は一部の窓口の例しか確認できなかったので、「受け付けている窓口もある」にとどめた"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'hellowork-tsukaikata' and c.slug = 'junbi' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'hellowork-tsukaikata' and c.slug = 'seido' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ハローワークのご案内（リーフレット）', '厚生労働省', 'https://www.mhlw.go.jp/content/11600000/001441500.pdf', '2026-10-09'::date, 'ハローワークは国（厚生労働省）が運営し、利用は無料であること。希望に応じて応募書類の添削や面接に向けた相談を行っていること、応募書類の作成方法などのセミナーを行っていること', 0 from articles where slug = 'hellowork-tsukaikata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '求職者マイページでできること（ハローワークインターネットサービス）', '厚生労働省', 'https://www.hellowork.mhlw.go.jp/member/mem_possible.html', '2026-10-09'::date, '求職者マイページで求人検索（検索条件の保存）、オンライン自主応募、応募状況の確認などができること。オンライン自主応募は職業紹介にあたらず、ハローワークの紹介を要件とする再就職手当等の対象にならないこと', 1 from articles where slug = 'hellowork-tsukaikata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'お仕事を探す（職業相談・紹介）', '兵庫労働局', 'https://jsite.mhlw.go.jp/hyogo-roudoukyoku/newpage_00391.html', '2026-10-09'::date, '在職中でも相談できること。相談には求職登録が必要で、窓口のほか、ハローワークインターネットサービスから事前にオンラインで登録できること', 2 from articles where slug = 'hellowork-tsukaikata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '求人への応募と紹介状についての案内', '埼玉労働局（ハローワーク）', 'https://jsite.mhlw.go.jp/saitama-hellowork/content/contents/002731646.html', '2026-10-09'::date, '求人に応募するには紹介状が必要なこと。求人票や求人番号を窓口に持っていくと、担当者が応募条件を確認し、求人者に連絡したうえで紹介状を渡すこと。オンラインで紹介を受けた場合はマイページから紹介状を受け取れること', 3 from articles where slug = 'hellowork-tsukaikata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'わかものハローワーク', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000181329.html', '2026-10-09'::date, '正社員を目指すおおむね35歳未満の若者を対象に、担当者制の職業相談から応募準備のサポートまで無料で行っていること', 4 from articles where slug = 'hellowork-tsukaikata';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'hellowork-tsukaikata' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"44de9f177887cd30674bddf799e5736e74cf67badce033369d5236831158444e","findings":[]}'::jsonb from articles where slug = 'hellowork-tsukaikata';
update articles set status = 'published' where slug = 'hellowork-tsukaikata';

-- article: iryo-jimu-mikeiken (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('iryo-jimu-mikeiken', 'article', '医療事務ってどんな仕事？受付・会計・レセプトの中身と、未経験から目指すときの確認', '医療事務は、病院やクリニックで受付・会計をし、医療費を請求するための書類（レセプト）を作る仕事です。それぞれの仕事の中身、資格が民間資格であることの意味、シフトや休日など働き方で確かめたいことを紹介します。', '「医療事務なら、未経験からでも目指せそう」。そう考えて調べ始めると、「レセプト」「資格」など、よく分からない言葉がたくさん出てきます。

先に結論を言うと、医療事務は、**病院やクリニックで受付・会計をし、医療費を請求するための書類（レセプト）を作る仕事**です。医療事務の資格は**民間資格で、働くために必須のものではありません**。資格を取るかどうかを決める前に、仕事の中身と働き方（診療時間・土曜の勤務など）を確かめておくと、入ってからのずれが少なくなります。

この記事で分かること：

- 受付・会計・レセプトの**仕事の中身**
- 医療事務の**資格の位置づけ**
- 未経験から目指すときの**準備**
- シフトや休日など**働き方で確かめたいこと**

事務職全体の種類は[未経験で事務職を目指す前に知っておきたいこと](/articles/jimu-mikeiken-mae)にまとめています。

## 医療事務って、どんな仕事？

厚生労働省の職業情報提供サイト「job tag」では、医療事務は、医療機関で**外来の受付や医療費の会計、入院・退院の手続き**などをし、**診療報酬を請求するための書類（レセプト）を作る**仕事として紹介されています。

| 仕事 | 主にすること |
| --- | --- |
| 受付 | 来院した患者さんの受付、保険証などの確認、診察の順番の案内、電話での予約の対応 |
| 会計 | カルテをもとに診療の内容をパソコンに入力し、患者さんが払う金額を出して、お金を受け取る |
| レセプト | 1か月分の診療内容をまとめて、医療費を請求するための書類を作る |
| 入退院の手続き | 入院する人の書類の受付や、退院のときの会計（病院の場合） |

どこまでを担当するかは職場によって違います。受付と会計を交代で担当する職場もあれば、担当が分かれている職場もあります。求人の仕事内容の欄で確かめましょう。

## レセプトって何をする？

レセプトは**診療報酬明細書**のことです。患者さんは窓口で医療費の一部を払いますが、残りは健康保険の側に請求します。そのための書類がレセプトです。

社会保険診療報酬支払基金の説明では、レセプトは**カルテから1か月分の診療内容をまとめて**作り、医療機関は**診療の翌月10日まで**に提出します。内容によっては、医療機関に戻されて出し直すこともあります。

```figure
type: steps
title: レセプトの流れ
items:
  - label: 毎日の入力
    text: 診療の内容を会計のたびにパソコンへ入力
  - label: 1か月分をまとめる
    text: 患者さんごとに1か月の診療内容を集める
  - label: 内容を確かめる
    text: 入力のもれや間違いがないかを点検する
  - label: 提出する
    text: 診療の翌月10日までに提出する
```

提出の期限があるので、職場によっては**月の初めにレセプトの作業が重なって忙しくなる**ことがあります。忙しい時期に残業があるかどうかは、面接で聞いておきたいところです。

job tagでは、デジタル化によって点数を書き写す作業は自動化が進み、**計算された結果を確かめる**ことに重点が移っていると紹介されています。同じ作業をくり返す中で、ミスに気づく注意力が求められる仕事です。

## 資格は必要？民間資格であることの意味

job tagでは、医療事務の仕事に就くために**学歴や資格は必須ではない**とされています。医療事務の資格はいくつもありますが、どれも**民間の団体が実施する資格**です。

民間資格であることは、次のように考えておくとよいでしょう。

- **なくても応募できる求人がある**：「未経験可」「資格不問」の求人も出ています
- **学んだ内容は仕事に直接つながる**：点数の計算やレセプトの作り方は、入社後にも使う知識です
- **どの資格が評価されるかは職場によって違う**：応募条件に資格名が書かれていないか確かめましょう
- **試験の内容や実施状況は団体ごとに違う**：受ける前に、実施団体の公式情報で最新の内容を確かめましょう

資格を先に取るか、働きながら覚えるかで迷ったら、まずは気になる求人をいくつか見て、資格が「必須」「歓迎」「不問」のどれになっているかを数えてみてください。資格を取る前に考えたいことは[未経験の転職に資格は必要？](/articles/mikeiken-shikaku)でくわしく紹介しています。

## 未経験から目指すとき、何を準備する？

### 接客の経験はそのまま使える

受付や会計は、患者さんと直接話す仕事です。体調が悪くて不安な人、待ち時間が長くていらだっている人に対応することもあります。接客や販売で身についた**声かけ、待っている人への気配り、お金のやりとりの正確さ**は、そのまま活かせます。

面接では、たとえば次のように話せます。

> 「ドラッグストアのレジで、お会計とあわせて、待っているお客さまへの声かけを担当していました。医療事務でも、患者さんが安心して待てるような受付をしたいと考えています。」

### パソコンの入力に慣れておく

会計やレセプトでは、専用のソフトに入力する作業が中心になります。キーボードで文字や数字を正確に入力することに慣れておくと安心です。パソコンに自信がないときは、[PCが得意じゃなくても、事務職は目指せる？](/articles/pc-nigate-jimu)の練習のしかたも参考にしてください。

## 働き方で確かめたいこと

医療事務の働き方は、**病院やクリニックの診療時間**に合わせて決まります。job tagでは、医院・診療所ではパートタイムで働く人が多いとされています。正社員を希望する場合は、雇用形態の欄をよく確かめましょう。

```figure
type: checklist
title: 医療事務の求人で確かめたいこと
items:
  - 雇用形態（正社員・パート・派遣）
  - 診療時間と、勤務時間・シフトの組み方
  - 土曜の診療と、休日の取り方
  - レセプトの時期の残業
  - 受付・会計・レセプトのどこを担当するか
  - 未経験の人に誰が教えるか
```

面接では、こんな聞き方ができます。

- 土曜日の診療がある場合、シフトはどのように組んでいますか
- 月の初めのレセプトの時期は、残業はどのくらいありますか
- 未経験で入った方は、最初の数か月でどの仕事から担当していますか

「土日休みを優先したい」という人は、診療日を見て、土曜や日曜に勤務があるかどうかを先に確かめておきましょう。', 'review', false, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '医療事務の仕事内容｜受付・会計・レセプトと資格の考え方', '医療事務の仕事内容を、受付・会計・レセプト（診療報酬明細書）に分けて紹介します。医療事務の資格は民間資格で必須ではないこと、未経験から目指すときの準備、シフトや土曜の勤務など求人で確かめたい働き方が分かります。', array['jimu-mikeiken-mae', 'mikeiken-shikaku', 'pc-nigate-jimu', 'uketsuke-shigoto']::text[], array['jimu']::text[], array['mikeiken-shokushu', 'office']::text[], array['sekkyaku', 'pc-mikeiken']::text[], array['医療事務、', '未経験から目指せる？']::text[], null, false, '[{"q":"医療事務の資格がないと働けませんか？","a":"医療事務として働くのに、法律で決まった資格（国家資格）はありません。医療事務の資格は民間の団体が実施しているもので、必須ではありません。ただ、求人によっては資格を応募条件や歓迎条件にしていることがあるので、気になる求人の条件を確かめましょう。"},{"q":"レセプトって何ですか？","a":"診療報酬明細書のことで、病院やクリニックが、患者さんが窓口で払った分以外の医療費を、健康保険の側に請求するための書類です。カルテをもとに1か月分の診療内容をまとめて作ります。今は電子のレセプトが原則で、パソコンの専用ソフトで作るのが一般的です。"},{"q":"医療事務は土日休みですか？","a":"職場によって違います。病院やクリニックの診療日に合わせて働くので、土曜に診療しているところでは土曜に勤務があり、平日に休みを取るシフトのこともあります。求人の休日欄と、診療時間（午前・午後や夜の診療があるか）をあわせて確認しましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"医療事務を「受付・会計・レセプト」に分けて、毎日どんな作業をするかを具体的にする。資格は民間資格で必須ではないことをはっきり書き、資格を取る前に求人の条件と働き方（診療時間・土曜・シフト）を確かめる順番をすすめる","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/443","text":"医療機関で、診療報酬を請求するための書類（レセプト）を作成し、窓口で外来の受付や医療費の会計、入退院の手続きなどを行う。カルテの内容を基に診療行為をコンピュータへ入力して点数化し、患者の自己負担額を算出する。学歴や資格は入職の必須条件ではなく、関連する民間資格がある。医院・診療所ではパートタイムが多い。デジタル化で転記作業は自動化されつつあり、算定結果の確認に重点が移っている（job tag に直接接続できなかったため、検索結果に表示されたページ内容で確認）","used_in":"医療事務って、どんな仕事？／資格は必要？／働き方で確かめたいこと"},{"source_url":"https://www.ssk.or.jp/smph/shinryohoshu/gyomuflow/index.html","text":"傷病名、投薬、注射等の診療内容を記入したカルテから、1か月の診療内容を集約した保険請求を行うための診療報酬明細書（レセプト）を作成し、診療翌月10日までに支払基金に提出する。判断が難しいものは医療機関に返戻される（検索結果に表示されたページ内容で確認）","used_in":"レセプトって何をする？"}],"not_used":["job tag の求人賃金の数字は、検索結果の要約に出ていたが、ページを直接開いて時点と値を確かめられなかったので書かない","個別の医療事務資格の名前・合格率・実施回数は、終了した試験があるとの情報もあり、公式で最新の状況を確かめられなかったので書かない（各団体の公式情報で確かめるよう書いた）","「大きな病院ほど分業化している」という説明は民間サイトの情報のみだったので、断定せず「職場によって担当の分け方が違う」とした"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'iryo-jimu-mikeiken' and c.slug = 'shokushu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'iryo-jimu-mikeiken' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '医療事務 - 職業詳細（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/443', '2026-10-09'::date, '医療事務の仕事内容（受付、会計、入退院の手続き、カルテをもとにした診療行為の入力とレセプト作成）、入職に資格が必須ではなく関連する民間資格があること、集中力と注意力が求められること、医院・診療所ではパートタイムが多いこと、点数の転記の自動化が進み確認に重点が移っていること', 0 from articles where slug = 'iryo-jimu-mikeiken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '診療報酬の審査・支払業務の流れ', '社会保険診療報酬支払基金', 'https://www.ssk.or.jp/smph/shinryohoshu/gyomuflow/index.html', '2026-10-09'::date, 'レセプトがカルテから1か月の診療内容を集約した請求のための明細書であること、医療機関が診療の翌月10日までに提出すること、内容によっては医療機関に返戻されること', 1 from articles where slug = 'iryo-jimu-mikeiken';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'iryo-jimu-mikeiken' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"788df7062617e2886e7afb8d0b87d90cdc6a819cb0a55ddc92ffeaed8a153504","findings":[]}'::jsonb from articles where slug = 'iryo-jimu-mikeiken';
update articles set status = 'published' where slug = 'iryo-jimu-mikeiken';

-- article: jiko-bunseki-yarikata (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('jiko-bunseki-yarikata', 'article', '転職のための自己分析のやり方｜経験の棚卸し・ゆずれない条件・やりたくないことの書き出し例', '転職の自己分析は、性格をくわしく調べることより「やってきたこと」「ゆずれない条件」「やりたくないこと」の3つを紙に書き出すことから始めると進めやすくなります。書き出しのワーク例と、まとめ方、書類や面接での使い方、無料で使える公的なツールを紹介します。', '「転職するなら、まず自己分析」と言われても、何を書けばいいのか分からず手が止まる人は多いです。

先に結論を言うと、転職のための自己分析は、性格をくわしく調べることより、次の**3つを紙に書き出す**ことから始めると進めやすくなります。

1. **やってきたこと**（経験の棚卸し）
2. **ゆずれない条件**
3. **やりたくないこと**

この3つがあると、求人を選ぶときの基準になり、履歴書や面接で話す材料にもなります。

この記事で分かること：

- 3つの書き出しの**やり方と例**
- 書き出したものの**まとめ方**
- 書類・面接での**使い方**
- ひとりでまとまらないときに使える**無料のツール**

## 転職の自己分析は、何のためにやる？

転職の自己分析には、大きく2つの役割があります。

- **求人を選ぶ基準を作る**：基準がないと、求人を見るたびに「こっちもいいかも」と迷い続けてしまいます
- **書類と面接の材料を作る**：「これまで何をしてきたか」「なぜこの仕事なのか」を、自分の言葉で話せるようになります

「自分はどんな人間か」を深く掘り下げるより、**転職先を選ぶことと、自分を説明すること**に使えるかどうかを意識すると、書くことがしぼれます。

## ワーク1：やってきたことを書き出す（経験の棚卸し）

最初は、これまでの仕事やアルバイトで**やってきたこと**を書き出します。「たいしたことはしていない」と思っても、細かく分けると書けることは意外とあります。

ひとつの仕事ごとに、次の4つを書き出してみましょう。

```figure
type: checklist
title: 経験を書き出すときの4つの問い
items:
  - 毎日やっていた作業は？
  - 自分なりに工夫したことは？
  - 任されたこと・頼まれたことは？
  - ほめられたこと・お礼を言われたことは？
```

書き出し例（飲食店のアルバイトの場合・仮の例）：

| 問い | 書き出し |
| --- | --- |
| 毎日やっていた作業 | 注文を受ける、レジ、席への案内、閉店後の売上の集計 |
| 工夫したこと | 混む時間の前に、よく出るメニューの準備を先に済ませた |
| 任されたこと | 新人アルバイトに仕事の流れを教えた |
| ほめられたこと | 「説明が分かりやすい」と常連のお客さまに言われた |

ポイントは、**できるだけ具体的な行動で書く**ことです。「接客をがんばった」ではなく「混む時間の前に準備を済ませた」のように、何をしたかが分かる書き方にすると、あとで職務経歴書や面接でそのまま使えます。

時期や順番が正確に思い出せなくても、まずは思いつくところから書いて大丈夫です。

## ワーク2：ゆずれない条件を書き出す

次に、次の仕事で**ゆずれない条件**を書き出します。条件を全部「ゆずれない」にすると、当てはまる求人がほとんどなくなってしまうので、2つに分けます。

- **ゆずれない**：これがないと続けられない、生活できない
- **できれば**：あるとうれしいが、ほかの条件しだいでは目をつぶれる

書き出し例（仮の例）：

| 項目 | ゆずれない | できれば |
| --- | --- | --- |
| 給料 | 今の手取りより下げない | 数年後に上がる見通しがある |
| 休み | 土日のどちらかは休める | 土日とも休み |
| 勤務地 | 家から通える範囲 | 乗り換えなしで通える |
| 働き方 | 正社員 | 研修がある |

「ゆずれない」は**3つくらいまで**にしぼるのがおすすめです。しぼれないときは、「この条件がなかったら、本当に応募しない？」と自分に聞いてみましょう。

給料の「下げられない金額」は、気持ちではなく、生活費から計算して決めると迷いにくくなります。

## ワーク3：やりたくないことを書き出す

3つめは、**やりたくないこと**です。やりたいことが分からなくても、「これはつらかった」「これは避けたい」は書けることが多いです。

書き出し例（仮の例）：

- 立ちっぱなしの仕事は、体力的に続けられない
- シフトが毎週変わって、予定が立てられないのがつらい
- 一人で売上の数字を追いかけ続けるのは向いていなかった

書き出したら、**「なぜつらかったのか」を一言そえる**と、次の仕事を選ぶヒントになります。たとえば「シフトが毎週変わるのがつらい」なら、「休みの曜日が決まっている仕事」を探す、という具合です。

注意したいのは、やりたくないことは**面接でそのまま話す材料ではない**ということです。面接では「〇〇が嫌だった」ではなく「〇〇できる働き方をしたい」と、前向きな言い方に置き換えて伝えます。

## 3つの書き出しを、ひとつにまとめる

3つのワークが終わったら、次の形で**1〜2行にまとめて**みます。これが、求人を選ぶときの「自分の基準」になります。

```figure
type: steps
title: 書き出しを1〜2行にまとめる
items:
  - label: やってきたこと
    text: 経験から、続けられた作業・得意な作業を選ぶ
  - label: ゆずれない条件
    text: ゆずれない条件を3つくらいまでにしぼる
  - label: やりたくないこと
    text: 避けたい働き方を、望む働き方に言いかえる
  - label: 1〜2行にまとめる
    text: 「〇〇を活かして、△△な働き方で、□□の仕事」
```

まとめ方の例（仮の例）：

> 接客で続けてきた「人の話を聞いて、分かりやすく説明する」ことを活かして、休みの曜日が決まっている働き方で、電話やメールでお客さまの問い合わせに答える仕事がしたい。

うまくまとまらなくても大丈夫です。求人を見たり、仕事内容を調べたりするうちに、書き足したり書き直したりしていけば十分です。

## 書類と面接で、どう使う？

書き出したものは、そのまま応募書類と面接の材料になります。

| 書き出し | 使うところ | 使い方の例 |
| --- | --- | --- |
| やってきたこと | 職務経歴書・自己PR | 「新人アルバイトに仕事の流れを教えていました」 |
| ゆずれない条件 | 求人を選ぶとき | 応募する前に、条件に合うかを確かめる |
| やりたくないこと | 転職理由 | 「休みの曜日が決まった働き方で、長く続けたい」 |
| まとめた1〜2行 | 志望動機 | 経験と応募する仕事のつながりを話す |

面接で「あなたの強みは？」と聞かれたときも、ワーク1の「工夫したこと」「ほめられたこと」から、具体的な場面をひとつ選んで話すと、説得力が出ます。

職務経歴書の書き方は[アルバイト経験だけの職務経歴書、何を書けばいい？](/articles/shokumu-keirekisho-arubaito)、志望動機の組み立て方は[未経験職種の志望動機、何を書けばいい？](/articles/shiboudouki-mikeiken)で紹介しています。接客の経験をどう言いかえるか迷ったら、[接客経験は転職でどう活かせる？](/articles/sekkyaku-keiken-ikasu)も参考になります。

## ひとりでまとまらないときに使える無料のツール

書き出しが進まないときは、厚生労働省が用意している無料のツールを使ってみる方法もあります。

- **職業情報提供サイト（job tag）**：職業ごとの仕事内容や必要な知識・スキルを調べられます。仕事への興味を調べる「職業興味検査」や、仕事で大切にしたいことを調べる「仕事価値観検査」などの自己診断ツールもあります
- **しごと能力プロフィール（job tag）**：これまでの職歴から、身につけたスキルや知識を整理したプロフィールを作り、近い職業を検索できます
- **ジョブ・カード**：職務経歴の整理から、自分の考え方やこだわりの整理、これからのプランづくりまで、シートに沿って順に書き進められます。様式はダウンロードでき、正確な時期が分からなくても記入を進めてよいとされています

診断ツールの結果は、**そのまま仕事を決めるためのものではなく、考えるきっかけ**として使いましょう。job tag でも、診断結果の職業リストは学歴・職務経験・資格などを考慮していないため、参考として使うよう案内されています。

やりたい仕事そのものが思い浮かばないときは、[やりたい仕事が分からない。自分に合う仕事の探し方3ステップ](/articles/shigoto-sagashikata)で、候補をしぼる方法を紹介しています。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '転職の自己分析のやり方｜3つの書き出しワークと例', '転職のための自己分析は何をすればいい？経験の棚卸し、ゆずれない条件、やりたくないことの3つの書き出しワークを例つきで紹介します。まとめ方と、履歴書・面接での使い方、job tag やジョブ・カードなど無料の公的ツールも分かります。', array['shigoto-sagashikata', 'mikeiken-tenshoku-hajimekata', 'sekkyaku-keiken-ikasu', 'tenshoku-schedule', 'jiko-pr-mikeiken']::text[], '{}'::text[], array['yaritai', 'mikeiken-shokushu']::text[], array['hajimete', 'sekkyaku']::text[], array['自己分析って、', '何を書けばいい？']::text[], null, false, '[{"q":"自己分析にはどのくらい時間をかければいいですか？","a":"決まった時間はありません。最初から完璧にまとめようとせず、まずは3つの書き出し（やってきたこと・ゆずれない条件・やりたくないこと）を一度やってみて、求人を見たり面接を受けたりしながら書き足していくほうが進めやすくなります。"},{"q":"アルバイトや短い職歴しかなくても、自己分析はできますか？","a":"できます。アルバイトでも、毎日やっていた作業、自分なりに工夫したこと、任されたこと、ほめられたことは書き出せます。厚生労働省のジョブ・カードでも、正確な時期が分からなくても記入を進めてよいとされていて、まずは思い出せることから書くのがおすすめです。"},{"q":"自己診断のツールの結果どおりに仕事を選べばいいですか？","a":"結果は、考えるきっかけとして使うのがおすすめです。職業情報提供サイト job tag の職業興味検査などは、結果の職業リストが学歴や職務経験、資格などを考慮していないため参考として使うよう案内されています。結果に出た仕事の内容を調べ、自分の書き出しと照らし合わせてみましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"自己分析を「性格を知る作業」ではなく「求人を選ぶ基準と、書類・面接で話す材料を作る作業」と定義し、3つの書き出し（経験の棚卸し・ゆずれない条件・やりたくないこと）に分けて、書き出し例つきで示す。迷ったら公的な無料ツール（job tag、ジョブ・カード）を使う","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/User","text":"job tag では職業の仕事の内容、求められる知識・スキル、どのような人が向いているかなどを調べられ、自己診断ツールとして職業興味検査、仕事価値観検査などがある（サイトへ直接接続できなかったため、検索結果に表示された内容で確認）","used_in":"ひとりでまとまらないときに使える無料のツール"},{"source_url":"https://shigoto.mhlw.go.jp/User/MyProfile/Step1","text":"しごと能力プロフィールは、これまでの職歴からスキルや知識を可視化して作成し、結果をもとに近い職業を検索できる（検索結果で確認）","used_in":"ひとりでまとまらないときに使える無料のツール"},{"source_url":"https://shigoto.mhlw.go.jp/User/faq","text":"職業興味検査と仕事価値観検査では、回答者の学歴・就業経験・取得資格・専門性は判定に使われていない。職業リストは興味や価値観の特徴との類似度から作成されているため、参考として活用する（Q17。検索結果に表示された内容で確認）","used_in":"ひとりでまとまらないときに使える無料のツール"},{"source_url":"https://www.job-card.mhlw.go.jp/guidance/jobseeker","text":"求職者は職務経歴シート、職業能力証明シート、キャリア・プラン作成補助シート、キャリア・プランシートの順に作るよう案内。職務経歴は正確な時期が分からなくても記入を進めてよい。就業経験のない人は、書ける内容がない場合は職務経歴シートなどを作成しなくてもよい（検索結果で確認）","used_in":"ひとりでまとまらないときに使える無料のツール"},{"source_url":"https://www.job-card.mhlw.go.jp/guidance/download_blank","text":"ジョブ・カードの様式は PDF と Excel でダウンロードできる（検索結果で確認）","used_in":"ひとりでまとまらないときに使える無料のツール"}],"not_used":["「自己分析は〇時間・〇日で終わらせる」といった目安は根拠がないため書かない","job tag の「ポータブルスキル見える化ツール」は、主にミドルシニア層を想定したものと案内されているため、読者向けには紹介しない","性格診断などの民間の診断サービスは、特定のサービスに触れないため扱わない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'jiko-bunseki-yarikata' and c.slug = 'junbi' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'jiko-bunseki-yarikata' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業情報提供サイト（job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User', '2026-10-09'::date, '仕事の内容や必要なスキル・知識などを調べられること。職業興味検査・仕事価値観検査などの自己診断ツールがあること', 0 from articles where slug = 'jiko-bunseki-yarikata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'しごと能力プロフィールの作成（job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/MyProfile/Step1', '2026-10-09'::date, 'これまでの職歴からスキルや知識を整理したプロフィールを作り、近い職業を検索できること', 1 from articles where slug = 'jiko-bunseki-yarikata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'よくあるお問い合わせ（job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/faq', '2026-10-09'::date, '自己診断の結果の職業リストは学歴・職務経験・資格などを考慮していないため、参考として使うこと', 2 from articles where slug = 'jiko-bunseki-yarikata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '求職者の方へ（ジョブ・カード制度総合サイト）', '厚生労働省', 'https://www.job-card.mhlw.go.jp/guidance/jobseeker', '2026-10-09'::date, 'ジョブ・カードで職務経歴の整理から自己理解、キャリア・プランの作成まで順に進められること。正確な時期が分からなくても記入を進めてよいこと。就業経験がない人は職務経歴シートを書ける内容がなければ作らなくてよいこと', 3 from articles where slug = 'jiko-bunseki-yarikata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ジョブ・カード様式のダウンロード', '厚生労働省', 'https://www.job-card.mhlw.go.jp/guidance/download_blank', '2026-10-09'::date, 'ジョブ・カードの様式を無料でダウンロードできること', 4 from articles where slug = 'jiko-bunseki-yarikata';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'jiko-bunseki-yarikata' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"cd180c9f948985aeadea9b24d5d67ab66dadcbb89ed08a90b2eeb3acd0e9d64a","findings":[]}'::jsonb from articles where slug = 'jiko-bunseki-yarikata';
update articles set status = 'published' where slug = 'jiko-bunseki-yarikata';

-- article: jiko-pr-mikeiken (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('jiko-pr-mikeiken', 'article', '未経験の仕事の自己PR、何を書く？アルバイト・接客の経験から強みを見つける方法と例文', '未経験の仕事に応募するときの自己PRは、同じ仕事の経験がなくても、アルバイトや接客で「やってきたこと」から作れます。強みの見つけ方、接客の経験を強みの言葉にする言い換え、自己PRの型、職種別の例文、面接で話すときのコツを紹介します。', '「接客のアルバイトしかしていないのに、自己PRに何を書けばいいの？」。未経験の仕事に応募しようとして、ここで手が止まる人は多いと思います。

先に結論を言うと、未経験の仕事の自己PRは、**同じ仕事の経験がなくても書けます**。大事なのは、**アルバイトや接客で自分がどう考えて動いたか**を、**応募する仕事でどう使うか**までつなげることです。

この記事で分かること：

- アルバイト・接客の経験から**強みを見つける方法**
- 接客の行動を**強みの言葉**にする言い換え
- 自己PRの**型**と、職種別の**例文**（仮の例）
- 面接で**話すとき**のコツ

## 自己PRと志望動機は何が違う？

兵庫労働局が公開しているハローワークのコラムでは、志望動機は「応募先の会社や仕事内容に、なぜ応募したのか」を問われるもの、自己PRは「自分の経験や性格、長所・短所、得意なこと」を問われるものと説明しています。

つまり自己PRは、**「私はこういう人で、こういうことができます」**を伝える欄です。会社への思いは志望動機で書くので、自己PRでは自分の経験に集中しましょう。志望動機の組み立て方は[未経験職種の志望動機、何を書けばいい？](/articles/shiboudouki-mikeiken)で紹介しています。

## 強みは「やってきたこと」から探す

「自分の強みは何か」と考えると、何も出てこないことがあります。そんなときは、強みを考えるのをいったんやめて、**アルバイトで実際にやったこと**を書き出してみましょう。

```figure
type: checklist
title: 強みを見つけるための問い
items:
  - お客さんや店長に、ほめられたことは？
  - 途中から任されるようになった仕事は？
  - 困ったことを、自分なりに工夫して変えたことは？
  - 面倒でも、ずっと続けてきたことは？
  - 周りの人から、よく頼まれることは？
```

ひとつの問いに、ひとつでも答えが出れば十分です。たとえば「店長に、品出しが早くて丁寧だと言われた」「常連のお客さんの好みを覚えていて、声をかけていた」のような、小さなことで構いません。

## 接客の行動を「強みの言葉」にする

書き出したことは、そのままだと「アルバイトでやったこと」です。これを、ほかの仕事でも通じる言葉に置き換えます。

| 接客・販売でやったこと | 強みの言葉にすると | 未経験の仕事での使いどころ |
| --- | --- | --- |
| お客さんの話を聞いて、合う商品をすすめた | 相手の希望を聞き出す力 | 営業、カスタマーサポート |
| 品出しや在庫の数を、間違えないよう確認した | 正確に作業を進める力 | 事務、経理の補助 |
| 混む時間の前に準備をしておいた | 先を読んで段取りする力 | 事務、営業事務 |
| 怒っているお客さんにも落ち着いて対応した | 落ち着いて対応する力 | カスタマーサポート、ITサポート |
| 新しいレジや機械の使い方をすぐ覚えた | 新しいことを覚える力 | ITサポート、事務 |

接客の経験を職種ごとにどう活かすかは、[接客経験は転職でどう活かせる？](/articles/sekkyaku-keiken-ikasu)でもくわしく紹介しています。

## 応募する仕事から、使う強みを選ぶ

強みが複数見つかったら、**応募する仕事で必要とされること**に近いものを選びます。仕事の中身が分からないときは、厚生労働省の職業情報提供サイト「job tag」で、職業ごとの仕事の内容や必要なスキル・知識を調べられます。求人票の「仕事内容」や「求める人物像」もあわせて読み、重なるところを探しましょう。

## 自己PRの型

自己PRは、次の順番で組み立てると、短くまとまります。

```figure
type: steps
title: 未経験の仕事の自己PRの型
items:
  - label: 強み
    text: 最初に、強みをひとことで言う
  - label: 場面と行動
    text: その強みが出た場面と、自分がしたこと
  - label: 結果
    text: どう変わったか、周りの反応
  - label: 活かし方
    text: 応募する仕事で、どう使いたいか
```

### 「強みの言葉」だけでは伝わらない

ハローワーク旭川の案内では、「〇〇ができます」「〇〇の性格です」と書いても根拠がないと、読む側に「なぜ？どうして？どのように？」と疑問を持たせてしまうと説明しています。

> 悪い例：「私の強みはコミュニケーション力です。接客で培った力を御社でも活かしたいです。」

これだと、どんな場面でどう話せるのかが分かりません。**「場面と行動」を具体的に書く**ことで、はじめて強みに根拠が生まれます。

## 職種別の例文（仮の例）

ここからは、型にそって書いた例文です。経験の内容は仮のものなので、自分の経験に置き換えてください。

### 飲食店のアルバイトから事務職へ

> 私の強みは、ミスが起きる原因を見つけて、仕組みで防ぐことです。飲食店のアルバイトで、食材の発注を担当していたとき、数を間違える日があったため、よく使う食材の在庫を書き込む確認表を作り、発注の前に必ず照らし合わせるようにしました。その後、発注の間違いはほとんどなくなり、ほかのスタッフも同じ表を使うようになりました。事務の仕事でも、入力や書類の確認でミスを防ぐ工夫を続けたいと考えています。

### アパレル販売からカスタマーサポートへ

> 私の強みは、相手が本当に困っていることを聞き出すことです。アパレルの販売で、返品の相談に来たお客様の話を聞くうちに、サイズではなく着方に迷っていると分かり、合わせ方を提案したところ、返品せずに使い続けていただけました。お問い合わせの対応でも、言葉の奥にある困りごとを聞き取り、解決につなげたいと考えています。

### ドラッグストアの販売から営業へ

> 私の強みは、お客様の顔と好みを覚えて、次の提案につなげることです。ドラッグストアで〇年働く中で、よく来店される方が使っている商品をメモしておき、新しい商品が入ったときに声をかけるようにしていました。「あなたに聞くと早い」と言っていただけることが増えました。営業の仕事でも、お客様一人ひとりのことを覚え、相手に合った提案をしたいと考えています。

職務経歴書の中で自己PRをどこに書くかは、[アルバイト経験だけの職務経歴書、何を書けばいい？](/articles/shokumu-keirekisho-arubaito)で構成ごとに紹介しています。

## 面接で話すときは

兵庫労働局のコラムでは、書類を書くときに面接で話しやすい形を考えておくと、内容が整理され、面接の準備にもつながるとしています。書いた自己PRを、話す用に整えておきましょう。

- **読み上げない**：書いた文章を暗記して読むより、型の4つの順番だけを覚えて、自分の言葉で話す
- **最初の一文をはっきり**：「私の強みは〇〇です」から始める
- **深く聞かれる準備をする**：「なぜそうしようと思ったのですか」「うまくいかなかったことはありますか」と聞かれても答えられるようにしておく
- **盛らない**：数字や結果は本当のことだけを話す。大きく言うと、深く聞かれたときに困るのは自分です

ひとりで考えても自信が持てないときは、ハローワークで応募書類の書き方や面接について相談できます。相談の方法や予約が必要かは、利用するハローワークで確認してください。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '未経験の自己PRの書き方｜アルバイト経験から作る型と例文', '未経験の仕事に応募するときの自己PRの書き方を紹介します。アルバイトや接客の経験から強みを見つける問い、強みの言い換え表、強み→場面→結果→活かし方の型、事務・カスタマーサポート・営業の例文、面接で話すときのコツが分かります。', array['sekkyaku-keiken-ikasu', 'shokumu-keirekisho-arubaito', 'shiboudouki-mikeiken', 'mensetsu-yokukiku-shitsumon', 'jiko-bunseki-yarikata']::text[], '{}'::text[], array['mensetsu', 'mikeiken-shokushu']::text[], array['sekkyaku', 'freeter', 'seishain-keiken-sukunai']::text[], array['接客の経験、', '自己PRにできる？']::text[], null, false, '[{"q":"アルバイトの経験だけでも、自己PRに書いていいですか？","a":"書いて構いません。自己PRで伝えるのは、経験の長さや肩書きよりも、仕事の中で自分がどう考えて動いたかです。アルバイトで工夫したことや任されたことを、応募する仕事でどう活かすかまでつなげて書きましょう。"},{"q":"自己PRと志望動機は、何が違いますか？","a":"志望動機は「なぜこの会社・この仕事に応募したのか」、自己PRは「自分の経験や長所、得意なこと」を伝えるものです。自己PRで伝えた強みを、志望動機の「この仕事でこう活かしたい」につなげると、話に一貫性が出ます。"},{"q":"自己PRに書く強みは、いくつ書けばいいですか？","a":"決まりはありませんが、強みを並べるよりも、一つにしぼってエピソードで裏づけるほうが伝わりやすくなります。ほかの強みは、面接で聞かれたときに話せるように準備しておきましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"未経験の自己PRは「同じ仕事の経験」ではなく「行動」から作る。アルバイト・接客で実際にやったことを問いで掘り起こし、応募する仕事に必要なこと（job tag で調べる）と結びつけて、型と例文で示す。書類と面接での話し方の違いまで扱う","quotes":[{"source_url":"https://jsite.mhlw.go.jp/hyogo-roudoukyoku/content/contents/000836463.pdf","text":"志望動機は応募先の企業や仕事内容に対してなぜ応募したのかを問われるもの、自己PRは自分の経験や性格、長所・短所、得意なことなどを問われるもの。書類の内容を面接で話しやすい形で考えると整理され、面接対策にもつながる（この環境から jsite.mhlw.go.jp に直接接続できなかったため、検索結果に表示された資料の抜粋で確認）","used_in":"自己PRと志望動機は何が違う？／面接で話すときは／FAQ"},{"source_url":"https://jsite.mhlw.go.jp/hokkaido-hellowork/list/asahikawa/kyushokusha/shigoto05-2.html","text":"志望動機や自己PRでありがちなのは、「〇〇ができます。」「〇〇の性格です。」と記載したときにその根拠がなく、見る側に「なぜ？どうして？どのように？」と疑問を抱かせてしまうこと（直接開けなかったため、検索結果の抜粋で確認）","used_in":"「強みの言葉」だけでは伝わらない"},{"source_url":"https://shigoto.mhlw.go.jp/User/","text":"職業ごとに仕事内容、必要なスキル・知識などを調べられる厚生労働省の職業情報提供サイト（直接開けなかったため、検索結果と厚生労働省の案内ページの抜粋で確認）","used_in":"応募する仕事から、使う強みを選ぶ"}],"not_used":["「自己PRは〇〇文字が目安」「面接での自己PRは〇分」などの分量・時間は、公的な根拠を確認できなかったので書かない","例文には年数・件数などの数字を入れず「〇年」とした。架空の数字を実績のように見せないため"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'jiko-pr-mikeiken' and c.slug = 'shorui-mensetsu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'jiko-pr-mikeiken' and c.slug = 'keiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '就職活動の苦手を減らそう 自己PR編', '兵庫労働局（三宮わかものハローワーク）', 'https://jsite.mhlw.go.jp/hyogo-roudoukyoku/content/contents/000836463.pdf', '2026-10-09'::date, '志望動機は応募先や仕事内容になぜ応募したのかを問われるもの、自己PRは自分の経験や性格、長所・短所、得意なことを問われるものという違い。面接で話しやすい形で考えると整理しやすいこと', 0 from articles where slug = 'jiko-pr-mikeiken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '応募書類作成支援', '北海道労働局（ハローワーク旭川）', 'https://jsite.mhlw.go.jp/hokkaido-hellowork/list/asahikawa/kyushokusha/shigoto05-2.html', '2026-10-09'::date, '「〇〇ができます」「〇〇の性格です」と書いても根拠がないと、読む側に「なぜ？どうして？どのように？」と疑問を持たせてしまうこと。ハローワークで応募書類の作成を相談できること', 1 from articles where slug = 'jiko-pr-mikeiken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業情報提供サイト（job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/', '2026-10-09'::date, '職業ごとに仕事の内容や、必要なスキル・知識を調べられること', 2 from articles where slug = 'jiko-pr-mikeiken';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'jiko-pr-mikeiken' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"547b70f216c41297c0b4f2e7aeed89735d10523be2d6c7c94675c5354709e1ad","findings":[]}'::jsonb from articles where slug = 'jiko-pr-mikeiken';
update articles set status = 'published' where slug = 'jiko-pr-mikeiken';

-- article: jimu-mikeiken-mae (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('jimu-mikeiken-mae', 'article', '未経験で事務職を目指す前に知っておきたいこと｜種類・PC・電話対応', '「事務職」とひとことで言っても、一般事務・営業事務・経理事務・受付事務などで仕事の中身は変わります。種類ごとの違い、求められやすいパソコン操作の目安、電話や来客対応のこと、接客経験の伝え方まで、応募前に知っておきたいことをまとめました。', '「オフィスで落ち着いて働きたい」「土日休みの仕事にしたい」。そんな理由で事務職を考える人は多いと思います。

ただ、事務職とひとことで言っても、種類によって毎日の仕事はかなり違います。応募する前に、**どの事務を目指すのか**と、**どんな作業が多いのか**をつかんでおくと、求人選びや面接で迷いにくくなります。

## 事務職って、どんな仕事？

厚生労働省の職業情報提供サイト「job tag」を見ると、事務の仕事は細かく分かれています。未経験から目指す人がよく候補にする4つを並べてみます。

| 種類 | 主な仕事 | 向いていそうな人 |
| --- | --- | --- |
| 一般事務 | 書類の作成・整理、伝票やデータの入力、電話の取り次ぎ、来客対応、郵便物の仕分け | 決まった手順をコツコツ進めるのが好き |
| 営業事務 | 営業担当の依頼で見積書・納品書を作る、売上や入金の管理、取引先からの問い合わせ対応 | 人とのやりとりも苦にならない |
| 経理事務 | 入出金の伝票づくり、帳簿への記録、月末の集計（会計ソフトやシステムを使う） | 数字を正確に扱うのが得意 |
| 受付事務 | 来た人の用件を聞いて担当者に取り次ぐ、会議室への案内 | 第一印象や言葉づかいに気を配れる |

求人票では「一般事務」と書かれていても、実際は営業部の事務をまとめて担当する、ということもあります。仕事内容の欄まで読んで、**どの作業が中心か**を確かめましょう。

## 未経験でも応募できる？

「未経験可」と書かれた事務の求人もあります。応募条件の欄で、経験や資格が「必須」なのか「あれば歓迎」なのかを見分けておきましょう。

もうひとつおすすめなのが、**一般事務だけにしぼらない**ことです。探す職種名が「一般事務」だけだと、見つかる求人の数も限られてしまいます。営業事務や受付事務、電話やメールで問い合わせに応えるカスタマーサポートなど、近い仕事もあわせて見ると、選べる求人が増えます。job tag では職業名で検索して、ほかの事務の仕事内容も調べられます。職種ごとの比較は[職種比較ページの事務](/jobs#jimu)でも確認できます。

```figure
type: compare
style: before-after
title: 探す職種名を広げてみる
columns:
  - label: 一般事務だけで探す
    items:
      - 見つかる求人の数も限られる
  - label: 近い仕事もあわせて見る
    items:
      - 営業事務
      - 受付事務
      - カスタマーサポート
```

## パソコンはどのくらい使える必要がある？

job tag では、一般事務は書類づくりや集計にパソコンを使い、コピー機やFAXなどの事務機器もよく使う仕事だと説明されています。求人ごとに求められる水準は違いますが、まずは次の4つを目安にしてみてください。

- 文字の入力（ローマ字入力で、見ないで打てると楽になる）
- メールの送受信（宛先の使い分け、ファイルの添付）
- 表計算ソフトでの入力と、合計などの簡単な計算
- ファイルの保存場所を決めて、あとで探せるように整理する

求人票に「Excel（関数）」のように具体的に書かれていれば、それが目安です。パソコンに自信がない人は、[PCが得意じゃなくても、事務職は目指せる？](/articles/pc-nigate-jimu)で練習のしかたを紹介しています。

## 電話や来客の対応もある？

あります。job tag の一般事務の説明にも、電話の取り次ぎや、来客の対応・お茶出しの補助が含まれています。営業事務なら、取引先からの問い合わせに電話やメールで応えることもあります。

ここは、接客や販売の経験が活きる場面です。面接では、たとえば次のように伝えられます。

> 飲食店で2年間ホールを担当し、電話での予約受付やお客さまのご案内をしていました。相手の用件を最初に確かめてから対応する習慣は、事務の電話の取り次ぎや来客対応でも活かせると考えています。

接客経験の分け方は、[接客経験は転職でどう活かせる？](/articles/sekkyaku-keiken-ikasu)でくわしく紹介しています。

## 応募前に確認しておきたいこと

同じ「事務」でも、会社によって忙しさや仕事の中身は違います。求人票で分からないことは、面接で聞いてみましょう。

- どの部署の事務か（一般事務・営業事務・経理事務など）
- 1日のうち、パソコン作業と電話・来客対応はどのくらいの割合か
- 使っている表計算ソフトや社内システムは何か
- 月末・月初など、忙しくなる時期と残業の目安
- 入社後、誰にどのように仕事を教わるか

```figure
type: checklist
title: 事務の求人で応募前に確認したいこと
items:
  - どの部署の事務か（一般・営業・経理など）
  - パソコン作業と電話・来客対応の割合
  - 使っている表計算ソフトや社内システム
  - 忙しくなる時期と残業の目安
  - 入社後、誰にどのように仕事を教わるか
```

最後の質問は、未経験の人にとって特に大事です。研修の確認のしかたは[未経験求人の「研修あり」で確認すべきこと](/articles/mikeiken-kenshu-kakunin)にまとめています。どの事務が自分に合いそうかを決めてから求人を見ると、比べやすくなります。', 'review', true, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['pc-nigate-jimu', 'sekkyaku-keiken-ikasu', 'mikeiken-kenshu-kakunin', 'eigyo-jimu-shigoto', 'keiri-mikeiken', 'iryo-jimu-mikeiken']::text[], array['jimu']::text[], array['office', 'mikeiken-shokushu']::text[], array['sekkyaku', 'pc-mikeiken']::text[], array['未経験から事務職へ。', '最初に知っておきたいこと']::text[], null, false, '[{"q":"事務職は、資格がないと応募できませんか？","a":"求人によって違います。応募条件の欄に資格が書かれていなければ、資格がなくても応募できます。資格の有無よりも、「表計算ソフトで入力と合計の計算ができる」のように、できる操作を具体的に伝えられるほうが判断材料になりやすいです。"},{"q":"一般事務と営業事務、未経験ならどちらがいいですか？","a":"どちらが向いているかは人によります。一般事務は書類やデータの管理、電話の取り次ぎなど社内の仕事を支えることが中心です。営業事務は営業担当の依頼で見積書を作ったり、取引先からの電話やメールに応えたりと、社外とのやりとりも入ってきます。人と話すのが苦にならないなら、営業事務も候補に入れてみてください。"},{"q":"事務職は、あまり人と話さない仕事ですか？","a":"パソコン作業が中心ですが、電話の取り次ぎや来客への対応、社内からの依頼の受け付けなど、人とのやりとりもあります。どのくらいの割合かは職場によって違うので、面接で「1日のうち電話や来客対応はどのくらいありますか」と聞いてみましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「事務＝座ってPC作業」というイメージを、種類ごとの中身と電話・来客対応の実際に分けて整理する","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/428","text":"一般事務は特定の分野に限らず定型的な事務を行う。書類の作成・整理、メール対応、伝票の作成・管理、各種台帳の管理、データ入力、郵便物の発送・仕分け、電話の取り次ぎ、来客の対応やお茶出しの補助など。書類作成や集計にはパソコンを使い、コピー機・FAXなどの事務機器もよく使う。","used_in":"事務職って、どんな仕事？ / パソコンはどのくらい使える必要がある？ / 電話や来客の対応もある？"},{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/431","text":"営業事務は営業担当者の指示で資料や見積書を作成し、契約・売上・入金の管理、顧客からの電話・メールでの問い合わせ対応、見積書・納品書の作成などを行う。別名に営業アシスタント、受発注管理事務員。","used_in":"事務職って、どんな仕事？"},{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/430?media=4876","text":"経理事務は会計・財務管理のソフトやシステムを使い、入出金伝票や振替伝票の作成、現金出納帳・総勘定元帳への記録を行う。月末には勘定科目を集計して残高を確定し、実際の預金残高と照合する。","used_in":"事務職って、どんな仕事？"},{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/427","text":"受付事務（別名 案内係・会社受付係）は来訪者の用件を確認して担当部署に取り次ぎ、会議室などへ案内する。来訪者の記録や電話の取り次ぎの補助も行う。","used_in":"事務職って、どんな仕事？"},{"source_url":"https://shigoto.mhlw.go.jp/","text":"job tag は厚生労働省の職業情報提供サイトで、500以上の職業について仕事内容や必要なスキルなどを調べられる。","used_in":"未経験でも応募できる？"}]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'jimu-mikeiken-mae' and c.slug = 'shokushu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'jimu-mikeiken-mae' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '一般事務 - 職業詳細（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/428', '2026-10-06'::date, '一般事務の仕事内容（書類の作成・整理、伝票、データ入力、郵便物の仕分け、電話の取り次ぎ、来客対応やお茶出しの補助など）と使う機器（パソコン・コピー機・FAXなど）', 0 from articles where slug = 'jimu-mikeiken-mae';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '営業事務 - 職業詳細（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/431', '2026-10-06'::date, '営業事務の仕事内容（見積書・納品書の作成、契約・売上・入金の管理、取引先からの電話・メールでの問い合わせ対応）', 1 from articles where slug = 'jimu-mikeiken-mae';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '経理事務 - 職業詳細（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/430?media=4876', '2026-10-06'::date, '経理事務の仕事内容（入出金の伝票づくり、帳簿への記録、月末の集計、会計ソフトやシステムの利用）', 2 from articles where slug = 'jimu-mikeiken-mae';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '受付事務 - 職業詳細（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/427', '2026-10-06'::date, '受付事務の仕事内容（来訪者の用件を確認して担当者に取り次ぐ、案内する）', 3 from articles where slug = 'jimu-mikeiken-mae';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業情報提供サイト（job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/', '2026-10-06'::date, 'job tag で500以上の職業の仕事内容を調べられることの紹介', 4 from articles where slug = 'jimu-mikeiken-mae';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'jimu-mikeiken-mae' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"b893bb7f315b201790f39008f035c54822ede5d6e5dee51ee9b62f9e4c50129d","findings":[]}'::jsonb from articles where slug = 'jimu-mikeiken-mae';
update articles set status = 'published' where slug = 'jimu-mikeiken-mae';

-- article: jinji-saiyo-mikeiken (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('jinji-saiyo-mikeiken', 'article', '人事・採用の仕事に、未経験から近づくには？入口になりやすい仕事と準備', '人事の仕事は、採用・勤怠や給与の管理・研修などに分かれています。未経験からなら、採用アシスタントや人事事務など、決まった手続きを支える仕事が入口になりやすいです。仕事の種類、接客やバイトリーダーの経験の伝え方、知っておきたい採用のルールを紹介します。', '「人と関わる仕事を、オフィスでしたい」。そう考えたときに候補にあがりやすいのが、人事・採用の仕事です。

ただ、人事の仕事は「面接をする人」というイメージだけでは見えない部分がたくさんあります。未経験から近づくなら、まず**人事の中にどんな仕事があるか**を知って、入口になりやすい仕事から考えるのがおすすめです。

## 人事の仕事って、何をしている？

厚生労働省の職業情報提供サイト「job tag」では、人事事務を「社員の採用から退職までの人事管理に関する事務」をする仕事として紹介しています。中身をイメージしやすいよう、よくある分け方の一例で並べてみます。

| 分野 | 主な仕事 |
| --- | --- |
| 採用 | 求人の準備、応募者との連絡、面接の日程調整、入社の手続き |
| 労務 | 勤務時間や休み・有給休暇の管理、出勤記録をもとにした給与計算、社会保険の手続き |
| 教育 | 研修の準備や運営、社員の学びの支援 |
| 配置・異動 | 配属や異動、昇進、退職の手続き |

分け方や呼び方は会社によって違い、規模によっては一人がいくつもの分野を担当することもあります。求人票で「人事」と書かれていたら、**どの分野が中心か**を確認しましょう。

## 未経験だと、どこが入口になりやすい？

人事の求人には、経験者を前提にしたものもあります。未経験から近づくなら、次のような仕事が入口の候補です。

- **採用アシスタント**: 応募者への連絡や面接の日程調整、応募書類の管理など、採用担当を支える仕事
- **人事事務**: 勤怠データの確認や入力、入社・退職の書類の準備など、決まった手続きを進める仕事
- **総務・一般事務**: 会社によっては、人事の手続きを総務や事務の担当が一緒に受け持つこともある

どれも、パソコンでの書類づくりやデータ入力が多くなりやすい仕事です。何を任されるかは会社によって違うので、求人票の仕事内容の欄で確かめましょう。事務の仕事でよく使う操作やパソコン作業の多さは、[職種比較ページの事務](/jobs#jimu)でも確認できます。

## 接客やバイトリーダーの経験は活きる？

活きる場面はあります。人事の仕事を細かく見ると、接客やアルバイトでやってきたことと重なる部分が見つかります。

| これまでの経験 | 人事の仕事で近い場面 |
| --- | --- |
| シフトの調整や、急な欠員への対応 | 面接の日程調整、応募者や面接担当との連絡 |
| お客さまへの言葉づかい・電話対応 | 応募者への連絡や、来社した応募者の案内 |
| 新人アルバイトへの仕事の説明 | 入社した人への案内や、研修の準備 |
| 採用面接の同席や、新人の教育係 | 採用や教育の流れを、現場の側から知っている |

職務経歴書では、たとえば次のように書けます。

> アルバイトリーダーとして、15人分のシフト作成と、新人スタッフへの仕事の説明を担当（約1年）。急な欠員が出たときは、スタッフに連絡して代わりの人を探し、営業に支障が出ないよう調整した。

数字は覚えている範囲で正確に書きましょう。接客経験の分け方は[接客経験は転職でどう活かせる？](/articles/sekkyaku-keiken-ikasu)でも紹介しています。

## 知っておきたい「公正な採用選考」

採用にかかわる仕事を目指すなら、知っておきたい考え方があります。厚生労働省は「公正な採用選考」として、応募者の基本的人権を尊重することと、応募者の適性と能力に基づいた基準で選ぶことを基本にしています。

そのうえで、本籍・出生地や家族のことなど本人の適性や能力と関係のないことや、思想・宗教など本来自由であるべきことを、採用選考で聞かないよう求めています。厚生労働省の「公正採用選考特設サイト」では、就職差別につながるおそれがある14の事項や、聞いてはいけない質問の例を確認できます。

採用アシスタントは、応募者の個人情報を扱う仕事です。面接で「なぜ人事に興味があるのか」と聞かれたときに、こうした考え方を知っていることを伝えられると、仕事への理解が伝わりやすくなります。

## 応募前・面接で確認したいこと

人事の求人を見るときは、次のことを確かめておくと入社後のずれを減らせます。

- 担当するのは採用・労務・教育のどの分野か
- 1日のうち、人とやりとりする時間と、書類やデータの作業の割合
- 採用が忙しくなる時期や、月末の給与計算の時期の残業の目安
- 入社後、誰にどのように仕事を教わるか

```figure
type: checklist
title: 人事の求人で応募前に確認したいこと
items:
  - 担当するのは採用・労務・教育のどの分野か
  - 人とのやりとりと、書類・データ作業の割合
  - 採用が忙しい時期や給与計算の時期の残業の目安
  - 入社後、誰にどのように仕事を教わるか
```

志望動機では「人と話すのが好き」だけで終わらせず、「人と話す経験」と「正確に進める経験」の両方を伝えましょう。これまでの経験を作業と工夫に分けて書き出す方法は、[未経験転職は何から始める？](/articles/mikeiken-tenshoku-hajimekata)で紹介しています。

```figure
type: compare
title: 志望動機では両方の経験を伝える
columns:
  - label: 人と話す経験
    tone: sand
    items:
      - 例：お客さまへの言葉づかい・電話対応
      - 例：新人アルバイトへの仕事の説明
  - label: 正確に進める経験
    tone: sky
    items:
      - 例：シフトの調整や、急な欠員への対応
      - 例：15人分のシフト作成
```', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['sekkyaku-keiken-ikasu', 'mikeiken-tenshoku-hajimekata']::text[], array['jinji']::text[], array['office', 'mikeiken-shokushu']::text[], array['sekkyaku']::text[], array['人事・採用の仕事、', '未経験からどう近づく？']::text[], null, false, '[{"q":"人事の仕事は、未経験でも応募できますか？","a":"求人によります。人事の経験を応募条件にしている求人もあれば、採用アシスタントや人事事務のように、事務の基本ができれば応募できる求人もあります。まずは応募条件の欄で「経験」が必須かどうかを確かめましょう。"},{"q":"資格がないと、人事の仕事はできませんか？","a":"応募条件に資格が書かれていなければ、資格がなくても応募できます。勤怠や給与、社会保険の手続きなどは、担当する仕事に合わせて入社後に学んでいく方法もあります。面接で、入社後にどう教わるかを確かめておくと安心です。"},{"q":"「人と話すのが好き」だけでは、志望動機として弱いですか？","a":"それだけだと伝わりにくくなります。人事の仕事は、応募者や社員とのやりとりに加えて、書類やデータを正確に扱う場面も多いからです。「話す」経験と「正確に進める」経験の両方を、具体的な場面で伝えるのがおすすめです。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"人事の仕事を分解し、未経験の入口（採用アシスタント・人事事務）と、接客・アルバイトリーダー経験の結びつけ方を示す","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/432","text":"人事事務は、社員の採用から退職までの人事管理に関する事務を行う（job tag の事務系の職業の一つ）。","used_in":"人事の仕事って、何をしている？"},{"source_url":"https://kouseisaiyou.mhlw.go.jp/","text":"公正な採用選考では、応募者の適性と能力で判断することが求められる。就職差別につながるおそれがある14事項を示している。","used_in":"知っておきたい「公正な採用選考」"},{"source_url":"https://jsite.mhlw.go.jp/shiga-roudoukyoku/hourei_seido_tetsuzuki/shokugyou_shoukai/kouseinasaiyousennkou_00142.html","text":"採用選考の基本は、応募者の基本的人権を尊重すること、応募者の適性と能力に基づいた基準により行うこと。","used_in":"知っておきたい「公正な採用選考」"},{"source_url":"https://kouseisaiyou.mhlw.go.jp/question.html","text":"本籍・出生地、家族構成や家族の職業など本人の適性・能力と関係のない事項や、思想・信条・宗教など憲法で保障された自由にかかわる事項を採用選考で尋ねることは、就職差別につながるおそれがある。","used_in":"知っておきたい「公正な採用選考」"}]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'jinji-saiyo-mikeiken' and c.slug = 'shokushu' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '人事事務 - 職業詳細（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/432', '2026-10-06'::date, '人事事務が、社員の採用から退職までの人事管理に関する事務を行う仕事であること', 0 from articles where slug = 'jinji-saiyo-mikeiken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '公正採用選考特設サイト', '厚生労働省', 'https://kouseisaiyou.mhlw.go.jp/', '2026-10-06'::date, '公正な採用選考は応募者の適性と能力で判断すること', 1 from articles where slug = 'jinji-saiyo-mikeiken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '公正な採用選考について', '滋賀労働局', 'https://jsite.mhlw.go.jp/shiga-roudoukyoku/hourei_seido_tetsuzuki/shokugyou_shoukai/kouseinasaiyousennkou_00142.html', '2026-10-06'::date, '公正な採用選考の基本（応募者の基本的人権の尊重、適性と能力に基づいた基準）', 2 from articles where slug = 'jinji-saiyo-mikeiken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '就職差別につながるおそれがある質問（公正採用選考特設サイト）', '厚生労働省', 'https://kouseisaiyou.mhlw.go.jp/question.html', '2026-10-06'::date, '本籍・出生地や家族のこと、思想・宗教など、就職差別につながるおそれがあり採用選考で聞かないよう求められている事項', 3 from articles where slug = 'jinji-saiyo-mikeiken';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'jinji-saiyo-mikeiken' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"720e80f4ba6f288589163780283c6bf0f4a8253b1c2bad71f075a678f1df6fd3","findings":[]}'::jsonb from articles where slug = 'jinji-saiyo-mikeiken';
update articles set status = 'published' where slug = 'jinji-saiyo-mikeiken';

-- article: kaigo-mikeiken (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('kaigo-mikeiken', 'article', '未経験から介護職へ転職するときに知っておきたいこと｜仕事内容・資格の段階・夜勤', '介護職は、施設や利用者の自宅で、食事・入浴・排せつなど日常生活の手助けをする仕事です。施設介護と訪問介護の違い、介護職員初任者研修から介護福祉士までの資格の段階、夜勤を含む働き方、応募前に確認することを紹介します。', '「人の役に立つ仕事がしたい」「資格を取って、長く続けられる仕事に就きたい」。そう考えて介護職を候補に入れる人は少なくありません。一方で、「資格がないと無理？」「夜勤はきつい？」と、最初の一歩で迷いやすい仕事でもあります。

先に結論を言うと、介護職は**どこで働くか（施設・訪問・デイサービス）で、必要な資格も働く時間も変わる**仕事です。資格は段階を踏んで取っていくもので、最初から上の資格が必要なわけではありません。

この記事で分かること：

- 介護職の**仕事内容**と、働く場所による違い
- 介護職員初任者研修から介護福祉士までの**資格の段階**
- **夜勤**を含む働き方
- 応募前に**確認すること**

## 介護職の仕事内容は？

厚生労働省の職業情報提供サイト（job tag）では、施設で働く介護職（施設介護員）を、社会福祉施設に入所したり通所したりする人の介護や援助をする仕事として紹介しています。中心になるのは、次のような日常生活の手助けです。

- 食事の手助け（食べる・飲み込むのを見守る、介助する）
- 入浴の手助け
- 排せつ（トイレ・おむつ）の手助け
- ベッドから車いすへの移動など、からだを支える介助
- 身のまわりを清潔に保つ手伝い

このほか、利用者の様子を記録したり、家族や看護職員などとやりとりしたりする仕事もあります。

### 働く場所で、仕事の中身が変わる

| 働く場所 | どんな仕事？ |
| --- | --- |
| 入所型の施設 | 施設で暮らす人の生活を、昼も夜も交替で支える |
| デイサービス（通所） | 日中に通ってくる人の食事・入浴・レクリエーションなどを支える |
| 訪問介護 | 利用者の自宅を訪ねて、介助や家事の手伝いをする |

未経験の場合は、まず施設かデイサービスで、先輩と一緒に働きながら仕事を覚える形が多くなります。

## 資格がなくても働ける？

介護施設では、医療・福祉関係の資格がない人が介護の仕事に就いている場合もあります。その場合、介護サービスの事業者は、資格のない職員に**認知症介護基礎研修**を受けさせる措置をとることが義務づけられています（2024年4月に完全施行）。

一方で、利用者の自宅を訪ねる**訪問介護員（ホームヘルパー）**として働くには、介護職員初任者研修の修了が必要です。資格のない人は訪問介護員としては働けません。

「資格なしで応募できるか」は、求人の**応募資格**の欄で確認しましょう。「無資格可」と書かれていても、入社後にどの研修をいつ受けるのかは事業所によって違います。

## 資格は3つの段階で考える

介護の資格は、仕事をしながら段階的に取っていくのが一般的です。

```figure
type: steps
title: 介護の資格の段階
items:
  - label: 介護職員初任者研修
    text: 130時間の研修。介護の基本を学ぶ最初の資格
  - label: 実務者研修
    text: 450時間の研修。介護福祉士の受験に必要
  - label: 介護福祉士（国家資格）
    text: 実務経験3年以上と実務者研修のあと、国家試験に合格
```

- **介護職員初任者研修**：130時間の研修で、介護の基本的な知識と技術を学びます。訪問介護で働くときに必要になる資格です
- **実務者研修**：450時間の研修で、より深い知識と技術を学びます
- **介護福祉士**：介護の国家資格です。job tag では、3年以上の実務経験を積み、実務者研修を受けて国家試験に合格すると取得できる流れが紹介されています

### 先に取る？働きながら取る？

初任者研修を**先に取ってから応募する**か、**働きながら取る**かは、どちらの道もあります。考えるときのポイントは次のとおりです。

- 先に取る：応募できる求人が増える。訪問介護も選べる。学ぶ時間と費用は自分で用意する
- 働きながら取る：現場を知ってから学べる。会社が研修の費用を出す制度があるかは、事業所によって違う

講座を選ぶときは、通学か通信か、修了までの期間、費用を講座の案内で比べましょう。国の制度を使って学ぶ方法は、[ハロートレーニング（公共職業訓練）とは？](/articles/hello-training)や[教育訓練給付金の使い方](/articles/kyouiku-kunren-kyufu-tsukaikata)で紹介しています。講座が給付の対象になっているかどうかも、申し込む前に確かめておきましょう。

## 夜勤はある？働き方の違い

job tag では、24時間介護サービスを提供している施設が多いため、交替勤務や夜間勤務があると説明されています。同じ介護の仕事でも、デイサービスは日中のみ、入居型の施設はシフト制、というように働き方が変わります。

```figure
type: compare
title: 働く場所ごとの勤務の違い
columns:
  - label: 入所型の施設
    tone: sky
    items:
      - シフト制
      - 夜勤・交替勤務がある場合が多い
  - label: デイサービス
    tone: mint
    items:
      - 日中のみの勤務が中心
      - 利用者は自宅から通ってくる
  - label: 訪問介護
    tone: sand
    items:
      - 訪問の予定に合わせて動く
      - 初任者研修の修了が必要
```

夜勤がある職場では、夜勤の回数、夜勤のときに何人で働くか、夜勤明けの休みの扱いなどが働きやすさに関わります。土日休みを希望する場合は、シフトの決め方と土日の出勤も確認しておきましょう。

## 向いている人・合わないと感じやすい場面

### 向いている人

- 相手のペースに合わせて、ゆっくり話を聞ける
- 小さな変化（いつもより食べる量が少ない、など）に気づける
- チームで情報を共有しながら働くのが苦にならない

### 合わないと感じやすい場面

- からだを使う介助が多く、体力がいる
- 夜勤があると生活のリズムが変わる
- 利用者や家族との関わりで、気持ちを使う場面がある

接客や販売の経験がある人は、**相手の様子を見て声をかける**ことや、**ていねいな言葉づかい**が活かせます。面接では、たとえば次のように伝えられます。

> 「飲食店で接客をしてきました。お客さまの様子を見て、こちらから声をかけることを大事にしてきました。介護の仕事でも、利用者の方の小さな変化に気づけるよう、まずは初任者研修で基本を学びたいと考えています。」（仮の例です）

## 応募前に、確認すること

```figure
type: checklist
title: 介護職の求人で確認すること
items:
  - 施設・デイサービス・訪問のどれか
  - 応募資格（無資格可か、初任者研修が必要か）
  - 入社後の研修と、ひとりで担当するまでの流れ
  - 資格取得の費用を会社が出す制度があるか
  - 夜勤の有無と回数、夜勤の人数
  - シフトの決め方と、土日の出勤
  - 正社員・契約社員・パートなど雇用の形
```

求人に書かれていないことは、面接や見学で質問してかまいません。

- 「入社後、先輩と一緒に働く期間はどのくらいありますか」
- 「夜勤は月に何回くらいで、何人体制ですか」
- 「初任者研修や実務者研修を取るときの支援はありますか」

「研修あり」と書かれた求人の見方は、[未経験求人の「研修あり」で確認すべきこと](/articles/mikeiken-kenshu-kakunin)にまとめています。介護職は、働く場所と資格の段階によって働き方が大きく変わる仕事です。どこで、どんな時間帯に働きたいかを先に決めてから求人を比べると、自分に合う職場を選びやすくなります。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '未経験で介護職に転職するには？資格の段階と夜勤', '未経験から介護職を考える人へ。施設介護と訪問介護の仕事内容の違い、介護職員初任者研修・実務者研修・介護福祉士の資格の段階、夜勤やシフトの働き方、求人や面接で確認しておきたいことを紹介します。', array['hello-training', 'kyouiku-kunren-kyufu-tsukaikata', 'mikeiken-kenshu-kakunin', 'mikeiken-shikaku', 'koteizangyo-kyujin']::text[], array['sonota']::text[], array['mikeiken-shokushu']::text[], array['hajimete', 'sekkyaku']::text[], array['介護職、', '未経験から始められる？']::text[], null, false, '[{"q":"資格がなくても、介護の仕事はできますか？","a":"介護施設では、医療・福祉関係の資格がない人が介護の仕事に就いている場合もあります。その場合、事業者は認知症介護基礎研修を受けさせる措置をとることが義務づけられています。一方、利用者の自宅を訪問する訪問介護員（ホームヘルパー）として働くには、介護職員初任者研修の修了が必要です。求人の応募資格の欄で確認しましょう。"},{"q":"介護職員初任者研修は、どのくらいの時間がかかりますか？","a":"介護職員初任者研修は130時間の研修です。その上の段階の実務者研修は450時間です。通学か通信を組み合わせるか、修了までの期間、費用は講座によって違うので、申し込む前に講座の案内で確認しましょう。"},{"q":"介護職は夜勤が必ずありますか？","a":"働く場所によって違います。24時間介護をする入所型の施設では、交替勤務や夜勤がある場合が多いです。一方、通所のデイサービスは日中のみの勤務が中心です。夜勤の有無と回数は、求人票と面接で確認しましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"介護職を「どこで働くか（施設・訪問・デイ）」と「資格の段階」の2軸で整理し、未経験の人が最初に迷う「資格なしで入れる？」「夜勤は？」に、確認のしかたつきで答える","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/134","text":"社会福祉施設に入所・通所する人たちの保護・介護・援助を行う。食事、入浴、排泄の世話や身体介助、清潔の保持など。24時間介護サービスを提供している施設が多いため、交替勤務や夜間勤務がある。関連資格は介護福祉士、介護職員初任者研修修了者（job tag へ直接接続できなかったため、検索結果に表示されたページ内容で確認）","used_in":"介護職の仕事内容は？ / 夜勤はある？働き方の違い"},{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/133","text":"訪問介護員になるには「介護職員初任者研修課程」を修了する必要がある。3年以上の実務経験を積み、「実務者研修」を受講して国家試験に合格すると介護福祉士の資格を取得できる（検索結果で確認）","used_in":"資格は3つの段階で考える"},{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/410","text":"同じ介護施設でも、デイサービスは日勤のみで、入居型施設はシフト制となる（検索結果で確認）","used_in":"夜勤はある？働き方の違い"},{"source_url":"https://jsite.mhlw.go.jp/ishikawa-roudoukyoku/content/contents/001790771.pdf","text":"研修時間数は介護職員初任者研修130時間、実務者研修450時間。資格のない人は訪問介護員として従事できない（PDF へ直接接続できなかったため、検索結果に表示された内容で確認）","used_in":"資格は3つの段階で考える"},{"source_url":"https://www.mhlw.go.jp/content/12300000/001252331.pdf","text":"介護に直接携わる職員のうち医療・福祉関係の資格を有さない者に対し認知症介護基礎研修を受講させるための措置を講じることが介護サービス事業者に義務付けられた（3年間の経過措置期間を経て令和6年4月に完全施行）（検索結果で確認）","used_in":"資格がなくても働ける？"}],"not_used":["介護職の賃金や処遇改善加算の金額は、事業所や年度で変わるため書かない","新しく採用された無資格の職員に対する認知症介護基礎研修の猶予期間は、検索結果で一次情報を確認しきれなかったため書かない","初任者研修の講座の費用・期間の相場は公的な根拠を確認できなかったので書かない","初任者研修が教育訓練給付制度の対象かどうかは講座ごとに違うため断定せず、確かめ方の記事へのリンクにとどめた"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'kaigo-mikeiken' and c.slug = 'shokushu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'kaigo-mikeiken' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '施設介護員 - 職業詳細（職業情報提供サイト job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/134', '2026-10-09'::date, '施設介護員の仕事内容（入所・通所の利用者への食事・入浴・排せつの世話、身体介助など）、24時間サービスの施設が多く交替勤務・夜間勤務があること、関連資格（介護福祉士・介護職員初任者研修修了者）', 0 from articles where slug = 'kaigo-mikeiken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '訪問介護員/ホームヘルパー - 職業詳細（職業情報提供サイト job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/133', '2026-10-09'::date, '訪問介護員になるには介護職員初任者研修課程の修了が必要なこと、3年以上の実務経験と実務者研修の受講を経て国家試験に合格すると介護福祉士の資格を取得できること', 1 from articles where slug = 'kaigo-mikeiken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '施設管理者（介護施設） - 職業詳細（職業情報提供サイト job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/410', '2026-10-09'::date, 'デイサービスは日勤のみ、入居型施設はシフト制になること', 2 from articles where slug = 'kaigo-mikeiken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '介護職員の研修・資格の一覧（石川労働局の資料）', '石川労働局', 'https://jsite.mhlw.go.jp/ishikawa-roudoukyoku/content/contents/001790771.pdf', '2026-10-09'::date, '介護職員初任者研修が130時間、実務者研修が450時間であること、資格がない人は訪問介護員として働けないこと', 3 from articles where slug = 'kaigo-mikeiken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '認知症介護基礎研修受講義務付けの効果に関する調査研究事業 報告書（令和3年度介護報酬改定の効果検証及び調査研究に係る調査）', '厚生労働省', 'https://www.mhlw.go.jp/content/12300000/001252331.pdf', '2026-10-09'::date, '介護に直接携わる職員のうち医療・福祉関係の資格がない人に認知症介護基礎研修を受講させる措置が事業者に義務づけられ、2024年4月に完全施行されたこと', 4 from articles where slug = 'kaigo-mikeiken';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'kaigo-mikeiken' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"f6c1af532da0073c9662713370d81f73612a068f51bce7a22f47e28de708bda1","findings":[]}'::jsonb from articles where slug = 'kaigo-mikeiken';
update articles set status = 'published' where slug = 'kaigo-mikeiken';

-- article: keiri-mikeiken (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('keiri-mikeiken', 'article', '経理の仕事内容は？日次・月次・年次の流れと、未経験から目指すときの準備', '経理は、会社のお金の出入りを記録し、月ごと・年ごとに集計して、経営の状態を数字でまとめる仕事です。日次・月次・年次の仕事の流れ、日商簿記の位置づけ、求人の「経理補助」「経理アシスタント」の読み方、未経験から目指すときの準備を紹介します。', '「数字を扱う仕事に興味がある」「事務の中でも、専門性のある仕事がしたい」。そんな理由で経理を考える人もいると思います。一方で、「簿記の資格がないと無理？」「未経験で応募していいの？」と迷う人も多い職種です。

先に結論を言うと、経理は**会社のお金の出入りを毎日記録し、月ごと・年ごとに集計して、会社の状態を数字でまとめる仕事**です。未経験からの入口になりやすいのは、伝票づくりや入力などの**毎日の仕事**で、簿記はその土台になる知識です。

この記事で分かること：

- 経理の仕事を**日次・月次・年次**に分けた流れ
- **簿記の資格**はどのくらい必要か
- 求人の「**経理補助**」「経理アシスタント」の読み方
- 未経験から目指すときの**準備**

## 経理の仕事を「日次・月次・年次」で見る

厚生労働省の職業情報提供サイト（job tag）では、経理事務は、会社の取引で生じるお金の出入りを記録・管理し、月末や決算期にそれを集計する仕事として説明されています。時間の区切りごとに分けると、次のようになります。

```figure
type: compare
title: 経理の仕事を時間で分ける
columns:
  - label: 日次（毎日）
    tone: mint
    items:
      - 入出金の伝票を作る
      - 帳簿や会計ソフトに記録する
      - 請求書の発行・入金の確認
  - label: 月次（毎月）
    tone: sky
    items:
      - 勘定科目ごとに集計する
      - 帳簿と預金の残高を照らし合わせる
      - 月次の決算書類を作る
  - label: 年次（毎年）
    tone: sand
    items:
      - 決算と財務諸表の作成
      - 棚卸で在庫を確かめる
      - 年末調整などの手続き
```

### 日次：お金の出入りを記録する

毎日の仕事は、取引があるたびに**入出金伝票や振替伝票を作り、現金出納帳や総勘定元帳などの帳簿に記録する**ことです。job tag では、会計や財務管理のソフト・システムを使って記録するとされています。請求書の発行や、取引先からの入金の確認もこの段階の仕事に入ります。

### 月次：月末に締めて、数字を確かめる

月末には、**勘定科目（「売上」「交通費」などのお金の分類）ごとに集計**して帳簿の残高を確定させ、実際の預金の残高などと合っているかを照らし合わせます。そのうえで、月ごとの決算書類をまとめます。

### 年次：決算と、1年に一度の手続き

期末（会社の1年の区切り）には、試算表を作り、棚卸で在庫を確かめ、**貸借対照表や損益計算書などの財務諸表**を作ります。国税庁によると、法人税の確定申告書は、原則として事業年度が終わった日の翌日から2か月以内に提出することになっています。決算のあとも、申告に向けた準備が続きます。

このほか、job tag では社員の給与計算も経理事務の仕事に挙げられています。給与の支払者が、毎月の給与から差し引いた所得税と1年間の税額との差額を精算する**年末調整**（国税庁によると通常は12月）を、経理が担当する会社もあります。給与計算や年末調整を総務や人事が担当する会社もあるので、担当範囲は求人で確かめましょう。

## 簿記の資格はどのくらい必要？

job tag では、経理事務になるのに学歴や資格は特に必要とされていません。ただし、日商簿記検定などの関連資格があると、仕事に役立つとされています。

簿記の役割は、2つに分けて考えると整理しやすくなります。

- **応募の条件として**：求人によっては「簿記3級以上」「簿記2級歓迎」のように書かれています。条件に入っているかどうかは求人ごとに違うので、応募条件の欄を確認しましょう
- **入社後の土台として**：仕訳（取引を「何に・いくら」で記録するルール）が分かっていると、伝票や会計ソフトの入力の意味が理解しやすくなります

日本商工会議所は、日商簿記の級を次のように位置づけています。

| 級 | 公式の位置づけ（要約） |
| --- | --- |
| 3級 | 業種や職種にかかわらず、社会人が身につけておきたい基本的な商業簿記 |
| 2級 | 商業簿記と工業簿記（原価計算を含む）を扱い、財務諸表の数字から経営内容をつかめるレベル |

はじめて簿記を学ぶなら、まず3級で仕訳と帳簿の基本を身につけ、応募したい求人の条件を見ながら2級を考える順番が進めやすいです。講座を使う場合は、費用の一部が戻る制度もあります。くわしくは[教育訓練給付金の使い方](/articles/kyouiku-kunren-kyufu-tsukaikata)で紹介しています。

## 求人の「経理補助」「経理アシスタント」はどう読む？

未経験から応募しやすい求人には、「経理補助」「経理アシスタント」「経理事務（サポート）」のような職種名がついていることがあります。名前だけで仕事の範囲は決まらないので、**仕事内容の欄に何が書かれているか**を見ましょう。

たとえば、仕事内容の書き方によって、次のように担当の範囲を読み取れます（書き方は仮の例です）。

| 求人の書き方の例 | 読み取れること |
| --- | --- |
| 伝票の入力、経費精算のチェック、請求書の発行 | 日次の仕事が中心。未経験から始めやすい範囲 |
| 月次決算の補助 | 月末の集計や照合も手伝う |
| 決算業務、税務申告の対応 | 年次の仕事まで担当する。経験を求められることもある |

job tag によると、経理は伝票の作成や記帳などの基礎の仕事から始め、予算・決算・資金計画の仕事へ進むのが一般的で、経理全般を身につけて一人前になるには数年程度かかるとされています。最初は日次の仕事から任されると考えておくと、求人を比べやすくなります。

```figure
type: checklist
title: 経理の求人で確認すること
items:
  - 担当は日次・月次・年次のどこまでか
  - 使う会計ソフトと表計算ソフト
  - 簿記の資格は条件か、歓迎か
  - 給与計算や年末調整も担当するか
  - 決算の月と、その時期の残業の目安
  - 誰に、どのように教わるか
```

求人票で分からないことは、面接で聞いてみましょう。

> 「入社後は、どの仕事から担当することが多いでしょうか。」
> 「決算の時期は、何月ごろ、どのくらい忙しくなりますか。」
> 「会計ソフトは何を使っていますか。入社前に練習しておくとよいことはありますか。」

## 未経験から目指すときの準備

経理で求められることとして、job tag では、お金を扱うための正確さや注意力、几帳面さ、決算の締め切りに間に合わせる速さや粘り強さが挙げられています。未経験の人は、次の順番で準備を進めると、面接で話せることが増えていきます。

1. **簿記の基本を学ぶ**：3級の範囲で、仕訳と帳簿のしくみを理解する
2. **表計算ソフトに慣れる**：合計や並べ替え、簡単な関数を使えるようにする（練習のしかたは[PCが得意じゃなくても、事務職は目指せる？](/articles/pc-nigate-jimu)で紹介しています）
3. **今の仕事の「お金」や「数字」の経験をふり返る**：レジ締めで金額を照らし合わせていた、在庫の数を数えて記録していた、などは経理の仕事とつながる経験です

面接では、たとえば次のように伝えられます。

> 「販売の仕事で、毎日のレジ締めで売上と現金を照らし合わせ、差額が出たときは原因を確認していました。数字を正確に合わせる仕事に関心を持ち、簿記3級の勉強を始めています。」

経理は、ほかの事務と比べて専門の知識が必要になる場面が多い仕事です。ほかの事務職と比べながら考えたい人は、[未経験で事務職を目指す前に知っておきたいこと](/articles/jimu-mikeiken-mae)も参考にしてください。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '経理の仕事内容と未経験からの準備｜簿記と経理補助の見方', '経理はどんな仕事？伝票や帳簿への記録などの日次の仕事、月末の締め、決算や年末調整などの年次の仕事を整理。日商簿記3級・2級の位置づけ、求人の「経理補助」の読み方、未経験から目指すときの準備を紹介します。', array['jimu-mikeiken-mae', 'pc-nigate-jimu', 'kyouiku-kunren-kyufu-tsukaikata', 'eigyo-jimu-shigoto', 'mikeiken-shikaku']::text[], array['jimu']::text[], array['mikeiken-shokushu', 'office']::text[], array['pc-mikeiken', 'seishain-keiken-sukunai']::text[], array['経理って、', '未経験からどう目指す？']::text[], null, false, '[{"q":"経理の仕事は、簿記の資格がないとできませんか？","a":"job tag（厚生労働省の職業情報提供サイト）では、経理事務になるのに学歴や資格は特に必要とされていません。ただし、日商簿記検定などの関連資格があると仕事に役立つとされています。求人によっては応募条件に「簿記3級以上」などと書かれていることもあるので、応募条件の欄を確認しましょう。"},{"q":"日商簿記は3級と2級、どちらを目指せばいいですか？","a":"日本商工会議所は、3級を業種や職種にかかわらず社会人が身につけておきたい基本的な商業簿記、2級を工業簿記も含めて財務諸表の数字から経営内容をつかめるレベルと位置づけています。簿記をはじめて学ぶなら、まず3級で仕訳や帳簿の基本を身につけ、応募したい求人の条件を見て2級を考える順番が進めやすいです。"},{"q":"経理は残業が少ない仕事ですか？","a":"job tag では、経理事務は基本的に残業が少なく土日祝日が休みのことが多い一方、決算の時期には日常の仕事と並行して決算の作業をするため、残業が増えることがあるとされています。決算の月や繁忙期の残業の目安は会社によって違うので、面接で確認しましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"経理を「毎日・毎月・毎年」の3つの時間軸で見せて、未経験の入口になりやすいのは日次の仕事（伝票・入力・経費精算のチェック）だと分かるようにする。簿記は「応募の条件」と「入社後の土台」の2つの役割に分けて説明し、資格を取れば転職できるとは書かない","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/430","text":"毎日の金銭管理として入出金伝票や振替伝票を作成し、現金出納帳や総勘定元帳などの帳簿に記入する。月末には勘定科目ごとに集計して帳簿残高を確定し、実際の預金残高などと照合して月次決算書類を作る。期末には試算表を作り、棚卸で在庫を把握し、貸借対照表や損益計算書などの財務諸表を作成する。社員の給与計算、請求書の発行や入金確認なども行う。（job tag への直接接続ができなかったため、検索結果に表示されたページの内容で確認）","used_in":"経理の仕事を「日次・月次・年次」で見る"},{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/430","text":"入職にあたって学歴や資格は特に必要とされないが、日商簿記検定、簿記能力検定などの関連資格があると仕事の役に立つ。伝票作成や記帳などの基礎業務から始め、予算・決算・資金計画の仕事へ進むのが一般的で、一人前になるには数年程度かかる。正確さ、注意力、几帳面さが求められる。基本的に残業は少なく土日祝日は休みが多いが、決算期には残業が増えることがある","used_in":"簿記の資格はどのくらい必要？ / 未経験から目指すときの準備"},{"source_url":"https://www.kentei.ne.jp/bookkeeping/class3","text":"3級は業種・職種にかかわらずビジネスパーソンが身につけておくべき基本的な商業簿記を修得し、小規模企業の経理関連書類の適切な処理を行うために求められるレベル（検索結果に表示された公式ページの内容で確認）","used_in":"簿記の資格はどのくらい必要？"},{"source_url":"https://www.kentei.ne.jp/bookkeeping/class2","text":"2級は商業簿記と工業簿記（原価計算を含む）を扱い、財務諸表の数字から経営内容を把握できるレベル。企業から求められる資格のひとつとされる（検索結果に表示された公式ページの内容で確認）","used_in":"簿記の資格はどのくらい必要？"},{"source_url":"https://www.nta.go.jp/taxes/shiraberu/taxanswer/gensen/2665.htm","text":"年末調整は、給与の支払者が、毎月の給与から源泉徴収した所得税等の合計額と、その人が1年間に納めるべき税額との差額を精算するもの。通常は12月に行う（検索結果で確認）","used_in":"経理の仕事を「日次・月次・年次」で見る"},{"source_url":"https://www.nta.go.jp/law/joho-zeikaishaku/hojin/group_faq/19.htm","text":"法人税の確定申告書は、原則として各事業年度終了の日の翌日から2か月以内に提出する（検索結果で確認）","used_in":"経理の仕事を「日次・月次・年次」で見る"}],"not_used":["民間サイトにある「経理事務の平均時給」「簿記2級以上が目安」などの数字・基準は、公的な根拠を確認できなかったので書かない","簿記の合格率や受験料は回ごとに変わるため書かない","給与計算や年末調整を経理・総務・人事のどこが担当するかは会社によって違うため、断定せず「担当することがある」にとどめた"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'keiri-mikeiken' and c.slug = 'shokushu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'keiri-mikeiken' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '経理事務 - 職業詳細（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/430', '2026-10-09'::date, '経理事務の仕事内容（入出金伝票・振替伝票の作成と帳簿への記入、月末の集計と残高の照合、決算時の試算表・棚卸・財務諸表の作成、給与計算や請求書の発行・入金確認）、入職に学歴・資格は特に必要とされず日商簿記検定などが役立つこと、基礎業務から始めて一人前には数年程度かかること、決算期には残業が増えることがあること', 0 from articles where slug = 'keiri-mikeiken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '簿記 3級', '日本商工会議所（商工会議所の検定試験）', 'https://www.kentei.ne.jp/bookkeeping/class3', '2026-10-09'::date, '日商簿記3級の位置づけ（業種・職種にかかわらず社会人が身につけておきたい基本的な商業簿記）', 1 from articles where slug = 'keiri-mikeiken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '簿記 2級', '日本商工会議所（商工会議所の検定試験）', 'https://www.kentei.ne.jp/bookkeeping/class2', '2026-10-09'::date, '日商簿記2級の位置づけ（商業簿記と工業簿記を扱い、財務諸表の数字から経営内容を把握できるレベル）', 2 from articles where slug = 'keiri-mikeiken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'No.2665 年末調整の対象となる人 ほか（タックスアンサー）', '国税庁', 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/gensen/2665.htm', '2026-10-09'::date, '年末調整は、給与の支払者が毎月の源泉徴収税額と1年間の税額との差額を精算する手続きであること', 3 from articles where slug = 'keiri-mikeiken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '確定申告書の提出期限', '国税庁', 'https://www.nta.go.jp/law/joho-zeikaishaku/hojin/group_faq/19.htm', '2026-10-09'::date, '法人税の確定申告書は、原則として事業年度終了の日の翌日から2か月以内に提出すること', 4 from articles where slug = 'keiri-mikeiken';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'keiri-mikeiken' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"684d8b652e99e8a7e94d647068062d64f3aee75540a32587ab4ccca252f4e110","findings":[]}'::jsonb from articles where slug = 'keiri-mikeiken';
update articles set status = 'published' where slug = 'keiri-mikeiken';

-- article: kibou-nenshu-kakikata (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('kibou-nenshu-kakikata', 'article', '希望年収・希望給与の書き方と面接での答え方｜「貴社規定に従います」の使いどころと例文', '希望年収は、書類では「貴社規定に従います」を基本にしつつ、ゆずれない金額があるときは根拠をそえて書きます。面接では、額面の年額で、今の年収と希望をセットで伝えると話がずれません。手取りと額面の違い、今の年収の確かめ方、場面別の答え方の例を紹介します。', '応募書類の「希望給与」の欄や、面接での「希望年収はいくらですか？」という質問。高く言うと落とされそうで、低く言うと損をしそうで、どう答えればいいか迷う人は多いです。

先に結論を言うと、次のように場面で分けて考えると迷いにくくなります。

- **書類**：基本は「貴社の規定に従います」。ゆずれない金額があるときだけ、根拠をそえて書く
- **面接**：**額面の年額**で、**今の年収と希望をセット**で、根拠をそえて伝える
- **内定のあと**：提示された金額を**書面で確かめて**から返事をする

この記事で分かること：

- 「額面」と「手取り」の違いと、今の年収の確かめ方
- 「貴社規定に従います」の**使いどころ**
- 書類の**書き方の例**と、面接での**答え方の例**

## まず「額面」と「手取り」をそろえる

希望年収の話がずれるいちばんの原因は、**額面と手取りの取り違え**です。

- **額面**：税金や社会保険料などが引かれる前の、支給される金額の合計
- **手取り**：額面から、税金や社会保険料などが引かれたあとに、実際に振り込まれる金額

たとえば厚生年金の保険料は、会社と本人が半分ずつ負担し、本人の分は給与から差し引かれます。ほかにも、健康保険料や雇用保険料、所得税、住民税などが引かれるため、手取りは額面より少なくなります。

```figure
type: compare
title: 額面と手取りの違い
columns:
  - label: 額面
    tone: sky
    items:
      - 引かれる前の、支給額の合計
      - 求人の月給・年収はこちらで書かれることが多い
      - 面接で年収を伝えるときはこちら
  - label: 手取り
    tone: sand
    items:
      - 税金や保険料が引かれたあとの金額
      - 実際に口座に振り込まれる金額
      - 生活費を考えるときはこちら
```

面接で「今の年収は？」と聞かれて手取りで答えると、会社は額面だと受け取り、実際より低い金額で話が進んでしまうことがあります。**会社と話すときは額面、生活費を考えるときは手取り**と覚えておきましょう。

手取りの目安の出し方は[手取り20万円から転職を考えるとき、何を比べればいい？](/articles/tedori-20man-hikaku)で紹介しています。

### 今の年収は、何で確かめる？

今の年収（額面）は、会社から年末ごろや退職のときに受け取る**源泉徴収票**の「支払金額」の欄で確かめられます。ここには、その年に支払われることが決まった給与などの総額が書かれています。

源泉徴収票が手元にないときは、給与明細の「総支給額」を1年分合計し、賞与があればそれも足して目安を出します。

転職先に前の会社の源泉徴収票を出すこともあるので、今の年収を実際より多く伝えるのはやめましょう。

## 「貴社規定に従います」は、どんなときに使う？

「貴社の規定に従います」は、**給与を会社の決まりにまかせます**という意味の書き方です。次のようなときに使います。

- 書類の本人希望記入欄で、**給与について特に希望がない**とき
- 未経験の職種で、**給与の相場がまだ分からない**とき
- 求人に書かれた**給与の幅に納得している**とき

一方で、次のようなときは「貴社規定に従います」だけで済ませないほうがいいです。

- **生活のために、これ以上は下げられない金額がある**とき
- 求人の給与の幅が広く、**どこになるかで生活が大きく変わる**とき

「貴社規定に従います」と書いたあとで、内定のときに「その金額では生活できません」と言うと、話がこじれやすくなります。ゆずれない金額があるなら、面接のどこかで伝えておくほうが、あとで困りません。

## 履歴書・応募書類での書き方

厚生労働省の履歴書様式例では、給料・職種・勤務時間・勤務地などの希望は「本人希望記入欄」に、希望があれば書くことになっています。

**特に希望がないとき（書き方の例）**

> 貴社の規定に従います。

**ゆずれない金額があるとき（書き方の例・金額は仮の例）**

> 給与につきましては、現在の年収（〇〇万円）を考慮いただけますと幸いです。そのほかは貴社の規定に従います。

> 生活の事情により、月給〇〇万円以上を希望いたします。

書くときのポイントは次の3つです。

- **金額は額面で書く**
- **一方的に要求する言い方にしない**（「〜を希望いたします」「考慮いただけますと幸いです」）
- **給与以外の希望を書きすぎない**：希望が多いと、条件の合う人だけを探していると受け取られることがあります

給与のほかに書いておきたいことがあれば、「在職中のため、平日の日中は電話に出られないことがあります」のような連絡の希望を書くこともできます。

## 面接での答え方の例

面接で希望年収を聞かれたら、次の順番で答えると短くまとまります。

```figure
type: steps
title: 希望年収を聞かれたときの答え方
items:
  - label: 今の年収
    text: 額面の年額で、賞与を含むかもそえる
  - label: 希望
    text: 希望額か、これ以上は下げられない金額
  - label: 根拠
    text: 今の年収・生活に必要な金額・求人の給与の幅
  - label: 相談の姿勢
    text: 「ご相談させてください」と結ぶ
```

### 今の年収を維持したいとき

> 「現在の年収は、賞与を含めて額面で〇〇万円です。生活のことを考えると、同じくらいの金額を希望しております。ただ、未経験の職種ですので、御社の規定をふまえてご相談させてください。」

### 未経験の職種で、下がってもいいと考えているとき

> 「未経験からのスタートですので、御社の規定に従います。ただ、生活のために、年収〇〇万円は下回らないようにしたいと考えています。」

「下がってもいい」と思っていても、**これ以上は下げられない金額**は決めておきましょう。生活費から計算しておくと、自信をもって伝えられます。

### 今の年収を聞かれて、答えにくいとき

> 「アルバイトでしたので、年によって変わりますが、20XX年分の源泉徴収票では額面で〇〇万円でした。」

アルバイトや派遣で収入が月によって違う場合も、源泉徴収票などで分かる金額を、そのまま伝えれば大丈夫です。

### 避けたい答え方

| 答え方 | どう受け取られやすいか | 言い換えの例 |
| --- | --- | --- |
| 「いくらでもいいです」 | 何も考えていないように見える | 「御社の規定に従います。そのうえで、〇〇万円は下回らないようにしたいです」 |
| 根拠なく高い金額だけを言う | 会社の考えと合わないと思われる | 今の年収や生活費を根拠としてそえる |
| 手取りの金額で答える | 実際より低い金額で話が進む | 「額面で〇〇万円です」と言い添える |

面接全体の準備は[未経験職種の面接、何を準備する？](/articles/mensetsu-junbi-mikeiken)で紹介しています。

## 内定のあとは、書面で確かめる

内定が出たら、提示された給与を**書面で確かめてから**返事をします。

- 月給の内訳（基本給・手当・固定残業代があるか）
- 賞与があるか、年に何回か、どう決まるか
- 面接で伝えた希望と、提示された金額の差

提示された金額が希望と大きく違うときは、承諾する前に「〇〇の点について、ご相談させていただけますか」と聞いてみましょう。給料が下がるかもしれないときの考え方は[年収300万円から転職すると、給料は下がる？上げられる？](/articles/nenshu-300man-tenshoku)にまとめています。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '希望年収の書き方・答え方｜「貴社規定に従います」は使える？', '履歴書の希望給与はどう書く？「貴社規定に従います」の使いどころ、ゆずれない金額があるときの書き方、面接で希望年収や今の年収を聞かれたときの答え方の例、手取りと額面の違い、源泉徴収票での今の年収の確かめ方を紹介します。', array['nenshu-300man-tenshoku', 'tedori-20man-hikaku', 'mensetsu-junbi-mikeiken', 'koteizangyo-kyujin', 'mensetsu-yokukiku-shitsumon']::text[], '{}'::text[], array['kyuryo', 'mensetsu']::text[], array['hajimete', 'seishain-keiken-sukunai']::text[], array['希望年収、', 'なんて答えればいい？']::text[], null, false, '[{"q":"履歴書の希望給与の欄は、空欄でもいいですか？","a":"厚生労働省の履歴書様式例では、給料などの希望を書く欄は「本人希望記入欄」で、希望があれば記入する欄です。特に希望がなければ「貴社の規定に従います」と書くのが一般的です。空欄よりも、ひとこと書いておくほうが、書き忘れではないことが伝わります。"},{"q":"今の年収は、手取りと額面のどちらで答えればいいですか？","a":"額面（税金や社会保険料が引かれる前の金額）で答えるのが基本です。求人の月給や年収も額面で書かれていることが多いので、そろえておくと話がずれません。今の年収は、源泉徴収票の「支払金額」の欄で確かめられます。"},{"q":"希望年収を高めに言うと、落とされますか？","a":"金額だけで結果が決まるとは言えませんが、根拠のない金額だと、会社の考える金額と合わないと受け取られることがあります。求人に書かれた給与の幅を確かめ、その範囲の中で、生活に必要な金額や今の年収を根拠にして伝えると、話し合いになりやすくなります。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"希望年収は「書類」と「面接」で伝え方を分ける。書類は「貴社規定に従います」を基本に、ゆずれない金額があるときだけ根拠つきで書く。面接では額面の年額で、今の年収と希望をセットで伝える。手取りと額面の取り違えが一番のずれの原因なので、源泉徴収票で今の年収を確かめる方法を示す","quotes":[{"source_url":"https://www.hellowork.mhlw.go.jp/doc/kouroushourirekisho.pdf","text":"厚生労働省履歴書様式例には「本人希望記入欄（特に給料・職種・勤務時間・勤務地・その他についての希望などがあれば記入）」がある（直接開けなかったため、検索結果に表示された内容で確認）","used_in":"履歴書・応募書類での書き方"},{"source_url":"https://www.nta.go.jp/publication/pamph/hotei/tebikihtml/2-2-3.htm","text":"「支払金額」欄には、その年中に支払の確定した給与等の総額を記載する。中途就職者で前の支払者の給与等を通算して年末調整した場合はその金額を含む（検索結果で確認）","used_in":"今の年収は、何で確かめる？"},{"source_url":"https://www.nenkin.go.jp/service/kounen/hokenryo/hoshu/20150515-01.html","text":"厚生年金保険料は、標準報酬月額・標準賞与額に保険料率をかけて計算し、事業主と被保険者が半分ずつ負担する。被保険者の負担分は給与から控除される（検索結果で確認）","used_in":"まず「額面」と「手取り」をそろえる"}],"not_used":["「希望年収は今の年収の〇割増しが目安」「〇万円上乗せが相場」などの数字は、公的な根拠がないため書かない","手取りの割合（額面の〇割前後）は、扶養や住民税、保険の種類で変わり、公的な目安を確認できなかったため書かない","厚生年金の保険料率や標準報酬月額の等級などの具体的な数字は、この記事の主題から外れるため書かない","年収の交渉を代行するサービスなど、特定のサービスには触れない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'kibou-nenshu-kakikata' and c.slug = 'hatarakikata' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'kibou-nenshu-kakikata' and c.slug = 'shorui-mensetsu' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '履歴書（厚生労働省履歴書様式例）', '厚生労働省（ハローワークインターネットサービス）', 'https://www.hellowork.mhlw.go.jp/doc/kouroushourirekisho.pdf', '2026-10-09'::date, '履歴書様式例に「本人希望記入欄」があり、給料・職種・勤務時間・勤務地などの希望があれば記入する欄であること', 0 from articles where slug = 'kibou-nenshu-kakikata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '「支払金額」欄（給与所得の源泉徴収票等の法定調書の作成と提出の手引）', '国税庁', 'https://www.nta.go.jp/publication/pamph/hotei/tebikihtml/2-2-3.htm', '2026-10-09'::date, '源泉徴収票の「支払金額」の欄には、その年中に支払の確定した給与等の総額が書かれること', 1 from articles where slug = 'kibou-nenshu-kakikata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '厚生年金保険の保険料', '日本年金機構', 'https://www.nenkin.go.jp/service/kounen/hokenryo/hoshu/20150515-01.html', '2026-10-09'::date, '厚生年金保険料は標準報酬月額に保険料率をかけて計算し、事業主と被保険者が半分ずつ負担し、本人の分は給与から差し引かれること', 2 from articles where slug = 'kibou-nenshu-kakikata';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'kibou-nenshu-kakikata' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"10c976138de21b306a1412c37a3177e426bfa2b008df7d26da7ce6fc05bc2eac","findings":[]}'::jsonb from articles where slug = 'kibou-nenshu-kakikata';
update articles set status = 'published' where slug = 'kibou-nenshu-kakikata';

-- article: kigyou-erabi-soudan (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('kigyou-erabi-soudan', 'article', '自分に合う会社選びを、プロに相談するとよい理由｜求人票で分からないことの聞き方と確かめ方', '求人票には、職場の雰囲気や配属、残業の実態、研修の中身までは書かれていないことがよくあります。人材紹介会社のキャリアアドバイザーに相談すると、こうした求人票の外側のことを聞けて、条件の優先順位も一緒に整理できます。聞けることと質問の例、優先順位のつけ方、すすめられた会社を自分で確かめる方法を紹介します。', '求人をいくつも見ていると、どの会社も同じように見えてきて、「結局どこが自分に合うのか分からない」と感じることがあります。給料や休日は求人票で比べられても、**入ってから毎日過ごす職場の様子**は、求人票だけではなかなか見えません。

先に結論を言うと、**自分に合う会社を選ぶには、求人票の外側の情報を集めることと、自分の条件に優先順位をつけることが大切**です。どちらも、人材紹介会社のキャリアアドバイザー（転職エージェント）に相談すると進めやすくなります。

この記事で分かること：

- **求人票だけでは分からない**こと
- キャリアアドバイザーに**聞けること**と、質問の例
- 条件の**優先順位のつけ方**
- すすめられた会社を**自分で確かめる方法**

## 求人票だけでは分からないこと

求人票には、給料・休日・勤務地などの条件が書かれています。でも、次のようなことは書かれていないか、書かれていても一部だけのことが多いです。

| 分かりにくいこと | 求人票だけでは見えないところの例 |
| --- | --- |
| 職場の雰囲気 | 年齢層、チームの人数、質問しやすい空気か |
| 配属 | 最初にどの部署で何をするか、その後に変わることはあるか |
| 残業の実態 | 月によって忙しさがどう違うか、部署による差はあるか |
| 研修 | 誰が、どのくらいの期間、どんな形で教えてくれるか |

配属については、2024年4月から、求人の募集や職業紹介のときに明示される労働条件に「業務の変更の範囲」「就業場所の変更の範囲」が加わりました。求人票に書かれている「変更の範囲」も見ておくと、入社後にどんな仕事や勤務地に変わる可能性があるかの手がかりになります。

それでも、「実際に入った人は最初の1年で何をしているか」「忙しい時期はいつか」といった実態は、求人票からは読み取りにくいところです。

## キャリアアドバイザーに聞けること

人材紹介会社のキャリアアドバイザーは、求人を出している企業とやりとりをしています。そのため、求人票に書かれていない職場の様子を、知っている範囲で教えてもらえることがあります。どこまで分かるかは求人によって違うので、「分かる範囲で教えてください」と聞いてみましょう。

**職場の雰囲気**

- 「配属される部署は何人くらいで、どんな年代の人が多いですか？」
- 「未経験で入った人は、職場にどのくらいいますか？」

**配属**

- 「最初に配属される部署と、そこで任される仕事を教えてください」
- 「何年か働いたあとに、部署や勤務地が変わることはありますか？」

**残業の実態**

- 「残業が多くなりやすい時期はありますか？」
- 「求人票の残業時間は、配属される部署でも同じくらいですか？」

**研修**

- 「入社後の研修は、どのくらいの期間、どんな形で行われますか？」
- 「研修のあと、仕事を教えてくれる先輩はついてもらえますか？」

面接では聞きにくい質問も、応募の前にキャリアアドバイザーに聞いておけると、応募するかどうかを落ち着いて判断できます。

## 条件の優先順位は、一緒に整理できる

自分に合う会社を選ぶときに、もうひとつ大事なのが**条件の優先順位**です。給料も休みも仕事内容も、全部を満たす求人はなかなかありません。何を優先するかが決まっていないと、求人を見るたびに迷ってしまいます。

優先順位は、次の順番で整理すると決めやすくなります。

```figure
type: steps
title: 条件の優先順位のつけ方
items:
  - label: 書き出す
    text: 給料・休日・勤務地・仕事内容など、気になる条件を全部書く
  - label: ゆずれない条件
    text: 満たされないなら応募しない条件を1〜2個選ぶ
  - label: できれば
    text: あるとうれしいが、ほかと比べて考えられる条件
  - label: 気にしない
    text: 今回はこだわらなくていい条件
```

たとえば、次のように整理します（仮の例）。

- **ゆずれない**：土日休み、通勤は片道1時間以内
- **できれば**：今と同じくらいの給料、研修がある
- **気にしない**：会社の規模、制服の有無

迷うときは、**今の仕事でいちばんつらいこと**を思い出してみてください。「土日に休めない」がつらいなら、それがゆずれない条件の候補です。

この整理は、キャリアアドバイザーと話しながら進めるとまとまりやすくなります。「土日休みと給料、どちらを優先するか迷っています」と伝えれば、それぞれを優先した場合の求人の違いを一緒に考えてもらえます。

## すすめられた会社を、自分で確かめる方法

キャリアアドバイザーの話は参考になりますが、応募するかどうかを決めるのは自分です。すすめられた会社は、次の方法で自分でも確かめておきましょう。

```figure
type: checklist
title: すすめられた会社を確かめる
items:
  - すすめられた理由を聞いたか
  - 求人票の条件と、聞いた話が合っているか
  - 公式サイトで、仕事内容や会社の様子を見たか
  - しょくばらぼで、職場情報が公開されていないか
  - 分からないことを、面接の逆質問で聞けるか
  - 内定後に、条件を書面で確かめるつもりか
```

- **すすめられた理由を聞く**：「この会社をすすめてくださった理由を教えてください」と聞くと、自分の希望のどこに合っているのかが分かります
- **公的な職場情報を見る**：厚生労働省の職場情報総合サイト「しょくばらぼ」では、企業の残業時間や有給休暇の取得状況、平均年齢などの職場情報を検索・比較できます（すべての会社が載っているわけではありません）
- **面接で確かめる**：キャリアアドバイザーから聞いた話で気になることは、面接の逆質問で「入社後はどのような研修がありますか？」のように、自分でも確かめましょう

自分で調べる方法は[転職の企業研究、何を見ればいい？](/articles/kigyou-kenkyu-yarikata)、新卒者などの募集で職場情報を求める方法は[求人で「職場の情報」を確かめるには？](/articles/shokuba-jouhou-wakamono)で紹介しています。内定をもらったら、聞いていた条件を労働条件通知書などの書面で照らし合わせることも大切です。見るところは[転職で後悔しないために、入社前に確認したいこと](/articles/tenshoku-koukai-shinai)にまとめています。

## 相談するときに気をつけたいこと

- **聞いた話は、最後は書面で確かめる**：キャリアアドバイザーが知っている職場の様子も、時期や部署によって変わることがあります。大事な条件は、内定後に書面で確かめましょう
- **すすめられた会社を、そのまま受けない**：紹介される求人は、その人材紹介会社が扱っている求人の中からになります。自分の優先順位と合っているかを、自分で判断しましょう
- **合わない担当者もいる**：希望を伝えてもかみ合わないときは、担当を変えてもらえるか問い合わせても構いません

キャリアアドバイザーを「会社を決めてくれる人」ではなく、**求人票の外側の情報を集め、優先順位を一緒に整理してくれる相談相手**として使うと、自分で納得して会社を選びやすくなります。

## まとめ：相談の前に整理しておくこと

自分に合う会社を選ぶには、求人票の条件だけでなく、職場の雰囲気・配属・残業の実態・研修といった求人票の外側の情報と、自分の条件の優先順位が欠かせません。どちらも、人材紹介会社のキャリアアドバイザーに相談すると整理しやすくなります。

相談を考えているなら、面談の前に次のことを整理しておくと、自分に合う会社の話に早く進めます。

- **気になる条件の書き出し**と、そのうち**ゆずれない条件1〜2個**
- **今の仕事でつらいこと・変えたいこと**
- **求人票を見て気になったこと**（あれば、その求人票も持っていく）

面談の前に決めておくこと・決めなくていいことは、[エージェント面談の前に決めておくこと・決めなくていいこと](/articles/agent-mendan-mae)にまとめています。', 'review', false, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-10'::timestamptz, '自分に合う会社選びをプロに相談するとよい理由と確かめ方', '自分に合う会社はどう選ぶ？求人票だけでは分からない職場の雰囲気・配属・残業の実態・研修を、人材紹介会社のキャリアアドバイザーに聞くときの質問例と、条件の優先順位のつけ方、すすめられた会社を自分で確かめる方法を紹介します。', array['kigyou-kenkyu-yarikata', 'tenshoku-koukai-shinai', 'shokuba-jouhou-wakamono', 'tenshoku-agent-merit', 'mensetsu-renshu-pro']::text[], '{}'::text[], array['yaritai']::text[], array['hajimete']::text[], array['自分に合う会社、', 'どう選べばいい？']::text[], null, false, '[{"q":"求人票に書いていないことは、どうやって調べればいいですか？","a":"会社の公式サイトや、厚生労働省の職場情報総合サイト「しょくばらぼ」で、残業時間や有給休暇の取得状況などが公開されていないか確かめましょう。それでも分からないことは、人材紹介会社のキャリアアドバイザーに聞いたり、面接の逆質問で確かめたりする方法があります。"},{"q":"キャリアアドバイザーにすすめられた会社は、信用していいですか？","a":"すすめられた理由を聞き、自分の希望と合っているかを自分でも確かめてから決めましょう。キャリアアドバイザーが知っている職場の様子は参考になりますが、大事な条件は、内定のあとに労働条件通知書などの書面で確認することが大切です。"},{"q":"条件の優先順位は、どうやって決めればいいですか？","a":"気になる条件をすべて書き出してから、「これが満たされないなら応募しない」というゆずれない条件を1〜2個選びます。残りは「できれば」の条件にします。迷うときは、今の仕事でいちばんつらいことを思い出すと、ゆずれない条件が見つかりやすくなります。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"既存の kigyou-kenkyu-yarikata（自分で調べる企業研究）と tenshoku-koukai-shinai（内定後に書面で確かめること）と役割を分け、「求人票の外側の情報を、人材紹介会社のキャリアアドバイザーに聞く」ことと「条件の優先順位を一緒に整理する」ことに絞る。アドバイザーの話も最後は自分で確かめる、という注意を短く入れたうえで、前向きな使い方で結ぶ。特定の会社名・サービス名は書かない","quotes":[{"source_url":"https://www.mhlw.go.jp/content/001114167.pdf","text":"2024年4月1日から、募集広告や職業紹介の際に明示される労働条件に、従事すべき業務の変更の範囲、就業場所の変更の範囲、有期労働契約を更新する場合の基準が追加された（mhlw.go.jp に直接接続できなかったため、各労働局が掲載している同じ求職者向けリーフレットの内容を検索結果で確認。URL は既存の公開記事 agent-soudan-nani・tenshoku-koukai-shinai で使っているもの）","used_in":"求人票だけでは分からないこと（配属）"},{"source_url":"https://shokuba.mhlw.go.jp/010/20180302201542.html","text":"しょくばらぼは厚生労働省の職場情報総合サイトで、企業の残業時間（時間外労働時間）、有給休暇取得率、平均年齢などの職場情報を検索・比較できる（サイトに直接接続できなかったため、検索結果の記載で確認）","used_in":"すすめられた会社を、自分で確かめる方法"}],"not_used":["求人票の「未経験歓迎」「学歴不問」などの言葉の読み方は、執筆中の kyujin-hyo-yomikata（draft）の役割なので扱わず、リンクもしていない（未公開のため）","キャリアアドバイザーが職場の内情をどこまで知っているかについての公的な根拠はないため、「知っている範囲で教えてもらえることがある」にとどめた","残業時間や離職率の「この数字なら安心」といった基準は、公的な根拠を確認できなかったので書かない","口コミサイトの情報は扱わない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'kigyou-erabi-soudan' and c.slug = 'junbi' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'kigyou-erabi-soudan' and c.slug = 'hatarakikata' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '企業から受ける労働条件明示のルールが変わります！（求職者の皆さまへ）', '厚生労働省', 'https://www.mhlw.go.jp/content/001114167.pdf', '2026-10-10'::date, '2024年4月から、求人の募集や職業紹介のときに明示される労働条件に、業務の変更の範囲・就業場所の変更の範囲などが加わったこと', 0 from articles where slug = 'kigyou-erabi-soudan';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職場情報総合サイト しょくばらぼ', '厚生労働省', 'https://shokuba.mhlw.go.jp/010/20180302201542.html', '2026-10-10'::date, '企業の残業時間や有給休暇の取得状況、平均年齢などの職場情報を検索・比較できること', 1 from articles where slug = 'kigyou-erabi-soudan';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'kigyou-erabi-soudan' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"aff29acfe6b84bd130639abb28e08bcf20795b63ef25151cd8b9fd278a8b242f","findings":[]}'::jsonb from articles where slug = 'kigyou-erabi-soudan';
update articles set status = 'published' where slug = 'kigyou-erabi-soudan';

-- article: kigyou-kenkyu-yarikata (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('kigyou-kenkyu-yarikata', 'article', '転職の企業研究、何を見ればいい？公式サイト・求人票・職場情報の調べ方と面接での使い方', '転職の企業研究は、「面接で聞かれることに答える材料を集める」ことと「入社後のギャップを減らす」ことの2つのためにします。求人票・会社の公式サイト・しょくばらぼなどの公的な職場情報・job tag でそれぞれ何を見るか、調べた内容のまとめ方、志望動機や逆質問への使い方を紹介します。', '応募したい会社が見つかった。でも「企業研究をしよう」と言われても、何をどこまで調べればいいのか分からない。そんな人は多いはずです。

先に結論を言うと、転職の企業研究は、次の2つのためにします。

1. **面接で聞かれることに答える材料を集める**（「なぜこの会社なのか」「入社後に何をしたいか」）
2. **入社してからのギャップを減らす**（仕事内容・働き方・職場の様子を、入る前に確かめる）

会社の歴史や業界の将来をくわしく分析する必要はありません。この記事では、**どこで、何を見て、どう面接に使うか**を順番に紹介します。

## どこで、何を見る？

企業研究で見る場所は、大きく4つです。

| 見る場所 | 主に分かること |
| --- | --- |
| 求人票 | 仕事内容、給料、休日、勤務時間、試用期間 |
| 会社の公式サイト | 事業の中身、お客さん、会社が大事にしていること |
| 公的な職場情報 | 残業時間、有休の取りやすさ、採用や定着の状況 |
| job tag（仕事の情報） | その職種の一般的な仕事内容、必要な知識 |

いきなり全部を調べなくてもかまいません。書類を出す前は「求人票」と「公式サイト」、面接が決まったら「職場情報」と「仕事の情報」まで、と段階を分けると続けやすくなります。

## 求人票で見ること

求人票は、会社が応募者に向けて書いた、いちばん具体的な情報です。企業研究の出発点にします。

- **仕事内容**：入社してすぐ担当する仕事は何か。「〇〇など」の「など」に何が含まれていそうか
- **応募資格**：「未経験歓迎」「経験者優遇」のどちらか。必要なPCスキルや資格
- **働き方の条件**：休日の数と曜日、勤務時間、残業の目安、試用期間の有無
- **会社の説明欄**：事業内容、従業員数、どんなお客さんがいるか

読みながら「ここが分からない」と思ったことは、その場でメモしておきます。あとで面接の逆質問の材料になります。休日と年収の数字の見比べ方は[「土日休み」と「年収」をどう比較する？](/articles/donichi-yasumi-nenshu-hikaku)で紹介しています。

## 会社の公式サイトで見ること

公式サイトでは、求人票だけでは分からない「その会社らしさ」を探します。見るページの例は次のとおりです。

- **事業内容・サービスのページ**：何を、誰に売っている（提供している）会社か
- **会社の考え（理念・代表のあいさつなど）**：会社が大事にしていると書いていること
- **お知らせ・ニュース**：新しく始めたこと、力を入れていること
- **採用ページ**：社員の紹介、1日の流れ、研修の説明があれば読む

ここで見つけたことのうち、**自分の経験や関心とつながるもの**を1つ選んでおくと、志望動機に「この会社ならではの理由」を入れやすくなります。

## 公的な職場情報で見ること

働き方の実態は、会社が公表している数字や、国のサイトに登録された情報でも確かめられます。

### しょくばらぼ（職場情報総合サイト）

厚生労働省の「しょくばらぼ」では、企業ごとの残業時間、有休の取得状況、平均年齢、採用の状況などの職場情報を検索したり、複数の会社を比べたりできます。すべての会社が登録しているわけではないので、**見つからなくても「情報がない会社＝よくない会社」とは考えない**ようにしましょう。

### 若者雇用促進法の職場情報

若者雇用促進法では、新卒者などを条件にした募集をする会社は、応募者などから求められたら、「募集・採用の状況」「労働時間などの状況」「研修など能力開発の状況」の3つの類型ごとに1つ以上の情報を出すことになっています。第二新卒などの募集で使えるかどうかや、どんな項目があるかは[求人で「職場の情報」を確かめるには？](/articles/shokuba-jouhou-wakamono)でくわしく紹介しています。

### 中途採用比率

2021年4月1日から、常時雇用する労働者が301人以上の企業は、直近3事業年度について、採用した正社員のうち中途採用が占める割合（中途採用比率）を、自社のホームページなどで公表することになっています。会社の採用ページやサステナビリティのページに載っていることが多いので、「中途採用比率」で探してみましょう。中途で入った人がどのくらいいるかの目安になります。

## 仕事内容は job tag で確かめる

未経験の職種に応募するときは、会社のことだけでなく、**その仕事そのもの**も調べておくと面接で話しやすくなります。厚生労働省の「job tag（職業情報提供サイト）」では、職業ごとに、仕事の内容、必要な知識やスキル、その仕事に就くまでの経路などを調べられます。

求人票の仕事内容と、job tag の一般的な説明を見比べると、「この会社では、この仕事のどの部分を担当するのか」が分かりやすくなります。

## 調べたことは「企業研究メモ」にまとめる

調べたことは、1社につき1枚のメモにまとめておくと、面接の前に見返しやすくなります（項目は一例です）。

```figure
type: checklist
title: 企業研究メモに書く項目
items:
  - 何を、誰に提供している会社か
  - 入社後に担当する仕事
  - 会社が大事にしていること
  - 自分の経験とつながるところ
  - 働き方の条件（休日・残業・試用期間）
  - 調べても分からなかったこと
```

書き方の例（仮の例）：

> - 何の会社：法人向けに事務用品を販売。お客さんは地域の中小企業
> - 担当する仕事：営業事務。受注の入力、見積書の作成、電話の取り次ぎ
> - 大事にしていること：「注文から届くまでを早く、正確に」とサイトに書いてある
> - 自分とのつながり：販売の仕事で、在庫の確認と取り置きの連絡を担当していた
> - 分からないこと：残業が多い時期はいつか、入社後の研修はどのくらいあるか

最後の「分からないこと」が、面接の逆質問の材料になります。

## 面接の準備にどう使う？

企業研究メモができたら、面接で話すことに組み込みます。

### 志望動機に「この会社ならでは」を1つ入れる

志望動機は、「きっかけ → 経験とのつながり → 入社後にやりたいこと」の順に組み立てると話しやすくなります。企業研究で見つけたことは、真ん中の「つながり」に入れます。

> 「御社がサイトで『注文から届くまでを早く、正確に』を大事にしていると知り、販売の仕事で在庫の確認や取り置きの連絡を正確に行うよう心がけてきた経験を活かせると考えました。」

志望動機の組み立て方と例文は[未経験職種の志望動機、何を書けばいい？](/articles/shiboudouki-mikeiken)で紹介しています。

### 「分からないこと」は逆質問にする

メモの「分からないこと」は、そのまま逆質問の候補になります。

> 「入社後は、どのような流れで仕事を覚えていくことが多いでしょうか。」

調べれば分かること（事業内容や従業員数など）を聞くと、準備していないように受け取られることがあります。**調べたうえで、それでも分からないこと**を聞くのがポイントです。聞き方の例は[面接の逆質問、何を聞けばいい？](/articles/gyaku-shitsumon)にまとめています。

### 働き方の条件は、内定のあとに書面で確かめる

休日や残業、試用期間など、働き方の条件で気になることは、面接で聞きにくければ、内定が出たあとに労働条件通知書などの書面で確かめる方法もあります。企業研究メモに書いた「分からないこと」は、内定のあとまで残しておきましょう。', 'review', false, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '転職の企業研究のやり方｜どこで何を見て面接に使う？', '転職の企業研究は何を見ればいい？求人票・会社の公式サイト・しょくばらぼや若者雇用促進法の職場情報・中途採用比率・job tag で確かめることと、調べたことのまとめ方、志望動機や逆質問への使い方を紹介します。', array['shokuba-jouhou-wakamono', 'shiboudouki-mikeiken', 'gyaku-shitsumon', 'shorui-senkou-tooranai', 'fukuri-kousei-mikata', 'kigyou-erabi-soudan']::text[], '{}'::text[], array['mensetsu', 'mikeiken-shokushu']::text[], array['hajimete']::text[], array['企業研究って、', 'どこで何を見る？']::text[], null, false, '[{"q":"企業研究は、1社にどのくらい時間をかければいいですか？","a":"決まった時間はありません。目安は「志望動機に会社ならではの理由を1つ入れられる」「逆質問をいくつか用意できる」「働き方の条件で気になることが分かっている」の3つがそろうところまでです。書類を出す前は求人票と公式サイトを中心に、面接が決まったら職場情報や仕事内容まで調べる、と段階を分けると続けやすくなります。"},{"q":"小さな会社で、公式サイトにほとんど情報がありません。どう調べればいいですか？","a":"求人票を細かく読み、しょくばらぼで職場情報が登録されていないかを確認しましょう。仕事内容は job tag（職業情報提供サイト）で職種ごとの一般的な内容を調べられます。それでも分からないことは、面接の逆質問や、内定後に労働条件を確認する場で聞くことにして、メモに残しておきます。"},{"q":"口コミサイトの情報は、企業研究に使ってもいいですか？","a":"参考にするのはかまいませんが、書いた人の立場や時期が分からず、事実かどうか確かめられないこともあります。気になることがあれば、求人票や会社が公表している情報と照らし合わせ、それでも分からないことは面接で質問する形で確かめましょう。面接で口コミの内容をそのまま持ち出すのは避けたほうが無難です。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"企業研究を「大きな会社の分析」ではなく、①面接で答える材料、②入社後のギャップを減らす確認、の2つに絞る。見る場所を4つ（求人票・公式サイト・公的な職場情報・job tag）に分け、何を見るかとメモの型、面接での使い方まで具体的に示す。若者雇用促進法の詳しい説明は既存記事 shokuba-jouhou-wakamono に任せる","quotes":[{"source_url":"https://shokuba.mhlw.go.jp","text":"しょくばらぼは厚生労働省の職場情報総合サイトで、勤務実態などの働き方や採用状況について企業の職場情報を検索・比較できる。若者雇用促進総合サイト、女性の活躍推進企業データベース、両立支援のひろばの情報が集められている（サイトに直接接続できなかったため、検索結果の記載で確認）","used_in":"公的な職場情報で見ること"},{"source_url":"https://shigoto.mhlw.go.jp/User/about","text":"job tag は職業の仕事内容、タスク、スキル・知識を見える化したサイトで、仕事の概要、入職経路、労働条件などを確認できる（検索結果の記載で確認）","used_in":"仕事内容は job tag で確かめる"},{"source_url":"https://jsite.mhlw.go.jp/oita-roudoukyoku/hourei_seido_tetsuzuki/kyujin_kyushoku/2021.02.15.html","text":"令和3年4月1日から、常時雇用する労働者が301人以上の企業は、自社のホームページなどで「直近の3事業年度の各年度について、採用した正規雇用労働者の中途採用比率」を公表することが必要となる（検索結果の記載で確認。ページ題名は直接読めなかったため、内容に沿った題名で記録した）","used_in":"公的な職場情報で見ること"},{"source_url":"https://jsite.mhlw.go.jp/kochi-roudoukyoku/var/rev0/0109/7901/2016216181336.pdf","text":"新卒者等であることを条件とした募集・求人申込みを行う場合に情報提供が必要。応募者等からの求めがあった場合は、募集・採用に関する状況、労働時間などに関する状況、職業能力の開発・向上に関する状況の3類型ごとに1つ以上の情報提供が義務（検索結果の記載で確認。資料の正式な題名は直接読めなかったため、内容に沿った題名で記録した）","used_in":"公的な職場情報で見ること"}],"not_used":["しょくばらぼの掲載企業数は時点で変わるため書かない","中途採用比率の公表に違反したときの罰則の有無は、民間の解説でしか確認できなかったので書かない","口コミサイトの信頼性についての公的な調査は確認できなかったので、「事実か確かめられないこともある」という一般的な注意にとどめた"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'kigyou-kenkyu-yarikata' and c.slug = 'junbi' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'kigyou-kenkyu-yarikata' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職場情報総合サイト しょくばらぼ', '厚生労働省', 'https://shokuba.mhlw.go.jp', '2026-10-09'::date, '企業の残業時間・有休の取得状況・平均年齢・採用の状況などの職場情報を検索・比較できるサイトであること。若者雇用促進総合サイトや女性の活躍推進企業データベースなどの情報が集められていること', 0 from articles where slug = 'kigyou-kenkyu-yarikata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業情報提供サイト（job tag）について', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/about', '2026-10-09'::date, '職業ごとの仕事内容・必要なスキルや知識・入職までの経路・労働条件などを調べられること', 1 from articles where slug = 'kigyou-kenkyu-yarikata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '正規雇用労働者の中途採用比率の公表についてのお知らせ', '大分労働局', 'https://jsite.mhlw.go.jp/oita-roudoukyoku/hourei_seido_tetsuzuki/kyujin_kyushoku/2021.02.15.html', '2026-10-09'::date, '2021年4月1日から、常時雇用する労働者が301人以上の企業は、直近3事業年度の各年度について、採用した正規雇用労働者の中途採用比率を自社のホームページなどで公表する必要があること', 2 from articles where slug = 'kigyou-kenkyu-yarikata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '若者雇用促進法に基づく職場情報の提供についての報道発表資料', '高知労働局', 'https://jsite.mhlw.go.jp/kochi-roudoukyoku/var/rev0/0109/7901/2016216181336.pdf', '2026-10-09'::date, '新卒者等であることを条件とした募集では、応募者などから求めがあれば、募集・採用の状況、労働時間などの状況、能力開発の状況の3つの類型ごとに1つ以上の情報を提供する義務があること', 3 from articles where slug = 'kigyou-kenkyu-yarikata';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'kigyou-kenkyu-yarikata' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"2ae99fbdc181b2b041269dd7def87e5ecb79fc96260529f9bf7477815293cc62","findings":[]}'::jsonb from articles where slug = 'kigyou-kenkyu-yarikata';
update articles set status = 'published' where slug = 'kigyou-kenkyu-yarikata';

-- article: kokumin-nenkin-menjo (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('kokumin-nenkin-menjo', 'article', '退職後に国民年金の保険料が払えないときは？免除・納付猶予と失業の特例、申請先と追納', '退職して国民年金の保険料を払うのが難しいときは、未納のままにせず、免除か納付猶予を申請しましょう。失業による特例で辞めた本人の所得がゼロとして審査されるしくみ、免除の4つの段階、申請先と必要な書類、さかのぼれる期間、あとから納める追納を紹介します。', '会社を辞めて、国民年金に切り替えた。でも収入がない中で、毎月の保険料を払うのは正直きつい。そんなときは、**払わずに放っておくのではなく、免除か納付猶予を申請**しましょう。

退職した人には「**失業による特例**」があり、辞めた本人の前の年の所得をゼロとして審査してもらえます。会社員のときにそれなりの給料があった人でも、免除を受けられる可能性があります。

この記事で分かること：

- **免除**の4つの段階と、**納付猶予**の違い
- **失業による特例**のしくみと必要な書類
- **申請先**と、**さかのぼって**申請できる期間
- 未納との違いと、あとから納める**追納**

国民年金への切り替えの手続き（期限や窓口）は、[転職で働かない期間ができたら、年金はどうする？](/articles/taishoku-nenkin-tetsuzuki)で紹介しています。この記事は、切り替えたあとに「払えない」ときの話です。

## 免除は4段階、納付猶予もある

保険料を払うのが難しいときの制度には、**免除**と**納付猶予**があります。

2026年度（2026年4月〜2027年3月）の国民年金の保険料は月額17,920円です。免除には4つの段階があり、一部免除の場合は残りの額を納めます。

| 種類 | 2026年度に納める額（月額） |
| --- | --- |
| 全額免除 | 0円 |
| 4分の3免除 | 4,480円 |
| 半額免除 | 8,960円 |
| 4分の1免除 | 13,440円 |

- **免除**：本人、配偶者、世帯主の前の年の所得で審査されます。全額免除の所得の目安は「（扶養親族等の数＋1）×35万円＋32万円」です
- **納付猶予**：50歳未満の人が対象で、本人と配偶者の前の年の所得で審査されます（世帯主の所得は見ません）。親と同居していて世帯主が親の場合などは、世帯主の所得を見ないぶん、納付猶予の対象になることがあります

申請書は、免除と納付猶予で共通の「国民年金保険料免除・納付猶予申請書」を使います。

**一部免除で気をつけること**：一部免除が認められたのに、残りの額（たとえば半額免除なら8,960円）を納めないと、一部免除が無効になり、**未納**の扱いになります。

## 失業による特例：辞めた本人の所得はゼロとして審査

ふだんの審査では、前の年の所得を見ます。会社を辞めた年は、前の年に会社員として給料をもらっていたので、そのままだと所得の基準を超えてしまうことがあります。

そこで、退職した人は**失業による特例**を使えます。

- 辞めた本人の前の年の所得を**ゼロとみなして**審査する
- 配偶者や世帯主の所得は、ふつうどおり審査される
- 対象は、**失業した月の前月から翌々年の6月まで**の期間

たとえば、ひとり暮らしで自分が世帯主なら、自分の所得がゼロとして扱われるので、全額免除を受けられる可能性があります。一方、実家に住んでいて親が世帯主の場合、免除では親の所得も見られます。その場合でも、納付猶予なら世帯主（親）の所得は見ないので、本人と配偶者の所得で審査されます。

## 未納のままにしないほうがいい理由

払えないからといって、何も手続きせずに未納にすると、免除を受けた場合と比べて困ることがあります。

```figure
type: compare
title: 免除・猶予と未納の違い
columns:
  - label: 免除・納付猶予を受けた
    tone: mint
    items:
      - 受給資格期間に入る
      - 障害年金の要件でも数えられる
      - 全額免除は年金額の2分の1に反映
      - 10年以内なら追納できる
  - label: 未納のまま
    tone: coral
    items:
      - 受給資格期間に入らない
      - 障害年金を受けられないおそれ
      - 年金額に反映されない
```

- **受給資格期間**（年金を受け取るために必要な期間）：免除・納付猶予の期間は入りますが、未納の期間は入りません
- **障害基礎年金**：病気やけがで障害が残ったときの年金です。受けるには保険料を納めた期間などの要件があり、免除・猶予の期間はその要件でも数えられます。未納が多いと受けられないおそれがあります
- **老齢基礎年金の額**：全額免除の期間は、全額払った場合の2分の1が反映されます。4分の3免除は8分の5、半額免除は8分の6、4分の1免除は8分の7です。納付猶予の期間は、追納しない限り年金額には反映されません

## 申請先と必要なもの

```figure
type: steps
title: 免除・納付猶予の申請の流れ
items:
  - label: 書類をそろえる
    text: 離職票や雇用保険受給資格者証など、辞めたことが分かる書類
  - label: 申請書を出す
    text: 市区町村の国民年金の窓口か年金事務所。郵送や電子申請も
  - label: 結果の通知を待つ
    text: 承認・却下の通知が届く
  - label: 一部免除なら納める
    text: 残りの額を納めないと未納になる
```

- **申請先**：住んでいる市区町村の役所の国民年金の担当窓口、または年金事務所。郵送でも出せます。マイナポータルからの電子申請もできます
- **申請書**：「国民年金保険料免除・納付猶予申請書」
- **失業による特例を使うとき**：辞めたことが分かる書類のコピーが必要です。たとえば、ハローワークで受け取る**雇用保険受給資格者証**、**雇用保険受給資格通知**、会社から届く**雇用保険被保険者離職票**など
- **雇用保険に入っていなかった人**：ほかの書類で失業したことを確認できる場合があります。どの書類が使えるか、窓口で聞いてみましょう

国民年金に切り替える手続きと、免除の申請は、同じ窓口でまとめて相談できます。切り替えのときに「保険料を払うのが難しいので、免除の相談もしたいです」と伝えるとスムーズです。

離職票や雇用保険受給資格者証は、失業手当の手続きでも使います。くわしくは[退職後の失業手当はもらえる？](/articles/shitsugyo-teate-kihon)で紹介しています。

## さかのぼって申請できる期間と、年度ごとの申請

### 2年1か月前までさかのぼれる

申請書が受け付けられた月の**2年1か月前まで**（すでに保険料を払った月を除く）なら、さかのぼって申請できます。たとえば2026年7月に申請する場合は、2024年6月分までさかのぼれます。

ただし、申請していない間に病気やけがで障害が残った場合などは、障害年金を受けられないおそれがあります。「あとでまとめて申請すればいい」と考えず、払えないと分かった時点で申請しましょう。

### 申請は年度ごと（7月〜翌年6月）

免除・納付猶予の「年度」は、**7月から翌年6月まで**です。申請は原則として年度ごとに必要です。

- 全額免除か納付猶予が認められた人は、希望すれば翌年度以降も続けて審査してもらえます
- **失業による特例で認められた人は、翌年度も申請が必要**です

たとえば2026年9月に辞めて、2027年7月以降も働いていない場合は、2027年7月からの年度の分をあらためて申請します。

## あとから納める「追納」

免除や納付猶予を受けた期間の保険料は、**10年以内**ならあとから納める（追納する）ことができます。追納すると、その期間は全額払ったのと同じ扱いになり、年金額が増えます。

- 申し込み先：住んでいる地域の年金事務所に「国民年金保険料追納申込書」を出し、送られてくる納付書で納める
- 承認を受けた年度の翌年度から数えて**3年度目以降**に追納すると、当時の保険料に加算額が上乗せされる
- 追納は、**古い期間から順に**納める
- 一部免除の期間は、残りの額を納めていないと追納できない

次の仕事が決まって収入が安定してから、余裕のある範囲で追納を考える、という順番で大丈夫です。追納した保険料は社会保険料控除の対象になるので、年末調整や確定申告で申告しましょう。年末調整のしかたは[転職した年の年末調整と確定申告](/articles/tenshoku-nenmatsu-chosei)で紹介しています。

## 申請前のチェック

- 国民年金への切り替えの手続きは済んでいるか
- 離職票や雇用保険受給資格者証など、辞めたことが分かる書類のコピーがあるか
- 世帯主は誰か（自分か、親など）
- 配偶者がいる場合、配偶者の前の年の所得
- 基礎年金番号が分かるもの

退職後のお金の準備全体は、[転職活動にかかるお金と、退職後の生活費の準備](/articles/tenshoku-okane-junbi)にまとめています。', 'review', false, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '国民年金が払えない｜退職後の免除・納付猶予と失業の特例', '退職後、国民年金の保険料が払えないときの免除・納付猶予の申請方法を紹介します。失業による特例のしくみ、全額・一部免除の違いと2026年度の納める額、申請先と必要書類、2年1か月前までさかのぼれること、追納の期限が分かります。', array['taishoku-nenkin-tetsuzuki', 'shitsugyo-teate-kihon', 'tenshoku-okane-junbi', 'taishoku-kakutei-shinkoku']::text[], '{}'::text[], array['yametai']::text[], array['hajimete', 'seishain-keiken-sukunai']::text[], array['年金の保険料、', '払えないときは？']::text[], null, false, '[{"q":"退職して収入がありません。国民年金の保険料は払わなくてもいいですか？","a":"払えないときは、そのままにせず免除か納付猶予を申請しましょう。退職した人は「失業による特例」で、辞めた本人の前の年の所得をゼロとして審査してもらえます。申請しないで未納のままにすると、その期間は年金を受け取るために必要な期間に入らず、けがや病気で障害が残ったときの障害基礎年金を受けられないおそれがあります。"},{"q":"退職してから何か月もたってしまいました。今から申請できますか？","a":"申請書が受け付けられた月の2年1か月前までの期間（すでに保険料を払った月を除く）なら、さかのぼって申請できます。ただし、申請が遅れている間にけがや病気で障害が残ったときなどは、障害年金を受けられないおそれがあるので、気づいた時点で早めに申請しましょう。"},{"q":"免除してもらった保険料は、あとで払わないといけませんか？","a":"払わなくても未納にはなりません。ただ、免除や納付猶予の期間は、将来の老齢基礎年金が全額払った場合より少なくなります（納付猶予は年金額に反映されません）。10年以内なら追納（あとから納めること）ができ、年金額を増やせます。承認を受けた年度の翌年度から数えて3年度目以降は、当時の保険料に加算額が上乗せされます。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"既存の taishoku-nenkin-tetsuzuki は「退職後の国民年金への切り替え」が中心で、免除は概要だけ。この記事は「払えないとき」に絞り、失業特例の審査のしかた、4段階の免除と納める額、未納との違い、さかのぼり申請、毎年度の申請、追納まで、申請する人が迷うところを具体的に書く","quotes":[{"source_url":"https://www.nenkin.go.jp/service/kokunen/menjo/20150428.html","text":"免除される額は全額・4分の3・半額・4分の1の4種類。令和8年度の保険料17,920円に対し、4分の3免除は4,480円、半額免除は8,960円、4分の1免除は13,440円を納める。全額免除の所得の目安は（扶養親族等の数+1）×35万円+32万円。納付猶予は50歳未満で本人・配偶者の前年所得が一定以下の人が対象（世帯主の所得は問わない）。失業等の事実が確認できれば失業した人の前年所得をゼロとみなして審査し、対象は失業等のあった月の前月から翌々年6月まで。失業の確認書類は雇用保険受給資格者証、雇用保険受給資格通知、雇用保険被保険者離職票など。提出先は住所地の市区町村の国民年金担当窓口か年金事務所（郵送可）、マイナポータルでの電子申請も可。一部免除は減額された保険料を納めないと未納になる。申請は原則毎年度必要で、失業等による特例免除の承認者は翌年度も申請が必要（nenkin.go.jp に直接接続できなかったため、検索結果に表示された内容で確認）","used_in":"免除は4段階、納付猶予もある / 失業による特例 / 申請先と必要なもの / 申請は年度ごとに"},{"source_url":"https://www.nenkin.go.jp/service/kokunen/menjo/20150428.html","text":"年金額への反映は、全額免除が全額納付の2分の1、4分の3免除が8分の5、半額免除が8分の6、4分の1免除が8分の7（いずれも平成21年4月分以降）。納付猶予は受給資格期間に入るが年金額には反映されない。未納は受給資格期間に入らない。免除等の申請が遅れると障害年金や遺族年金を受けられないおそれがある（検索結果で確認）","used_in":"未納のままにしないほうがいい理由"},{"source_url":"https://www.nenkin.go.jp/service/kokunen/menjo/20150402-01.html","text":"過去期間は申請書が受理された月から2年1カ月前（すでに保険料が納付済の月を除く）まで。例えば令和8年7月に申請する場合は令和6年6月分までさかのぼれる。免除・納付猶予での年度は7月から翌年6月まで（検索結果で確認）","used_in":"さかのぼって申請できる期間"},{"source_url":"https://www.nenkin.go.jp/service/kokunen/menjo/20150331.html","text":"承認された月の前10年以内の期間に限り追納できる。承認を受けた期間の翌年度から起算して3年度目以降に追納する場合は、当時の保険料額に経過期間に応じた加算額が上乗せされる。追納は古い期間から順番に行う。年金事務所に追納申込書を出し、送られてくる納付書で納める。追納した保険料は社会保険料控除の対象（検索結果で確認）","used_in":"あとから納める「追納」"}],"not_used":["一部免除（4分の3・半額・4分の1）の所得基準の細かい計算式は、控除の種類で変わり読者が自分で計算しにくいため、全額免除の目安だけを載せ、ほかは窓口で確認するよう書いた","追納の加算額の具体的な金額は年度で変わるため書かない","学生納付特例、法定免除、産前産後期間の免除は、この記事の読者（退職した人）から外れるため扱わない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'kokumin-nenkin-menjo' and c.slug = 'seido' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'kokumin-nenkin-menjo' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '国民年金保険料の免除制度・納付猶予制度', '日本年金機構', 'https://www.nenkin.go.jp/service/kokunen/menjo/20150428.html', '2026-10-09'::date, '免除の4つの段階と2026年度の納める額、所得の基準の目安、納付猶予の対象、失業による特例、申請先と必要書類、年金額への反映、未納との違い、毎年度の申請', 0 from articles where slug = 'kokumin-nenkin-menjo';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '国民年金保険料の免除等の申請が可能な期間', '日本年金機構', 'https://www.nenkin.go.jp/service/kokunen/menjo/20150402-01.html', '2026-10-09'::date, '申請書が受理された月の2年1か月前までさかのぼって申請できること、免除・納付猶予の年度が7月から翌年6月までであること', 1 from articles where slug = 'kokumin-nenkin-menjo';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '国民年金保険料の追納制度', '日本年金機構', 'https://www.nenkin.go.jp/service/kokunen/menjo/20150331.html', '2026-10-09'::date, '承認された月の前10年以内の期間を追納できること、3年度目以降は加算額が上乗せされること、古い期間から順に納めること、申込み先が年金事務所であること', 2 from articles where slug = 'kokumin-nenkin-menjo';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'kokumin-nenkin-menjo' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"68e7198f8983685c8a1d005943e317d88a1db585a0212cc2c342ac7213059d72","findings":[]}'::jsonb from articles where slug = 'kokumin-nenkin-menjo';
update articles set status = 'published' where slug = 'kokumin-nenkin-menjo';

-- article: koteizangyo-kyujin (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('koteizangyo-kyujin', 'article', '固定残業代（みなし残業）がある求人の見方｜求人に書かれるべき3つの項目と確認のしかた', '固定残業代がある求人では、月給の合計だけでなく「固定残業代を除いた基本給」「何時間分でいくらか」「超えた分を追加で払うか」の3つを確かめます。若者雇用促進法に基づく指針と厚生労働省のリーフレットをもとに、求人の読み方、書いていないときの聞き方を紹介します。', '求人を見ていると、「月給〇〇万円（固定残業代含む）」「みなし残業〇時間分を含む」といった書き方を見かけることがあります。月給が高く見えても、その中身が分からないと、ほかの求人と正しく比べられません。

先に結論を言うと、固定残業代がある求人は、**次の3つが書かれているか**を確かめます。

1. **固定残業代を除いた基本給**はいくらか
2. 固定残業代は**何時間分で、いくら**か
3. その時間を**超えた分は追加で支払われる**か

この記事で分かること：

- 固定残業代（みなし残業）の**しくみ**
- 求人に書かれるべき**3つの項目**と、求人の読み方の例
- 書いていないときの**聞き方**と、入社前に確かめる書類

## 固定残業代（みなし残業）とは？

固定残業代は、**一定の時間分の残業代を、実際に残業したかどうかにかかわらず、毎月決まった金額で支払う**しくみです。時間外労働のほか、休日労働や深夜労働の割増賃金を定額で支払う場合もあります。

求人では、次のようないろいろな名前で書かれます。

- 固定残業代
- みなし残業代
- 定額残業手当

厚生労働省のリーフレットでは、名前が「定額残業手当」や「みなし残業代」などでも、同じように扱うとされています。

固定残業代は、**基本給とは別の手当として払われる場合**と、**基本給の中に含めて払われる場合**があります。どちらの場合も、残業代にあたる部分とそれ以外の部分を、はっきり区別する必要があるとされています。

```figure
type: equation
title: 固定残業代がある月給の中身
terms:
  - 月給
  - =
  - 基本給
  - +
  - 固定残業代
  - +
  - そのほかの手当
```

## 求人に書かれるべき3つの項目

若者雇用促進法（青少年の雇用の促進等に関する法律）に基づく指針では、固定残業代を採用する場合、次の3つを明示することとされています。厚生労働省・都道府県労働局・ハローワークのリーフレットでも、募集要項や求人票に**3つすべてを明示する**よう求めています。

```figure
type: checklist
title: 固定残業代で書かれるべき3つの項目
items:
  - 固定残業代を除いた基本給の額
  - 固定残業代の時間数と金額（計算方法）
  - 超えた分の割増賃金を追加で支払うこと
```

求人の書き方の例を、よい例と足りない例で比べてみます（金額・時間数は「〇」で示した仮の例です）。

| | 書き方の例 | 分かること |
| --- | --- | --- |
| 3つがそろっている | 基本給〇〇円、固定残業手当（時間外労働の有無にかかわらず、〇時間分の時間外手当として〇〇円を支給）、〇時間を超える時間外労働分は追加で支給 | 基本給、時間数と金額、超えた分の扱いがすべて分かる |
| 足りない | 月給〇〇円（固定残業代を含む） | 基本給がいくらか、何時間分か、超えた分を払うかが分からない |

「足りない」書き方の求人は、それだけで応募をやめる必要はありませんが、**応募前や面接で3つの項目を確かめる**ようにしましょう。

## 固定残業代がある求人の比べ方

固定残業代がある求人とない求人を比べるときは、**月給の合計ではなく、基本給どうしで比べる**のが基本です。

たとえば、月給が同じに見える2つの求人でも、一方は固定残業代を含み、もう一方は含まない場合、基本給には差があります。固定残業代がない求人では、残業をした分は別に残業代として払われます。

基本給の違いは、ほかのお金にも関わることがあります。

- **賞与（ボーナス）**：基本給をもとに計算する会社では、基本給が低いと賞与も変わります
- **昇給**：基本給が上がるしくみかどうかも、会社によって違います

賞与や昇給の計算のしかたは会社によって違うので、気になるときは面接や内定のときに確認しましょう。休日や年収をあわせて比べる方法は、[「土日休み」と「年収」をどう比較する？](/articles/donichi-yasumi-nenshu-hikaku)で紹介しています。

### 「〇時間分」は、残業しなければいけない時間ではない

固定残業代の「〇時間分」は、その時間分の残業代を定額で払うという意味です。**その時間まで残業しなければならない**という意味ではありません。

ただし、固定残業の時間数と、実際の残業時間は別のものです。実際にどのくらい残業があるかは、求人の「月平均の残業時間」の欄や、面接での質問で確かめましょう。

## 書いていないとき、どう聞く？

求人に3つの項目が書かれていないときや、書き方があいまいなときは、次のように聞いてみましょう。

**応募前（問い合わせ・エージェント経由）の聞き方の例**

> 「月給に含まれる固定残業代について、固定残業代を除いた基本給の額と、何時間分の残業代にあたるかを教えていただけますか。」

**面接での聞き方の例**

> 「入社後の働き方をイメージしたいので伺います。配属予定の部署では、月の残業時間はどのくらいでしょうか。また、固定残業の時間を超えた場合は、別に残業代が支払われるという理解でよろしいでしょうか。」

聞きにくいと感じるかもしれませんが、給料のしくみを確かめるのは、働き始めてから困らないために大切なことです。言い方を丁寧にすれば、失礼にはなりません。

### 内定のときは、書面で確かめる

内定が出たら、承諾する前に**労働条件通知書**などの書面で、次の点を確かめます。

- 基本給と、固定残業代の金額が分けて書かれているか
- 固定残業代が何時間分か
- 超えた分を追加で支払うことが書かれているか
- 求人や面接で聞いた内容と違っていないか

書面の見方は[内定をもらったら、承諾の前に確認すること](/articles/naitei-shodaku-mae)、月給から手取りの目安を出す方法は[手取り20万円から転職を考えるとき、何を比べればいい？](/articles/tedori-20man-hikaku)で紹介しています。

## 入社してから気になったら

固定残業代で決められた時間を超えて残業した場合や、法律の方法で計算した割増賃金が固定残業代の額を上回る場合は、**その差額を支払う必要がある**とされています。

「固定残業代があるから、いくら残業しても残業代は出ない」と言われたり、超えた分が払われていないと感じたりしたときは、次のものを手元に残しておきましょう。

- 給与明細
- 勤務時間の記録（タイムカードの写し、自分でつけたメモなど）
- 労働条件通知書、求人票の控え

そのうえで、会社の人事などに確認し、話が進まないときは労働基準監督署などに相談します。

若者の採用に力を入れている会社の残業時間などの情報を、応募前に確かめる方法は[求人で「職場の情報」を確かめるには？](/articles/shokuba-jouhou-wakamono)で紹介しています。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '固定残業代（みなし残業）の求人の見方｜確認する3項目', '「固定残業代」「みなし残業」がある求人は、どこを見ればいい？若者雇用促進法に基づく指針と厚生労働省のリーフレットで示された3つの明示項目、求人票の読み方の例、書いていないときの質問のしかた、入社前に確認する書類を紹介します。', array['donichi-yasumi-nenshu-hikaku', 'naitei-shodaku-mae', 'tedori-20man-hikaku', 'tenshoku-koukai-shinai', 'kibou-nenshu-kakikata']::text[], '{}'::text[], array['kyuryo']::text[], array['hajimete', 'seishain-keiken-sukunai']::text[], array['「みなし残業」って', 'どこを見ればいい？']::text[], null, false, '[{"q":"固定残業代がある会社は、避けたほうがいいですか？","a":"固定残業代があること自体が、すぐに悪いというわけではありません。大事なのは、固定残業代を除いた基本給がいくらか、何時間分の残業代でいくらか、その時間を超えた分は追加で支払われるかが、はっきり示されているかどうかです。この3つが書かれていない場合は、応募前や面接で確かめましょう。"},{"q":"固定残業代が「〇時間分」とあれば、その時間までは残業しないといけないのですか？","a":"固定残業代は、決められた時間分の残業代を、残業の有無にかかわらず定額で支払うしくみです。その時間まで残業しなければならないという意味ではありません。実際にどのくらい残業があるかは、求人の「月平均の残業時間」の欄や、面接での質問で別に確かめましょう。"},{"q":"固定残業の時間を超えて働いた分は、払ってもらえますか？","a":"固定残業代で決められた時間を超えて残業した場合や、計算した割増賃金が固定残業代の額を上回る場合は、その差額を支払う必要があるとされています。払われていないと感じたら、給与明細と勤務時間の記録を手元に残し、労働基準監督署などに相談しましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"固定残業代は「あるかないか」より「3つの項目が書かれているか」で見る。月給の合計ではなく、固定残業代を除いた基本給で比べる。書いていないときは応募前・面接・内定時に聞き、労働条件通知書で確かめる","quotes":[{"source_url":"https://www.mhlw.go.jp/file/06-Seisakujouhou-11600000-Shokugyouanteikyoku/0000184068.pdf","text":"固定残業代制を採用する場合は、募集要項や求人票などに、①固定残業代を除いた基本給の額、②固定残業代に関する労働時間数と金額等の計算方法、③固定残業時間を超える時間外労働、休日労働及び深夜労働に対して割増賃金を追加で支払う旨、のすべてを明示する。名称が「定額残業手当」「みなし残業代」などでも同じ。記載例として「時間外労働の有無にかかわらず○時間分の時間外手当として△△円を支給し、○時間を超える時間外労働分についての割増賃金は追加で支給」が示されている（直接開けなかったため、資料のタイトルと検索結果に表示された内容で確認）","used_in":"求人に書かれるべき3つの項目"},{"source_url":"https://www.mhlw.go.jp/content/11600000/000534967.pdf","text":"若者雇用促進法に基づく指針として、固定残業代を採用する場合は、固定残業代を除いた基本給の額、固定残業代に関する労働時間数と金額等の計算方法、固定残業時間を超える時間外労働・休日労働・深夜労働への割増賃金を追加で支払う旨を明示すること（検索結果で確認）","used_in":"求人に書かれるべき3つの項目"},{"source_url":"https://www.check-roudou.mhlw.go.jp/qa/roudousya/chingin/q11.html","text":"定額残業制は、法律に明文規定はないが、法定時間外・法定休日・深夜労働の割増賃金を、あらかじめ定額の手当等の名目で、あるいは基本給の一部として支給する制度。基本給に含める場合は割増賃金相当部分とそれ以外の賃金部分を明確に区別することを要する。まかなわれる残業時間数等を超えて残業等が行われた場合は差額を別途支払う必要がある（検索結果で確認）","used_in":"固定残業代（みなし残業）とは？／入社してから気になったら"},{"source_url":"https://www.startup-roudou.mhlw.go.jp/qa/zigyonushi/chingin/q11.html","text":"固定残業代の金額が労基法37条等に定められた方法で計算した割増賃金の額を下回るときは、その差額を支払う必要がある（検索結果で確認）","used_in":"入社してから気になったら"}],"not_used":["「固定残業は月〇時間までが目安」「〇時間を超える求人は避ける」といった基準は、公的な目安として確認できなかったため書かない","割増率（25%など）の具体的な数字は、この記事の主題から外れるため書かない","固定残業代と「みなし労働時間制（裁量労働制・事業場外みなし）」の違いは、今回の出典で確認しきれなかったため扱わない","求人の金額例は、架空の数字を作らないよう「〇〇円」で示した"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'koteizangyo-kyujin' and c.slug = 'hatarakikata' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'koteizangyo-kyujin' and c.slug = 'seido' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '固定残業代制を採用する場合は、募集要項や求人票などに、次の①～③の内容すべてを明示してください。', '厚生労働省・都道府県労働局・ハローワーク', 'https://www.mhlw.go.jp/file/06-Seisakujouhou-11600000-Shokugyouanteikyoku/0000184068.pdf', '2026-10-09'::date, '固定残業代制を採用する場合に、募集要項や求人票に①固定残業代を除いた基本給の額、②固定残業代に関する労働時間数と金額等の計算方法、③固定残業時間を超える時間外労働・休日労働・深夜労働に対して割増賃金を追加で支払う旨を明示すること。名称が「定額残業手当」「みなし残業代」などでも同じ扱いであること。記載例', 0 from articles where slug = 'koteizangyo-kyujin';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '若者の募集・採用等に関する指針　ご対応いただきたい５つのポイントを紹介します', '厚生労働省', 'https://www.mhlw.go.jp/content/11600000/000534967.pdf', '2026-10-09'::date, '若者雇用促進法に基づく指針で、固定残業代を採用する場合に3つの項目を明示することとされていること', 1 from articles where slug = 'koteizangyo-kyujin';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '基本給に含めた割増賃金って何？（確かめよう労働条件）', '厚生労働省', 'https://www.check-roudou.mhlw.go.jp/qa/roudousya/chingin/q11.html', '2026-10-09'::date, '定額残業制は、時間外・休日・深夜労働の割増賃金をあらかじめ定額の手当や基本給の一部として支払う制度であること。割増賃金にあたる部分とそれ以外を明確に区別する必要があること。まかなわれる時間数を超えて残業した場合は差額を別に支払う必要があること', 2 from articles where slug = 'koteizangyo-kyujin';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '固定残業代を支払うこととすれば、残業や休日勤務をさせても別途に残業代を支払わなくてよいでしょうか？（スタートアップ労働条件）', '厚生労働省', 'https://www.startup-roudou.mhlw.go.jp/qa/zigyonushi/chingin/q11.html', '2026-10-09'::date, '固定残業代の金額が、法律の方法で計算した割増賃金の額を下回るときは、その差額を支払う必要があること', 3 from articles where slug = 'koteizangyo-kyujin';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'koteizangyo-kyujin' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"05724d2cb70157ea96a74258e18683e3448d5ccd7e72c859b3b8c9ba6e49bdf4","findings":[]}'::jsonb from articles where slug = 'koteizangyo-kyujin';
update articles set status = 'published' where slug = 'koteizangyo-kyujin';

-- article: koumuin-shakaijin (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('koumuin-shakaijin', 'article', '社会人から公務員を目指すには？年齢要件の確かめ方と試験の流れ・準備', '社会人から公務員を目指す入口には、一般の採用試験と、民間などでの職務経験をいかす経験者採用があります。年齢や職務経験の要件は自治体・試験ごとに違うので、受験案内での確かめ方、試験の流れ、民間との違い、働きながらの準備を紹介します。', '「今の仕事を続けるより、公務員として働いてみたい」。社会人になってからそう考える人もいます。ただ、調べ始めると「何歳まで受けられる？」「社会人枠って何？」と、分からないことが次々に出てきます。

先に結論を言うと、社会人から公務員を目指す入口は、大きく**一般の採用試験**と、**民間などでの職務経験をいかす経験者採用**の2つです。**年齢や職務経験の要件は、自治体・試験・年度ごとに違います**。最初にやることは、受けたい自治体の**受験案内（募集要項）の「受験資格」を読むこと**です。

この記事で分かること：

- 社会人が使える**2つの入口**
- 年齢や職務経験の要件の**確かめ方**
- **試験の流れ**
- 民間の会社との**違い**
- 働きながらの**準備のしかた**

## 公務員の仕事って、どんな仕事？

この記事では、市役所や県庁などで働く**行政事務**の仕事を中心に紹介します。

厚生労働省の職業情報提供サイト「job tag」では、地方公務員（行政事務）は、住民のための行政サービスや施策の企画、予算、実際の事務を行う仕事として紹介されています。市町村では、**住民登録や戸籍、税金、保育園の入所、ごみの収集**などを受け持ち、窓口での届出の受付や証明書の発行、住民からの相談への対応、災害への備えなども仕事に入ります。

「窓口で書類を受け付ける仕事」というイメージを持つ人も多いですが、それは仕事の一部です。数年ごとの異動で、**まったく違う分野の仕事を経験することが多い**のも特徴です。

## 社会人の入口は2つある

| 入口 | どんな試験？ | 見ておきたいところ |
| --- | --- | --- |
| 一般の採用試験 | 学校を卒業する人と同じ試験。年齢などの要件の範囲なら、社会人も受けられる場合がある | 年齢の要件、学歴の区分（大学卒業程度など） |
| 経験者採用（社会人経験者採用） | 民間などでの職務経験をいかしてもらうための試験 | 職務経験の年数と、何を職務経験として数えるか |

国家公務員にも、人事院が行う**経験者採用試験**があります。民間企業での実務の経験などをいかせる係長級の仕事に採用する試験で、受験資格は卒業してからの年数などで決められ、試験の区分ごとに違います。人事院は「社会人の皆さんへ」というページで、社会人向けの中途採用の情報をまとめています。

## 年齢や職務経験の要件は、どう確かめる？

年齢の上限や必要な職務経験の年数は、**自治体ごと・試験ごと・年度ごと**に違います。ネットの「〇歳まで」という情報をうのみにせず、次の順番で確かめましょう。

1. 受けたい自治体（または府省）の**採用ページ**を開く
2. その年度の**受験案内（募集要項）**を探す
3. 試験の区分ごとに**「受験資格」の欄**を読む
4. 分からないところは、**採用の担当窓口に問い合わせる**

受験案内では、特に次のところを確かめます。

```figure
type: checklist
title: 受験案内で確かめること
items:
  - 年齢の要件（何年何月何日時点の年齢か）
  - 職務経験の年数と、数え方
  - 正社員以外の経験も数えるか
  - 学歴の区分（大学卒業程度など）
  - 申込期間と試験日
  - 試験の内容（筆記・論文・面接など）
```

「職務経験の数え方」は見落としやすいところです。正社員としての経験だけを数える試験もあれば、条件を満たせば契約社員やアルバイトの経験も含める試験もあります。**自分の経験が何年分として数えられるか**は、受験案内の定義を読んで確かめましょう。

## 試験の流れは？

job tagでは、自治体の採用試験は多くの場合、**1次試験・2次試験**に分かれ、**教養試験、専門試験、面接**などが行われると紹介されています。経験者採用では、職務経験についての論文や面接に重きを置く試験もあります。どの試験があるかは受験案内で確かめましょう。

```figure
type: steps
title: 公務員試験のおおまかな流れ
items:
  - label: 受験案内を読む
    text: 受験資格・試験日・試験の内容を確かめる
  - label: 申し込む
    text: 決められた期間内に申し込む
  - label: 1次試験
    text: 筆記試験や論文など
  - label: 2次試験
    text: 面接など（試験によって回数が違う）
  - label: 合格・採用
    text: 合格したあと、採用の時期が決まる
```

民間の会社の中途採用は一年中募集があることが多いのに比べ、公務員の試験は**申込期間と試験日が決まっています**。申込期間を逃すと次の機会まで待つことになるので、受けたい自治体の採用ページは早めにチェックしておきましょう。

## 民間の会社と何が違う？

公務員と民間の会社では、働き方の決まりにも違いがあります。

- **異動で仕事が変わる**：数年ごとに部署が変わり、税金、福祉、まちづくりなど違う分野を担当することが多い
- **休日**：job tagでは、土日祝日や年末年始が休みになることが多いとされています。ただ、休日に窓口を開けている自治体もあり、部署によって勤務の形が違います
- **兼業には許可が必要**：地方公務員は、地方公務員法第38条により、報酬を得てほかの仕事をするときなどに**任命権者（採用した側）の許可**が必要です。副業を考えている人は知っておきましょう
- **採用までの時間**：試験の日程が決まっているため、申し込みから採用まで時間がかかることがあります

「土日休みにしたい」「安定して働きたい」という理由で考える人も多いと思いますが、配属される部署によって忙しさや休みの取り方は変わります。説明会などで、実際に働いている職員の話を聞いておくと、イメージとのずれを減らせます。

## 働きながらの準備はどう進める？

### 試験日から逆算して計画を立てる

受験案内で試験日と試験の内容が分かったら、そこから逆算して計画を立てます。働きながら準備する場合は、平日は短い時間、休日にまとまった時間を取るなど、続けられる形にしましょう。働きながら転職活動を進めるときの時間の作り方は[働きながらの転職活動、何から？](/articles/zaishoku-tenshoku-susumekata)も参考になります。

### 経験を言葉にしておく

経験者採用では、論文や面接で**これまでの仕事で何をしてきたか**を聞かれます。接客やアルバイトの経験でも、「住民の困りごとを聞いて、正しい窓口につなぐ」といった公務員の仕事とつながる部分を言葉にしておきましょう。経験の書き出し方は[転職のための自己分析のやり方](/articles/jiko-bunseki-yarikata)で紹介しています。

### 面接で聞かれやすいことを準備する

面接では、たとえば次のようなことを聞かれることがあります。

- なぜ民間の会社ではなく、公務員なのですか
- なぜ、ほかの自治体ではなく、この自治体なのですか
- これまでの仕事の経験を、どのようにいかせますか
- 希望していない部署に配属されたら、どうしますか

答え方の例です。

> 「販売の仕事で、地域のお客さまから生活の困りごとを聞く機会が多くありました。一つの会社の商品で応えるのではなく、地域に住む人全体の暮らしを支える仕事がしたいと考え、地元である〇〇市を志望しました。」

志望動機の組み立て方は[未経験職種の志望動機、何を書けばいい？](/articles/shiboudouki-mikeiken)の3つの要素も使えます。

公務員試験の要件は、毎年見直されることがあります。この記事の内容は2026年10月9日時点で確認したものです。受験を考えたら、必ずその年度の受験案内で最新の内容を確かめてください。', 'review', false, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '社会人から公務員へ｜経験者採用と年齢要件の確かめ方', '社会人から公務員を目指すときの入口（一般の採用試験・経験者採用）、年齢や職務経験の要件を受験案内で確かめる方法、試験の流れ、仕事内容や兼業の決まりなど民間との違い、働きながらの準備と面接で聞かれやすいことが分かります。', array['zaishoku-tenshoku-susumekata', 'jiko-bunseki-yarikata', 'shiboudouki-mikeiken', 'tekisei-kensa-tenshoku']::text[], array['sonota']::text[], array['seishain']::text[], array['hajimete', 'dainishinsotsu']::text[], array['社会人から公務員、', '何を確かめる？']::text[], null, false, '[{"q":"公務員試験は何歳まで受けられますか？","a":"自治体や試験の種類ごとに決まっていて、一律ではありません。同じ自治体でも、一般の採用試験と社会人経験者向けの試験で年齢の要件が違うことがあります。受けたい自治体の採用ページで、その年度の受験案内（募集要項）の「受験資格」の欄を確かめましょう。"},{"q":"アルバイトや派遣の経験も、社会人経験者採用の「職務経験」に入りますか？","a":"自治体や試験ごとに決まりが違います。正社員としての経験だけを数えるところもあれば、一定の条件を満たせば雇用形態を問わないところもあります。受験案内の「職務経験」の定義の欄を読み、分からなければ採用の担当窓口に問い合わせて確かめましょう。"},{"q":"働きながら公務員試験の準備はできますか？","a":"働きながら準備する人もいます。まず受験案内で試験日と試験の内容を確かめ、そこから逆算して、平日に短い時間、休日にまとまった時間を取るように計画を立てると続けやすくなります。申込期間を逃さないよう、受けたい自治体の採用ページは定期的に確認しましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「社会人から公務員」は年齢上限や倍率が自治体・試験ごとに違うため数字を断定せず、受験案内のどこを見れば自分が受けられるかが分かるか、という確かめ方を中心にする。試験の流れ、民間との違い（仕事内容・異動・兼業の許可・採用までの時間）、働きながらの準備と面接の質問例を具体的にする","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/139","text":"地方自治体で、住民のための行政サービス・施策の企画・立案、予算案の編成や業務の実施に関する事務を行う。採用には自治体ごとの採用試験に合格する必要があり、1次・2次試験で教養試験、専門試験、面接などが行われる。行政内部の異動が多く、さまざまな分野を経験する。土日祝日や年末年始が休みになることが多いが、休日に窓口を開ける自治体もあり部署によって異なる（job tag に直接接続できなかったため、検索結果に表示されたページ内容で確認）","used_in":"公務員の仕事って、どんな仕事？／試験の流れは？／民間の会社と何が違う？"},{"source_url":"https://www.jinji.go.jp/saiyo/siken/keikennsya/keikensya_goudou.html","text":"試験の対象となる官職は、民間企業における実務の経験その他これに類する経験を活用することができるもの。受験資格は大学等の卒業日などからの経過年数で定められ、試験（府省・区分）によって年数が異なる（人事院サイトの検索結果に表示された内容で確認）","used_in":"社会人の入口は2つある"},{"source_url":"https://www.jinji.go.jp/saiyo/saiyo/sonota/sonota.html","text":"社会人向けに国家公務員の中途採用（経験者採用試験など）の情報をまとめたページ（人事院サイトの検索結果で確認）","used_in":"社会人の入口は2つある"},{"source_url":"https://www.soumu.go.jp/main_sosiki/jichi_gyousei/koumuin_seido/hukumu.html","text":"一般職の地方公務員は、営利企業の役員等の地位を兼ねること、自ら営利企業を営むこと、報酬を得ていかなる事業又は事務に従事することについて、任命権者の許可が必要（地方公務員法第38条）（総務省サイトの検索結果に表示された内容で確認）","used_in":"民間の会社と何が違う？"}],"not_used":["年齢の上限、必要な職務経験の年数、倍率は自治体・試験・年度ごとに違うため、具体的な数字は書かず、受験案内での確かめ方を書いた","人事院の経験者採用試験の具体的な受験資格の年数や2026年度の日程は検索結果に出ていたが、区分や年度で変わり、読者の多くには直接当てはまらないため書かない","job tag の求人賃金や学歴別の割合は、時点と値を直接確かめられなかったので書かない","公務員の給与や退職手当の制度は、自治体の条例などで決まり、この記事の目的から外れるため扱わない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'koumuin-shakaijin' and c.slug = 'shokushu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'koumuin-shakaijin' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '地方公務員（行政事務） - 職業詳細（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/139', '2026-10-09'::date, '地方公務員（行政事務）の仕事内容（住民登録・戸籍・地方税・保育・ごみ収集などの事務、窓口での届出受付や証明書発行、予算、災害対策など）、自治体ごとの採用試験に合格する必要があり、教養試験・専門試験・面接などが行われること、異動でさまざまな分野を経験すること、土日祝日が休みのことが多いが部署によって違うこと', 0 from articles where slug = 'koumuin-shakaijin';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '経験者採用試験（係長級（事務））', '人事院 国家公務員試験採用情報NAVI', 'https://www.jinji.go.jp/saiyo/siken/keikennsya/keikensya_goudou.html', '2026-10-09'::date, '国家公務員の経験者採用試験が、民間企業での実務の経験などをいかせる係長級の官職への採用試験であること、受験資格が卒業からの年数などで決められ区分や試験ごとに違うこと', 1 from articles where slug = 'koumuin-shakaijin';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '社会人の皆さんへ（中途採用に関する情報）', '人事院 国家公務員試験採用情報NAVI', 'https://www.jinji.go.jp/saiyo/saiyo/sonota/sonota.html', '2026-10-09'::date, '人事院が社会人向けに国家公務員の中途採用の情報をまとめて案内していること', 2 from articles where slug = 'koumuin-shakaijin';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '地方公務員制度等 兼業', '総務省', 'https://www.soumu.go.jp/main_sosiki/jichi_gyousei/koumuin_seido/hukumu.html', '2026-10-09'::date, '地方公務員は、地方公務員法第38条により、営利企業の役員を兼ねる、自ら営利企業を営む、報酬を得て事業や事務に従事する場合に任命権者の許可が必要なこと', 3 from articles where slug = 'koumuin-shakaijin';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'koumuin-shakaijin' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"f3fddf35883023c32c74d3da084701e5844b820e76dad49561b32b41b436d554","findings":[]}'::jsonb from articles where slug = 'koumuin-shakaijin';
update articles set status = 'published' where slug = 'koumuin-shakaijin';

-- article: kuhaku-kikan-setsumei (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('kuhaku-kikan-setsumei', 'article', '職歴に空白期間があるとき、面接でどう説明する？書類の書き方と答え方の例', '働いていない期間があるときは、隠すよりも「その間のこと」と「今は働ける状態か」を短く伝えるほうが、面接で話しやすくなります。履歴書・職務経歴書での書き方、面接での説明の型と理由別の例文、その期間にやっていたことの言い方を紹介します。', '履歴書を書いていて、職歴と職歴のあいだに何も書けない期間がある。面接で「この期間は何をしていましたか？」と聞かれたらどうしよう。そんな不安を持つ人は少なくありません。

先に結論を言うと、空白期間の説明で大事なのは、**理由がりっぱかどうかより、「今は働ける状態か」「これから何をしたいか」が伝わるか**です。

この記事で分かること：

- 履歴書・職務経歴書での**書き方**
- 面接での**説明の型**と、理由別の**例文**（仮の例）
- その期間に**やっていたことの言い方**

## 面接官は、空白期間の何を知りたい？

空白期間について聞かれると、責められているように感じるかもしれません。でも、質問の多くは次のようなことを確かめるためのものです。

- 今は、働ける状態になっているか
- 入社したら、続けて働けそうか
- これからやりたいことと、応募した仕事がつながっているか

つまり、聞かれているのは「過去の説明」よりも「今とこれから」です。答えを準備するときも、ここを中心に組み立てます。

## 書類ではどう書く？

### 履歴書：職歴欄に一言添える

履歴書の職歴欄は、入社と退職の年月を順に書く欄です。空白期間を書かなくても、年月を見れば期間が空いていることは分かります。理由を短く添えておくと、面接で話を始めやすくなります（書き方は仮の例です）。

| 年 | 月 | 職歴 |
| --- | --- | --- |
| 20XX | 4 | 株式会社〇〇 入社（販売スタッフ） |
| 20XX | 3 | 一身上の都合により退職 |
| | | 退職後、家族の介護に専念（現在は介護の体制が整い、就業可能） |

長い説明はいりません。「何をしていたか」と「今は働けること」が1行で分かれば十分です。

### 職務経歴書：最後に短くまとめる

職務経歴書では、職歴の最後や「補足」の欄に、2〜3行で書く方法があります。

> 20XX年4月〜20XX年3月は、資格の勉強に専念していました。この期間に日商簿記3級を取得し、現在は表計算ソフトの関数の練習も続けています。

勉強や資格のように、応募する仕事とつながることがあれば、ここで具体的に書いておくと面接での話題にもなります（資格名は仮の例です）。

## 面接での説明は「4つの順番」で

面接では、次の順番で話すと、短く、前向きにまとまります。

```figure
type: steps
title: 空白期間の説明の型
items:
  - label: 事実
    text: いつからいつまで、何をしていたか
  - label: その間のこと
    text: やっていたこと、考えたこと
  - label: 今の状態
    text: 今は働ける状態になっていること
  - label: これから
    text: 応募した仕事でやりたいこと
```

全体で1分くらい、話す量は「事実」を短く、「今の状態」と「これから」を少し厚めにするのがコツです。

## 理由別の例文（仮の例）

ここからは、よくある理由ごとの例です。自分の言葉に置き換えて使ってください。

### 体調を崩していた

> 「前の職場を退職したあと、体調を整えるために半年ほど休んでいました。今は回復していて、フルタイムで働くことに支障はありません。休んでいる間に、自分に合う働き方を考え直し、落ち着いて事務の仕事に取り組みたいと思うようになりました。」

病名や治療の内容まで細かく話す必要はありません。伝えるのは「今は働ける状態か」です。勤務時間などで配慮してほしいことがある場合は、入社後に困らないよう、どこまで伝えるかをハローワークなどの窓口で相談しておくと安心です。

### 家族の介護をしていた

> 「家族の介護のため、1年ほど仕事を離れていました。現在は介護サービスを利用する体制が整い、フルタイムで働けます。」

厚生労働省は、家族の健康や病歴などを採用選考で把握することは就職差別につながるおそれがあるとしています。家族の病気のことなど、詳しい事情まで話す必要はありません。

### 資格の勉強や職業訓練をしていた

> 「ITの仕事に移りたいと考え、退職後の8か月間はパソコンの基礎と資格の勉強をしていました。勉強の中で、人に操作を説明するのが自分に合っていると感じ、ヘルプデスクの仕事を希望しています。」

勉強していたことは、そのまま「準備をしてきたこと」として話せます。合格していなくても、何をどのくらい続けたかを具体的に伝えましょう。

### 就職活動が長引いた・何をしたいか決められなかった

> 「退職後、次に何をしたいか決めきれず、時間がかかってしまいました。その間にいくつかの職種を調べ、接客で続けてきた『人の困りごとを聞く』ことを活かせる仕事として、カスタマーサポートを考えるようになりました。」

この理由がいちばん言いにくいかもしれませんが、**取りつくろうより、正直に認めて「これから」につなげる**ほうが、話がぶれずに済みます。

## 「何もしていない」と思っても、言えることはある

空白期間に「特別なこと」をしていなくても、ふり返ると話せることが見つかることがあります。

```figure
type: checklist
title: 空白期間をふり返る問い
items:
  - 毎日の生活で続けていたことは？
  - 調べたこと・読んだもの・練習したことは？
  - 家族や周りの人のために、引き受けていたことは？
  - 働き方について考えたこと・決めたことは？
  - 今、仕事に向けて始めていることは？
```

たとえば「家計の管理を任されていた」「毎朝決まった時間に起きる生活を続けていた」も、働く準備ができていることを伝える材料になります。ただし、やっていないことを「やっていた」と言うのはやめましょう。面接で深く聞かれたときに答えられなくなります。

いまから始められることもあります。応募する仕事に関係する勉強を少しでも始めておくと、「今は〇〇を始めています」と、今の状態として話せるようになります。

## ひとりで準備するのが不安なら

説明を考えても自信が持てないときは、人に聞いてもらうのがいちばんの練習になります。

- **ハローワーク**：応募書類の作り方や面接の受け答えについて、無料で相談できます
- **わかものハローワーク**：正社員を目指すおおむね35歳未満の人を対象に、担当者制で相談に乗ってくれます
- **地域若者サポートステーション（サポステ）**：働くことに悩みを抱えている15歳から49歳までの人を対象に、就職に向けた準備から無料で支援しています

面接でよく聞かれる質問全体の準備は[未経験職種の面接、何を準備する？](/articles/mensetsu-junbi-mikeiken)、転職回数が多いときの説明の型は[転職回数が気になるときに整理したいこと](/articles/tenshoku-kaisu-kininaru)、アルバイトから正社員を目指すときの全体の流れは[フリーターから正社員を目指すとき、最初に確認したいこと](/articles/freeter-seishain-hajimeni)で紹介しています。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-07'::timestamptz, '空白期間の説明、面接でどう言う？書類の書き方と例文', '職歴に空白期間があるときの説明のしかたを紹介します。履歴書・職務経歴書への書き方、面接での説明の型（事実→その間のこと→今の状態→これから）、体調・介護・勉強など理由別の例文、相談できる窓口が分かります。', array['freeter-seishain-hajimeni', 'tenshoku-kaisu-kininaru', 'mensetsu-junbi-mikeiken']::text[], '{}'::text[], array['mensetsu', 'seishain']::text[], array['seishain-keiken-sukunai', 'freeter']::text[], array['空白期間、', '面接でどう話す？']::text[], null, false, '[{"q":"空白期間は、書類に書かずに黙っていてもいいですか？","a":"履歴書の職歴欄は入社・退職の年月を並べるので、書かなくても期間が空いていることは読み取れます。面接で聞かれることも多いので、隠すよりも、書類に一言添えたり、面接で話す内容を準備したりしておくほうが落ち着いて答えられます。"},{"q":"何もしていなかった期間は、どう説明すればいいですか？","a":"無理に「何かしていた」ことにする必要はありません。「次に何をしたいか決めきれず、時間がかかってしまいました」と事実を短く認めたうえで、「今は〇〇の仕事をしたいと考え、△△を始めています」と、今の状態とこれからにつなげると話しやすくなります。"},{"q":"家族の介護で空白がある場合、家族の病気のことまで話す必要がありますか？","a":"細かい事情まで話す必要はありません。厚生労働省は、家族の健康や病歴などを採用選考で把握することは就職差別につながるおそれがあるとしています。「家族の介護のため離職していました。現在は介護の体制が整い、フルタイムで働けます」のように、働ける状態であることを中心に伝えましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"空白期間は「理由の正しさ」より「今は働ける状態か」「これから何をしたいか」が伝わるかが大事。説明の型を1つ持ち、理由別に言い換える","quotes":[{"source_url":"https://kouseisaiyou.mhlw.go.jp/consider.html","text":"採用選考時に配慮すべき事項として、家族に関すること（職業・続柄・健康・病歴・地位・学歴・収入・資産など）の把握が挙げられ、就職差別につながるおそれがあるとされている","used_in":"理由別の例文（仮の例）"},{"source_url":"https://www.mhlw.go.jp/stf/newpage_27742.html","text":"ハローワークでは、応募書類の作り方、面接の受け方などの個別相談やセミナーを無料で行い、応募する求人に合わせた書類の書き方や面接の受け答えについて助言している","used_in":"ひとりで準備するのが不安なら"},{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000181329.html","text":"わかものハローワークは、正社員を目指す若者（おおむね35歳未満）を対象に、担当者制による職業相談などを無料で行っている","used_in":"ひとりで準備するのが不安なら"},{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/jinzaikaihatsu/saposute.html","text":"地域若者サポートステーションは、働くことに悩みを抱えている15歳から49歳までの人を対象に、就労に向けた支援を行う機関。厚生労働省が委託した民間団体などが運営し、無料で利用できる","used_in":"ひとりで準備するのが不安なら"}],"not_used":["「空白期間が〇か月を超えると不利」といった基準や、企業がどう評価するかの調査データは公的な根拠を確認できなかったので書かない","サポステの設置か所数・利用実績の数字は年度で変わるため書かない","本人の病歴をどこまで伝えるべきかの法的な線引きは確認できなかったので、断定せず「働けることを中心に伝える」「配慮が必要なら相談する」にとどめた"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'kuhaku-kikan-setsumei' and c.slug = 'shorui-mensetsu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'kuhaku-kikan-setsumei' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '採用選考時に配慮すべき事項（公正採用選考特設サイト）', '厚生労働省', 'https://kouseisaiyou.mhlw.go.jp/consider.html', '2026-10-07'::date, '家族に関すること（職業・続柄・健康・病歴など）を採用選考で把握することは、就職差別につながるおそれがあるとされていること', 0 from articles where slug = 'kuhaku-kikan-setsumei';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ハローワークの相談支援', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_27742.html', '2026-10-07'::date, 'ハローワークで応募書類の作り方や面接の受け答えについて、無料で相談できること', 1 from articles where slug = 'kuhaku-kikan-setsumei';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'わかものハローワーク', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000181329.html', '2026-10-07'::date, '正社員を目指すおおむね35歳未満の若者を対象に、担当者制の職業相談などを無料で行っていること', 2 from articles where slug = 'kuhaku-kikan-setsumei';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '地域若者サポートステーション', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/jinzaikaihatsu/saposute.html', '2026-10-07'::date, '働くことに悩みを抱えている15歳から49歳までの人を対象に、就労に向けた支援を無料で行っていること', 3 from articles where slug = 'kuhaku-kikan-setsumei';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'kuhaku-kikan-setsumei' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"f76b2e80aef64c7c68841c2192fb5137a718bcb47a3925c5162c4caed3cfc295","findings":[]}'::jsonb from articles where slug = 'kuhaku-kikan-setsumei';
update articles set status = 'published' where slug = 'kuhaku-kikan-setsumei';

-- article: kyouiku-kunren-kyufu-tsukaikata (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('kyouiku-kunren-kyufu-tsukaikata', 'article', '教育訓練給付金の使い方｜3つの種類と、講座を申し込む前に確認すること', '雇用保険の教育訓練給付金は、厚生労働大臣が指定した講座を修了すると、払った費用の一部が戻ってくる制度です。一般・特定一般・専門実践の3つの種類と給付率、雇用保険に入っていた期間の条件、対象講座の探し方、申し込む前に必要な手続きを整理します。', '「事務の仕事に移りたいから、パソコンの講座を受けたい」「ITの勉強をしてから転職したい」。そう考えたときに知っておきたいのが、雇用保険の**教育訓練給付金**です。

先に結論です。

- 厚生労働大臣が指定した講座を修了すると、払った費用の一部が雇用保険から戻ってきます
- 種類は「一般」「特定一般」「専門実践」の3つ。戻ってくる割合と、必要な手続きが違います
- 使えるかどうかは、**雇用保険に入っていた期間**で決まります。辞めた人は、離職日の翌日から受講開始日までが原則1年以内であることも条件です

申し込んでから「対象外だった」とならないよう、順番に確認していきましょう。

## 教育訓練給付金ってどんな制度？

教育訓練給付金は、働く人や仕事を辞めた人が、仕事に役立つ講座を受けたときに、その費用の一部を支給する制度です。雇用保険の給付のひとつなので、窓口はハローワークです。

ポイントは、**対象になるのは厚生労働大臣の指定を受けた講座だけ**ということです。資格の講座、パソコンの講座、専門学校のコースなどの中で、指定を受けたものが対象になります。同じスクールの講座でも、指定を受けていないものは対象外です。

## 3つの種類と、戻ってくる割合

講座は、内容によって3つの種類に分かれています。

| 種類 | どんな講座？ | 戻ってくる割合（上限） |
| --- | --- | --- |
| 一般教育訓練 | 仕事のスキルアップにつながる講座 | 費用の20％（上限10万円） |
| 特定一般教育訓練 | すぐに仕事に就くことにつながりやすい講座 | 費用の40％（上限20万円） |
| 専門実践教育訓練 | 中長期的なキャリアづくりにつながる講座 | 費用の50％（年間上限40万円） |

特定一般と専門実践には、条件を満たすと割合が上乗せされるしくみがあります。

- **特定一般**：講座が目標とする資格を取るなどして、修了日の翌日から1年以内に雇用保険の被保険者として雇われると、費用の50％（上限25万円）
- **専門実践**：資格を取るなどして就職した場合などは費用の70％（年間上限56万円）。さらに、修了後の賃金が受講前より5％以上上がった場合は80％（年間上限64万円）

専門実践の80％の上乗せは、2024年10月1日以降に受講を始めた人が対象です。

```figure
type: stats
title: 費用のうち戻ってくる割合（基本）
items:
  - value: "20"
    unit: "％"
    label: 一般教育訓練
    note: 上限10万円
  - value: "40"
    unit: "％"
    label: 特定一般教育訓練
    note: 上限20万円
  - value: "50"
    unit: "％"
    label: 専門実践教育訓練
    note: 年間上限40万円
```

たとえば（仮の例）、受講料10万円の一般教育訓練の講座を修了した場合、戻ってくるのは10万円 × 20％ ＝ 2万円です。入学金や受講料など、どの費用が対象になるかには決まりがあるので、講座を選ぶときに確認してください。

## 使える人の条件は？

条件の中心は、雇用保険に入っていた期間（支給要件期間）です。

| 種類 | 支給要件期間 |
| --- | --- |
| 一般・特定一般 | 3年以上（初めて給付金を受ける人は1年以上） |
| 専門実践 | 3年以上（初めて給付金を受ける人は2年以上） |

20代で初めて使う人なら、一般・特定一般は1年以上、専門実践は2年以上が目安になります。

あわせて、次のどちらかに当てはまる必要があります。

- **働いている人**：受講を始める日に、雇用保険の被保険者であること
- **辞めた人**：被保険者でなくなった日（離職日の翌日）から受講を始める日までが、原則1年以内であること

妊娠・出産・育児・病気やけがなどで講座を受けられない期間があった人は、手続きをするとこの1年を延ばせる場合があります（最大20年まで）。

転職をはさんでいる人は、前の職場の期間を合わせて数えられるかどうかに決まりがあります。自分で数えるのが難しいときは、ハローワークで「支給要件照会」をすると、受講開始予定日の時点で受給資格があるかを確認できます。

## 対象講座の探し方

対象講座は、厚生労働省の「教育訓練給付制度 厚生労働大臣指定教育訓練講座 検索システム」で探せます。

```figure
type: checklist
title: 講座を申し込む前に確認すること
items:
  - 検索システムに講座名が載っているか
  - 一般・特定一般・専門実践のどれか
  - 自分の雇用保険の期間は条件を満たすか
  - 受講前の手続きが必要な講座か
  - 志望する仕事の求人で、その資格がどう見られているか
```

気になる講座が見つかったら、検索システムで講座名と種類（一般・特定一般・専門実践）を確かめます。講座のパンフレットに「教育訓練給付制度の対象」と書かれていても、指定の期間が決まっているので、受講を始める日に指定が有効かどうかも確認しておきましょう。

## 受講前に手続きが必要な講座がある

一般教育訓練は、講座を修了してから申請します。申請の期限は、修了日の翌日から1か月以内です。2024年2月1日以降は、ハローワークの窓口のほか、電子申請・郵送・代理人でも申請できるようになりました。

一方、**特定一般と専門実践は、受講を始める前の手続きが必要**です。

1. 訓練前キャリアコンサルティングを受けて、ジョブ・カード（目標や経験をまとめた書類）を作ってもらう
2. 受講を始める日の原則2週間前までに、ハローワークで受給資格確認の手続きをする

2週間前までという期限は、2024年4月1日から緩和されたものです（それまでは1か月前まで）。申し込んだあとに気づいても間に合わないことがあるので、特定一般や専門実践の講座を考えている人は、講座を申し込む前にハローワークに相談しましょう。

## 「資格を取れば転職できる」とは限らない

未経験の仕事を採用するときに、会社が資格をどこまで重視するかは、職種や会社によって違います。講座を選ぶ前に、志望する仕事の求人を何件か見て、その資格やスキルが応募条件や歓迎条件に書かれているかを確認しておくと、時間とお金をむだにしにくくなります。

雇用保険の失業手当を受け取る人には、2025年4月1日以降に教育訓練給付の対象講座などを受けると、自己都合退職の給付制限が解除されるしくみもあります。辞める前後に講座を考えている人は、あわせてハローワークで確認してください。

教育訓練給付の拡充や、2025年10月に始まった教育訓練休暇給付金は[学び直しの支援が拡充](/news/news-kyouiku-kunren-kyufu)で紹介しています。事務職で使うパソコンの操作は[PCが得意じゃなくても、事務職は目指せる？](/articles/pc-nigate-jimu)、AIで仕事の中身がどう変わるかは[AIで変わる仕事を、未経験転職者はどう見るべきか](/articles/ai-shigoto-mikeiken)も参考にしてください。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-07'::timestamptz, '教育訓練給付金の使い方｜一般・特定一般・専門実践の違いと条件', '資格や講座の費用の一部が戻る教育訓練給付金。一般（20％）・特定一般（40％）・専門実践（50％）の違い、雇用保険に入っていた期間の条件、対象講座の探し方、受講前にハローワークで必要な手続きを整理します。', array['news-kyouiku-kunren-kyufu', 'ai-shigoto-mikeiken', 'pc-nigate-jimu']::text[], '{}'::text[], array['mikeiken-shokushu']::text[], array['pc-mikeiken', 'hajimete']::text[], array['講座の費用、', '一部が戻る制度がある']::text[], 'graduation', false, '[{"q":"会社を辞めたあとでも教育訓練給付金は使えますか？","a":"離職した人も対象になります。ただし、雇用保険の被保険者でなくなった日（離職日の翌日）から受講開始日までが原則1年以内であることが条件です。妊娠・出産・育児・病気などで、この期間を延ばせる場合もあります。辞めてから時間がたっている人は、早めにハローワークで確認しましょう。"},{"q":"好きなスクールの講座なら、どれでも対象になりますか？","a":"対象になるのは、厚生労働大臣の指定を受けた講座だけです。同じスクールでも、指定を受けている講座とそうでない講座があります。申し込む前に、厚生労働省の検索システムで講座名を確認してください。"},{"q":"自分が条件を満たしているか、受講前に確かめられますか？","a":"ハローワークで「支給要件照会」をすると、受講開始予定日の時点で受給資格があるかどうかを確認できます。雇用保険に入っていた期間がはっきりしない人や、転職をはさんでいる人は、事前に確認しておくと安心です。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「資格を取れば転職できる」とはしない。講座を申し込む前に、対象講座か・自分が条件を満たすか・受講前の手続きが要るかの3点を確認する順番を見せる","quotes":[{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/jinzaikaihatsu/kyouiku.html","text":"一般教育訓練は教育訓練経費の20％（上限10万円）。特定一般教育訓練は40％（上限20万円）、資格取得等をし修了日の翌日から1年以内に雇用された場合は50％（上限25万円）。専門実践教育訓練は50％（年間上限40万円）、資格取得等で70％（年間上限56万円）","used_in":"3つの種類と、戻ってくる割合"},{"source_url":"https://www.hellowork.mhlw.go.jp/insurance/insurance_education.html","text":"訓練修了後の賃金が受講開始前と比較して5％以上上昇した場合は、教育訓練経費の80％（年間上限64万円）。令和6年10月1日より前に受講を開始している場合は賃金上昇に係る追加支給はない","used_in":"3つの種類と、戻ってくる割合"},{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000197028.html","text":"受講開始日に被保険者である方のうち支給要件期間が3年（初めて教育訓練給付金を受給する場合は1年）以上。離職者は被保険者資格を喪失した日以降、受講開始日までが1年以内","used_in":"使える人の条件は？"},{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000160564_00037.html","text":"2024年4月1日から、必要書類の提出期限が受講を開始する日の原則2週間前までに緩和（これまでは1か月前まで）","used_in":"受講前に手続きが必要な講座がある"}],"not_used":["専門実践教育訓練を受ける離職者向けの「教育訓練支援給付金」は、2025年4月以降の給付率と実施期限を一次情報で確認しきれなかったので書かない","2025年10月に始まった教育訓練休暇給付金は、在職中に休暇を取る人向けで記事の主題から外れるため、公開済みニュース記事へのリンクにとどめた","指定講座の数（約17,000講座など）は時期で変わり、最新の数を確認しきれなかったので書かない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'kyouiku-kunren-kyufu-tsukaikata' and c.slug = 'seido' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'kyouiku-kunren-kyufu-tsukaikata' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '教育訓練給付金', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/jinzaikaihatsu/kyouiku.html', '2026-10-07'::date, '3種類の教育訓練と給付率・上限（一般20％・上限10万円、特定一般40％・上限20万円／資格取得等で50％・上限25万円、専門実践50％・年間上限40万円／資格取得等で70％・年間上限56万円）', 0 from articles where slug = 'kyouiku-kunren-kyufu-tsukaikata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ハローワークインターネットサービス - 教育訓練給付金', '厚生労働省（ハローワークインターネットサービス）', 'https://www.hellowork.mhlw.go.jp/insurance/insurance_education.html', '2026-10-07'::date, '専門実践で賃金が5％以上上昇した場合は80％（年間上限64万円）、2024年10月1日以降に受講を始めた場合が対象であること、特定一般・専門実践の受講前の手続き（訓練前キャリアコンサルティング、ジョブ・カード、受給資格確認）', 1 from articles where slug = 'kyouiku-kunren-kyufu-tsukaikata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'Q&A～一般教育訓練給付金～', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000197028.html', '2026-10-07'::date, '一般教育訓練の支給要件期間（3年以上、初めての場合は1年以上）、離職者は資格喪失日から受講開始日まで1年以内であること', 2 from articles where slug = 'kyouiku-kunren-kyufu-tsukaikata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'Q＆A～専門実践教育訓練給付金～', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000197058.html', '2026-10-07'::date, '専門実践の支給要件期間（3年以上、初めての場合は2年以上）、適用対象期間の延長（最大20年）', 3 from articles where slug = 'kyouiku-kunren-kyufu-tsukaikata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年４月１日から教育訓練の支給申請がしやすくなります！', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000160564_00037.html', '2026-10-07'::date, '特定一般・専門実践の受講前の書類の提出期限が、2024年4月1日から受講開始日の原則2週間前までになったこと', 4 from articles where slug = 'kyouiku-kunren-kyufu-tsukaikata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '一般教育訓練の「教育訓練給付金」のご案内', '厚生労働省（ハローワークインターネットサービス）', 'https://www.hellowork.mhlw.go.jp/doc/kyouiku_kyufu.pdf', '2026-10-07'::date, '一般教育訓練の支給申請は修了日の翌日から1か月以内であること、受講前にハローワークで支給要件照会ができること', 5 from articles where slug = 'kyouiku-kunren-kyufu-tsukaikata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '一般教育訓練給付金の申請を行う皆さまへ', '厚生労働省', 'https://www.mhlw.go.jp/content/001211710.pdf', '2026-10-07'::date, '2024年2月1日以降の支給申請は、電子・郵送・代理人でも可能になったこと', 6 from articles where slug = 'kyouiku-kunren-kyufu-tsukaikata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '教育訓練給付制度 厚生労働大臣指定教育訓練講座 検索システム', '厚生労働省', 'https://www.kyufu.mhlw.go.jp/kensaku/', '2026-10-07'::date, '対象講座の探し方', 7 from articles where slug = 'kyouiku-kunren-kyufu-tsukaikata';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'kyouiku-kunren-kyufu-tsukaikata' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"a6ddb83cd0057956dddf21fb4063bf076e6b0cc2e68c6b1db72d6324d57ba58e","findings":[]}'::jsonb from articles where slug = 'kyouiku-kunren-kyufu-tsukaikata';
update articles set status = 'published' where slug = 'kyouiku-kunren-kyufu-tsukaikata';

-- article: kyujin-hyo-yomikata (draft)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('kyujin-hyo-yomikata', 'article', '求人票の「未経験歓迎」「学歴不問」はどう読む？', '求人票によく出てくる言葉の意味と、その言葉だけでは分からないことを整理する記事（執筆中）。', '（執筆中のドラフトです。status が draft のため、公開ページには表示されません。本文が存在しても、査読と公開承認を経るまでは公開されません。）

## 「未経験歓迎」が意味すること

「未経験歓迎」は、その職種の経験がない人の応募を受け付けているという意味で使われることが多い表現です。ただし、入社後の研修の内容や、求められる基本的なスキルは求人ごとに違います。', 'draft', false, null, '2026-10-06'::timestamptz, null, null, null, null, null, array['koteizangyo-kyujin', 'tenshoku-koukai-shinai', 'shoyo-kyujin-mikata', 'fukuri-kousei-mikata']::text[], '{}'::text[], '{}'::text[], '{}'::text[], '{}'::text[], null, false, '[]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","brief":"求人票の定型表現の読み方。出典候補を調査中。"}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'kyujin-hyo-yomikata' and c.slug = 'junbi' on conflict do nothing;
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'kyujin-hyo-yomikata' on conflict do nothing;

-- article: kyushokusha-shien-seido (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('kyushokusha-shien-seido', 'article', '求職者支援制度とは？失業手当がない人が無料で職業訓練を受けられるしくみ', '雇用保険の失業手当（基本手当）を受け取れないフリーターや、受給が終わった人などが、無料（テキスト代などは自己負担）の職業訓練を受けられるのが求職者支援制度です。対象になる人、訓練の中身、月10万円の職業訓練受講給付金の条件、申し込みの流れを整理します。', '「雇用保険に入っていなかったから、仕事を辞めても何の支援もない」。アルバイトや短時間の仕事を続けてきた人は、そう思っているかもしれません。

先に結論です。

- **求職者支援制度**は、雇用保険の失業手当（基本手当）を受け取れない人が、無料で職業訓練を受けられる制度です（テキスト代などは自己負担）
- 本人や世帯の収入などの条件を満たすと、訓練中に**月10万円の職業訓練受講給付金**と通所手当などを受け取れます
- 申し込みの窓口はハローワークです。訓練中から修了後まで、ハローワークの就職支援も続きます

ここでは、対象になる人、訓練の中身、給付金の条件、申し込みの流れを順に見ていきます。

## 求職者支援制度ってどんな制度？

求職者支援制度は、再就職や転職、スキルアップを目指す人が、無料の職業訓練を受けながら仕事を探せるようにする制度です。訓練は、厚生労働大臣の認定を受けた民間の訓練機関（スクールなど）が行い、「求職者支援訓練」と呼ばれます。

訓練を受けるだけでなく、ハローワークが「就職支援計画書」をつくり、訓練中と修了後に就職の相談を続けて受けられるのが特徴です。

## 対象になるのはどんな人？

厚生労働省の案内では、次のような人が例として挙げられています。

- 雇用保険に入れなかった人（短時間のアルバイトなど）
- 失業手当を受け取っている間に再就職できず、支給が終わった人
- 雇用保険に入っていた期間が足りず、失業手当を受け取れない人
- 自営業を廃業した人
- 就職が決まらないまま学校を卒業した人

あわせて、ハローワークで求職の申込みをしていること、雇用保険の被保険者や受給資格者ではないこと、働く意思と能力があること、ハローワークが訓練などの支援が必要と認めたこと、が条件になります。

また、雇用保険に入っていない働き方をしている人は、働きながら訓練を受けられる場合もあります。

反対に、雇用保険の基本手当を受け取っている人や、受け取れる見込みの人は、まず公共職業訓練（離職者訓練）が案内されることが多くなります。公共職業訓練も受講料は無料（テキスト代などは自己負担）です。自分がどちらの訓練に当てはまるかは、離職票や雇用保険の加入記録をもとにハローワークで確認できます。

「雇用保険に入っていたかどうか分からない」という人は、前の職場の給与明細を見て、雇用保険料が引かれていたかを確認しておくと、相談がスムーズです。

## どんな訓練がある？

求職者支援訓練には、大きく2つのコースがあります。

| コース | 内容のイメージ |
| --- | --- |
| 基礎コース | 社会人としての基礎や、パソコンの基本操作など |
| 実践コース | IT、営業・販売・事務、医療事務、介護福祉、デザインなどの分野の技能 |

たとえば、基礎コースにはビジネスパソコン科やオフィスワーク科、実践コースには経理事務の科、介護職員初任者研修の科、Webやプログラミングの科などがあります。実際にどのコースが開かれているかは地域や時期で変わるので、住んでいる地域の労働局やハローワークの訓練コース一覧で確認してください。

訓練期間は、コースによって2〜6か月です。受講料は無料で、テキスト代などは自己負担になります。

## 月10万円の給付金をもらう条件は？

訓練中の生活を支えるのが、**職業訓練受講給付金**です。次の3つで構成されています。

- 職業訓練受講手当：月10万円
- 通所手当：訓練施設までの交通費（上限は月42,500円）
- 寄宿手当：家族と離れて住む必要がある場合に月10,700円

受け取るには、本人の収入が月8万円以下、世帯全体の収入が月30万円以下、世帯全体の金融資産が300万円以下であることなど、次の条件をすべて満たす必要があります。ここでの「収入」は、税金が引かれる前の給料（賞与を含む）だけでなく、各種年金や仕送りなども含みます（対象外になる手当などもあります）。

```figure
type: checklist
title: 職業訓練受講給付金の主な条件
items:
  - 本人の収入が月8万円以下
  - 世帯全体の収入が月30万円以下
  - 世帯全体の金融資産が300万円以下
  - 住んでいる所以外に土地・建物を持っていない
  - すべての訓練日に出席する
  - 世帯で、ほかに給付金を受けて訓練中の人がいない
  - 過去6年以内に給付金を受けていない
```

出席については、やむを得ない理由で休んだことを証明できる場合でも、8割以上の出席が必要です。このほか、過去3年以内に不正な受給をしていないことなども条件です。

本人の収入が月12万円以下で、世帯の収入が月34万円以下の場合は、ほかの条件を満たせば、通所手当だけを受け取れる場合があります。

給付金だけでは生活費が足りない場合は、希望に応じて労働金庫（ろうきん）の貸付制度を利用できる場合もあります。ただし貸付は返済が必要なお金なので、借りる前に返し方まで考えておきましょう。

「世帯」の範囲や「収入」の数え方には細かい決まりがあります。親と同居している人などは、自分が当てはまるかどうかをハローワークで確認してください。

## 申し込みから訓練修了までの流れ

おおまかな流れは次のとおりです。

```figure
type: steps
title: 求職者支援訓練を受けるまでの流れ
items:
  - label: ハローワークで相談
    text: 求職の申込みをして、制度の説明を受ける
  - label: 訓練を選んで申し込む
    text: 受講申込書をハローワークに出す
  - label: 選考を受ける
    text: 訓練機関の面接や筆記試験など
  - label: 就職支援計画書を受け取る
    text: 合格後、訓練が始まる前にハローワークで
  - label: 訓練を受ける
    text: 原則月1回、指定された日にハローワークへ
```

訓練が始まってから修了後3か月までは、原則として月1回、ハローワークが指定した日（指定来所日）に行き、職業相談を受けます。給付金を受け取っている人は、この来所が支給の条件にもかかわるので、予定を空けておきましょう。

訓練には定員があり、申込みの締切もコースごとに決まっています。気になるコースを見つけたら、早めにハローワークで相談するのがおすすめです。

## 申し込む前に考えておきたいこと

無料で学べるといっても、数か月を訓練に使うことになります。申し込む前に、次のことを書き出しておくと、コースを選びやすくなります。

1. 訓練が終わったあと、どんな仕事に応募したいか
2. その仕事の求人で、どんなスキルや資格が求められているか
3. 訓練中の生活費は、給付金や貯金でまかなえるか

フリーターから正社員を目指すときの進め方は[フリーターから正社員を目指すとき、最初に確認したいこと](/articles/freeter-seishain-hajimeni)、事務職のパソコンの準備は[PCが得意じゃなくても、事務職は目指せる？](/articles/pc-nigate-jimu)、ITの仕事の入口は[未経験のIT、どんな仕事から始まる？](/articles/mikeiken-it-hajimari)でも紹介しています。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-07'::timestamptz, '求職者支援制度とは｜フリーターも無料で職業訓練・給付金の条件', '失業手当を受け取れないフリーターなどが無料で職業訓練を受けられる求職者支援制度。対象になる人、訓練の種類と期間、月10万円の職業訓練受講給付金の収入・出席などの条件、ハローワークでの申し込みの流れを整理します。', array['freeter-seishain-hajimeni', 'pc-nigate-jimu', 'mikeiken-it-hajimari']::text[], '{}'::text[], array['seishain', 'mikeiken-shokushu']::text[], array['freeter', 'seishain-keiken-sukunai']::text[], array['失業手当がなくても、', '無料で学べる訓練']::text[], null, false, '[{"q":"アルバイトを続けながら訓練を受けられますか？","a":"雇用保険に入っていない働き方の人は、働きながら求職者支援訓練を受けられる場合があります。ただし、職業訓練受講給付金には本人の収入が月8万円以下などの条件があり、収入によっては給付金を受け取れないことがあります。働き方と収入を伝えたうえで、ハローワークで確認してください。"},{"q":"親と同居していても給付金はもらえますか？","a":"給付金には、世帯全体の収入が月30万円以下、世帯全体の金融資産が300万円以下などの条件があります。親と同居していて世帯収入が条件を超える場合は、給付金は受け取れず、無料の訓練だけを受講することになります。"},{"q":"訓練を受ければ就職できますか？","a":"訓練を受けることで、仕事に必要な基礎を学び、ハローワークの就職支援も受けられますが、就職が約束されるものではありません。訓練の内容が、目指す仕事の求人で求められていることに合っているかを、申し込む前にハローワークで相談しておきましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「雇用保険に入っていなかったから何も使えない」と思っているフリーターに、無料の訓練と給付金の入口があることを示す。給付金の条件は厳しめなので、条件をそのまま並べる","quotes":[{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyushokusha_shien/index.html","text":"再就職、転職、スキルアップを目指す方が月10万円の生活支援の給付金を受給しながら、無料の職業訓練を受講する制度","used_in":"求職者支援制度ってどんな制度？"},{"source_url":"https://jsite.mhlw.go.jp/saitama-roudoukyoku/content/contents/001476098.pdf","text":"本人収入が月8万円以下、世帯全体の収入が月30万円以下、世帯全体の金融資産が300万円以下、現在住んでいるところ以外に土地・建物を所有していない。本人収入が月12万円以下かつ世帯収入が月34万円以下で他の要件を満たす場合は通所手当を受給可能","used_in":"月10万円の給付金をもらう条件は？"},{"source_url":"https://www.mhlw.go.jp/hellotraining/support/","text":"全ての訓練実施日に出席している（やむを得ない理由により欠席し、証明できる場合であっても8割以上出席）。過去6年以内に職業訓練受講給付金の支給を受けたことがない","used_in":"月10万円の給付金をもらう条件は？"}],"not_used":["訓練の就職率など実績の数字は、年度によって変わり、最新年度の数字を確認しきれなかったので書かない","訓練期間を「3か月から6か月」とする古い資料もあったため、新しい資料の「2〜6か月」を採用し、「コースによって違う」と書いた","短期・短時間の訓練コースの詳しい条件は確認しきれなかったので書かない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'kyushokusha-shien-seido' and c.slug = 'seido' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'kyushokusha-shien-seido' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '求職者支援制度のご案内', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyushokusha_shien/index.html', '2026-10-07'::date, '制度の概要（月10万円の給付金を受けながら無料の職業訓練を受講）、対象になる人の例、訓練中から修了後3か月まで原則月1回ハローワークで職業相談を受けること', 0 from articles where slug = 'kyushokusha-shien-seido';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業支援・給付金などについて知る（ハロトレ特設サイト）', '厚生労働省', 'https://www.mhlw.go.jp/hellotraining/support/', '2026-10-07'::date, '職業訓練受講給付金の内容（職業訓練受講手当月10万円・通所手当・寄宿手当）と支給要件', 1 from articles where slug = 'kyushokusha-shien-seido';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '「求職者支援訓練」とは', '厚生労働省', 'https://www.mhlw.go.jp/bunya/nouryoku/training/dl/training01m.pdf', '2026-10-07'::date, '求職者支援訓練は民間訓練機関が厚生労働大臣の認定を受けて行う訓練で、基礎コースと実践コースがあること、主な訓練分野の例', 2 from articles where slug = 'kyushokusha-shien-seido';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '求職者支援制度（ハロートレーニングのご案内）', '山梨労働局', 'https://jsite.mhlw.go.jp/yamanashi-roudoukyoku/content/contents/001286161.pdf', '2026-10-07'::date, '受講料は無料（テキスト代等は自己負担）、訓練期間は2〜6か月であること', 3 from articles where slug = 'kyushokusha-shien-seido';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業訓練受講給付金のご案内', '埼玉労働局', 'https://jsite.mhlw.go.jp/saitama-roudoukyoku/content/contents/001476098.pdf', '2026-10-07'::date, '支給要件（本人収入月8万円以下、世帯収入月30万円以下、世帯の金融資産300万円以下、住居以外の土地・建物がない、出席要件、過去の受給歴など）、通所手当のみ受給できる場合（本人収入月12万円以下かつ世帯収入月34万円以下）、通所手当の上限42,500円、寄宿手当10,700円、労働金庫の貸付制度', 4 from articles where slug = 'kyushokusha-shien-seido';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '求職者支援制度 雇用保険に加入していない方が、働きながら訓練を受けることができます', '厚生労働省・都道府県労働局・ハローワーク', 'https://www.mhlw.go.jp/content/11801000/001163368.pdf', '2026-10-07'::date, '雇用保険に加入していない人が働きながら訓練を受けられること', 5 from articles where slug = 'kyushokusha-shien-seido';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ハロートレーニング（離職者訓練・求職者支援訓練）', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/jinzaikaihatsu/rishokusha.html', '2026-10-07'::date, '公共職業訓練（離職者訓練）は主に雇用保険を受給している求職者が対象で、無料（テキスト代等は自己負担）であること', 6 from articles where slug = 'kyushokusha-shien-seido';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '求職者支援制度・訓練受講のしおり －就職支援計画書の交付を受ける方へ－', '厚生労働省・都道府県労働局・ハローワーク', 'https://www.mhlw.go.jp/content/000998532.pdf', '2026-10-07'::date, '合格後、訓練開始前にハローワークで就職支援計画書の交付を受けること、指定来所日に来所して職業相談を受けること', 7 from articles where slug = 'kyushokusha-shien-seido';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '求職者支援制度に関するよくあるご質問', '厚生労働省', 'https://www.mhlw.go.jp/content/000960250.pdf', '2026-10-07'::date, '給付金の条件でいう「収入」には税引前の給与（賞与含む）、各種年金、仕送りなどが含まれ、児童手当など一部は対象外であること', 8 from articles where slug = 'kyushokusha-shien-seido';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'kyushokusha-shien-seido' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"50305ae31e708b7fced71f6d14d89c3809108bdc4403d2bc6bb6aaa68029073d","findings":[]}'::jsonb from articles where slug = 'kyushokusha-shien-seido';
update articles set status = 'published' where slug = 'kyushokusha-shien-seido';

-- article: mensetsu-fukusou (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('mensetsu-fukusou', 'article', '転職の面接、服装はスーツ？「私服可」「服装自由」「オフィスカジュアル」の考え方と身だしなみチェック', '転職の面接の服装は、指定がなければスーツを選ぶと迷いにくくなります。「私服可」「服装自由」「オフィスカジュアル」と書かれていたときの考え方、迷ったときの確かめ方と問い合わせの例、スーツがないときの選び方、当日の身だしなみチェックを紹介します。', '「面接の案内に『服装自由』と書いてあるけど、本当に私服でいいの？」「スーツを持っていない」。面接の準備では、話す内容と同じくらい、服装で迷う人が多いです。

先に結論を言うと、**服装の指定がなければスーツを選ぶと迷いにくく**、**指定があればその意図に合わせる**のが基本です。どちらの場合も、いちばん大事なのは**清潔感**です。

この記事で分かること：

- 指定がないときの**基本の服装**
- 「私服可」「服装自由」「オフィスカジュアル」の**考え方**
- 迷ったときの**確かめ方**と問い合わせの例
- スーツがないとき、オンライン面接のときの**服装**
- 当日の**身だしなみチェック**

## 指定がなければスーツが無難

ハローワークの面接対策の案内では、アパレルなど一部の業界を除き、面接の服装は**基本はスーツ**とされています。正社員の求人だけでなく、パートやアルバイトでも、清潔感や「きちんと感」を伝えるためにスーツをすすめる案内もあります。

### スーツで行くときの基本

ハローワークのセミナー資料では、次のような組み合わせが基本として紹介されています。

- スーツ：黒・紺・グレーなど落ち着いた色
- シャツ：白が基本
- 靴：革靴
- 靴下：黒・紺・グレーのビジネス用。ストッキングはベージュ系
- カバン：黒が主流

転職の面接では、新卒の就職活動ほど形が決まっているわけではありません。ただ、色や形で目立つ必要はないので、**落ち着いた色・シンプルな形**を選んでおけば大きく外しにくくなります。

## 服装でいちばん大事なのは「清潔感」

ハローワーク山形の面接対策の資料では、服装で個性を出す必要はなく、**無難で清潔感のある服装**を目指すようにと案内しています。髪や靴、爪といった細かいところにも目が向けられます。

高いスーツかどうかより、**シワや汚れがないか、サイズが合っているか**のほうが印象に関わります。

## 「私服可」「服装自由」「オフィスカジュアル」はどう考える？

面接の案内に、服装について書かれていることがあります。公的な決まった定義があるわけではないので、ここでは一般的な受け止め方と、迷ったときの選び方を紹介します。

| 案内の書き方 | 一般的な受け止め方 | 迷ったときの選び方 |
| --- | --- | --- |
| 書かれていない | 特に指定はない | スーツ |
| 私服可 | スーツでも私服でもよい | スーツ、またはジャケットを着たきちんとした私服 |
| 服装自由 | 形は問わない。ただし面接の場にふさわしい服装 | ジャケットに襟のあるシャツなど、きちんと感のある服 |
| 私服でお越しください | 会社が私服を望んでいる | ジャケットを着た、落ち着いた色の私服 |
| オフィスカジュアル | 職場で働くときのような、きちんとした服装 | ジャケット、襟のあるシャツやブラウス、無地のパンツやスカート |

「自由」「私服」と書かれていても、**普段着でよいという意味とは限りません**。デニム、Tシャツ1枚、サンダル、派手な柄などは避け、「この服で、この会社の人と仕事の打ち合わせができるか」を基準に選ぶと考えやすくなります。

## 迷ったときの確かめ方

「会社の雰囲気が分からない」「どこまでくずしていいか分からない」ときは、次の順番で確かめましょう。

```figure
type: steps
title: 服装に迷ったときの確かめ方
items:
  - label: 案内をもう一度読む
    text: 面接の案内メールや求人に、服装の指定がないか
  - label: 会社の様子を調べる
    text: 会社のサイトや採用ページの写真で、社員の服装を見る
  - label: 問い合わせる
    text: 採用担当者に、服装の指定があるか聞く
  - label: それでも迷ったら
    text: スーツ、またはスーツに近いきちんとした服装にする
```

労働局の面接対策の資料でも、**会社や業界にふさわしい服装**で臨むこと、迷う場合は会社の社員の服装を確認する方法が紹介されています。

問い合わせは失礼ではありません。メールなら、たとえば次のように聞けます。

> 件名：面接当日の服装について（氏名）
>
> 〇月〇日に面接のお時間をいただいております、〇〇と申します。
> 当日の服装について、ご指定があれば教えていただけますでしょうか。
> お忙しいところ恐れ入りますが、よろしくお願いいたします。

転職エージェント経由で応募している場合は、担当者に聞くのが早いです。

## スーツを持っていないときは

指定がなければスーツが無難ですが、すぐに用意できないこともあります。その場合は、手持ちの服で「きちんと感」を出す組み合わせを考えましょう。

- 上：ジャケット（黒・紺・グレーなど）
- 中：襟のあるシャツ、またはシンプルなブラウス
- 下：無地で落ち着いた色のパンツやスカート
- 靴：汚れのない革靴や、シンプルなパンプス

面接のあとも転職活動が続くなら、スーツを1着用意しておくと、毎回迷わずにすみます。

## オンライン面接の服装

ハローワーク川崎の資料では、オンライン面接でも**通常の面接と同じ服装**で臨むこと、パソコンのカメラを目線の高さに合わせることが案内されています。

- 上半身だけ整えるのではなく、全身を整えておく（立ち上がったときに見えることがある）
- 背景は片づいた壁などにする
- 画面に映る自分の顔が暗くないか、事前に確認する

## 当日の身だしなみチェック

家を出る前に、鏡の前で次の項目を確認しましょう。

```figure
type: checklist
title: 面接当日の身だしなみチェック
items:
  - 服にシワ・汚れ・ほつれがない
  - 髪が清潔で、顔にかからない
  - 爪が短く、汚れていない
  - 靴が汚れていない、かかとがすり減っていない
  - 靴下・ストッキングが落ち着いた色
  - カバンに書類が折れずに入る
  - 香水などの香りが強すぎない
```

服装が整ったら、あとは話す内容の準備です。よく聞かれる質問と答え方は[未経験職種の面接、何を準備する？](/articles/mensetsu-junbi-mikeiken)に、志望動機の組み立て方は[未経験職種の志望動機、何を書けばいい？](/articles/shiboudouki-mikeiken)にまとめています。働きながら転職活動を進めていて、面接の日程の組み方に迷うときは、[働きながらの転職活動、何から？](/articles/zaishoku-tenshoku-susumekata)が参考になります。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '転職の面接の服装｜スーツ？私服可・服装自由の考え方', '転職の面接はスーツで行くべき？「私服可」「服装自由」「オフィスカジュアル」と書かれていたときの考え方、迷ったときの確かめ方と問い合わせの例文、スーツがないときの服の選び方、オンライン面接の注意点、当日の身だしなみチェックを紹介します。', array['mensetsu-junbi-mikeiken', 'shiboudouki-mikeiken', 'kuhaku-kikan-setsumei', 'web-mensetsu-junbi', 'mensetsu-yokukiku-shitsumon']::text[], '{}'::text[], array['mensetsu']::text[], array['hajimete', 'freeter']::text[], array['面接の服装、', 'スーツじゃなきゃダメ？']::text[], null, false, '[{"q":"「私服でお越しください」と書かれていたのに、スーツで行ってもいいですか？","a":"スーツで行っても失礼にはあたらないと考えられますが、会社が「私服で」とはっきり書いているなら、その意図に合わせるのがよいでしょう。ジャケットに襟のあるシャツ、落ち着いた色のパンツやスカートのように、きちんと感のある服装にすると迷いにくくなります。不安なら、採用の担当者に問い合わせてかまいません。"},{"q":"スーツを持っていません。買わないといけませんか？","a":"指定がなければスーツが無難ですが、すぐに用意できない場合は、ジャケットと襟のあるシャツ、無地で落ち着いた色のパンツやスカートなど、手持ちの服で「きちんと感」を出す方法もあります。大事なのは、シワや汚れがなく清潔に見えることです。"},{"q":"オンライン面接でも、服装は対面と同じですか？","a":"ハローワークの面接対策の資料では、オンライン面接でも通常の面接と同じ服装で臨むことが案内されています。上半身しか映らないと思っても、立ち上がったときに見えることもあるので、全身を整えておきましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"面接の服装の「正解」を一つに決めつけず、「指定がなければスーツ」「指定があればその意図に合わせる」「迷ったら確かめる」の順で判断できるようにする。根拠はハローワーク・労働局の面接対策資料に絞り、身だしなみはチェックリストで見せる","quotes":[{"source_url":"https://jsite.mhlw.go.jp/yamagata-hellowork/content/contents/002350381.pdf","text":"服装で個性を出す必要はない。無難で、突っ込みどころのない、清潔感のある服装を目指す。髪や靴、爪などの注意点（jsite.mhlw.go.jp へ直接接続できなかったため、検索結果に表示された内容で確認）","used_in":"服装でいちばん大事なのは「清潔感」 / 当日の身だしなみチェック"},{"source_url":"https://jsite.mhlw.go.jp/aomori-roudoukyoku/content/contents/002105371.pdf","text":"会社や業界にふさわしい服装で臨む。迷う場合は会社を下見して社員の服装を確認する方法もある（検索結果で確認）","used_in":"迷ったときの確かめ方"},{"source_url":"https://jsite.mhlw.go.jp/osaka-hellowork/list/abeno/mother-syukatsutaikendan002_00002.html","text":"アパレルなど特殊な業界以外は「基本はスーツ」。パートやアルバイトでも清潔感や「きちんと感」を伝えるためにスーツをすすめている（検索結果で確認）","used_in":"指定がなければスーツが無難"},{"source_url":"https://jsite.mhlw.go.jp/osaka-hellowork/content/contents/002184437.pdf","text":"シャツは白が基本、スーツは黒・紺・グレーが基本。女性のストッキングはベージュ系、男性の靴下は黒・グレー・紺のビジネスソックス。カバンは黒が主流（検索結果で確認）","used_in":"スーツで行くときの基本"},{"source_url":"https://jsite.mhlw.go.jp/kanagawa-hellowork/content/contents/002604524.pdf","text":"髪は清潔に、黒や紺のソックス、革靴。オンライン面接では、PCのカメラを目線の高さに合わせ、通常の面接と同じ服装で臨む（検索結果で確認）","used_in":"オンライン面接の服装 / 当日の身だしなみチェック"}],"not_used":["「私服可」「服装自由」「オフィスカジュアル」の公的な定義は見つからなかったため、意味は一般的な受け止め方として書き、断定せず確認のしかたを示した","服装が合否にどの程度影響するかの調査データは、公的な根拠を確認できなかったので書かない","面接会場に何分前に着くかの目安は、資料によって異なり今回の主題でもないため書かない","特定のスーツ店やレンタルサービスには触れない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'mensetsu-fukusou' and c.slug = 'shorui-mensetsu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'mensetsu-fukusou' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '面接対策（ハローワーク山形の資料）', '山形労働局（ハローワーク山形）', 'https://jsite.mhlw.go.jp/yamagata-hellowork/content/contents/002350381.pdf', '2026-10-09'::date, '服装で個性を出す必要はなく、無難で清潔感のある服装を目指すこと、髪・靴・爪などにも気を配ること', 0 from articles where slug = 'mensetsu-fukusou';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '事前の準備が大事です 面接試験の受け方（青森労働局の資料）', '青森労働局', 'https://jsite.mhlw.go.jp/aomori-roudoukyoku/content/contents/002105371.pdf', '2026-10-09'::date, '会社や業界にふさわしい服装で臨むこと、迷ったときは会社の社員の服装を確認する方法があること', 1 from articles where slug = 'mensetsu-fukusou';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ハローワーク阿倍野 マザーズコーナー 就活体験談', '大阪労働局（ハローワーク阿倍野）', 'https://jsite.mhlw.go.jp/osaka-hellowork/list/abeno/mother-syukatsutaikendan002_00002.html', '2026-10-09'::date, 'アパレルなど一部の業界を除き、面接の服装は基本はスーツとされていること', 2 from articles where slug = 'mensetsu-fukusou';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ハローワーク布施 面接対策セミナー', '大阪労働局（ハローワーク布施）', 'https://jsite.mhlw.go.jp/osaka-hellowork/content/contents/002184437.pdf', '2026-10-09'::date, 'スーツは黒・紺・グレー、シャツは白が基本で、靴下・ストッキング・カバンも落ち着いた色にすること', 3 from articles where slug = 'mensetsu-fukusou';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '面接対策 面接のマナーとよく聞かれる質問（ハローワーク川崎）', '神奈川労働局（ハローワーク川崎）', 'https://jsite.mhlw.go.jp/kanagawa-hellowork/content/contents/002604524.pdf', '2026-10-09'::date, '髪は清潔にし、靴は革靴にすること、オンライン面接でも通常の面接と同じ服装で臨み、カメラを目線の高さに合わせること', 4 from articles where slug = 'mensetsu-fukusou';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'mensetsu-fukusou' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"3c63dc11df0a037e1c1006678523a6837814df7d02cac876f4997d705a048b4d","findings":[]}'::jsonb from articles where slug = 'mensetsu-fukusou';
update articles set status = 'published' where slug = 'mensetsu-fukusou';

-- article: mensetsu-junbi-mikeiken (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('mensetsu-junbi-mikeiken', 'article', '未経験職種の面接、何を準備する？よく聞かれる質問と逆質問の例', '未経験の職種の面接では、志望動機・転職理由・これまでの経験・入社後のことを聞かれやすいものです。質問ごとの準備のしかたと答え方の例、逆質問の例、オンライン面接の確認ポイント、答えなくていい質問についてまとめました。', '未経験の職種の面接は、「経験がないことを、どう話せばいいの？」と不安になりやすいものです。でも、聞かれることはある程度決まっています。質問ごとに**話す材料**を用意しておけば、当日あわてずにすみます。

## 何を聞かれる？まずは4つを準備

未経験の職種の面接で聞かれやすいのは、たとえば次の4つです。

| 聞かれやすいこと | 準備しておくこと |
| --- | --- |
| 志望動機 | その仕事に興味を持ったきっかけと、この会社を選んだ理由 |
| 転職理由 | 今の仕事から変わりたい理由と、次にしたいこと |
| これまでの経験 | アルバイトや前職で担当したこと、工夫したこと |
| 入社後のこと | 最初に覚えたいこと、今勉強していること |

ハローワークの資料では、面接では提出した履歴書や職務経歴書の内容をもとに質問されることが多いとして、書類のコピーを取っておき、面接の前に見直すようすすめています。書いた内容と話す内容がずれないようにしておきましょう。志望動機の組み立て方は[未経験職種の志望動機、何を書けばいい？](/articles/shiboudouki-mikeiken)で紹介しています。

## 「未経験ですよね？」と聞かれたら

経験がないことは、隠さずに認めて大丈夫です。そのうえで、**近い経験 → 準備していること → 入社後**の順に話すと、前向きな答えになります。

```figure
type: steps
title: 「未経験ですよね？」への答え方
items:
  - label: 近い経験
    text: 例：レジ締めやシフト表の入力を3年間
  - label: 準備していること
    text: 例：表計算ソフトの基本操作を練習中
  - label: 入社後
    text: 例：研修で教わることを早く一人でできるように
```

> はい、事務の仕事は未経験です。ただ、アルバイトではレジ締めやシフト表の入力を3年間担当してきたので、数字を正確に扱うことには慣れています。今は表計算ソフトの基本操作を練習していて、入社後は研修で教わることを早く一人でできるようにしたいと考えています。

## 転職理由は「これから」につなげる

転職理由は、今の職場への不満だけで終わらせないことがポイントです。不満がきっかけでも構いません。それを「次にどうしたいか」に言いかえて話しましょう。

| そのまま話すと | 言いかえると |
| --- | --- |
| シフトが不規則でつらい | 生活のリズムを整えて、長く働ける環境で経験を積みたい |
| 給料が上がらない | 経験を積むほど評価される仕事で、力をつけていきたい |
| 立ち仕事がきつい | 接客で身につけた対応力を、オフィスの仕事で活かしたい |

転職回数が多くて説明に迷う場合は、[転職回数が気になるときに整理したいこと](/articles/tenshoku-kaisu-kininaru)も参考にしてください。

## 逆質問、何を聞けばいい？

面接の最後に「何か質問はありますか？」と聞かれることがあります。未経験の場合は、**入社後の働き方が分かる質問**を用意しておくと、自分にとっても判断材料になります。

- 未経験で入社した方は、最初の3か月ほどでどんな仕事を任されることが多いですか？
- 研修のあと、一人で担当するまでにどのくらいの期間がありますか？
- 入社までに勉強しておくとよいことはありますか？
- 1日の仕事の流れを教えていただけますか？

求人票やホームページを見れば分かることは避けましょう。研修について確かめたいことは[未経験求人の「研修あり」で確認すべきこと](/articles/mikeiken-kenshu-kakunin)にまとめています。

## オンライン面接で確認すること

オンライン面接では、通信や機材のトラブルが不安のもとになりがちです。前日までに次のことを確認しておきましょう。

- 指定されたアプリやURLで、接続を試したか
- カメラは目の高さか、顔が明るく映るか
- 背景に見られたくないものが映っていないか
- 通知が鳴らないよう、ほかのアプリを閉じたか
- つながらないときの連絡先を控えたか

```figure
type: checklist
title: オンライン面接の前日までに確認すること
items:
  - 指定されたアプリやURLで、接続を試したか
  - カメラは目の高さか、顔が明るく映るか
  - 背景に見られたくないものが映っていないか
  - 通知が鳴らないよう、ほかのアプリを閉じたか
  - つながらないときの連絡先を控えたか
```

## 答えなくていい質問もある

厚生労働省は、採用選考は応募者の適性・能力だけを基準に行うべきだとしています。そのため、**本籍・出生地、家族の職業や収入、住まいの状況、宗教、支持政党**など、適性や能力に関係のないことを面接で尋ねるのは、就職差別につながるおそれがあるとして、企業に配慮を求めています。

こうした質問に、無理に答える必要はありません。気になる質問をされたときは、ハローワーク（公共職業安定所）や都道府県労働局に相談できます。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['shiboudouki-mikeiken', 'mikeiken-kenshu-kakunin', 'shokumu-keirekisho-arubaito', 'mensetsu-yokukiku-shitsumon', 'gyaku-shitsumon', 'mensetsu-kinchou', 'tekisei-kensa-tenshoku']::text[], '{}'::text[], array['mensetsu', 'mikeiken-shokushu']::text[], array['hajimete', 'seishain-keiken-sukunai']::text[], array['面接が不安。', '何を準備する？']::text[], null, false, '[{"q":"面接で家族のことを聞かれたら、答えないといけませんか？","a":"厚生労働省は、家族の職業や収入など、本人の適性・能力と関係のない事項を面接で尋ねることは就職差別につながるおそれがあるとして、企業に配慮を求めています。答えにくい質問に無理に答える必要はありません。気になる質問をされたときは、ハローワークや都道府県労働局に相談できます。"},{"q":"逆質問で「特にありません」と答えるのはだめですか？","a":"だめというわけではありませんが、入社後の働き方を知るよい機会です。研修のあとの流れや、未経験で入社した人が最初に任される仕事など、自分が判断するために知りたいことを1〜2個用意しておくと安心です。"},{"q":"未経験であることは、どう伝えればいいですか？","a":"隠す必要はありません。聞かれたら未経験であることを認めたうえで、近い経験、今準備していること、入社後に取り組みたいことの順につなげて話すと伝わりやすくなります。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"未経験職種の面接で聞かれやすい4つの質問ごとに準備のしかたと答え方の例を示し、逆質問・オンライン面接・答えなくていい質問（公正な採用選考）までを一つの準備リストとしてまとめる","quotes":[{"source_url":"https://kouseisaiyou.mhlw.go.jp/basic.html","text":"公正な採用選考の基本は、応募者の基本的人権を尊重すること、応募者の適性・能力のみを基準として行うこと","used_in":"答えなくていい質問もある"},{"source_url":"https://kouseisaiyou.mhlw.go.jp/consider.html","text":"就職差別につながるおそれがある14事項。本人に責任のない事項（本籍・出生地、家族、住宅状況、生活環境・家庭環境）と、本来自由であるべき事項（宗教、支持政党、人生観・生活信条、思想、労働組合・学生運動など）を応募書類や面接で把握しない","used_in":"答えなくていい質問もある／FAQ"},{"source_url":"https://kouseisaiyou.mhlw.go.jp/jobseekers.html","text":"面接などで本人の適性・能力以外の事項を把握された事例を紹介し、不適切な質問があった場合は最寄りのハローワークや都道府県労働局に相談できると案内","used_in":"答えなくていい質問もある／FAQ"},{"source_url":"https://www.hellowork.mhlw.go.jp/doc/oubosyorui_pamphlet_202406.pdf","text":"面接では提出した履歴書（職務経歴書を含む）の記載内容に基づいて質問されることが多いので、完成した書類をコピーしておき、面接前に確認する","used_in":"何を聞かれる？まずは4つを準備"}],"not_used":["面接でよく聞かれる質問のランキングや、面接の通過率などの統計は使っていない","オンライン面接の確認事項は一般的な準備として書き、公的な基準としては扱っていない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'mensetsu-junbi-mikeiken' and c.slug = 'shorui-mensetsu' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '公正な採用選考の基本', '厚生労働省', 'https://kouseisaiyou.mhlw.go.jp/basic.html', '2026-10-06'::date, '採用選考は応募者の適性・能力のみを基準として行うという考え方', 0 from articles where slug = 'mensetsu-junbi-mikeiken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '採用選考時に配慮すべき事項', '厚生労働省', 'https://kouseisaiyou.mhlw.go.jp/consider.html', '2026-10-06'::date, '本籍・出生地、家族、住宅状況、宗教、支持政党などを面接で尋ねることが就職差別につながるおそれがあること', 1 from articles where slug = 'mensetsu-junbi-mikeiken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '求職者の皆様へ', '厚生労働省', 'https://kouseisaiyou.mhlw.go.jp/jobseekers.html', '2026-10-06'::date, '不適切な質問をされたときに、ハローワークや都道府県労働局に相談できること', 2 from articles where slug = 'mensetsu-junbi-mikeiken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '応募書類（パンフレット）', 'ハローワークインターネットサービス（厚生労働省）', 'https://www.hellowork.mhlw.go.jp/doc/oubosyorui_pamphlet_202406.pdf', '2026-10-06'::date, '面接では提出した履歴書・職務経歴書の内容をもとに質問されることが多いので、コピーを取って面接前に確認すること', 3 from articles where slug = 'mensetsu-junbi-mikeiken';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'mensetsu-junbi-mikeiken' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"ea14fedda28cffc26ca3a682d4e4a6f97e60db4f7fcc6815b6edd8e1d1d40b7a","findings":[]}'::jsonb from articles where slug = 'mensetsu-junbi-mikeiken';
update articles set status = 'published' where slug = 'mensetsu-junbi-mikeiken';

-- article: mensetsu-kinchou (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('mensetsu-kinchou', 'article', '面接で緊張してしまうときの準備と当日の対処｜言葉に詰まったときの言い方の例', '面接の緊張は、なくそうとするより「緊張しても話せる準備」をしておくほうが現実的です。話す内容の準備のしかた、声に出す練習、当日の流れの確認、ゆっくり話すコツ、言葉に詰まったときや質問が分からないときの言い方の例を、ハローワークの資料をもとに紹介します。', '面接の前の日から落ち着かない。いざ質問されると頭が真っ白になって、準備したことが出てこない。そんな経験がある人は少なくありません。

先に結論を言うと、緊張を**ゼロにしようとするより、緊張しても話せるように準備しておく**ほうが現実的です。具体的には、次の4つを準備します。

1. 話す内容を「要点」で準備する
2. 声に出して練習する
3. 当日の流れを知っておく
4. 言葉に詰まったときの言い方を決めておく

## 緊張の中身を分けてみる

「緊張する」とひとことで言っても、不安の中身は人によって違います。何が不安なのかが分かると、準備することが見えてきます。

| 不安の中身 | 準備できること |
| --- | --- |
| 何を聞かれるか分からない | よく聞かれる質問に、要点だけ答えを用意する |
| うまく話せるか自信がない | 声に出して練習し、録音して聞き直す |
| どう進むのか分からない | 当日の流れと持ち物を確認しておく |
| 詰まったらどうしよう | 詰まったときに言う一言を決めておく |

全部の不安を消す必要はありません。「ここは準備した」と思えるところを増やしていくと、本番で落ち着ける場面が増えます。

## 話す内容は「要点」で準備する

答えを文章で丸暗記すると、一言忘れただけで続きが出てこなくなりやすくなります。そこで、答えは**キーワードと順番**で覚えておきます。

たとえば「転職理由」なら、次のようにメモします。

> - きっかけ：接客で問い合わせに答えるのが好きだった
> - 考えたこと：困りごとの解決を専門にしたい
> - これから：電話とメールの問い合わせ対応で長く働きたい

キーワードと順番さえ決まっていれば、言い回しが毎回少し違ってもかまいません。自己紹介・転職理由・志望動機のように、ほとんどの面接で聞かれる質問から準備しましょう。質問ごとの答え方の型は、[転職の面接でよく聞かれる質問と答え方](/articles/mensetsu-yokukiku-shitsumon)で紹介しています。

書類に書いたことは、面接でもそのまま質問されやすいところです。提出した履歴書や職務経歴書を読み返して、「この経験について教えてください」と聞かれたときの要点もメモしておきましょう。

## 声に出して練習する

頭の中で考えるのと、声に出して話すのとでは、思った以上に違います。練習は、次の順で進めると取り組みやすくなります。

- **ひとりで声に出す**：メモを見ながらでいいので、実際に話してみる
- **録音して聞き直す**：早口になっていないか、話が長くなっていないかを確かめる
- **人に聞いてもらう**：家族や友人に面接官役を頼み、メモを見ずに答えてみる

人に聞いてもらう練習は、ハローワークでも相談できます。ハローワークでは、応募書類の作り方や面接の受け方について、個別相談やセミナーを無料で行っています。窓口で面接の練習ができるところもあるので、予約や方法は利用したいハローワークに問い合わせてみてください。

未経験の職種に応募するときの準備は、[未経験職種の面接、何を準備する？](/articles/mensetsu-junbi-mikeiken)もあわせて読んでみてください。

## 当日の流れを知っておく

「次に何が起こるか分からない」ことも、緊張のもとになります。会社によって違いはありますが、対面の面接はおおむね次のように進みます。

```figure
type: steps
title: 対面の面接の、よくある流れ
items:
  - label: 到着・受付
    text: 余裕を持って着き、受付で名前と面接に来たことを伝える
  - label: 待機
    text: 案内された場所で待つ。メモを見返してもいい
  - label: 入室・あいさつ
    text: 名前を名乗ってあいさつし、すすめられてから座る
  - label: 質問に答える
    text: 自己紹介・転職理由・志望動機などを聞かれる
  - label: 逆質問
    text: 「何か質問はありますか」と聞かれることが多い
  - label: あいさつ・退室
    text: お礼を言って退室する
```

最後の逆質問は、聞くことを1つか2つ決めておくと、そこで慌てずに済みます。聞くことの例は[面接の逆質問、何を聞けばいい？](/articles/gyaku-shitsumon)で紹介しています。

前の日には、次のことを確かめておきましょう。

- 会場の住所と行き方、かかる時間、遅れそうなときの連絡先
- 持ち物（応募書類の控え、筆記用具、案内のメールで指定されたもの）
- 着ていく服（服装の考え方は[転職の面接、服装はスーツ？](/articles/mensetsu-fukusou)を参照）
- 話す要点のメモ

オンラインの面接なら、通信やカメラの確認も前日までに済ませておくと安心です。

## 当日、話すときに意識したいこと

ハローワークの資料では、緊張するといつもより早口になりやすいので、**聞き取りやすい大きさの声で、いつも以上にゆっくり話す**よう案内されています。ほかにも、次のような点が挙げられています。

- 面接官の質問は最後まで聞き、**一呼吸おいてから**話し始める
- 語尾をはっきり言い、**短く簡潔に**答える

一呼吸おくのは、考える時間を作るためでもあります。質問が終わったら、心の中で「はい」と言ってから話し始めるくらいの気持ちで十分です。

答えは、結論を先に言うと短くまとまります。

> 「転職を考えた理由は、困りごとの解決を専門にする仕事がしたいと思ったからです。」

結論のあとに、理由や具体例を1つ足すくらいがちょうどいい長さです。

## 言葉に詰まったときの言い方

準備をしていても、言葉に詰まることはあります。そのときに言う一言を決めておくだけで、黙り込んでしまうのを防げます。

**考える時間がほしいとき**

> 「少し考える時間をいただいてもよろしいでしょうか。」

**話している途中で、何を言っているか分からなくなったとき**

> 「緊張していて、うまくまとまらず失礼しました。改めてお話しします。」

言い直すときは、結論の一文から始めると立て直しやすくなります。

**質問の意味が分からなかったとき**

> 「〇〇についてのご質問ということで、よろしいでしょうか。」

分からないまま答えるより、確かめてから答えるほうが、話がずれずに済みます。

**経験がないことを聞かれたとき**

> 「その仕事はまだ経験がありません。ただ、販売の仕事で〇〇をしていたので、その経験を活かして早く覚えたいと考えています。」

経験がないことを隠す必要はありません。近い経験や、今取り組んでいることにつなげましょう。

**話が長くなってしまったとき**

> 「まとめると、〇〇ということです。」

最後に一文でまとめ直すと、聞いている人にも要点が伝わります。

## 終わったら、ふり返りをメモする

面接が終わったら、その日のうちに次のことをメモしておくと、次の面接の準備になります。

```figure
type: checklist
title: 面接のあとにメモしておくこと
items:
  - 聞かれた質問
  - うまく答えられたこと
  - 詰まった質問と、言いたかったこと
  - 面接官から聞いた仕事の話
  - 次に準備しておきたいこと
```

詰まった質問は、要点のメモに書き足して、もう一度声に出して練習しておきましょう。回数を重ねるうちに「この質問はもう答えたことがある」と思えるものが増え、落ち着いて話せる場面が増えていきます。', 'review', false, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '面接で緊張するときの準備と対処｜詰まったときの言い方', '面接で緊張して頭が真っ白になりそう…。話す内容を要点で準備する方法、声に出す練習、当日の流れ、ゆっくり話すコツ、言葉に詰まったとき・質問が分からないときの言い方の例と、前日に確認したいことを紹介します。', array['mensetsu-yokukiku-shitsumon', 'web-mensetsu-junbi', 'mensetsu-fukusou', 'mensetsu-ochita-furikaeri', 'tekisei-kensa-tenshoku', 'mensetsu-renshu-pro']::text[], '{}'::text[], array['mensetsu']::text[], array['hajimete', 'seishain-keiken-sukunai']::text[], array['面接で緊張して', '頭が真っ白になる']::text[], null, false, '[{"q":"面接で緊張していることは、伝えてもいいですか？","a":"伝えてかまいません。言葉に詰まったときに「緊張していて、うまくまとまらず失礼しました。改めてお話しします」と一言添えてから話し直すと、黙ってしまうより落ち着いて続けやすくなります。ただし何度もくり返すより、話す中身に戻ることを大事にしましょう。"},{"q":"答えを丸暗記していったほうが安心ですか？","a":"丸暗記は、一言忘れると続きが出てこなくなりやすいので、話す要点をいくつかのキーワードで覚えておく方法がおすすめです。順番と言いたいことが決まっていれば、言い回しが毎回少し変わってもかまいません。"},{"q":"面接の練習は、どこでできますか？","a":"家族や友人に面接官役を頼むほか、ハローワークでは面接の受け方についての個別相談やセミナーを無料で行っています。窓口で面接の練習ができるところもあるので、利用したいハローワークに予約や方法を問い合わせてみてください。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"緊張を「なくす」方法ではなく、緊張しても話せる状態を作る準備（要点の準備・声に出す練習・流れを知る）と、当日に言葉に詰まったときに使える一言を具体的に示す。よく聞かれる質問の答え方は既存記事 mensetsu-yokukiku-shitsumon に任せてリンクする","quotes":[{"source_url":"https://jsite.mhlw.go.jp/hokkaido-hellowork/list/sapporo/shisetsu/shinsotsu-column3.html","text":"緊張するといつもよりも早口になってしまうことがある。聞き取りやすい大きさの声で、いつも以上にゆっくり丁寧に話す。面接官の話を最後まで聞いたうえで、一呼吸おいてから話し始めると、話を聞ける人だという印象を与えられる（官公庁サイトは直接開けなかったため、検索結果の抜粋で確認）","used_in":"当日、話すときに意識したいこと"},{"source_url":"https://jsite.mhlw.go.jp/yamagata-hellowork/content/contents/002350381.pdf","text":"面接官の質問には語尾をはっきりと、張りのある声で短く簡潔に答える。緊張から早口になりがちなので、声の大きさ・スピードに注意する（直接開けなかったため検索結果の抜粋で確認）","used_in":"当日、話すときに意識したいこと"},{"source_url":"https://www.mhlw.go.jp/stf/newpage_27742.html","text":"ハローワークでは、応募書類の作り方、面接の受け方などの個別相談やセミナーを無料で行っている（直接開けなかったため、既存記事での確認内容と検索結果で確認）","used_in":"声に出して練習する"}],"not_used":["緊張を和らげる呼吸法や医学的な効果についての説明は、公的な根拠を確認できなかったので書かない","「受付の何分前に着く」といった時間の目安は資料によって違い、出典を特定しきれなかったので数字を書かず「余裕を持って」にとどめた","模擬面接の所要時間や予約方法はハローワークごとに違うため書かない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'mensetsu-kinchou' and c.slug = 'shorui-mensetsu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'mensetsu-kinchou' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'おさえておきたい面接マナー', '札幌新卒応援ハローワーク（北海道労働局）', 'https://jsite.mhlw.go.jp/hokkaido-hellowork/list/sapporo/shisetsu/shinsotsu-column3.html', '2026-10-09'::date, '緊張するといつもより早口になりやすいので、聞き取りやすい大きさの声でいつも以上にゆっくり話すこと、面接官の話を最後まで聞いてから一呼吸おいて話し始めること', 0 from articles where slug = 'mensetsu-kinchou';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '面接対策', 'ハローワーク山形（山形労働局）', 'https://jsite.mhlw.go.jp/yamagata-hellowork/content/contents/002350381.pdf', '2026-10-09'::date, '質問には語尾をはっきりと、短く簡潔に答えること、緊張から早口になりがちなので声の大きさ・スピードに注意すること', 1 from articles where slug = 'mensetsu-kinchou';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ハローワークの相談支援', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_27742.html', '2026-10-09'::date, 'ハローワークで、応募書類の作り方や面接の受け方などの個別相談やセミナーを無料で行っていること', 2 from articles where slug = 'mensetsu-kinchou';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'mensetsu-kinchou' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"8411e4360582905e05865ac41cde6e0d88553623d91b448ba464457e36a467cc","findings":[]}'::jsonb from articles where slug = 'mensetsu-kinchou';
update articles set status = 'published' where slug = 'mensetsu-kinchou';

-- article: mensetsu-ochita-furikaeri (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('mensetsu-ochita-furikaeri', 'article', '面接に落ちたら、どう振り返る？気持ちの整理と、次の面接に向けた直し方', '面接に落ちたときは、自分を責めるより、「準備で直せること」と「相性やタイミングなど自分では変えられないこと」を分けて振り返ると、次の面接につなげやすくなります。気持ちの整理のしかた、振り返りの項目、答えの直し方の例、ハローワークで面接の相談をするときの使い方を紹介します。', '面接の結果が「今回はご縁がありませんでした」だった。準備したつもりだったのに、何がいけなかったのか分からない。そんなとき、落ち込むのは自然なことです。

先に結論を言うと、面接に落ちたときは、**「準備で直せること」と「自分では変えられないこと」を分けて振り返る**と、次の面接につなげやすくなります。落ちた理由を全部自分のせいにしなくていいし、反対に、直せるところを見ないままにもしない、ということです。

この記事で分かること：

- 落ち込んだときの**気持ちの整理のしかた**
- 面接の直後に残しておく**振り返りの項目**
- 次の面接に向けた**答えの直し方の例**
- ハローワークなどで**面接の相談をするときの使い方**

## まず、気持ちを整理する

不採用の連絡を受けた日は、無理に振り返らなくてもかまいません。気持ちが落ち着かないまま考えると、「自分は何をやってもだめだ」と、話が大きくなりがちです。

気持ちを整理するときは、次のことを思い出してください。

- 不採用は、**応募した会社との今回の組み合わせ**についての結果で、あなたの価値を決めるものではない
- 面接の結果には、ほかの応募者との比べ方、募集の人数、配属先の事情など、**応募者からは見えないこと**も関わる
- 1回の面接で分かることは限られている。**直せるところが1つ見つかれば十分**

少し時間をおいて落ち着いたら、次の「振り返りの項目」に進みます。

## 振り返りは「直せること」と「変えられないこと」に分ける

振り返りの目的は、反省文を書くことではなく、次の面接で1つでも良くすることです。そのために、思い当たることを2つに分けます。

```figure
type: compare
title: 落ちた理由を2つに分ける
columns:
  - label: 準備で直せること
    tone: mint
    items:
      - 答えが長すぎた・短すぎた
      - 志望動機が会社に合っていなかった
      - 求人の仕事内容を調べきれていなかった
      - 逆質問を用意していなかった
  - label: 自分では変えられないこと
    tone: sand
    items:
      - ほかの応募者との比較
      - 募集の人数や時期
      - 会社が求める経験との相性
```

右側のことは、考えても答えが出ません。時間を使うのは左側だけにします。

## 面接の直後にメモしておく項目

振り返りでいちばん役に立つのは、**面接が終わった当日のうちに書いたメモ**です。結果が出てからだと、聞かれた質問も自分の答えも思い出しにくくなります。結果を待っている間に、次の項目を書いておきましょう。

```figure
type: checklist
title: 面接の直後にメモすること
items:
  - 聞かれた質問（順番どおりに）
  - 自分の答え（覚えている言葉で）
  - 答えに詰まった質問
  - 面接官が深く聞いてきたところ
  - 面接官の反応が良かったところ
  - 聞きそびれたこと・逆質問の内容
```

メモの書き方の例（仮の例）：

> - 質問：「なぜ事務の仕事を選んだのですか？」
> - 自分の答え：「パソコンを使う仕事がしたいと思ったからです」
> - 気になったこと：「パソコンで何をしたいのか」と聞き返されて、うまく答えられなかった

このように「聞かれたこと」「答えたこと」「引っかかったこと」が並んでいれば、あとで直すところが見つけやすくなります。

## 次の面接に向けた直し方

メモを見返したら、直すところを**1回の面接につき1〜2個**にしぼります。全部を一度に直そうとすると、かえって話し方がぶれやすくなります。

### 答えに詰まった質問は、答えの「型」を作り直す

詰まった質問は、答えの順番が決まっていないことが多いです。たとえば「なぜこの仕事を選んだのか」は、**きっかけ → これまでの経験とのつながり → 入社後にやりたいこと**の順に組み立て直します。

直す前（仮の例）：

> 「パソコンを使う仕事がしたいと思ったからです。」

直したあと（仮の例）：

> 「販売の仕事で、在庫の数を表計算ソフトでまとめる作業を任され、数字を正確に整えることが自分に合っていると感じました。接客で身につけた、お客様の話を聞き取る力も、社内の人から頼まれごとを受ける事務の仕事で活かせると考えています。入社後は、まず伝票や書類の処理を正確に覚えたいです。」

よく聞かれる質問の答え方の型と回答例は[転職の面接でよく聞かれる質問と答え方](/articles/mensetsu-yokukiku-shitsumon)で紹介しています。

### 深く聞かれたところは、具体例を1つ足す

面接官が「たとえば？」「具体的には？」と聞き返してきたところは、話に**具体的な場面**が足りなかったところです。いつ、どこで、何をしたかが分かるエピソードを1つ用意しておきます。

### 退職理由で詰まったら、言い換えを準備する

退職理由を聞かれて、前の職場の不満をそのまま話してしまった場合は、「これからやりたいこと」に言い換える練習をします。言い換え方は[面接で退職理由を聞かれたら？](/articles/taishoku-riyuu-mensetsu)で例文とあわせて紹介しています。

### 会社のことを聞かれて答えられなかったら、調べ方を見直す

「当社のどこに興味を持ちましたか？」に答えられなかった場合は、求人票と会社の公式サイトを読む量が足りなかったのかもしれません。次の応募からは、仕事内容・会社が大事にしていること・入社後の働き方を、面接の前にメモにまとめておきましょう。

## 何社か落ちたら、「どこで落ちているか」を見る

何社か不採用が続いたときは、1社ずつではなく、まとめて見ると傾向が分かります。

| どこで落ちることが多い？ | 見直すところ |
| --- | --- |
| 書類選考 | 応募書類の書き方、応募する求人の選び方 |
| 1回目の面接 | 自己紹介・志望動機・退職理由の基本の答え |
| 最後の面接 | 入社後にやりたいこと、働き方の希望の伝え方 |

同じ質問で何度も詰まっているなら、そこが直すところです。反対に、毎回ちがうところで落ちているなら、答え方よりも応募する求人の選び方を見直すほうがよいこともあります。

## ひとりで振り返るのがつらいときは

自分の答えを自分で直すのは、思っている以上にむずかしいものです。人に聞いてもらうと、自分では気づかないくせが分かります。

- **ハローワーク**：応募書類の作り方や面接の受け方について、無料で個別相談やセミナーを行っています。希望に応じて、応募書類の添削や面接に向けた相談も受けられます
- **わかものハローワーク**：正社員を目指すおおむね35歳未満の人を対象に、担当者制で職業相談から応募準備まで無料でサポートしています

相談に行くときは、**面接直後に書いたメモと、提出した応募書類のコピー**を持っていくと話が早く進みます。たとえば、次のように切り出すと伝わりやすくなります。

> 「事務職の面接で2社続けて不採用になりました。志望動機を聞かれたときに、うまく答えられなかった気がします。メモを持ってきたので、答え方を一緒に見ていただけますか。」

面接練習の進め方や予約のしかたは窓口によって違うので、利用するハローワークで確認してください。面接の最後の逆質問を見直したいときは[面接の逆質問、何を聞けばいい？](/articles/gyaku-shitsumon)も参考にしてください。', 'review', false, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '面接に落ちたときの振り返り方｜次の面接に向けた直し方', '面接に落ちたとき、何をどう振り返ればいい？気持ちの整理のしかた、面接直後にメモしておく項目、直せることと直せないことの分け方、答えの直し方の例、ハローワークで面接練習や相談を受けるときの使い方を紹介します。', array['mensetsu-yokukiku-shitsumon', 'mensetsu-junbi-mikeiken', 'gyaku-shitsumon', 'mensetsu-kinchou', 'hellowork-tsukaikata', 'mensetsu-renshu-pro']::text[], '{}'::text[], array['mensetsu']::text[], array['hajimete', 'seishain-keiken-sukunai']::text[], array['面接に落ちた…', '次は何を直せばいい？']::text[], null, false, '[{"q":"面接に落ちた理由を、会社に聞いてもいいですか？","a":"聞くこと自体はかまいませんが、不採用の理由は詳しく教えてもらえないことが多いと考えておきましょう。答えが返ってこなくても失礼にあたるわけではありません。理由が分からないときは、面接直後のメモをもとに自分で振り返るか、ハローワークなどの窓口で面接の受け答えを一緒に見直してもらう方法があります。"},{"q":"面接に何回も落ちています。自分に問題があるのでしょうか？","a":"不採用には、応募者の受け答えだけでなく、ほかの応募者との比較や募集人数、会社の事情なども関わります。回数だけで自分を否定せず、「どの質問でつまずいたか」「同じところで落ちていないか」を並べてみましょう。書類で落ちることが多いのか、面接で落ちることが多いのかでも、直すところが変わります。"},{"q":"振り返りや面接練習は、どこで手伝ってもらえますか？","a":"ハローワークでは、応募書類の作り方や面接の受け方について、無料で個別相談やセミナーを行っています。正社員を目指すおおむね35歳未満の人は、わかものハローワークなどで担当者制の相談も受けられます。面接練習の実施方法や予約のしかたは窓口によって違うので、利用するハローワークで確認しましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"面接に落ちたとき、読者は「自分がだめだった」と一括りにしがち。直せること（準備・答え方）と直せないこと（比較・枠・相性）を分け、面接直後のメモ→1つずつ直す→人に聞いてもらう、の順で次につなげる。面接の答え方そのものは既存記事（mensetsu-yokukiku-shitsumon など）に任せ、この記事は「振り返りの手順」に絞る","quotes":[{"source_url":"https://www.mhlw.go.jp/stf/newpage_27742.html","text":"ハローワークでは、履歴書をはじめとした応募書類の作り方、面接の受け方などの個別相談やセミナーを実施しており、応募する求人に合わせた面接での受け答えなどについて助言している（官公庁サイトに直接接続できなかったため、検索結果の記載で確認）","used_in":"ひとりで振り返るのがつらいときは"},{"source_url":"https://www.mhlw.go.jp/content/11600000/001441500.pdf","text":"ご希望等に応じて応募書類（履歴書・職務経歴書など）の添削や面接に向けた相談も行っております。ご利用は無料（検索結果の記載で確認）","used_in":"ひとりで振り返るのがつらいときは"},{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000181329.html","text":"正社員を目指す若者（おおむね35歳未満）を対象に、担当者制による職業相談から応募準備のサポート、就職後の職場定着支援まで一貫した支援を無料で実施（検索結果の記載で確認）","used_in":"ひとりで振り返るのがつらいときは"}],"not_used":["「面接の通過率」「平均で何社受けるか」などの数字は、公的な根拠を確認できなかったので書かない","不採用理由の開示について、会社に説明する義務があるかどうかの公的な説明は確認できなかったので、「教えてもらえないことが多いと考えておく」にとどめた","面接練習（模擬面接）の予約方法・時間は窓口ごとに違うため、具体的な時間は書かない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'mensetsu-ochita-furikaeri' and c.slug = 'shorui-mensetsu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'mensetsu-ochita-furikaeri' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ハローワークの相談支援', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_27742.html', '2026-10-09'::date, 'ハローワークで、応募書類の作り方や面接の受け方について個別相談やセミナーを無料で行い、求人に合わせた面接での受け答えについて助言していること', 0 from articles where slug = 'mensetsu-ochita-furikaeri';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ハローワークのご案内（リーフレット）', '厚生労働省', 'https://www.mhlw.go.jp/content/11600000/001441500.pdf', '2026-10-09'::date, '希望に応じて応募書類の添削や面接に向けた相談を受けられること、利用は無料であること', 1 from articles where slug = 'mensetsu-ochita-furikaeri';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'わかものハローワーク', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000181329.html', '2026-10-09'::date, '正社員を目指すおおむね35歳未満の若者を対象に、担当者制の職業相談や応募準備のサポートを無料で行っていること', 2 from articles where slug = 'mensetsu-ochita-furikaeri';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'mensetsu-ochita-furikaeri' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"ec4b9f97fe899c7307af4f3bdc692d8bbf695773404c6dc3407062b2ef0fe084","findings":[]}'::jsonb from articles where slug = 'mensetsu-ochita-furikaeri';
update articles set status = 'published' where slug = 'mensetsu-ochita-furikaeri';

-- article: mensetsu-renshu-pro (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('mensetsu-renshu-pro', 'article', '面接の練習は、プロに頼むと何が変わる？模擬面接で分かることと、頼む前の準備', '面接の練習は、ひとりでも声に出してできますが、話の長さや伝わり方は、人に聞いてもらわないと分かりにくいものです。ひとりで練習する限界、模擬面接で分かること、人材紹介会社のキャリアアドバイザーやハローワークでの面接練習、頼む前に準備することを紹介します。', '面接の準備で、想定される質問への答えを考えて、声に出して練習してみた。でも、「これで本当に伝わっているのかな」と不安が残る。そんな人は多いはずです。

先に結論を言うと、**面接の練習は、ひとりでやるより、人に聞いてもらうほうが直すところが見つかりやすくなります**。特に、転職のプロ（人材紹介会社のキャリアアドバイザーや、ハローワークの職員）に模擬面接をしてもらうと、自分では気づきにくい**話の長さ・伝わり方・応募先に合わせた答え方**が分かります。

この記事で分かること：

- ひとりで練習するときの**限界**
- 模擬面接で**分かること**
- **どこで**面接の練習を頼めるか
- 頼む**前に準備すること**と、頼み方の例

よく聞かれる質問と答え方の型は[転職の面接でよく聞かれる質問と答え方](/articles/mensetsu-yokukiku-shitsumon)、緊張したときの対処は[面接で緊張してしまうときの準備と当日の対処](/articles/mensetsu-kinchou)で紹介しています。この記事では、「人に練習を頼むと何が変わるか」に絞ります。

## ひとりで練習するときの限界

ひとりでも、答えを書き出したり、声に出したり、スマホで録音して聞き返したりする練習はできます。それだけでも、何も準備しないよりずっと落ち着いて話せます。

ただ、ひとりの練習では、次のようなことが分かりにくいままです。

- **長さがちょうどいいか**：自分では短くまとめたつもりでも、聞く側には長く感じることがある
- **相手に伝わっているか**：自分は話の流れを知っているので、説明が抜けていても気づきにくい
- **聞き返しや深掘りにどう答えるか**：「それはなぜですか？」と追加で聞かれる練習ができない
- **応募先に合った答えになっているか**：その会社や職種で何が重視されやすいかは、ひとりでは判断がつきにくい

面接は「相手に伝わるか」がすべてです。伝わり方は、実際に誰かに聞いてもらわないと確かめられません。

## 模擬面接で分かること

模擬面接は、本番と同じように質問してもらい、答えたあとに感想や直すところを教えてもらう練習です。プロに頼むと、主に次の3つが分かります。

### 1. 話の長さ

「答えが長くて、途中で何の話か分からなくなった」「短すぎて、もう少し聞きたかった」といった、聞く側の感じ方を教えてもらえます。

### 2. 伝わり方

結論が先に来ているか、言葉づかいは自然か、声の大きさや表情はどうか。自分では見えない部分を、聞いた人の目で指摘してもらえます。

たとえば、転職理由を聞かれて、こう答えたとします（仮の例）。

> 「今の職場は飲食店で、シフトが毎月変わるのですが、人が足りないときは休みの日に呼ばれることもあって、店長に相談したこともあったのですが、なかなか変わらず、それで、もう少し決まった時間で働ける仕事がいいなと思うようになって……」

模擬面接では、「不満の説明が長く、何をしたいのかが最後まで出てこない」と指摘されることがあります。直すと、次のようになります。

> 「決まった時間で働きながら、事務の仕事を長く続けたいと考えて転職を決めました。飲食店で4年接客をする中で、予約の管理や発注など、裏方の仕事にやりがいを感じたのがきっかけです。」

```figure
type: compare
style: before-after
title: 転職理由の答え方の直し方
columns:
  - label: 直す前
    tone: sand
    items:
      - 今の職場への不満から話し始める
      - 何をしたいかが最後まで出てこない
      - 一文が長く、話の区切りがない
  - label: 直したあと
    tone: mint
    items:
      - 最初に「何をしたいか」を言う
      - 今の経験とのつながりを短く添える
      - 一文を短く区切って話す
```

### 3. 応募先に合わせた答え方

同じ志望動機でも、応募先によって伝えたほうがいいことは変わります。たとえば、事務職なら「正確さ」や「段取り」、営業職なら「人と話すこと」や「目標に向けて動くこと」が話題になりやすいなど、職種や会社に合わせてどこを厚くするかを一緒に考えてもらえます。

人材紹介会社のキャリアアドバイザーは、応募先の求人を扱っているため、その会社の面接で聞かれやすいことを知っている場合もあります。「この会社の面接では、どんなことを聞かれやすいですか？」と聞いてみましょう。

## どこで頼める？

面接の練習を頼める主な相談先は、次の2つです。

**人材紹介会社のキャリアアドバイザー（転職エージェント）**

紹介を受けた求人に応募するときに、面接の準備を手伝ってもらえる場合があります。応募先に合わせた練習をしたいときに向いています。面接練習の有無や形は会社によって違うので、面談のときに「面接の練習もお願いできますか？」と確認しておきましょう。

**ハローワーク**

ハローワークでは、応募書類の作り方や面接の受け方について、無料で相談できます。担当の職員が、応募する求人に合わせた面接の受け答えについてアドバイスしてくれます。正社員を目指すおおむね35歳未満の人なら、わかものハローワークなどの若者向けの窓口で、担当者制で相談に乗ってもらえます。

模擬面接の実施の形（対面・オンラインなど）や予約の方法は、窓口ごとに違います。利用したいときは、最寄りのハローワークに問い合わせてみてください。ハローワークの使い方の全体は[ハローワークの使い方は？](/articles/hellowork-tsukaikata)にまとめています。

## 頼む前に準備すること

模擬面接は、準備してから受けるほど、もらえるアドバイスが具体的になります。

```figure
type: checklist
title: 模擬面接の前に用意するもの
items:
  - 応募先の求人票（決まっていれば）
  - 自分の履歴書・職務経歴書
  - 自己紹介・転職理由・志望動機の要点メモ
  - 特に見てほしいところ
  - 本番に近い服装や、Web面接の環境
```

答えは文章で丸暗記するより、**要点を箇条書きにしたメモ**で準備しておくのがおすすめです。模擬面接で直すところが見つかったときにも、組み立て直しやすくなります。

頼むときは、**特に見てほしいところ**を伝えると、練習の中身が濃くなります。

- 「志望動機が長くなりがちなので、短くまとまっているか見てもらえますか？」
- 「未経験の仕事を選んだ理由が、納得できる答えになっているか聞いてほしいです」
- 「緊張すると早口になるので、話すスピードも見てもらえますか？」
- 「Web面接なので、画面の映り方や声の聞こえ方も確認してもらえますか？」

## 練習のあとにやること

模擬面接が終わったら、言われたことを忘れないうちにメモしておきましょう。

1. 指摘されたことを書き出す
2. 直すところを1〜2個に絞る
3. 要点メモを書き直して、声に出してもう一度話す
4. できれば、もう一度聞いてもらう

一度に全部を直そうとすると、かえって話しにくくなります。いちばん大事なところから少しずつ直していきましょう。

### 気をつけたいこと

アドバイスは参考にしつつ、**答えは自分の言葉で話せる形にしておく**ことが大切です。言われた言い回しをそのまま覚えると、本番で少し違う聞き方をされたときに詰まりやすくなります。また、アドバイスが自分の考えと合わないと感じたら、「どうしてそのほうがいいのですか？」と理由を聞いてみましょう。納得したうえで直したほうが、本番でも自然に話せます。

## まとめ：相談の前に整理しておくこと

面接の練習は、ひとりでもできます。でも、話の長さや伝わり方、応募先に合わせた答え方は、人に聞いてもらって初めて分かることが多いものです。人材紹介会社のキャリアアドバイザーやハローワークを頼って、本番の前に一度、模擬面接を受けてみましょう。

キャリアアドバイザーへの相談を考えているなら、面談の前に次のことを整理しておくと、面接の練習まで話がつながりやすくなります。

- **これまでの経歴の事実**（いつからいつまで、どんな仕事をしていたか）
- **転職したい理由**を、ひと言で言うと何か
- **面接で不安なこと**（話が長くなる、緊張する、未経験の理由をうまく言えないなど）

面談の前に決めておくこと・決めなくていいことは、[エージェント面談の前に決めておくこと・決めなくていいこと](/articles/agent-mendan-mae)にまとめています。', 'review', false, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-10'::timestamptz, '面接の練習はプロに頼むと何が変わる？模擬面接で分かること', '面接の練習をプロに頼むと何が変わる？ひとりで練習する限界、模擬面接で分かる話の長さ・伝わり方・応募先に合わせた答え方、キャリアアドバイザーやハローワークでの面接練習の受け方、頼む前に準備することを紹介します。', array['mensetsu-yokukiku-shitsumon', 'mensetsu-kinchou', 'hellowork-tsukaikata', 'tenshoku-agent-merit', 'kigyou-erabi-soudan']::text[], '{}'::text[], array['mensetsu']::text[], '{}'::text[], array['面接の練習、', 'プロに頼むと？']::text[], null, false, '[{"q":"模擬面接は、どこで受けられますか？","a":"人材紹介会社のキャリアアドバイザー（転職エージェント）に頼める場合があるほか、ハローワークでも面接の受け答えについて無料で相談できます。正社員を目指すおおむね35歳未満の人なら、わかものハローワークなどの若者向けの窓口もあります。実施の形や予約の方法は窓口ごとに違うので、事前に問い合わせましょう。"},{"q":"応募先が決まっていなくても、面接の練習を頼めますか？","a":"頼めます。自己紹介や転職理由など、どの会社でも聞かれやすい質問の練習から始められます。応募先が決まったら、その求人票を持っていき、応募先に合わせた志望動機の練習をもう一度してもらうと、本番に近い練習になります。"},{"q":"模擬面接で言われたとおりに答えを直せば大丈夫ですか？","a":"指摘は参考にしつつ、答えは自分の言葉で話せる形にしておきましょう。言われた言い回しをそのまま覚えると、本番で少し違う聞き方をされたときに詰まりやすくなります。直すところを1〜2個に絞り、要点だけ覚えて話す練習をするのがおすすめです。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"既存の mensetsu-yokukiku-shitsumon（質問と答え方の型）と mensetsu-kinchou（緊張への準備）と役割を分け、「人に練習を頼むと何が分かるか」と「頼み方・準備」に絞る。人材紹介会社のキャリアアドバイザーとハローワークの両方を紹介し、プロに頼む練習の価値を前向きに伝える。特定の会社名・サービス名は書かない","quotes":[{"source_url":"https://www.mhlw.go.jp/stf/newpage_27742.html","text":"ハローワークでは、応募書類の作り方、面接の受け方などの個別相談やセミナーを無料で行い、担当職員が求人に合わせた書類の書き方や面接の受け答えについて助言している（mhlw.go.jp に直接接続できなかったため、検索結果に表示された同ページの内容で確認）","used_in":"どこで頼める？"},{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000181329.html","text":"わかものハローワークなどで、正社員を目指すおおむね35歳未満の若者を対象に、担当者制による職業相談などを無料で行っている（検索結果に表示された同ページの内容で確認。各地のわかものハローワークの案内では、本番を想定した模擬面接を行っている例も検索結果で確認した）","used_in":"どこで頼める？"}],"not_used":["模擬面接の回数の目安や、模擬面接を受けた人の通過率などの数字は、公的な根拠がないため書かない","自己紹介や回答の長さの「〇分が目安」は、公的な根拠を確認できなかったので書かず、「短くまとまっているか見てもらう」にとどめた","各地のハローワークの模擬面接の予約方法・回数制限・オンライン対応は施設ごとに違い、検索で見つかった案内も時期がまちまちだったため、具体的には書かず「問い合わせる」とした","人材紹介会社の面接練習は事業者によって有無や形が違うため、一般的な例として書き、最初に確認するようすすめた"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'mensetsu-renshu-pro' and c.slug = 'shorui-mensetsu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'mensetsu-renshu-pro' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ハローワークの相談支援', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_27742.html', '2026-10-10'::date, 'ハローワークで、応募書類の作り方や面接の受け方について個別相談やセミナーを無料で行い、応募する求人に合わせた面接の受け答えなどについて助言していること', 0 from articles where slug = 'mensetsu-renshu-pro';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'わかものハローワーク', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000181329.html', '2026-10-10'::date, '正社員を目指すおおむね35歳未満の若者を対象に、担当者制による職業相談などを無料で行っていること', 1 from articles where slug = 'mensetsu-renshu-pro';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'mensetsu-renshu-pro' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"4e3d207095706a69aaa28d752a8d956c753beeb71451cc7d9b5daf80327d9fbd","findings":[]}'::jsonb from articles where slug = 'mensetsu-renshu-pro';
update articles set status = 'published' where slug = 'mensetsu-renshu-pro';

-- article: mensetsu-yokukiku-shitsumon (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('mensetsu-yokukiku-shitsumon', 'article', '転職の面接でよく聞かれる質問と答え方｜自己紹介・転職理由・志望動機の型と回答例', '転職の面接で聞かれることの多くは、「何ができるか」「どのくらい入りたいか」「どんな人か」を確かめる質問です。自己紹介・転職理由・志望動機・強み弱み・未経験の仕事を選んだ理由について、答え方の型と回答例を紹介します。応募者に聞いてはいけないとされている質問の考え方も紹介します。', 'はじめての転職の面接は、「何を聞かれるんだろう」「うまく答えられなかったらどうしよう」と不安になりやすいものです。

先に結論を言うと、面接の質問はたくさんあるように見えても、多くは**「何ができるか」「どのくらい入りたいか」「どんな人か」**を確かめるためのものです。どの質問にも使える**答え方の型**をひとつ持っておくと、知らない聞き方をされても組み立て直せます。

この記事で分かること：

- 面接官が質問で**確かめたいこと**
- どの質問にも使える**答え方の型**
- 自己紹介・転職理由・志望動機・強み弱み・未経験の仕事を選んだ理由の**回答例**（仮の例）
- 応募者に**聞いてはいけない**とされている質問の考え方

## 面接官は、何を知りたい？

ハローワークの面接対策の資料では、面接に決まったマニュアルはなく、答える内容は一人ひとり違うとしたうえで、企業は**能力・適性・経験**や**意欲**を見ていると説明しています。よく聞かれる質問を、確かめたいことと並べると次のようになります。

| よく聞かれる質問 | 面接官が確かめたいこと |
| --- | --- |
| 自己紹介をお願いします | 経歴の大まかな流れ、話し方や人柄 |
| なぜ転職を考えたのですか | 同じ理由ですぐ辞めないか、前向きに動いているか |
| なぜこの会社に応募したのですか | 会社や仕事をどのくらい調べ、理解しているか |
| あなたの強みと弱みは | 自分のことを客観的に見られているか |
| なぜ未経験の仕事を選んだのですか | 仕事の中身を知ったうえで選んでいるか |
| 入社後にやりたいことは | 入ってからの姿が具体的に想像できているか |

「正しい答え」を当てる試験ではありません。**自分の経験を材料に、質問の奥にあることに答える**と考えると、準備しやすくなります。

## どの質問にも使える「答え方の型」

答えるときは、次の順番を意識すると、短く、伝わりやすくまとまります。

```figure
type: steps
title: どの質問にも使える答え方の型
items:
  - label: 結論
    text: 聞かれたことに、最初にひとことで答える
  - label: 具体例
    text: そう言える理由を、経験やエピソードで話す
  - label: これから
    text: 応募先の仕事でどう活かすか、何をしたいか
```

いちばん大事なのは**最初の「結論」**です。エピソードから話し始めると、何の話か分からないまま長くなりがちです。結論を言ってから理由を足し、最後に「だから御社で〇〇したい」とつなげます。

## 質問別の答え方と回答例

ここからの回答例は、接客・販売のアルバイトから事務職やカスタマーサポートに応募する場合の**仮の例**です。自分の経験に置き換えて使ってください。

### 自己紹介

自己紹介は、名前に続けて「これまでの経歴の要点」と「今回応募した理由をひとこと」を話します。時間を指定されたらそれに合わせ、指定がなければ短くまとめて、詳しいことは次の質問で話せば大丈夫です。

> 「〇〇と申します。大学卒業後、カフェでアルバイトとして働き、接客のほかに、新人スタッフへの仕事の教え方やシフト表の作成も担当してきました。お客様やスタッフから相談を受けることが多く、人の困りごとを聞いて整理する仕事をしたいと考え、今回応募いたしました。本日はよろしくお願いいたします。」

### 転職理由（退職理由）

不満がきっかけでも、**「次に何をしたいか」**に言い換えて話します。前の職場の悪口にならないように気をつけましょう。

> 「接客の仕事を続ける中で、お客様の困りごとを聞いて解決することにやりがいを感じるようになりました。その経験を、問い合わせ対応を専門にする仕事で深めたいと考え、転職を決めました。」

言い換えのしかたは、[転職回数が気になるときに整理したいこと](/articles/tenshoku-kaisu-kininaru)の説明の型も参考になります。

### 志望動機

志望動機は「この仕事を選んだ理由」と「この会社を選んだ理由」の両方が入っていると、説得力が増します。

> 「御社の求人で、未経験で入った方が先輩について電話対応から始めると知り、教わりながら一つずつ覚えられる環境だと感じました。接客で身につけた、相手の話を最後まで聞く姿勢を、お客様からの問い合わせ対応で活かしたいと考えています。」

組み立て方は[未経験職種の志望動機、何を書けばいい？](/articles/shiboudouki-mikeiken)でくわしく紹介しています。

### 強み（長所）

強みは**ひとつに絞って、エピソードで裏づけ**ます。ハローワークの資料でも、自己PRには具体的な根拠やエピソード（上司やお客様からの評価など）を入れるとよいとされています。

> 「私の強みは、相手に合わせて説明を変えられることです。アルバイトで新人スタッフに仕事を教える担当をしていたとき、覚え方は人によって違うと気づき、口で説明するだけでなく、手順を紙にまとめて渡すようにしました。店長からは『教え方が分かりやすい』と言ってもらえました。」

接客の経験をどう言葉にするか迷うときは、[接客経験は転職でどう活かせる？](/articles/sekkyaku-keiken-ikasu)も参考にしてください。

### 弱み（短所）

弱みは、仕事に大きく差し支えるものを避け、**「気をつけていること」とセット**で話します。

> 「心配性なところがあり、確認に時間をかけすぎてしまうことがあります。今は、確認する項目を先にメモに書き出し、それが終わったら次に進むようにしています。」

「弱みはありません」と答えると、自分を見つめ直していない印象になりやすいので、ひとつは用意しておきましょう。

### なぜ未経験の仕事を選んだのですか

未経験の転職では、聞かれることが多いと考えて準備しておきたい質問です。**仕事の中身を調べたうえで選んだこと**と、**今の経験との接点**を話します。

> 「事務の仕事は未経験ですが、アルバイトではレジ締めや発注の数量入力を担当していて、数字を正確に扱うことにやりがいを感じていました。事務の求人を調べる中で、毎日の入力や書類の確認が仕事の中心だと知り、自分に合っていると考えました。今は表計算ソフトの基本操作を練習しています。」

「なんとなく興味があって」だけで終わらせず、**調べて分かったこと**と**今やっている準備**を入れると、本気度が伝わります。

### 入社後にやりたいこと

入社後のことは、遠い目標より「最初の数か月で何をできるようになりたいか」を具体的に話すほうが伝わりやすいです。

> 「まずは研修で教わる仕事を早く一人でできるようになりたいです。そのうえで、よくある問い合わせをまとめて、ほかの方にも共有できるようになりたいと考えています。」

## 答えに詰まったときの言い方

想定していなかった質問をされても、黙り込む必要はありません。次のような言い方で、考える時間をもらえます。

- 「少し考えてからお答えしてもよろしいでしょうか」
- 「〇〇ということでしょうか」（質問の意味を確かめる）
- 「うまくまとまっていないのですが、〇〇だと考えています」

分からないことを知っているふりをするより、正直に言ってから答えるほうが、落ち着いた印象になります。

## 応募者に聞いてはいけない質問もある

厚生労働省は、採用選考は応募者の適性・能力にもとづいて行うべきだとしています。そのため、次のような**本人の適性・能力に関係のないこと**を、応募書類や面接で把握することは、就職差別につながるおそれがあるとしています。

- 本籍・出生地
- 家族のこと（職業・続柄・健康・収入など）
- 住宅のこと（間取り・部屋数・住宅の種類など）
- 生活環境・家庭環境
- 宗教、支持政党、人生観、尊敬する人物、思想など

こうした質問に、無理に答える必要はありません。その場では「仕事に関わることでしたら、お答えします」のように、やわらかく伝える方法もあります。気になる質問をされたときは、**最寄りのハローワークや都道府県労働局**に相談できます。

## 練習は「書類を見返す」ところから

ハローワークの資料では、面接では提出した履歴書や職務経歴書の内容をもとに質問されることが多いとして、書類のコピーを取っておき、面接の前に見直すようすすめています。

```figure
type: checklist
title: 面接の前にやっておきたい練習
items:
  - 提出した書類のコピーを読み返した
  - 質問ごとに「結論」をひとことで書き出した
  - 結論を支えるエピソードを決めた
  - 未経験の仕事を選んだ理由を声に出して話した
  - 弱みと、気をつけていることをセットにした
  - 家族など、答えなくていい質問を知っている
```

声に出して話してみると、書いたときには気づかなかった言いにくさが分かります。ひとりで練習するのが不安なら、ハローワークでは応募書類の添削や面接に向けた相談を無料で受けられます。

面接の準備全体（逆質問やオンライン面接の確認を含む）は[未経験職種の面接、何を準備する？](/articles/mensetsu-junbi-mikeiken)、働いていない期間の説明は[職歴に空白期間があるとき、面接でどう説明する？](/articles/kuhaku-kikan-setsumei)で紹介しています。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '転職の面接でよく聞かれる質問｜答え方の型と回答例', '転職の面接でよく聞かれる自己紹介・転職理由・志望動機・強みと弱み・未経験の仕事を選んだ理由の答え方を、型と回答例で紹介します。答えに詰まったときの言い方や、応募者に聞いてはいけない質問の考え方も分かります。', array['mensetsu-junbi-mikeiken', 'shiboudouki-mikeiken', 'kuhaku-kikan-setsumei', 'gyaku-shitsumon', 'taishoku-riyuu-mensetsu', 'jiko-pr-mikeiken', 'mensetsu-kinchou', 'mensetsu-renshu-pro']::text[], '{}'::text[], array['mensetsu', 'mikeiken-shokushu']::text[], array['hajimete', 'sekkyaku']::text[], array['面接の質問、', 'どう答えればいい？']::text[], null, false, '[{"q":"面接の回答は、丸暗記して臨んだほうがいいですか？","a":"文章をまるごと覚えると、少し違う聞き方をされたときに言葉が出なくなりがちです。質問ごとに「結論」と「話したいエピソード」だけを決めておき、あとは自分の言葉で話す練習をしておくほうが、落ち着いて答えやすくなります。"},{"q":"弱み（短所）を聞かれたら、何と答えればいいですか？","a":"仕事に大きく差し支えるものを避け、ひとつに絞って正直に伝えます。そのうえで「気をつけていること」をセットで話すと、自分を客観的に見られていることが伝わります。たとえば「心配性なところがあり、確認に時間をかけすぎることがあります。今は確認する項目を先に決めてから作業するようにしています」のような形です。"},{"q":"面接で家族のことや住まいのことを聞かれたら、答えないといけませんか？","a":"厚生労働省は、家族の職業や収入、住宅の状況など、本人の適性・能力に関係のないことを応募書類や面接で把握することは、就職差別につながるおそれがあるとしています。無理に答える必要はありません。気になる質問をされたときは、最寄りのハローワークや都道府県労働局に相談できます。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「よく聞かれる質問」を一覧で並べるだけでなく、面接官が確かめたいこと（できること・意欲・人柄）から逆算して、全質問に使える「結論→具体例→これから」の型を示す。未経験の仕事を選んだ理由を独立した質問として扱い、聞いてはいけない質問の考え方（公正な採用選考）で締める","quotes":[{"source_url":"https://jsite.mhlw.go.jp/osaka-hellowork/content/contents/002184437.pdf","text":"面接にマニュアルは無く、答える内容も1人ひとり異なる。企業側は「能力、適性、経験」を見ており、何ができるのか（どのような経験をし、どんな能力があるのか）、意欲（その会社にどのように貢献するのか、どのような存在になりたいのか）を伝える。自己PRには具体的な根拠やエピソード（上司や顧客からの評価など）を入れる（この環境から jsite.mhlw.go.jp に直接接続できなかったため、検索結果に表示された資料の抜粋で確認）","used_in":"面接官は、何を知りたい？／質問別の答え方と回答例"},{"source_url":"https://www.hellowork.mhlw.go.jp/doc/oubosyorui_pamphlet_202406.pdf","text":"面接では提出した履歴書・職務経歴書の内容に基づいて質問されることが多いので、完成した書類はコピーしておき、面接前に確認する（直接開けなかったため、検索結果と既存記事 mensetsu-junbi-mikeiken の記録で確認）","used_in":"練習は「書類を見返す」ところから"},{"source_url":"https://kouseisaiyou.mhlw.go.jp/consider.html","text":"就職差別につながるおそれがある14事項。本人に責任のない事項（本籍・出生地、家族、住宅状況、生活環境・家庭環境）、本来自由であるべき事項（宗教、支持政党、人生観・生活信条、尊敬する人物、思想など）を、応募用紙や面接で把握しない（直接開けなかったため、各労働局が公開している同内容の資料の検索結果で確認）","used_in":"応募者に聞いてはいけない質問もある"},{"source_url":"https://kouseisaiyou.mhlw.go.jp/jobseekers.html","text":"面接で適性・能力に関係のない質問をされ、就職差別につながると感じた場合は、最寄りのハローワークや都道府県労働局に相談できる（直接開けなかったため、愛媛労働局など各労働局の案内ページの検索結果で確認）","used_in":"応募者に聞いてはいけない質問もある／FAQ"},{"source_url":"https://www.mhlw.go.jp/content/11600000/001441500.pdf","text":"ハローワークでは応募書類の作成方法などのセミナーを実施し、希望に応じて応募書類の添削や面接に向けた相談も行っている。利用は無料（直接開けなかったため、検索結果の抜粋で確認）","used_in":"練習は「書類を見返す」ところから"}],"not_used":["「自己紹介は1分程度」「転職理由を重視する企業は約85%」などの時間・割合は、公的な根拠を確認できなかったので書かない","よく聞かれる質問のランキングは、調査の出どころが確認できないので使わない","「その質問は違法です」と面接官に指摘するような対応は、法的な線引きを断定できないため書かず、相談先の案内にとどめた"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'mensetsu-yokukiku-shitsumon' and c.slug = 'shorui-mensetsu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'mensetsu-yokukiku-shitsumon' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ハローワーク布施 面接対策セミナー', '大阪労働局 ハローワーク布施', 'https://jsite.mhlw.go.jp/osaka-hellowork/content/contents/002184437.pdf', '2026-10-09'::date, '面接に決まったマニュアルはなく、答える内容は一人ひとり違うこと。企業は能力・適性・経験や意欲を見ていること。自己PRには具体的な根拠やエピソードを入れること', 0 from articles where slug = 'mensetsu-yokukiku-shitsumon';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '応募書類（パンフレット）', 'ハローワークインターネットサービス（厚生労働省）', 'https://www.hellowork.mhlw.go.jp/doc/oubosyorui_pamphlet_202406.pdf', '2026-10-09'::date, '面接では提出した応募書類の内容をもとに質問されることが多いので、書類のコピーを取り、面接の前に見直すこと', 1 from articles where slug = 'mensetsu-yokukiku-shitsumon';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '採用選考時に配慮すべき事項（公正採用選考特設サイト）', '厚生労働省', 'https://kouseisaiyou.mhlw.go.jp/consider.html', '2026-10-09'::date, '本籍・出生地、家族、住宅状況、生活環境・家庭環境、宗教、支持政党などを応募書類や面接で把握することは、就職差別につながるおそれがあるとされていること', 2 from articles where slug = 'mensetsu-yokukiku-shitsumon';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '求職者の皆様へ（公正採用選考特設サイト）', '厚生労働省', 'https://kouseisaiyou.mhlw.go.jp/jobseekers.html', '2026-10-09'::date, '不適切な質問をされたときに、ハローワークや都道府県労働局に相談できること', 3 from articles where slug = 'mensetsu-yokukiku-shitsumon';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ハローワークのご案内（リーフレット）', '厚生労働省', 'https://www.mhlw.go.jp/content/11600000/001441500.pdf', '2026-10-09'::date, 'ハローワークで、応募書類の添削や面接に向けた相談を無料で受けられること', 4 from articles where slug = 'mensetsu-yokukiku-shitsumon';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'mensetsu-yokukiku-shitsumon' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"a927fb3d9313ebca8ea1ad8345075d9a2aa87672afbe014c842961fe0ac2c871","findings":[]}'::jsonb from articles where slug = 'mensetsu-yokukiku-shitsumon';
update articles set status = 'published' where slug = 'mensetsu-yokukiku-shitsumon';

-- article: mikeiken-it-hajimari (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('mikeiken-it-hajimari', 'article', '未経験のIT、どんな仕事から始まる？入口になりやすい仕事と入社前の確認', 'ITの仕事はプログラミングだけではありません。未経験から検討しやすいのは、ヘルプデスク、運用・管理（監視など）、テストのように、システムを支えたり確かめたりする仕事です。それぞれの仕事内容と、研修・勤務時間・働く場所など入社前に確認したいこと、ITパスポートの考え方を紹介します。', '「ITの仕事に興味はあるけど、プログラミングはしたことがない」。そんなときにまず知っておきたいのは、ITの仕事は「作る」だけではないということです。

未経験の人が検討しやすいのは、**ヘルプデスク、運用・管理（監視など）、テスト**のように、システムを支えたり確かめたりする仕事です。ただし、どこから始められるかは会社によって違うので、仕事の中身と入社後の育て方を確認することが大切です。

## 「IT＝プログラミング」だけじゃない？

厚生労働省の職業情報提供サイト「job tag」の「IT関連の仕事（工程別）」では、ITの仕事を工程ごとに分けて紹介しています。システムを企画したり作ったりする仕事のほかに、できあがったシステムを**動かし続ける・使う人を支える**「運用・保守」の仕事があり、ヘルプデスクや運用・管理の仕事はここに入ります。

```figure
type: compare
title: ITの仕事は「作る」だけじゃない
columns:
  - label: 作る仕事
    tone: sky
    items:
      - システムを企画する
      - システムを作る
  - label: 動かし続ける・支える仕事
    tone: mint
    items:
      - ヘルプデスク
      - 運用・管理（監視など）
```

プログラムを書く仕事に興味がある人も、まずはこうした仕事でITに触れながら、知識を少しずつ増やしていく道があります。

## 入口になりやすいのは、どんな仕事？

| 仕事 | 主にすること | 合いやすいかもしれない人 |
| --- | --- | --- |
| ヘルプデスク（ITサポート） | 「動かない」「分からない」という問い合わせに、電話・メール・訪問で応える | 困っている人の話を聞いて、順を追って説明するのが苦にならない |
| 運用・管理（監視など） | サーバーやシステムが止まらないよう見守り、異常があれば手順に沿って連絡・対応する | 決まった手順を正確に続けられる |
| テスト（デバッグ） | ソフトウェアが正しく動くかを確かめ、見つけた不具合（バグ）を一覧にして開発担当者に伝える | 細かい違いに気づける。同じ確認をくり返せる |

ヘルプデスクには、社員からの問い合わせに応える**社内向け**と、お客さまからの問い合わせに応える**社外向け**があります。社内向けでは、パソコンの初期設定やアカウントの管理を任される会社もあります。

このほか、IT部門の事務やデータ入力から入り、担当を少しずつ広げていく会社もあります。職種名だけで判断せず、「1日のうち何をする時間が長いか」を確認しましょう。ITサポートの仕事内容は[ITサポートの職種ページ](/jobs/it-support)でもまとめています。

## 入社前に確認したいことは？

未経験で入るときは、次の4つを確認しておくと安心です。

- **研修**: 何を、どのくらいの期間学ぶのか。一人で対応するようになるのはいつごろか
- **勤務時間**: システムを夜も止められない職場では、交替制のシフトや夜勤がある場合があります。問い合わせ窓口も、受付時間に合わせたシフト制のことがあります
- **働く場所**: 会社によっては、お客さまの会社に常駐して働く場合もあります。2024年4月からは、求人の募集時などに「就業場所の変更の範囲」も示されるようになったので、あわせて確認しましょう
- **その後の道筋**: 経験を積んだ人が、どんな仕事に進んでいるか

```figure
type: checklist
title: IT未経験で入社前に確認したい4つ
items:
  - 研修で何をどのくらい学び、いつ一人で対応するか
  - 交替制のシフトや夜勤があるか
  - お客さまの会社に常駐して働く場合があるか
  - 経験を積んだ人が、どんな仕事に進んでいるか
```

面接では、こんな聞き方ができます。

- 未経験で入社した方は、どのくらいで一人で問い合わせに対応していますか
- 夜勤や土日の勤務はありますか。ある場合、月に何回くらいですか
- 勤務先は自社ですか。それとも、お客さまの会社に常駐しますか
- この仕事を経験したあと、どのような仕事に進む方が多いですか

研修の確かめ方は[未経験求人の「研修あり」で確認すべきこと](/articles/mikeiken-kenshu-kakunin)でくわしく紹介しています。

## ITパスポートは取ったほうがいい？

応募条件に書かれていなければ、資格がなくても応募できます。

ITパスポート試験は、情報処理推進機構（IPA）が実施する国家試験で、社会人が備えておきたいITの基礎知識を問うものです。受験資格はなく、コンピュータで受けるCBT方式で、随時実施されています。

資格は「持っていないと入れないもの」ではなく、**勉強の目標を決めるための目安**と考えると気が楽になります。面接で「今ITパスポートの勉強をしていて、ネットワークの基本を覚えているところです」のように話せれば、入社後も学び続けるつもりがあることが伝わりやすくなります。

## 接客の経験はつながる？

ヘルプデスクの仕事は、相手の困りごとを聞き取り、分かりやすく説明するところが接客と似ています。「お客さまの話を最後まで聞いてから案内していた」「新人にレジの操作を教えていた」といった経験は、言葉にしておきましょう。

自分に合うかを考えるときは、スマホやパソコンで困ったときに自分で調べて直した経験を思い出してみてください。調べることが苦にならないかどうかは、ITの仕事との相性を考えるヒントになります。ほかの職種との違いは[営業・カスタマーサポート・ITサポートの違い](/articles/eigyo-cs-it-support-chigai)で比べられます。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['eigyo-cs-it-support-chigai', 'mikeiken-kenshu-kakunin', 'pc-nigate-jimu', 'programmer-mikeiken']::text[], array['it-support']::text[], array['mikeiken-shokushu']::text[], array['pc-mikeiken', 'hajimete']::text[], array['未経験のIT、', '最初はどんな仕事？']::text[], null, false, '[{"q":"ITパスポートを持っていないと、ITの仕事に応募できませんか？","a":"応募条件に書かれていなければ、資格がなくても応募できます。ITパスポート試験は受験資格のない国家試験なので、ITの基礎を学ぶときの目標として使うのは一つの方法です。"},{"q":"夜勤がある仕事は避けたほうがいいですか？","a":"一概には言えません。システムを夜も止められない職場では、交替制のシフトや夜勤がある場合があります。夜勤の回数、手当、休みの取り方を確認して、自分の生活に合うかどうかで判断しましょう。"},{"q":"パソコンが得意じゃなくても、ITの仕事を目指せますか？","a":"入社後に覚えることは多いので、研修の内容や、一人で対応するようになるまでの期間を確認しておくことが大切です。スマホやパソコンで困ったときに自分で調べる習慣をつけておくと、入社後の負担が軽くなります。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「IT＝プログラミング」の思い込みをほどき、未経験の入口になりやすい支える仕事と、入社前の確認点（研修・勤務時間・働く場所・その後）を示す。資格は必須扱いしない","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/User/ITRelatedWorkByProcess","text":"IT関連の仕事を工程別（企画・営業・設計や構築・運用や保守など）に分けて紹介。運用・保守には「運用・管理（IT）」（サーバーや情報システムがトラブルや不具合で止まらず安定して動き続けるよう運用・管理する）と「ヘルプデスク（IT）」が含まれる。","used_in":"「IT＝プログラミング」だけじゃない？／入口になりやすいのは、どんな仕事？"},{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/540","text":"ソフトウェアの誤り（バグ）を見つける仕事。見つかったバグを一覧表にまとめて開発担当者に連絡する。QAテスターなどの名称もある。","used_in":"入口になりやすいのは、どんな仕事？"},{"source_url":"https://www.ipa.go.jp/shiken/kubun/ip.html","text":"ITパスポート試験はIPAが実施する国家試験で、職業人が共通に備えておくべきITに関する基礎的な知識を対象とする。CBT方式で随時実施。受験資格の制限はない。","used_in":"ITパスポートは取ったほうがいい？"},{"source_url":"https://www.mhlw.go.jp/stf/newpage_32105.html","text":"2024年4月1日から職業安定法施行規則の改正により、求職者に明示する労働条件に就業場所・業務の変更の範囲などが追加された。","used_in":"入社前に確認したいことは？"}]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'mikeiken-it-hajimari' and c.slug = 'shokushu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'mikeiken-it-hajimari' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'IT関連の仕事（工程別）－知らない職業を探してみよう－', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/ITRelatedWorkByProcess', '2026-10-06'::date, 'ITの仕事を工程別に分けていること、運用・保守の工程にヘルプデスク（IT）と運用・管理（IT）があること、運用・管理（IT）とヘルプデスク（IT）の仕事内容（問い合わせに電話・メール・訪問で対応する等）', 0 from articles where slug = 'mikeiken-it-hajimari';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'デバッグ作業 - 職業詳細（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/540', '2026-10-06'::date, 'テスト（デバッグ）の仕事内容（不具合を見つけて一覧にし、開発担当者に伝える）', 1 from articles where slug = 'mikeiken-it-hajimari';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ITパスポート試験', '独立行政法人情報処理推進機構（IPA）', 'https://www.ipa.go.jp/shiken/kubun/ip.html', '2026-10-06'::date, 'ITパスポート試験がIPAの実施する国家試験であること、ITの基礎知識を問うこと、CBT方式で随時実施されること', 2 from articles where slug = 'mikeiken-it-hajimari';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年4月から労働条件明示のルールが変わります', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_32105.html', '2026-10-06'::date, '2024年4月から、募集時などに就業場所・業務の変更の範囲が明示されるようになったこと', 3 from articles where slug = 'mikeiken-it-hajimari';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'mikeiken-it-hajimari' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"cdd32cf2c01685927695e597815220e422e0abc8b978a2406d09660d98070178","findings":[]}'::jsonb from articles where slug = 'mikeiken-it-hajimari';
update articles set status = 'published' where slug = 'mikeiken-it-hajimari';

-- article: mikeiken-kenshu-kakunin (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('mikeiken-kenshu-kakunin', 'article', '未経験求人の「研修あり」で確認すべきこと｜期間・内容・その後のフォロー', '「研修制度あり」「未経験でも安心」と書かれた求人でも、研修の中身は会社によって大きく違います。期間・形式・教える人・研修後のフォローなど、応募前や面接で確認したいポイントを質問例つきでまとめました。', '未経験歓迎の求人には、「研修制度あり」「未経験でも安心のサポート体制」といった言葉がよく並んでいます。けれど、研修の中身は会社によってまったく違います。

1か月かけて座学で基礎を学ぶ会社もあれば、初日から現場に出て先輩の横で覚えていく会社もあります。どちらが良い悪いではなく、**自分に合ったやり方かどうか**を入社前に確かめておくことが大切です。

```figure
type: compare
title: 研修のやり方は会社によって違う
columns:
  - label: 座学で基礎から
    tone: sky
    items:
      - 1か月かけて座学で基礎を学ぶ
  - label: 現場で覚えていく
    tone: sand
    items:
      - 初日から現場に出て、先輩の横で覚える
```

## 「研修あり」の中身は大きく4つに分かれる

研修について確認するときは、次の4つの観点で聞くと全体像がつかみやすくなります。

| 観点 | 確認したいこと |
| --- | --- |
| 期間 | 研修は何日・何週間・何か月か。一人で業務を任されるのはいつごろか |
| 形式 | 座学・eラーニング・先輩との同行（OJT）など、どの形で学ぶか |
| 教える人 | 研修担当者がいるのか、配属先の先輩が教えるのか |
| その後のフォロー | 研修が終わったあと、相談できる人や定期的な面談があるか |

特に見落としやすいのが**研修後のフォロー**です。研修期間中は手厚くても、配属されたあとに相談できる相手がいないと、未経験から入った人は戸惑いやすくなります。

## 面接や面談で使える質問例

研修について聞くときは、具体的な場面をイメージできる質問にすると答えをもらいやすくなります。

- 入社後、最初の1か月はどのようなスケジュールで過ごすことが多いですか
- 未経験で入社した方は、どのくらいの期間で一人で担当を持つことが多いですか
- 研修はどなたが担当されますか。配属後に分からないことがあったときは、どなたに相談できますか
- 研修で使うマニュアルや教材はありますか
- 未経験で入社した方が、つまずきやすいのはどんな点ですか

最後の質問は特におすすめです。会社がどれだけ未経験者の受け入れに慣れているかが見えやすくなります。

## 新卒者等向けの募集では「職場情報」を確認できる

若者雇用促進法では、新卒者等を対象にした募集を行う会社に対して、職場情報を提供するしくみが設けられています。提供される情報には、**研修の有無及び内容**や、平均勤続年数などが含まれます。

既卒・第二新卒の人も、応募する求人が新卒者等を対象にした募集であれば、こうした情報を確認できる場合があります。一方で、中途採用の求人はこのしくみの対象外のこともあるため、気になる点は面接や人材紹介会社の担当者を通じて直接確認しましょう。

## 研修期間中の条件も確認しておく

研修と一緒に確認しておきたいのが、研修期間や試用期間中の労働条件です。

- 試用期間はあるか、ある場合は何か月か
- 試用期間中の給与や待遇は、本採用後と同じか
- 研修の場所や勤務時間は、通常の勤務と違うか

研修のために本社や別の拠点へ通う期間がある会社もあります。通勤の負担が変わることもあるので、勤務地とあわせて確認しておくと安心です。

## 「研修が短い＝悪い会社」ではない

最後に、誤解されやすい点をひとつ。研修期間が短いことは、必ずしも悪いことではありません。仕事内容がシンプルで、現場で覚えたほうが早い職種もあります。

大事なのは、研修の長さよりも「分からないことを聞ける環境があるか」と「自分が安心して覚えられるやり方か」です。自分がどんな学び方だと力を発揮しやすいかを考えておくと、研修の説明を聞いたときに判断しやすくなります。

```figure
type: checklist
title: 研修の長さより大事なこと
items:
  - 分からないことを聞ける環境があるか
  - 自分が安心して覚えられるやり方か
```

研修以外に面談で確認したいことは、[エージェント面談前に決めておくこと・決めなくていいこと](/articles/agent-mendan-mae)にまとめています。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['eigyo-cs-it-support-chigai', 'agent-mendan-mae', 'mikeiken-tenshoku-hajimekata']::text[], '{}'::text[], array['mikeiken-shokushu', 'mensetsu']::text[], array['dainishinsotsu', 'hajimete']::text[], array['「研修あり」の求人、', '何を確かめる？']::text[], null, true, '[{"q":"研修について質問すると、やる気がないと思われませんか？","a":"聞き方次第です。「早く一人前になりたいので、最初の数か月でどんなことを学ぶのか知りたい」のように、前向きな理由を添えて聞けば、意欲の表れとして受け取られることが多いです。"},{"q":"研修期間中の給与は、通常と違うことがありますか？","a":"会社によっては、研修期間や試用期間中の給与や待遇が本採用後と異なる場合があります。求人票や労働条件の説明で、期間と条件を確認しておきましょう。"}]'::jsonb, null, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'mikeiken-kenshu-kakunin' and c.slug = 'junbi' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'mikeiken-kenshu-kakunin' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職場情報の提供制度', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000122234.html', '2026-10-06'::date, '若者雇用促進法にもとづく職場情報（研修の有無及び内容など）の提供', 0 from articles where slug = 'mikeiken-kenshu-kakunin';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年4月から労働条件明示のルールが変わります', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_32105.html', '2026-10-06'::date, '試用期間や業務の変更の範囲など、明示される労働条件の確認', 1 from articles where slug = 'mikeiken-kenshu-kakunin';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'mikeiken-kenshu-kakunin' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"d39860228964ecca491787762e4d4293b7c21cafb1a4b22efb840dc640a079fd","findings":[]}'::jsonb from articles where slug = 'mikeiken-kenshu-kakunin';
update articles set status = 'published' where slug = 'mikeiken-kenshu-kakunin';

-- article: mikeiken-shikaku (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('mikeiken-shikaku', 'article', '未経験の転職に資格は必要？取る前に考えたいことと、職種別に検討されやすい資格の例', '未経験の転職では、資格があれば採用されるわけではありません。大事なのは、目指す仕事で「なくては働けない資格」か「あると役立つ資格」かを見分けることです。資格より先に考えたいこと、MOS・日商簿記・ITパスポート・介護職員初任者研修などの例、取る前に確認することを紹介します。', '「未経験の仕事に応募するなら、何か資格を取っておいたほうがいい？」。転職を考え始めると、まず資格の勉強から始めようとする人は多いです。

先に結論を言うと、**資格があれば未経験でも採用される、というわけではありません**。大事なのは、目指す仕事で**「なくては働けない資格」なのか、「あると役立つ資格」なのか**を見分けることです。そのうえで、取るかどうか、いつ取るかを決めましょう。

この記事で分かること：

- 資格より**先に考えたいこと**
- 「なくては働けない資格」と「あると役立つ資格」の**違い**
- 職種別に検討されやすい**資格の例**
- 資格を**取る前に確認すること**

## 資格より先に考えたいこと

資格の勉強を始める前に、次の2つを先に考えておくと、遠回りを防げます。

### 1. どの仕事を目指すかを決める

「とりあえず役に立ちそうだから」と資格を選ぶと、取ったあとに応募したい仕事とつながらないことがあります。先に、**どの職種の求人に応募したいか**を決め、その仕事でどんな知識が使われるかを調べましょう。厚生労働省の職業情報提供サイト（job tag）では、職種ごとに仕事内容や関連する資格を調べられます。

やりたい仕事がまだ決まらないときは、気になる職種をいくつか挙げて、仕事内容を読み比べるところから始めましょう。

### 2. 今までの経験を言葉にする

未経験の職種への応募でも、面接で聞かれるのは資格だけではありません。アルバイトや接客で身につけたこと、仕事への向き合い方も見られています。たとえば事務職について、job tag では、一般事務は入職に学歴や資格は特に必要とされないと紹介されています。

資格の勉強と並行して、これまでの経験を書類に書ける形にしておきましょう。書き方は[履歴書に書くことがないと思ったとき](/articles/rirekisho-kakukoto-nai)で紹介しています。

## 「なくては働けない資格」と「あると役立つ資格」

資格には、大きく分けて2つの種類があります。

```figure
type: compare
title: 資格の2つの種類
columns:
  - label: なくては働けない資格
    tone: coral
    items:
      - その資格がないと、その仕事に就けない
      - 求人の「必須」欄に書かれる
      - 例：訪問介護員の介護職員初任者研修
  - label: あると役立つ資格
    tone: mint
    items:
      - なくても応募できる
      - 求人の「歓迎」「優遇」欄に書かれる
      - 例：事務職のMOSや日商簿記
```

たとえば、利用者の自宅を訪ねる訪問介護員（ホームヘルパー）として働くには、介護職員初任者研修の修了が必要です。こうした仕事を目指すなら、資格の取得は避けて通れません。

一方、事務職のように、資格がなくても応募できる仕事では、資格は**知識の証明や、勉強していることを伝える材料**になります。資格よりも、実際に使えるかどうかを面接で聞かれることもあります。

## 職種別に検討されやすい資格の例

ここでは、未経験の転職でよく名前が挙がる資格を、職種ごとに紹介します。取るかどうかは、応募したい求人の内容を見て決めましょう。

| 目指す職種 | 資格の例 | どんな場面で役立つ？ |
| --- | --- | --- |
| 一般事務 | MOS（マイクロソフト オフィス スペシャリスト） | ExcelやWordの操作ができることを伝える |
| 経理事務 | 日商簿記検定 | お金の出入りを記録するしくみを理解していることを伝える |
| ITサポート | ITパスポート試験 | ITの基礎知識を学んだことを伝える |
| 介護職 | 介護職員初任者研修 | 介護の基本を学んだ証明。訪問介護では必須 |

### 事務職：MOSと日商簿記

job tag では、一般事務の関連資格としてMOSや秘書検定などが、経理事務の関連資格として日商簿記検定などが挙げられています。一般事務では、仕事によってパソコンの操作や簿記の知識が求められる場合もあるとされています。

PCの操作に自信がない人は、資格の前に、よく使う操作を練習しておくのも一つの方法です。[PCが得意じゃなくても、事務職は目指せる？](/articles/pc-nigate-jimu)で、練習のしかたを紹介しています。

### ITサポート：ITパスポート試験

ITパスポート試験は、ITに関する基礎的な知識を証明する国家試験で、受験資格はありません。情報処理推進機構（IPA）は、2027年度から新しい試験制度に移る予定だと案内しているので、受ける前に公式サイトで最新の試験の内容を確認しましょう。IT系の入口になりやすい仕事は、[未経験のIT、どんな仕事から始まる？](/articles/mikeiken-it-hajimari)にまとめています。

### 介護職：介護職員初任者研修

介護職員初任者研修は、介護の基本的な知識と技術を学ぶ研修です。訪問介護で働くには修了が必要です。施設で働く場合は、応募資格の欄で、資格がなくても応募できるか、入社後に研修を受ける形かを確認しましょう。

## 取る前に確認すること

資格の勉強には、時間もお金もかかります。申し込む前に、次のことを確認しておきましょう。

```figure
type: checklist
title: 資格を取る前に確認すること
items:
  - 応募したい求人で「必須」か「歓迎」か
  - 求人に資格名が書かれているか
  - 受験料・講座代はいくらか
  - 勉強にどのくらいの期間がかかりそうか
  - 試験の日程や申し込みの締め切り
  - 取ったあと、面接でどう話すか
```

いちばん手軽な確認方法は、**応募したい求人を何件か読んで、資格名が書かれているかを数えてみる**ことです。「歓迎」欄によく出てくる資格は検討する価値がありますが、ほとんど書かれていないなら、資格より先に応募書類の準備を進めたほうが早いこともあります。

### 勉強中でも書類に書ける

資格を取り終える前に応募を始めてもかまいません。履歴書の資格欄や自己PRには、たとえば次のように書けます。

> 日商簿記検定3級 取得に向けて勉強中（〇年〇月受験予定）

取得していない資格を、取得済みのように書くのはやめましょう。

## 講座代の負担を軽くする制度

国には、仕事に役立つ講座の受講費用の一部を支給する**教育訓練給付制度**があります。専門実践教育訓練・特定一般教育訓練・一般教育訓練の3つの種類があり、対象の講座は厚生労働省の検索システムで調べられます。

雇用保険に入っていた期間などの条件があるので、使えるかどうかは申し込む前にハローワークで確認しましょう。種類ごとの違いや申し込みの流れは、[教育訓練給付金の使い方](/articles/kyouiku-kunren-kyufu-tsukaikata)で紹介しています。

資格は、目指す仕事に近づくための道具のひとつです。「何の資格を取るか」から考えるのではなく、「どの仕事に就きたいか」から逆算して、必要なものから順に準備していきましょう。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '未経験の転職に資格は必要？選び方と職種別の例', '未経験の転職に資格は必要？「なくては働けない資格」と「あると役立つ資格」の違い、資格より先に考えたいこと、MOS・日商簿記・ITパスポート・介護職員初任者研修など職種別の例、取る前に確認することと教育訓練給付制度を紹介します。', array['pc-nigate-jimu', 'kyouiku-kunren-kyufu-tsukaikata', 'rirekisho-kakukoto-nai', 'keiri-mikeiken', 'kaigo-mikeiken']::text[], array['jimu', 'it-support']::text[], array['mikeiken-shokushu']::text[], array['hajimete', 'pc-mikeiken']::text[], array['未経験の転職、', '資格は取るべき？']::text[], null, false, '[{"q":"資格がないと、未経験の職種には応募できませんか？","a":"職種によります。厚生労働省の職業情報提供サイト（job tag）では、一般事務は入職に学歴や資格は必要とされないと紹介されています。一方、訪問介護員（ホームヘルパー）のように、介護職員初任者研修の修了が必要な仕事もあります。応募したい求人の「応募資格」「必須」「歓迎」の欄を見て判断しましょう。"},{"q":"勉強中の資格は、履歴書に書いてもいいですか？","a":"書いてかまいません。資格欄や自己PRに「日商簿記3級の取得に向けて勉強中（〇年〇月受験予定）」のように書くと、仕事に向けて準備していることが伝わります。取得していない資格を取得済みのように書くのはやめましょう。"},{"q":"資格の講座代を、国の制度で補助してもらえますか？","a":"雇用保険に入っていた期間などの条件を満たすと、厚生労働大臣が指定した講座を受けて修了したときに、費用の一部が教育訓練給付金として支給される制度があります。対象になる講座は厚生労働省の検索システムで調べられます。自分が条件を満たすかは、申し込む前にハローワークで確認しましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「資格を取れば未経験でも採用される」という期待をほどき、目指す職種で「必須の資格」と「あると役立つ資格」を分けて考える順番を示す。資格の例は job tag の関連資格欄や公式情報で確認できたものに絞る","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/428","text":"入職に学歴や資格は特に必要とされない。事務処理の高度化、専門化により、パソコンスキル、文書作成能力、簿記、英会話など業務に関連のある技能や資格が求められる場合もある。関連資格として、ビジネス・キャリア検定、コンピュータサービス技能評価試験、秘書検定、マイクロソフトオフィススペシャリスト（MOS）（job tag へ直接接続できなかったため、検索結果に表示されたページ内容で確認）","used_in":"資格より先に考えたいこと / 職種別に検討されやすい資格の例"},{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/430","text":"関連資格として「日商簿記検定」「簿記能力検定」があり、取得していると仕事の役に立つ（検索結果で確認）","used_in":"職種別に検討されやすい資格の例"},{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/133","text":"訪問介護員になるには「介護職員初任者研修課程」を修了する必要がある（検索結果で確認）","used_in":"「なくては働けない資格」と「あると役立つ資格」"},{"source_url":"https://www.ipa.go.jp/shiken/kubun/ip.html","text":"ITパスポート試験は、ITに関する共通的な基礎知識を証明する国家試験。受験資格は特にない。CBT方式で随時実施。2027年度から新試験制度に移行する予定（ipa.go.jp へ直接接続できなかったため、検索結果に表示された内容で確認）","used_in":"職種別に検討されやすい資格の例"},{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/jinzaikaihatsu/kyouiku.html","text":"教育訓練給付には専門実践教育訓練、特定一般教育訓練、一般教育訓練の3種類があり、対象講座は厚生労働大臣指定教育訓練講座検索システムで検索できる。支給には雇用保険の被保険者期間などの要件がある（検索結果で確認）","used_in":"講座代の負担を軽くする制度"}],"not_used":["各資格の合格率・学習時間の目安・受験料は、年度や回によって変わり、公式情報を今回すべて確認できなかったため書かない","教育訓練給付金の支給率・上限額は、種類や受講開始日で変わるため本文では書かず、既存記事へのリンクにとどめた","「資格があると年収が上がる」といった効果は公的な根拠を確認できなかったので書かない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'mikeiken-shikaku' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'mikeiken-shikaku' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '一般事務 - 職業詳細（職業情報提供サイト job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/428', '2026-10-09'::date, '一般事務は入職に学歴や資格は必要とされないこと、パソコンスキルや簿記などが求められる場合もあること、関連資格としてMOS・秘書検定などが挙げられていること', 0 from articles where slug = 'mikeiken-shikaku';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '経理事務 - 職業詳細（職業情報提供サイト job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/430', '2026-10-09'::date, '経理事務の関連資格として日商簿記検定・簿記能力検定が挙げられ、取得していると仕事の役に立つとされていること', 1 from articles where slug = 'mikeiken-shikaku';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '訪問介護員/ホームヘルパー - 職業詳細（職業情報提供サイト job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/133', '2026-10-09'::date, '訪問介護員になるには介護職員初任者研修課程の修了が必要なこと', 2 from articles where slug = 'mikeiken-shikaku';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ITパスポート試験', '独立行政法人情報処理推進機構（IPA）', 'https://www.ipa.go.jp/shiken/kubun/ip.html', '2026-10-09'::date, 'ITパスポート試験がITに関する共通的な基礎知識を証明する国家試験で、受験資格がないこと、2027年度から新しい試験制度に移る予定であること', 3 from articles where slug = 'mikeiken-shikaku';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '教育訓練給付金', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/jinzaikaihatsu/kyouiku.html', '2026-10-09'::date, '教育訓練給付制度に3つの種類があること、対象講座を検索システムで調べられること', 4 from articles where slug = 'mikeiken-shikaku';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'mikeiken-shikaku' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"30ef4b0f729e3f878108becb98d96b0f401fbcee54203468933e0fb931891d72","findings":[]}'::jsonb from articles where slug = 'mikeiken-shikaku';
update articles set status = 'published' where slug = 'mikeiken-shikaku';

-- article: mikeiken-tenshoku-hajimekata (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('mikeiken-tenshoku-hajimekata', 'article', '未経験転職は何から始める？最初に整理したい5つのこと', '求人を眺める前に「転職したい理由」「経験」「希望条件」「比べる職種」「スケジュール」の5つを整理しておくと、求人の良し悪しを自分の基準で判断しやすくなります。それぞれの整理のしかたを具体的に紹介します。', '未経験から転職を考え始めたとき、最初につまずきやすいのは「何から手をつければいいのか分からない」ことです。求人サイトを開いても、職種も条件も幅が広すぎて、どれが自分に合っているのか判断できません。

そこでおすすめしたいのが、求人を探す前に**自分の側の材料を整理しておく**ことです。ここでは、最初に整理しておきたい5つの項目と、その書き出し方を紹介します。

```figure
type: steps
title: 最初に整理したい5つのこと
items:
  - label: 転職したい理由
    text: 「不満」と「望み」に分ける
  - label: これまでの経験
    text: 「作業」と「工夫」で書き出す
  - label: 希望条件
    text: 「ゆずれない」と「できれば」に分ける
  - label: 興味のある職種
    text: 2〜3つに絞って比べる
  - label: スケジュール
    text: いつまでに、どのくらい時間を使えるか
```

## 1. 転職したい理由を「不満」と「望み」に分ける

まずは、なぜ今の働き方を変えたいのかを書き出します。ここでは遠慮せず、本音をそのまま書いて構いません。

書き出したら、それぞれを次の2つに分けてみてください。

- **不満**: 今の状況で困っていること・続けたくないこと
- **望み**: 転職したあとに実現したいこと

たとえば「シフトが毎月変わって予定が立てにくい」は不満です。これを望みに言い換えると「平日の日中に働いて、休みの曜日を固定したい」になります。

```figure
type: compare
style: before-after
title: 不満を「望み」に言い換える
columns:
  - label: 不満
    items:
      - シフトが毎月変わって予定が立てにくい
  - label: 望み
    items:
      - 平日の日中に働いて、休みの曜日を固定したい
```

望みの形になると、求人を見るときに「勤務時間」「休日」の欄をどう読めばいいかがはっきりします。不満のままだと、求人を比べる基準になりにくいのです。

## 2. これまでの経験を「作業」と「工夫」で書き出す

次に、これまでの仕事やアルバイトでやってきたことを書き出します。ポイントは、役職や肩書きではなく**具体的な作業**で書くことです。

| 書き方の例 | 作業 | 工夫したこと |
| --- | --- | --- |
| 飲食店ホール | 注文受付、会計、新人へのレジ操作の説明 | 混雑時に待ち時間を伝えて、クレームを減らした |
| 倉庫の仕分け | 伝票と商品の照合、出荷数の入力 | 間違えやすい品番を一覧にして共有した |
| コンビニ | 発注、品出し、宅配便の受付 | 曜日ごとの売れ方を見て発注数を調整した |

「工夫したこと」の欄は、書類選考や面接で経験を伝えるときにそのまま使えます。小さなことでも構いません。自分では当たり前だと思っていることほど、書き出すと意外な材料になります。

経験の言葉にしかたは、[接客経験は転職でどう活かせる？](/articles/sekkyaku-keiken-ikasu)でも詳しく紹介しています。

## 3. 希望条件を「ゆずれない」と「できれば」に分ける

年収、休日、勤務地、勤務時間、仕事内容。希望条件はたくさん出てきますが、すべてを満たす求人はほとんどありません。そこで、条件を2つのグループに分けておきます。

- **ゆずれない条件**: これが満たされないなら応募しない、というもの（1〜2個まで）
- **できれば条件**: あるとうれしいが、ほかの条件次第では妥協できるもの

ゆずれない条件を3つ以上にすると、応募できる求人が大きく減ります。迷ったら「この条件が満たされない仕事を、1年続けられるか」と自分に聞いてみてください。

なお、2024年4月からは、求人の募集時や労働契約を結ぶときに明示される労働条件に「就業場所・業務の変更の範囲」などが加わりました。勤務地や仕事内容をゆずれない条件にしている人は、こうした項目も確認の対象になります。

年収と休日のように、どちらも大事で決めきれない条件の比べ方は[「土日休み」と「年収」をどう比較する？](/articles/donichi-yasumi-nenshu-hikaku)で解説しています。

## 4. 興味のある職種を2〜3つに絞って比べる

「未経験歓迎」の求人は、営業、カスタマーサポート、事務、ITサポートなど幅広い職種で出ています。最初から1つに決める必要はありませんが、比べる対象は2〜3つに絞ったほうが判断しやすくなります。

絞り込むときは、次の3つの軸で考えると違いが見えやすくなります。

- 人と話す量はどのくらいか
- パソコンでの作業はどのくらいか
- 数字の目標（売上・件数など）があるか

職種ごとの違いは、[職種比較ページ](/jobs)で一覧にしています。また、厚生労働省の職業情報提供サイト（job tag）では、職業ごとの仕事内容や必要なスキルを調べられます。

## 5. いつまでに・どのくらいの時間を使えるかを決める

最後に、転職活動のスケジュールを大まかに決めます。

- 何月ごろまでに働き始めたいか
- 1週間のうち、転職活動にどのくらい時間を使えるか
- 今の仕事を続けながら活動するか、辞めてから活動するか

スケジュールが決まると、応募の数や面接日程の調整のしかたも考えやすくなります。特に、今の仕事を続けながら活動する場合は、面接に使える曜日や時間帯を先に把握しておくと慌てずに済みます。

## 整理ができたら次にやること

5つの項目にメモを書けたら、次の3つのどれかに進みましょう。

1. 興味のある職種について記事や職種比較ページで調べる
2. [条件整理チェック](/check)で、希望条件と経験をもう一度まとめてみる
3. 整理したメモを持って、キャリアアドバイザーに相談する

整理したメモは完成品である必要はありません。調べたり人と話したりする中で、何度書き直しても大丈夫です。大切なのは、求人を見る前に「自分にとって何が大事か」の手がかりを持っておくことです。', 'review', true, '2026-10-06'::timestamptz, '2026-10-07'::timestamptz, '2026-10-07'::timestamptz, null, '2026-10-06'::timestamptz, '未経験転職は何から始める？最初に整理したい5つのこと', '未経験転職の最初の一歩は、求人探しより「整理」です。転職理由・経験・希望条件・比べる職種・スケジュールの5つを、書き出し例つきで解説します。', array['agent-mendan-mae', 'donichi-yasumi-nenshu-hikaku', 'eigyo-cs-it-support-chigai', 'tenshoku-schedule', 'tenshoku-agent-merit']::text[], '{}'::text[], array['mikeiken-shokushu', 'yaritai']::text[], array['hajimete']::text[], array['未経験の転職、', '何から始める？']::text[], null, false, '[{"q":"自分には強みと言えるような経験がありません。それでも整理する意味はありますか？","a":"あります。整理の目的は「すごい経験」を探すことではなく、どんな作業をどのくらい続けてきたかを事実として並べることです。アルバイトのシフト管理や新人への説明なども、書き出してみると仕事選びの材料になります。"},{"q":"転職したい理由が不満ばかりです。ネガティブでも大丈夫でしょうか？","a":"最初は不満のままで構いません。そのうえで「その不満がなくなったら、次はどうなっていたいか」に言い換えると、求人を比べるときの基準として使えるようになります。"},{"q":"整理にはどれくらい時間をかければいいですか？","a":"目安は1〜2週間です。完璧に仕上げる必要はなく、5つの項目に一度メモを書けたら、職種を調べたり相談したりしながら書き直していくほうが進めやすくなります。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"求人探しの前に、比較の基準を作る"}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'mikeiken-tenshoku-hajimekata' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'mikeiken-tenshoku-hajimekata' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業情報提供サイト（job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/', '2026-10-06'::date, '職種ごとの仕事内容を調べる方法の紹介', 0 from articles where slug = 'mikeiken-tenshoku-hajimekata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年4月から労働条件明示のルールが変わります', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_32105.html', '2026-10-06'::date, '求人や内定時に確認できる労働条件の範囲', 1 from articles where slug = 'mikeiken-tenshoku-hajimekata';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'mikeiken-tenshoku-hajimekata' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"cce7e2899f8290909637af89ab8074955280a71b678d88b8364e830f6c7d019d","findings":[]}'::jsonb from articles where slug = 'mikeiken-tenshoku-hajimekata';
update articles set status = 'published' where slug = 'mikeiken-tenshoku-hajimekata';

-- article: muki-tenkan-keiyaku (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('muki-tenkan-keiyaku', 'article', '契約社員と正社員は何が違う？「無期転換ルール」のしくみと求人で確認すること', '契約社員として同じ会社で有期契約を更新し、通算5年を超えると、申し込めば期間の定めのない契約に変わる「無期転換ルール」があります。しくみと数え方、無期になっても正社員と同じとは限らないこと、求人で確認したいことを整理します。', '求人を見ていると、「契約社員」「正社員登用あり」といった言葉をよく目にします。契約社員から始めて、そのあと長く働けるのか、気になる人も多いと思います。

先に結論をまとめます。

- 契約社員の多くは、契約期間が決まっている「有期契約」です。正社員の多くは、契約期間の定めがない「無期契約」です
- 同じ会社で有期契約を更新して**通算5年を超えると、申し込むだけで無期契約に変わる**「無期転換ルール」があります。会社は断れません
- ただし、無期になっても**正社員と同じ条件になるとは限りません**。給料などは、原則として直前の契約と同じです
- 求人では、契約の更新の基準や上限、正社員登用の実績を確認しておきましょう

## 契約社員と正社員は何が違う？

いちばん大きな違いは、**契約期間が決まっているかどうか**です。

- **有期契約**：「1年」「6か月」など契約期間が決まっていて、期間が終わるたびに更新するかどうかが決まる。契約社員、パート、アルバイトなどの呼び方で募集されることが多い
- **無期契約**：契約期間の定めがない。正社員はふつうこちら

「契約社員」「正社員」という呼び方は会社ごとに使い方が違うので、求人票の「雇用形態」とあわせて「契約期間」の欄を見るのが確実です。

給料や手当にも違いがあることがありますが、正社員と有期契約の人との間で、基本給・賞与・手当などに**不合理な待遇差をつけることは法律で禁止**されています（パートタイム・有期雇用労働法、中小企業は2021年4月から）。待遇の違いの理由について、会社に説明を求めることもできます。

## 無期転換ルールとは？

無期転換ルールは、労働契約法第18条で決められているしくみです。

同じ会社（同じ使用者）との間で、有期契約が更新されて**通算5年を超えた**とき、働いている人が申し込むと、期間の定めのない契約（無期契約）に変わります。申し込むと、会社はそれを承諾したものとみなされるので、**会社は断ることができません**。

数えるのは、2013年4月1日以後に始まった有期契約の期間です。契約社員だけでなく、パートやアルバイトなど、呼び方に関係なく有期契約で働く人が対象です。派遣社員の場合は、派遣会社（派遣元）との有期契約の期間で数えます。

なお、一部の高度な専門職の人や、定年後に引き続き雇われる人などには、会社が国の認定を受けている場合の特例があります。

## いつから申し込める？5年の数え方

申し込めるようになるのは、通算5年を超えることになる契約が始まったときです。その契約期間の初日から最後の日までの間に申し込めます。

- 1年契約を更新している場合：5回目の更新をしたあとの1年間
- 3年契約の場合：1回目の更新をしたあとの3年間

申し込むと、そのとき結んでいる有期契約が終わった日の翌日から、無期契約が始まります。

たとえば、2021年4月1日から1年契約を毎年更新している場合（日付は仮の例です）、5回目の更新で結ぶ2026年4月1日〜2027年3月31日の契約で通算5年を超えます。この期間中に申し込むと、2027年4月1日から無期契約になります。

```figure
type: steps
title: 1年契約を更新している場合（仮の例）
items:
  - label: 2021年4月1日
    text: 1年契約で働き始める
  - label: 毎年更新
    text: 同じ会社で1年ごとに契約を更新
  - label: 2026年4月1日
    text: 5回目の更新。この契約で通算5年を超える
  - label: この1年の間に申込み
    text: 会社は断れない
  - label: 2027年4月1日
    text: 無期契約が始まる
```

### 契約がない期間があるとき（クーリング）

同じ会社でも、契約と契約の間に**契約がない期間が一定以上**あると、それより前の期間は通算されなくなります。これを「クーリング」といいます。

- 契約がない期間の前の通算期間が1年以上のとき：契約がない期間が6か月以上あると、それより前は数えない
- 1年未満のとき：前の通算期間の2分の1以上（短い期間ごとに表で決まっている）

途中で別の会社に転職した場合も、5年は新しい会社で数え直しになります。

## 無期になっても「正社員と同じ」とは限らない

無期転換ルールは、有期契約を無期契約にするしくみで、**正社員にするしくみではありません**。無期転換したあとの給料や仕事内容などの条件は、就業規則などで別の定めがない限り、**直前の有期契約と同じ**です。

```figure
type: compare
title: 有期契約・無期転換後・正社員の違い
columns:
  - label: 有期契約
    tone: sand
    items:
      - 契約期間が決まっている
      - 期間が終わるたびに更新を判断
  - label: 無期転換後
    tone: sky
    items:
      - 契約期間の定めがなくなる
      - 給料などは原則として直前の契約と同じ
  - label: 正社員
    tone: mint
    items:
      - 契約期間の定めがない
      - 条件は会社の正社員向けの決まりによる
```

「正社員登用制度」は、無期転換ルールとは別のものです。こちらは会社が独自に設けている制度で、法律は会社に正社員への転換を進める取り組みを求めていますが、実際に正社員にすることまでは求めていません。登用の試験や基準、毎年何人くらい登用されているかは会社によって違うので、応募前や面接で確認しておくと安心です。

## 契約社員の求人で確認したいこと

2024年4月から、求人を出すときに「有期契約を更新する場合の基準」を明示することになり、そこには**通算契約期間や更新回数の上限**があるかどうかも含まれます。さらに、契約を結ぶときや更新のときには、更新の上限の有無と内容、無期転換を申し込めるタイミングでは「申し込めること」と「無期転換後の条件」を、会社が書面などで示すことになっています。

求人票や面接では、次の点を確認しましょう。

- 1回の契約期間（6か月、1年など）
- 更新するかどうかの基準（「業績や勤務成績により判断」など）
- 更新の上限（「通算5年まで」「更新3回まで」など）があるか
- 正社員登用制度の有無と、登用の実績
- 無期転換したあとの条件はどうなるか

質問の例です。

- 「契約の更新に上限はありますか。ある場合、何年（何回）までですか」
- 「正社員登用制度について、これまでの実績や登用の基準を教えていただけますか」

求人や内定時に明示される労働条件のルールは、[求人で明示される労働条件が増えた｜「業務・就業場所の変更の範囲」とは](/news/news-roudou-jouken-meiji)でも紹介しています。

契約の更新を断られた（雇止め）など困ったときは、都道府県労働局や労働基準監督署の中にある「総合労働相談コーナー」に無料で相談できます。派遣で働いている人の正社員への道すじは[派遣から正社員を考えるとき、最初に確認したいこと](/articles/haken-seishain)でも紹介しています。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-07'::timestamptz, '無期転換ルールとは？契約社員と正社員の違いと確認点', '有期契約が同じ会社で通算5年を超えると、申し込めば無期契約に変わる「無期転換ルール」。5年の数え方や申し込める時期、無期になっても正社員と同じとは限らないこと、契約社員の求人で確認したい更新の基準や上限を紹介します。', array['haken-seishain', 'freeter-seishain-hajimeni', 'hanbai-seishain']::text[], '{}'::text[], array['seishain']::text[], array['seishain-keiken-sukunai', 'hajimete']::text[], array['契約社員から', '無期転換ってなに？']::text[], null, false, '[{"q":"無期転換を申し込んだら、会社に断られることはありますか？","a":"条件を満たした人が申し込んだ場合、会社は申し込みを承諾したものとみなされ、その時点で無期の労働契約が成立します。会社は断ることができません。口頭でも申し込めますが、あとで確認できるように書面で出しておくと安心です。"},{"q":"無期転換したら、給料は上がりますか？","a":"上がるとは限りません。無期転換後の給料などの条件は、就業規則などで別の定めがない限り、直前の有期契約と同じです。変わるのは「契約期間の定めがなくなる」点が中心です。転換後の条件は、2024年4月から、申し込める更新のタイミングごとに会社が明示することになっています。"},{"q":"途中で別の会社に転職した場合、5年は通算されますか？","a":"通算されません。無期転換ルールの5年は、同じ会社（同じ使用者）との有期契約の期間を数えます。また、同じ会社でも、契約がない期間が一定以上あると、それより前の期間は通算されなくなります（クーリング）。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「5年で正社員になれる」という誤解を避け、無期転換・正社員登用・待遇差のルールを分けて説明する。応募前に求人票で確認できる項目（更新の基準・上限）につなげる","quotes":[{"source_url":"https://www.mhlw.go.jp/stf/newpage_21917.html","text":"同一の使用者との間で有期労働契約が更新されて通算5年を超えたときは、労働者の申込みにより無期労働契約に転換される。申込みをすると使用者が申込みを承諾したものとみなされ、無期労働契約がその時点で成立する。通算契約期間は2013年4月1日以後に開始する有期労働契約が対象","used_in":"無期転換ルールとは？"},{"source_url":"https://muki.mhlw.go.jp/part_time_job/","text":"契約期間が1年の場合は5回目の更新後の1年間に、3年の場合は1回目の更新後の3年間に無期転換の申込権が発生する。通算5年を超える契約期間の初日から末日までの間に申し込める。6か月以上契約がない期間があると、それ以前の期間は通算に含めない","used_in":"いつから申し込める？5年の数え方"},{"source_url":"https://www.mhlw.go.jp/topics/2013/02/dl/tp0221-03-02.pdf","text":"無契約期間の前の通算契約期間が1年以上の場合、無契約期間が6か月以上あるとそれ以前の契約は通算されない。1年未満の場合は、前の通算契約期間の2分の1以上の無契約期間でクーリングされる","used_in":"いつから申し込める？5年の数え方"},{"source_url":"https://muki.mhlw.go.jp/overview/qa.pdf","text":"無期転換ルールは有期契約労働者を正社員にする制度ではない。無期転換後の労働条件は、別段の定めがある部分を除き直前の有期労働契約と同一。申込時の有期労働契約が終了する日の翌日から無期労働契約が始まる","used_in":"無期になっても「正社員と同じ」とは限らない"},{"source_url":"https://muki.mhlw.go.jp/rule.html","text":"2024年4月から、有期労働契約の締結・更新のタイミングごとに更新上限の有無と内容、無期転換申込権が発生する更新のタイミングごとに無期転換申込機会と無期転換後の労働条件の明示が必要","used_in":"契約社員の求人で確認したいこと"},{"source_url":"https://www.mhlw.go.jp/content/001114167.pdf","text":"2024年4月から、募集時に明示する労働条件に、従事すべき業務の変更の範囲、就業場所の変更の範囲、有期労働契約を更新する場合の基準（通算契約期間または更新回数の上限を含む）が追加","used_in":"契約社員の求人で確認したいこと"},{"source_url":"https://www.startup-roudou.mhlw.go.jp/qa/zigyonushi/pato/q8.html","text":"正社員転換はパートタイム・有期雇用労働法にもとづき事業主が転換推進措置を講ずるもので、実際に通常の労働者に転換することまでは求められていない。無期転換は要件を満たした労働者の申込みを使用者が拒否できない","used_in":"無期になっても「正社員と同じ」とは限らない"}],"not_used":["無期転換を申し込んだ人の割合や、正社員登用の実績の全国的な数字は、公的な一次情報で最新の数値を確認できなかったので書かない","無期転換の申込権が発生する前の雇止めについての扱い（どのような場合に無効になるか）は、個別の事情で判断が分かれるため、本文では相談先の案内にとどめた"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'muki-tenkan-keiyaku' and c.slug = 'seido' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'muki-tenkan-keiyaku' and c.slug = 'hatarakikata' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '無期転換ルールについて', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_21917.html', '2026-10-07'::date, '同じ使用者との有期契約が通算5年を超えると申込みで無期契約に転換すること、会社は承諾したものとみなされること、2013年4月1日以後に始まった契約から数えること', 0 from articles where slug = 'muki-tenkan-keiyaku';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '無期転換の概要（契約社員、アルバイトなどの方）', '厚生労働省（有期契約労働者の無期転換ポータルサイト）', 'https://muki.mhlw.go.jp/part_time_job/', '2026-10-07'::date, '名称にかかわらず有期契約の人が対象で、派遣社員は派遣元との契約期間で数えること、1年契約なら5回目の更新後、3年契約なら1回目の更新後に申込権が発生すること、通算5年を超える契約期間中に申し込めること、6か月以上契約がない期間があるとそれより前は通算しないこと', 1 from articles where slug = 'muki-tenkan-keiyaku';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '無期転換ルール Q&A（制度の概要編・無期転換後の労働条件編）', '厚生労働省', 'https://muki.mhlw.go.jp/overview/qa.pdf', '2026-10-07'::date, '無期転換は正社員にする制度ではないこと、転換後の条件は別段の定めがない限り直前の有期契約と同じであること、申込時の有期契約が終わった翌日から無期契約が始まること', 2 from articles where slug = 'muki-tenkan-keiyaku';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '労働契約法改正のあらまし（有期労働契約の新しいルールができました）', '厚生労働省', 'https://www.mhlw.go.jp/topics/2013/02/dl/tp0221-03-02.pdf', '2026-10-07'::date, 'クーリングの基準（契約がない期間の前の通算期間が1年以上なら6か月以上、1年未満ならその2分の1以上が目安）', 3 from articles where slug = 'muki-tenkan-keiyaku';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年4月から労働条件明示のルールが変わります', '厚生労働省（有期契約労働者の無期転換ポータルサイト）', 'https://muki.mhlw.go.jp/rule.html', '2026-10-07'::date, '2024年4月から、有期契約の締結・更新ごとに更新上限の有無と内容、申込権が発生する更新ごとに無期転換を申し込めることと転換後の労働条件を明示すること', 4 from articles where slug = 'muki-tenkan-keiyaku';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年4月から、募集広告や職業紹介を受ける際に、求人企業などから明示される労働条件が追加されます', '厚生労働省', 'https://www.mhlw.go.jp/content/001114167.pdf', '2026-10-07'::date, '求人の段階で「有期労働契約を更新する場合の基準（通算契約期間または更新回数の上限を含む）」などを明示することになったこと', 5 from articles where slug = 'muki-tenkan-keiyaku';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '有期雇用労働者の無期転換制度と、パートタイム労働者・有期雇用労働者の正社員転換の違いを教えてください。｜スタートアップ労働条件', '厚生労働省', 'https://www.startup-roudou.mhlw.go.jp/qa/zigyonushi/pato/q8.html', '2026-10-07'::date, '無期転換と正社員転換は別の制度で、正社員転換は会社が転換を進める措置をとるもので、実際に転換することまでは求められていないこと', 6 from articles where slug = 'muki-tenkan-keiyaku';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '同一労働同一賃金特集ページ', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000144972.html', '2026-10-07'::date, '正社員と有期雇用の人との間で、基本給・賞与・手当などの不合理な待遇差が禁止され、待遇差の説明を求められること', 7 from articles where slug = 'muki-tenkan-keiyaku';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '高度専門職・継続雇用の高齢者に関する無期転換ルールの特例について', '厚生労働省', 'https://www.mhlw.go.jp/file/06-Seisakujouhou-11200000-Roudoukijunkyoku/0000075676.pdf', '2026-10-07'::date, '一部の高度専門職や定年後に継続雇用される人について、無期転換ルールの特例があること', 8 from articles where slug = 'muki-tenkan-keiyaku';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '総合労働相談コーナーのご案内', '厚生労働省', 'https://www.mhlw.go.jp/general/seido/chihou/kaiketu/soudan.html', '2026-10-07'::date, '雇止めなどの相談を、都道府県労働局や労働基準監督署内の総合労働相談コーナーで無料で受け付けていること', 9 from articles where slug = 'muki-tenkan-keiyaku';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'muki-tenkan-keiyaku' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"0337cf041f3bbd459f3e885d4d3fc30bbce6414aba35bd172dc3c9376b6912c6","findings":[]}'::jsonb from articles where slug = 'muki-tenkan-keiyaku';
update articles set status = 'published' where slug = 'muki-tenkan-keiyaku';

-- article: naitei-go-junbi (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('naitei-go-junbi', 'article', '内定から入社までにやることは？退職手続きとの順番・入社日の調整・入社書類の準備', '内定から入社までは、「労働条件を書面で確認して承諾する」「入社日を決める」「今の会社に退職を伝える」「入社書類をそろえる」の順に進めると、行き違いが起きにくくなります。入社日の相談のしかたの例と、基礎年金番号が分かる書類・雇用保険被保険者証・源泉徴収票などの入社書類が何に使われるか、手元にないときの対処を紹介します。', '内定の連絡が来てほっとしたのもつかの間、「今の会社にはいつ言えばいい？」「入社までに何を用意すればいい？」と、次の心配が出てくる人も多いはずです。

先に結論を言うと、内定から入社までは、次の順番で進めると行き違いが起きにくくなります。

1. 労働条件を**書面で確かめて**、内定を承諾する
2. 入社先と**入社日を決める**
3. 今の会社に**退職を伝える**
4. **入社書類**をそろえる

いちばん大事なのは、**承諾して入社日が決まる前に、今の会社に退職を伝えない**ことです。

## 内定から入社までの流れ

```figure
type: steps
title: 内定から入社までの順番
items:
  - label: 条件を確かめる
    text: 労働条件を書面で受け取り、求人票と見比べる
  - label: 承諾する
    text: 返事の期限までに入社の意思を伝える
  - label: 入社日を決める
    text: 今の会社の退職の決まりを見て相談する
  - label: 退職を伝える
    text: 直属の上司に伝え、退職日を決める
  - label: 書類をそろえる
    text: 年金・雇用保険・税金の書類を用意する
```

在職中に転職活動をしている人は、とくにこの順番が大事です。すでに退職している人は「退職を伝える」を飛ばして、入社日と書類の準備に進みます。

## 承諾の前に、労働条件を書面で確かめる

会社は、採用のときに労働条件を示すことになっていて、契約期間、働く場所と仕事の内容、勤務時間や休日、賃金、退職に関することなどは書面で示すことが決められています（本人が希望すれば、メールなどで受け取ることもできます）。

承諾の返事は、この書面を受け取って、求人票や面接で聞いた内容と見比べてからにしましょう。書面のどこを見るか、返事の期限を相談するときの言い方は[内定をもらったら、承諾の前に確認すること](/articles/naitei-shodaku-mae)で紹介しています。

## 入社日は、退職の決まりを見てから相談する

承諾したら、入社日を決めます。在職中の人は、入社日を決める前に、今の会社の**就業規則で、退職をいつまでに申し出ることになっているか**を確認しておきましょう。引き継ぎや、残っている有給休暇の使い方も考えに入れます。

入社日を相談するときの言い方の例（仮の例）：

> 「現在の職場の就業規則で、退職は〇か月前までに申し出ることになっています。引き継ぎの期間も考えて、〇月〇日の入社でお願いできないでしょうか。」

会社から示された入社日に間に合いそうにないときも、黙っていないで早めに相談します。

> 「ご提示いただいた〇月〇日の入社について、現在の職場での引き継ぎが終わらない見込みです。〇月〇日からの入社にしていただくことは可能でしょうか。」

入社日をどこまで調整できるかは会社によって違います。「いつまでなら待ってもらえるか」を聞いておくと、退職日の相談もしやすくなります（申し出の期限は、自分の会社の就業規則で確かめてください）。

## 退職を伝えるのは、入社日が決まってから

入社日が決まったら、直属の上司に退職を伝えます。先に入社日が決まっていると、「〇月〇日で退職したい」と、はっきり伝えられます。

> 「お話ししたいことがあります。一身上の都合で、〇月〇日付で退職させていただきたいと考えています。」

切り出し方や引き止められたときの答え方は、[退職の伝え方は？誰に・いつ・どう言うか](/articles/taishoku-tsutaekata)で例文とあわせて紹介しています。

## 入社のときに求められることが多い書類

入社先からは、社会保険や税金の手続きのために、次のような書類を出すよう言われることが多いです。何を出すかは会社によって違うので、入社先の案内で確認しましょう。

| 書類 | 何に使う？ | どこにある？ |
| --- | --- | --- |
| 基礎年金番号が分かる書類 | 厚生年金に入る手続き | 基礎年金番号通知書、または年金手帳 |
| 雇用保険被保険者証 | 同じ番号で雇用保険に入る手続き | 前の会社から受け取る（保管していることも） |
| 源泉徴収票（前の会社のもの） | 前の会社の給与も含めた年末調整 | 退職後に前の会社から届く |
| 労働契約の書類 | 労働条件の確認・契約 | 入社先から渡される |

ほかに、マイナンバーが分かる書類、給与の振込口座、通勤経路など、会社ごとに必要なものが加わることがあります。

### 基礎年金番号通知書と年金手帳

2022年4月1日以降に初めて年金制度に入った人には、年金手帳に代わって「基礎年金番号通知書」が届いています。それより前から年金手帳を持っている人は、年金手帳を基礎年金番号が分かる書類としてそのまま使えます。

### 雇用保険被保険者証

雇用保険の被保険者番号は、転職しても同じ番号を引き継ぎます。そのため、入社先から提出を求められることがあります。前の会社が保管していて、退職するときに渡されることもあります。

### 源泉徴収票

年の途中で就職した人は、新しい会社で、前の会社の給与も含めて年末調整をします。前の会社の給与の金額は、源泉徴収票で確認します。年末調整のしくみは[転職した年の年末調整と確定申告](/articles/tenshoku-nenmatsu-chosei)で紹介しています。

## 入社書類が手元にないときは

書類が見つからなくても、あわてなくて大丈夫です。

- **雇用保険被保険者証**：ハローワークで再交付を受けられます。窓口で本人確認書類を見せて手続きをします。雇用保険に入っていなかった場合は、そもそも被保険者証がありません
- **基礎年金番号通知書・年金手帳**：なくしたときは、基礎年金番号通知書の再交付を申請します。番号の確認のしかたは入社先の担当者にも相談しましょう
- **源泉徴収票**：入社日に間に合わなくてもかまいません。届いたらすぐ出せるよう、担当者に伝えておきます。年末調整までに確認できないと、自分で確定申告をすることになります

担当者への伝え方の例（仮の例）：

> 「雇用保険被保険者証が見当たらず、ハローワークで再交付の手続きをする予定です。入社日に間に合わない場合は、後日の提出でもよろしいでしょうか。」

退職するときに受け取る書類と返す書類の一覧は、[退職するときに受け取る書類・返す書類](/articles/taishoku-shorui)にまとめています。

## 入社前に確認しておくこと

最後に、入社日までに確認しておきたいことをまとめます。

```figure
type: checklist
title: 入社日までに確認すること
items:
  - 労働条件の書面を受け取り、保管したか
  - 入社日と退職日がずれていないか
  - 入社書類のリストと提出期限
  - 初日の集合時間・場所・持ち物
  - 初日の服装
  - 困ったときの連絡先（担当者の名前）
```

初日の持ち物や服装が分からないときは、遠慮せずに入社先の担当者に聞いてかまいません。入社前に聞いておくことで、当日を落ち着いて迎えられます。', 'review', false, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '内定から入社までにやること｜退職との順番と入社書類', '内定から入社までに何をする？労働条件の確認と承諾、退職を伝える順番、入社日の相談のしかたの例、年金手帳・基礎年金番号通知書・雇用保険被保険者証・源泉徴収票などの入社書類の役割と、なくしたときの対処を紹介します。', array['naitei-shodaku-mae', 'taishoku-shorui', 'taishoku-tsutaekata', 'nyusha-go-hajime', 'tenkin-kinmuchi-kakunin']::text[], '{}'::text[], array['yametai']::text[], array['hajimete', 'dainishinsotsu']::text[], array['内定が出た！', '入社までに何をする？']::text[], null, false, '[{"q":"内定をもらったら、すぐ今の会社に退職を伝えてもいいですか？","a":"労働条件を書面で確認して内定を承諾し、入社日が決まってから伝えるのが安全です。承諾の前に退職を伝えてしまうと、条件が合わずに辞退したくなったとき、戻る場所がなくなってしまいます。退職の申し出の時期は就業規則に決まりがあることが多いので、あわせて確認しておきましょう。"},{"q":"雇用保険被保険者証をなくしてしまいました。入社に間に合いますか？","a":"ハローワークで再交付を受けられます。窓口で本人確認書類を見せて手続きをします。前の会社が保管していて、退職時に渡される場合もあるので、まずは手元の書類と前の会社に確認しましょう。間に合わない場合は、入社先の担当者に事情を伝えて、あとから出してもよいか相談します。"},{"q":"前の会社の源泉徴収票が、入社までに届きません。どうすればいいですか？","a":"源泉徴収票は、その年の年末調整で使う書類なので、入社日に必ずそろっていなければいけないわけではありません。届いたらすぐ入社先に出せるよう、担当者に「退職後に届く予定です」と伝えておきましょう。年末調整までに前の会社の給与を確認できないと、新しい会社では年末調整ができず、自分で確定申告をすることになります。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"内定〜入社までの「順番」と「入社書類」に絞る。労働条件通知書の見方は naitei-shodaku-mae、退職の伝え方は taishoku-tsutaekata、退職時に受け取る書類の一覧は taishoku-shorui に任せ、この記事は「承諾→入社日→退職を伝える→書類をそろえる」の流れと、入社日の相談の言い方、入社書類が手元にないときの対処を具体的に示す","quotes":[{"source_url":"https://www.mhlw.go.jp/bunya/roudoukijun/faq_kijyunhou_4.html","text":"労働基準法施行規則第5条第1項の事項を明示する必要があり、(1)から(6)（昇給に関する事項を除く）は書面の交付により明示しなければならない。労働者が希望した場合は、FAXや電子メール、SNS等でも明示できる（官公庁サイトに直接接続できなかったため、検索結果の記載で確認）","used_in":"承諾の前に、労働条件を書面で確かめる"},{"source_url":"https://jsite.mhlw.go.jp/aichi-hellowork/list/minami/hihokenshashoutowa.html","text":"別の事業所に転職する場合も同じ番号を引き継ぐ。再発行は来所し、本人確認資料を提示のうえ手続きする。雇用保険の加入条件を満たしておらず被保険者となっていない場合は再発行できない（検索結果の記載で確認）","used_in":"入社書類が手元にないときは"},{"source_url":"https://www.nenkin.go.jp/service/seidozenpan/20131107.html","text":"令和4年4月1日以降、国民年金制度または被用者年金制度に初めて加入する方には「基礎年金番号通知書」を発行。令和4年4月1日以降も、年金手帳は基礎年金番号が確認できる書類として利用できる。紛失等により再発行を希望される場合は、基礎年金番号通知書の再交付を申請する（検索結果の記載で確認）","used_in":"入社のときに求められることが多い書類／入社書類が手元にないときは"},{"source_url":"https://www.nta.go.jp/taxes/shiraberu/taxanswer/gensen/2674.htm","text":"前の会社などが支払った給与の金額や源泉徴収税額などは、源泉徴収票により確認する。確認できない場合は年末調整を行えず、本人が確定申告で精算することになる（検索結果の記載で確認）","used_in":"入社のときに求められることが多い書類／入社書類が手元にないときは"}],"not_used":["源泉徴収票の交付期限（退職後1か月以内）は taishoku-shorui で扱っているため、この記事ではリンクに任せた","内定から入社までの平均的な期間や、入社日を延ばせる日数の目安は公的な根拠がなく、会社によって違うため書かない","入社時に会社が求める書類（マイナンバー、口座、健康診断書など）は会社によって違うため、例として挙げるにとどめ「会社の案内で確認」とした"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'naitei-go-junbi' and c.slug = 'junbi' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'naitei-go-junbi' and c.slug = 'seido' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '採用時に労働条件を明示しなければならないと聞きました。具体的には何を明示すればよいのでしょうか。', '厚生労働省', 'https://www.mhlw.go.jp/bunya/roudoukijun/faq_kijyunhou_4.html', '2026-10-09'::date, '採用時に労働条件を明示する必要があり、契約期間・就業の場所と業務・労働時間や休日・賃金・退職に関することなどは書面で明示しなければならないこと。労働者が希望した場合はFAXやメールなどでも明示できること', 0 from articles where slug = 'naitei-go-junbi';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '雇用保険被保険者証を再発行する方法は？（転職された方向け）', '愛知労働局（ハローワーク）', 'https://jsite.mhlw.go.jp/aichi-hellowork/list/minami/hihokenshashoutowa.html', '2026-10-09'::date, '雇用保険の被保険者番号は転職しても引き継がれ、転職先から雇用保険被保険者証の提出を求められることがあること。なくしたときはハローワークに来所し、本人確認書類を見せて再発行の手続きをすること', 1 from articles where slug = 'naitei-go-junbi';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '基礎年金番号・基礎年金番号通知書・年金手帳について', '日本年金機構', 'https://www.nenkin.go.jp/service/seidozenpan/20131107.html', '2026-10-09'::date, '2022年4月1日以降に初めて年金制度に加入した人には年金手帳に代わって基礎年金番号通知書が発行されること、すでに年金手帳を持っている人は年金手帳が基礎年金番号を確認できる書類として引き続き使えること、紛失したときは基礎年金番号通知書の再交付を申請すること', 2 from articles where slug = 'naitei-go-junbi';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'No.2674 中途就職者の年末調整', '国税庁', 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/gensen/2674.htm', '2026-10-09'::date, '年の途中で就職した人は、前の会社の給与も含めて年末調整を行い、その金額は源泉徴収票で確認すること。確認できないときは年末調整ができず、本人が確定申告で精算すること', 3 from articles where slug = 'naitei-go-junbi';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'naitei-go-junbi' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"96efe3c58877f9911b666204083618bbcd0e8e12b4fb4beff8722a3b5ab49370","findings":[]}'::jsonb from articles where slug = 'naitei-go-junbi';
update articles set status = 'published' where slug = 'naitei-go-junbi';

-- article: naitei-jitai-tsutaekata (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('naitei-jitai-tsutaekata', 'article', '内定辞退の伝え方は？電話とメールの使い分け・例文と、承諾後に辞退するときの注意', '内定を辞退すると決めたら、できるだけ早く、まず電話で採用担当者に伝え、メールでも残すのが基本です。連絡のタイミング、電話での言い方とメールの例文、理由の伝え方、承諾したあとに辞退するときの民法の考え方と注意点を紹介します。', '複数の会社から内定をもらった、条件を確かめたら考えが変わった。理由はさまざまでも、内定を辞退するときは「どう伝えればいいのか」「怒られないか」と気が重くなるものです。

先に結論を言うと、内定辞退は**決めたらすぐに、まず電話で、理由は短く**伝えるのが基本です。電話のあとにメールでも送っておくと、行き違いが起きにくくなります。

この記事で分かること：

- 辞退を**いつ**伝えるか
- **電話とメール**の使い分けと、それぞれの例文
- **理由**の伝え方と、引き止められたときの答え方
- **内定を承諾したあと**に辞退したいときの考え方

## いつ伝える？決めたらすぐに

辞退すると決めたら、**その日のうちか、遅くとも翌営業日**には連絡しましょう。会社は、内定を出した人が入社する前提で、ほかの応募者への連絡や受け入れの準備を進めています。返事が遅れるほど、会社がほかの人に声をかける機会を減らしてしまいます。

東京都の資料でも、内定の辞退は一度した約束を取り消すことになるので、**なるべく早く、はっきりと**意思を伝えることが大切だとされています。複数の内定があるときは、早めに入社する会社を決め、入社しない会社には速やかに辞退を伝えるのが基本です。

連絡する時間帯は、相手の会社の営業時間内にします。始業すぐや昼休み、終業まぎわは担当者が忙しいことが多いので、避けたほうがつながりやすいでしょう。

### 返事の期限が来る前でも、決まったら連絡する

返事の期限が先でも、辞退を決めたなら期限まで待つ必要はありません。「期限までに連絡すればいい」と保留したままにせず、決まった時点で伝えましょう。

まだ迷っていて期限に間に合わないときは、辞退ではなく**期限の相談**をします。言い方の例は[内定をもらったら、承諾の前に確認すること](/articles/naitei-shodaku-mae)で紹介しています。

## 電話とメール、どちらで伝える？

法律で連絡の方法が決まっているわけではありません。ただ、内定辞退は相手にとって大事な連絡なので、**まず電話、そのあとメール**の順にすると丁寧で、確実に伝わります。

```figure
type: steps
title: 内定辞退を伝える流れ
items:
  - label: 入社しないと決める
    text: 迷いが残っていないか、もう一度確かめる
  - label: 電話で伝える
    text: 採用担当者に、おわびと辞退の意思を伝える
  - label: メールでも送る
    text: 電話で伝えたことを、文面でも残す
  - label: 書類などを返す
    text: 会社から受け取ったものがあれば、指示に従う
```

- **電話**：声で直接おわびを伝えられ、相手が受け取ったことをその場で確かめられます
- **メール**：電話で話した内容が文面で残り、「言った・聞いていない」の行き違いを防げます。担当者が電話に出られないときの連絡にも使えます

担当者が不在で電話がつながらないときは、電話に出た人に伝言を頼むより、「あらためてお電話します」と伝えて、メールで先に辞退の連絡を送っておく方法があります。

## 電話での言い方の例

電話では、**名乗る → 担当者につないでもらう → おわびと結論 → 理由を一言 → お礼**の順に話すと、短くまとまります（会社名・名前は仮の例です）。

> 「お世話になっております。〇月〇日に内定のご連絡をいただきました、山田太郎と申します。採用ご担当の佐藤様はいらっしゃいますでしょうか。」
>
> 「お忙しいところ失礼いたします。内定のご連絡をいただき、ありがとうございました。大変申し訳ないのですが、検討を重ねた結果、今回は内定を辞退させていただきたく、ご連絡いたしました。選考に時間を割いていただいたのに、このようなお返事となり、申し訳ありません。」

ポイントは次の3つです。

- **最初に結論を言う**：前置きが長いと、相手が用件をつかみにくくなります
- **「辞退させていただきます」とはっきり言う**：「迷っていて」と言うと、相談だと受け取られます
- **静かな場所からかける**：周りの音で聞き取りにくいと、おたがいに話しづらくなります

## メールの例文

電話で伝えたあとに送るメールの例です。電話がつながらず、先にメールで伝える場合は、2行目を「お電話を差し上げましたが、ご不在とのことでしたので、メールにて失礼いたします」と変えて使えます（会社名・名前は仮の例です）。

> 件名：内定辞退のご連絡（山田太郎）
>
> 株式会社〇〇　人事部　佐藤様
>
> お世話になっております。山田太郎です。
> 先ほどお電話でもお伝えしましたが、このたびいただいた内定を辞退させていただきたく、あらためてご連絡いたしました。
>
> 選考では、お時間を割いて丁寧にご対応いただき、ありがとうございました。
> 検討を重ねた結果、別の会社への入社を決めました。
> ご期待に沿えず、また直前のご連絡となりましたこと、心よりおわび申し上げます。
>
> 本来であれば直接お伺いすべきところ、メールでのご連絡となり申し訳ありません。
> 末筆ながら、貴社のますますのご発展をお祈り申し上げます。
>
> 山田太郎
> 電話：090-XXXX-XXXX
> メール：xxxx@example.com

件名だけで用件と名前が分かるようにしておくと、担当者がほかのメールに埋もれさせずに済みます。

## 理由はどこまで言う？

理由は、**細かく話す必要はありません**。聞かれたら、短く答えれば十分です。

| よくある理由 | 伝え方の例 |
| --- | --- |
| 別の会社に決めた | 「検討を重ねた結果、別の会社への入社を決めました」 |
| 仕事内容が合わないと感じた | 「自分の希望する働き方とあらためて照らし合わせ、今回は辞退することにしました」 |
| 今の職場に残ることにした | 「家族とも話し合い、今の職場で働き続けることにしました」 |

相手の会社の条件や社員への不満を理由として並べるのは避けましょう。伝えても辞退の結論は変わらず、おたがいに気まずくなるだけです。

### 強く引き止められたら

引き止められたら、まずお礼を伝え、そのうえで**結論は変えない**ことが大切です。

> 「そのようにおっしゃっていただき、ありがとうございます。十分に考えたうえで決めたことですので、辞退させていただきたいと思います。」

会社に来て説明するよう何度も求められたり、強い言葉で辞退を認めないと言われたりして話が進まないときは、ひとりで抱え込まずに相談しましょう。都道府県労働局や労働基準監督署などにある**総合労働相談コーナー**では、職場のトラブルについて、予約なし・無料で相談できます。

## 承諾したあとに辞退したいときは

内定を承諾したあとや、内定承諾書を出したあとで「やっぱり辞退したい」と思うこともあるかもしれません。

### 法律の考え方

民法第627条では、期間の定めのない雇用（正社員など）は、働く人がいつでも解約を申し入れることができ、申し入れの日から**2週間**がたつと終わるとされています。

厚生労働省の京都新卒応援ハローワークのページでは、職業選択の自由（憲法第22条）があることから、内定承諾書を出したあとでも、民法第627条に準じて**2週間以上前**に辞退を申し入れることは、法的に問題はないと考えられると説明されています。内定承諾書には強い拘束力はないとも書かれています。

ただし、これは「法律上は辞退を申し入れられる」という話です。契約期間が決まっている雇用（契約社員など）の場合は前提が違うので、契約の内容を確かめ、迷ったら相談窓口で聞いてみましょう。

### 承諾後の辞退で気をつけること

承諾したあとは、会社はあなたの入社に向けて、受け入れの準備や、ほかの応募者へのお断りを進めています。辞退は法律上できるとされていても、相手には大きな負担がかかります。

```figure
type: checklist
title: 承諾後に辞退するときの確認
items:
  - 迷いがなく、辞退すると決めたか
  - 決めたその日のうちに連絡できるか
  - 電話で、本人から直接おわびを伝えるか
  - 会社から受け取った書類や物はないか
  - 今の職場に退職を伝えてしまっていないか
```

- **連絡は電話で、本人から**：承諾前の辞退より、いっそう丁寧に伝えます
- **おわびをはっきり伝える**：「承諾のお返事をしておきながら、このようなご連絡となり、大変申し訳ありません」
- **受け取ったものを確認する**：入社書類や貸与品があれば、返し方を聞きます

準備にかかった費用などをめぐって話し合いになることもあるかもしれません。その場で約束や支払いに応じず、内容を確かめてから、総合労働相談コーナーなどに相談しましょう。

### そもそも承諾後の辞退を防ぐには

承諾後の辞退をしないで済むように、**承諾の前に労働条件を書面で確かめ、迷いがあれば返事の期限を相談する**ことが大切です。

また、働きながら転職活動をしている人は、**内定を承諾してから**今の職場に退職を伝える順番にすると、辞退や条件の行き違いがあっても困らずに済みます。進める順番は[働きながらの転職活動、何から？](/articles/zaishoku-tenshoku-susumekata)、今の職場への伝え方は[退職の伝え方は？誰に・いつ・どう言うか](/articles/taishoku-tsutaekata)で紹介しています。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '内定辞退の伝え方｜電話・メールの例文と承諾後の注意', '内定辞退はいつ、どう伝える？決めたらすぐ連絡する理由、電話での言い方とメールの例文、理由の伝え方、引き止められたときの答え方、承諾後に辞退するときの民法の考え方と注意点を紹介します。', array['naitei-shodaku-mae', 'taishoku-tsutaekata', 'zaishoku-tenshoku-susumekata', 'tenshoku-koukai-shinai', 'oubo-mail-kakikata']::text[], '{}'::text[], array['mensetsu']::text[], array['hajimete', 'dainishinsotsu']::text[], array['内定辞退、', 'どう伝えればいい？']::text[], null, false, '[{"q":"内定辞退はメールだけで伝えてもいいですか？","a":"法律で連絡の方法が決まっているわけではありませんが、まず電話で採用担当者に伝え、そのあとメールでも送っておくと、行き違いが起きにくく丁寧です。担当者につながらないときは、メールで先に伝えたうえで、あらためて電話をかけましょう。"},{"q":"内定を承諾したあとでも辞退できますか？","a":"厚生労働省の京都新卒応援ハローワークのページでは、内定承諾書を出したあとでも、民法第627条に準じて2週間以上前に辞退を申し入れることは、法的に問題はないと考えられると説明されています。ただし、会社にはすでに入社の準備を進めてもらっているので、決めたらすぐに、おわびとともに連絡しましょう。"},{"q":"辞退の理由は正直に言わないといけませんか？","a":"細かい理由まで話す必要はありません。「検討を重ねた結果、別の会社への入社を決めました」のように短く伝えれば十分です。相手の会社への不満を理由として並べるのは避けましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"内定辞退は「早く・まず電話・理由は短く」が基本。承諾後の辞退も法的にはできるとされるが、会社の負担が大きいので、法律の話を前面に出さずに、誠意をもって早く伝えることを中心にする","quotes":[{"source_url":"https://jsite.mhlw.go.jp/nisizinkarasumaoike-kyoto-plaza/home/shinsotsu/kyu-shoku/kosokoso_00003.html","text":"憲法22条の規定（職業選択の自由）により、内定承諾書を提出した後でも、民法第627条に準じて2週間以上前に解約（内定辞退）の申し入れをすることは、法的に問題はないと考えられる。内定承諾書に強い拘束力はないと言える（2026-10-09 時点で jsite.mhlw.go.jp に直接接続できなかったため、WebSearch の検索結果に表示されたページの記述で確認）","used_in":"承諾したあとに辞退したいときは"},{"source_url":"https://laws.e-gov.go.jp/law/129AC0000000089","text":"第六百二十七条第一項「当事者が雇用の期間を定めなかったときは、各当事者は、いつでも解約の申入れをすることができる。この場合において、雇用は、解約の申入れの日から二週間を経過することによって終了する。」（e-Gov に直接接続できなかったため、検索結果に表示された条文で確認）","used_in":"承諾したあとに辞退したいときは"},{"source_url":"https://www.hataraku.metro.tokyo.lg.jp/shiryo/2-3_naiteisyakaranozitai.pdf","text":"内定を辞退することは一度した約束を取り消すことになるため、なるべく早く、はっきりと意思表示することが大切。複数社から内定を得た場合は早めに就職先を決め、就職する予定のない会社には速やかに辞退を伝える（直接接続できなかったため、WebSearch の検索結果に表示された資料の記述で確認）","used_in":"いつ伝える？決めたらすぐに"},{"source_url":"https://www.mhlw.go.jp/general/seido/chihou/kaiketu/soudan.html","text":"総合労働相談コーナーは各都道府県労働局、全国の労働基準監督署内などに設置。あらゆる分野の労働問題を対象に、予約不要・無料で相談できる（既存記事 taishoku-tsutaekata と同じ出典。今回は直接接続できず、内容は既存記事の確認記録と照合）","used_in":"強く引き止められたら"}],"not_used":["「辞退は入社の〇か月前まで」などの目安は公的な根拠を確認できなかったので書かない","損害賠償を求められた事例や金額は、個別の事情で変わり公的な根拠も確認できなかったため、「準備にかかった費用などで話し合いになることもある」と一般論にとどめ、断定しない","契約期間の決まった雇用（契約社員など）の内定辞退は民法第627条の前提と違うため扱わず、契約内容の確認と相談をすすめるにとどめた"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'naitei-jitai-tsutaekata' and c.slug = 'junbi' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'naitei-jitai-tsutaekata' and c.slug = 'shorui-mensetsu' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '内定後のこと（京都新卒応援ハローワーク）', '厚生労働省 京都労働局', 'https://jsite.mhlw.go.jp/nisizinkarasumaoike-kyoto-plaza/home/shinsotsu/kyu-shoku/kosokoso_00003.html', '2026-10-09'::date, '内定承諾書を出したあとでも、職業選択の自由（憲法第22条）から、民法第627条に準じて2週間以上前に内定辞退を申し入れることは法的に問題はないと考えられること。内定承諾書に強い拘束力はないと言えること', 0 from articles where slug = 'naitei-jitai-tsutaekata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '民法（明治二十九年法律第八十九号）第六百二十七条', 'e-Gov法令検索（デジタル庁）', 'https://laws.e-gov.go.jp/law/129AC0000000089', '2026-10-09'::date, '期間の定めのない雇用は、各当事者がいつでも解約の申入れができ、申入れの日から2週間を経過すると終了すること', 1 from articles where slug = 'naitei-jitai-tsutaekata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '内定者からの辞退（TOKYOはたらくネット 資料）', '東京都産業労働局', 'https://www.hataraku.metro.tokyo.lg.jp/shiryo/2-3_naiteisyakaranozitai.pdf', '2026-10-09'::date, '内定の辞退は一度した約束を取り消すことになるため、なるべく早く、はっきりと意思表示することが大切なこと。複数の内定があるときは早めに就職先を決め、就職しない会社には速やかに辞退を伝えること', 2 from articles where slug = 'naitei-jitai-tsutaekata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '総合労働相談コーナーのご案内', '厚生労働省', 'https://www.mhlw.go.jp/general/seido/chihou/kaiketu/soudan.html', '2026-10-09'::date, '都道府県労働局・労働基準監督署内などの総合労働相談コーナーで、職場のトラブルを予約不要・無料で相談できること', 3 from articles where slug = 'naitei-jitai-tsutaekata';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'naitei-jitai-tsutaekata' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"ab1c3880c0e62352e44fcf5d50a00bafd6c2491ca0edc0ede68ca734225f997a","findings":[]}'::jsonb from articles where slug = 'naitei-jitai-tsutaekata';
update articles set status = 'published' where slug = 'naitei-jitai-tsutaekata';

-- article: naitei-shodaku-mae (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('naitei-shodaku-mae', 'article', '内定をもらったら、承諾の前に確認すること｜労働条件通知書の見方と返事のしかた', '内定が出たら、返事をする前に労働条件を書面で確かめましょう。労働条件通知書で見るところ（2024年4月から加わった「変更の範囲」なども）、返事の期限を相談するときの言い方、複数の内定があるときの考え方、承諾したあとに辞退したくなったときの対応を紹介します。', '内定の連絡をもらうと、うれしくて、すぐに「お受けします」と言いたくなるかもしれません。でも、承諾は「この条件で働きます」という約束です。返事をする前に、**働く条件を書面で確かめる**時間をとりましょう。

この記事で分かること：

- 承諾の前に**労働条件通知書**で見るところ
- **2024年4月から**明示されるようになった項目
- 返事の**期限を相談する**ときの言い方
- **複数の内定**があるときの考え方
- **承諾したあとに辞退**したくなったときの対応

## まず、労働条件を「書面で」もらう

会社は、労働契約を結ぶときに、働く人に労働条件を示さなければならないと法律で決められています（労働基準法第15条）。そのうち次の項目は、原則として**書面で**示すことになっています。この書面は「労働条件通知書」などの名前で渡されることが多いです。

1. 契約の期間（期間の定めがあるかどうか）
2. 期間の定めがある場合、契約を更新するときの基準
3. 働く場所と、する仕事
4. 始業・終業の時刻、残業の有無、休憩、休日、休暇
5. 賃金の決め方、計算と支払いの方法、締め日と支払日
6. 退職に関すること（解雇の理由を含む）

働く人が希望した場合は、書面のかわりに、FAXやメールなど、印刷して書面にできる方法で示されることもあります。

まだ受け取っていない場合は、「承諾の前に、労働条件を書面で確認させていただけますか」とお願いしてみましょう。条件を確かめたいと言うのは、失礼なことではありません。

## 労働条件通知書で見るところ

受け取ったら、面接や求人票で聞いていた内容と比べながら、次のところを見ていきます。

```figure
type: checklist
title: 労働条件通知書で見るところ
items:
  - 契約期間：期間の定めはあるか、試用期間はあるか
  - 仕事の内容と働く場所、その変更の範囲
  - 始業・終業の時刻、休憩、残業の有無
  - 休日（曜日・年間の日数）と休暇
  - 基本給と手当の内訳、固定残業代の有無
  - 締め日と支払日
  - 退職の申し出の決まり
```

### 給料は「内訳」まで見る

給料の欄は、合計の金額だけでなく、**基本給と手当の内訳**まで見ましょう。月給に固定残業代（一定時間分の残業代をあらかじめ含めたもの）が入っている場合は、何時間分でいくらか、超えた分は別に支払われるかを確かめます。手取りの目安の出し方は[手取り20万円から転職を考えるとき、何を比べればいい？](/articles/tedori-20man-hikaku)で紹介しています。

### 休日は「年間の日数」も見る

「週休2日制」と「完全週休2日制」は意味が違います。曜日だけでなく、年間の休日の日数も確認しましょう。休日と給料の比べ方は[「土日休み」と「年収」をどう比較する？](/articles/donichi-yasumi-nenshu-hikaku)が参考になります。

## 2024年4月から加わった項目

2024年4月1日から、労働契約を結ぶときに示す労働条件に、次の項目が加わりました。

```figure
type: compare
title: 2024年4月から明示される項目
columns:
  - label: すべての人
    tone: sky
    items:
      - 仕事の内容の「変更の範囲」
      - 働く場所の「変更の範囲」
  - label: 契約期間がある人
    tone: sand
    items:
      - 更新上限の有無と内容
      - 無期転換を申し込めること（対象時）
      - 無期転換後の労働条件（対象時）
```

**変更の範囲**とは、入社直後の仕事や働く場所が、将来の異動などでどこまで変わる可能性があるか、ということです。たとえば、仕事の内容が「（雇入れ直後）事務　（変更の範囲）会社の定める業務」となっていれば、事務以外の仕事に変わる可能性があると読めます。働く場所の変更の範囲が広ければ、転勤の可能性もあります。

契約社員など**契約期間が決まっている**場合は、契約を何回まで、または通算何年まで更新できるか（更新上限）も確かめましょう。くわしくは[求人で明示される労働条件が増えた｜「業務・就業場所の変更の範囲」とは](/news/news-roudou-jouken-meiji)で解説しています。

### 求人票と違うところがあったら

求人票や面接で聞いた条件と違うところがあれば、承諾の前に理由を確認しましょう。単純な書きまちがいのこともあれば、条件が変わっていることもあります。

> 「求人票では月給〇万円と拝見していましたが、通知書では△万円となっていました。どのような内訳になっているか、教えていただけますか。」

ハローワークの求人に応募した場合で、求人票と説明が違うときは、ハローワークの窓口に申し出ることもできます。

## 返事の期限は、相談していい

内定の返事にいつまで待ってもらえるかは、会社ごとに違います。内定の連絡を受けたら、まず**期限を確認**しましょう。

ほかの選考の結果を待ちたい、家族と相談したいなどの理由で期限に間に合いそうにないときは、**早めに、理由と希望の日付を添えて**相談します。

> 「内定のご連絡をいただき、ありがとうございます。前向きに考えております。ほかに選考が進んでいる会社があり、その結果が〇月〇日に出る予定です。大変恐縮ですが、〇月〇日までお返事をお待ちいただくことは可能でしょうか。」

延ばしてもらえるかどうかは会社の判断です。希望どおりにならないこともあるので、その場合にどちらを選ぶかも考えておきましょう。

## 複数の内定があるときの考え方

複数の会社から内定が出たら、気持ちのままに選ぶ前に、**転職活動を始めたときに決めた「ゆずれない条件」**に戻って比べます。

| 比べること | 見るところ |
| --- | --- |
| ゆずれない条件を満たしているか | 給料、休日、勤務地など、自分で決めた1〜2個の条件 |
| 仕事の内容 | 入社直後の仕事と、変更の範囲 |
| 続けられそうか | 研修やサポート、職場の様子 |
| 書面の条件 | 労働条件通知書の内容がはっきりしているか |

迷ったら、「この会社で1年働いている自分」を思い浮かべて、続けられそうかを考えてみてください。年収以外に比べたいことは[年収だけで求人を選ばないほうがいい理由](/articles/nenshu-dake-erabanai)でも紹介しています。

選ばなかった会社には、決めたらできるだけ早く、電話などで辞退を伝えましょう。返事を長く保留していると、その会社がほかの人に声をかける機会を減らしてしまいます。

## 承諾したあとに辞退したくなったら

承諾したあとで、「やっぱり別の会社にしたい」と思うこともあるかもしれません。

厚生労働省の新卒応援ハローワークのページでは、内定承諾書を出したあとでも、民法第627条に準じて2週間以上前に辞退を申し入れることは、法的に問題がないと考えられると説明されています。ただし、会社がその人のために特別な備品を買っていた場合などは、損害賠償を求められる可能性もあるとされています。

辞退を決めたら、次の点に気をつけましょう。

- **決めたらすぐに連絡する**：入社の準備が進むほど、会社の負担は大きくなります
- **まず電話で、本人から伝える**：つながらなければ、メールでも連絡し、あらためて電話する
- **理由は短く、おわびを伝える**：「検討を重ねた結果、別の会社に入社することを決めました。ご迷惑をおかけし、申し訳ありません」

とはいえ、承諾後の辞退は、相手の会社に大きな迷惑がかかります。そうならないためにも、**承諾の前に条件を確かめ、迷いがあれば返事の期限を相談する**ことが大切です。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-07'::timestamptz, '内定承諾の前に確認すること｜労働条件通知書の見方と返事の期限', '内定をもらったら、承諾の前に労働条件を書面で確認しましょう。労働条件通知書で見る項目、2024年4月からの明示ルール（変更の範囲・更新上限）、返事の期限の相談のしかた、複数内定の考え方、承諾後の辞退について紹介します。', array['nenshu-dake-erabanai', 'donichi-yasumi-nenshu-hikaku', 'tedori-20man-hikaku', 'naitei-jitai-tsutaekata', 'naitei-go-junbi']::text[], '{}'::text[], array['kyuryo']::text[], array['hajimete']::text[], array['内定が出た！', '承諾の前に見ること']::text[], null, false, '[{"q":"労働条件通知書をもらえないまま、承諾を求められています。どうすればいいですか？","a":"労働契約を結ぶときには、会社は契約期間、就業の場所と業務、労働時間、賃金、退職に関することなどを、原則として書面で明示しなければならないとされています。「承諾の前に、労働条件を書面で確認させてください」とお願いしてみましょう。ハローワークの求人で応募した場合は、ハローワークの窓口にも相談できます。"},{"q":"内定の返事は、いつまでに必要ですか？","a":"決まった期限があるわけではなく、会社ごとに違います。内定の連絡のときに期限を確認し、間に合いそうにないときは、理由と希望の日付を添えて早めに相談しましょう。延ばせるかどうかは会社の判断なので、希望どおりにならないこともあります。"},{"q":"内定を承諾したあとに辞退すると、違法になりますか？","a":"内定を承諾したあとでも、辞退すること自体は可能だと考えられています。厚生労働省の新卒応援ハローワークのページでも、内定承諾書を出したあとでも、民法第627条に準じて2週間以上前に申し入れることは法的に問題がないと考えられる、と説明されています。ただし、会社に迷惑がかかるので、決めたらすぐに電話で連絡しましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"内定の喜びで勢いのまま承諾せず、労働条件を書面で確かめてから返事をする。2024年4月の明示ルールの追加点を、読者が通知書のどこを見ればいいかに置き換える。返事の期限・複数内定・承諾後の辞退は、断定せず相談のしかたを書く","quotes":[{"source_url":"https://www.mhlw.go.jp/bunya/roudoukijun/faq_kijyunhou_4.html","text":"労働基準法第15条第1項、施行規則第5条第1項。(1)労働契約の期間、(2)有期契約を更新する場合の基準、(3)就業の場所及び従事すべき業務、(4)始業・終業の時刻、所定労働時間を超える労働の有無、休憩時間、休日、休暇など、(5)賃金の決定・計算・支払いの方法、締切り・支払の時期（昇給を除く）、(6)退職に関する事項（解雇の事由を含む）は書面の交付により明示。労働者が希望した場合は、FAXやWebメールサービス等で、出力して書面を作成できるものに限り明示できる","used_in":"労働条件通知書で見るところ"},{"source_url":"https://www.mhlw.go.jp/stf/newpage_32105.html","text":"2024年4月1日から、労働契約の締結・更新時に明示すべき労働条件に、就業場所・業務の変更の範囲などが加わった","used_in":"2024年4月から加わった項目"},{"source_url":"https://muki.mhlw.go.jp/rule.html","text":"全ての労働契約の締結と有期労働契約の更新のタイミングごとに、雇い入れ直後の就業場所・業務の内容に加え、変更の範囲の明示が必要。有期労働契約では更新上限の有無と内容、無期転換申込権が発生する更新ごとに無期転換申込機会と無期転換後の労働条件の明示が必要","used_in":"2024年4月から加わった項目"},{"source_url":"https://www.check-roudou.mhlw.go.jp/qa/roudousya/koyou/q5.html","text":"求人票や求人広告の条件が面接で説明された条件と異なる場合、まず異なる理由を確認する。ハローワークの求人票の場合は、ハローワークの窓口またはハローワーク求人ホットラインに申し出ると、ハローワークが事実確認と必要な指導などを行う","used_in":"求人票と違うところがあったら"},{"source_url":"https://jsite.mhlw.go.jp/nisizinkarasumaoike-kyoto-plaza/home/shinsotsu/kyu-shoku/kosokoso_00003.html","text":"内定承諾書を提出した後でも、憲法22条の職業選択の自由と民法第627条に準じて2週間以上前に解約（内定辞退）の申し入れをすることは法的に問題がないと考えられる。ただし特殊な備品を購入していた場合などは損害賠償を請求される可能性がある。辞退する場合は早急に連絡を入れることが重要","used_in":"承諾したあとに辞退したくなったら"},{"source_url":"https://laws.e-gov.go.jp/law/129AC0000000089","text":"第六百二十七条第一項「当事者が雇用の期間を定めなかったときは、各当事者は、いつでも解約の申入れをすることができる。この場合において、雇用は、解約の申入れの日から二週間を経過することによって終了する。」（e-Gov への直接接続ができなかったため、e-Gov 法令検索の検索結果に表示された条文で確認）","used_in":"承諾したあとに辞退したくなったら"}],"not_used":["内定の返事の期限の「一般的な日数（1週間程度など）」は公的な根拠を確認できなかったので書かない","求人の虚偽表示に対する罰則の内容は、2025年6月の刑法改正（拘禁刑）による表記の変化を一次情報で確認しきれなかったので書かない","内定の法的な性質（始期付解約権留保付労働契約）の詳しい説明は、読者に必要な範囲を超えるため扱わない","京都新卒応援ハローワークのページは新卒者向けの説明だが、内定辞退と民法第627条の関係の説明として引用した"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'naitei-shodaku-mae' and c.slug = 'junbi' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'naitei-shodaku-mae' and c.slug = 'hatarakikata' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '採用時に労働条件を明示しなければならないと聞きました。具体的には何を明示すればよいのでしょうか。', '厚生労働省', 'https://www.mhlw.go.jp/bunya/roudoukijun/faq_kijyunhou_4.html', '2026-10-07'::date, '労働契約を結ぶときに書面で明示しなければならない事項（契約期間、更新の基準、就業の場所・業務、労働時間・休日、賃金、退職）と、労働者が希望した場合はFAXやメールなどでも明示できること', 0 from articles where slug = 'naitei-shodaku-mae';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年4月から労働条件明示のルールが変わります', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_32105.html', '2026-10-07'::date, '2024年4月1日から、労働契約の締結・更新時に就業場所・業務の変更の範囲などの明示が必要になったこと', 1 from articles where slug = 'naitei-shodaku-mae';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年4月から労働条件明示のルールが変わります（有期契約労働者の無期転換ポータルサイト）', '厚生労働省', 'https://muki.mhlw.go.jp/rule.html', '2026-10-07'::date, 'すべての労働者に就業場所・業務の変更の範囲の明示が必要になったこと。有期契約では更新上限の有無と内容、無期転換申込機会、無期転換後の労働条件の明示が必要になったこと', 2 from articles where slug = 'naitei-shodaku-mae';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '求人票や求人広告に記載された条件が、実際の条件と違った場合の対処法（確かめよう労働条件）', '厚生労働省', 'https://www.check-roudou.mhlw.go.jp/qa/roudousya/koyou/q5.html', '2026-10-07'::date, '求人票と説明された条件が違う場合は、まず理由を確認すること。ハローワークの求人の場合はハローワークの窓口などに申し出られること', 3 from articles where slug = 'naitei-shodaku-mae';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '内定後のこと（京都新卒応援ハローワーク）', '京都労働局', 'https://jsite.mhlw.go.jp/nisizinkarasumaoike-kyoto-plaza/home/shinsotsu/kyu-shoku/kosokoso_00003.html', '2026-10-07'::date, '内定承諾書を出したあとでも、民法第627条に準じて2週間以上前に内定辞退を申し入れることは法的に問題がないと考えられること。特別な備品を購入していた場合などは損害賠償を求められる可能性があること。辞退するときは早急に連絡すること', 4 from articles where slug = 'naitei-shodaku-mae';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '民法（明治二十九年法律第八十九号）第六百二十七条', 'e-Gov法令検索（デジタル庁）', 'https://laws.e-gov.go.jp/law/129AC0000000089', '2026-10-07'::date, '期間の定めのない雇用は、解約の申入れの日から2週間を経過すると終了すること', 5 from articles where slug = 'naitei-shodaku-mae';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'naitei-shodaku-mae' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"7ed3ed2aaeb831789038670fce6d6d74c39fdd23b341db7661eea823aedef1d3","findings":[]}'::jsonb from articles where slug = 'naitei-shodaku-mae';
update articles set status = 'published' where slug = 'naitei-shodaku-mae';

-- article: nenshu-300man-tenshoku (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('nenshu-300man-tenshoku', 'article', '年収300万円から転職すると、給料は下がる？上げられる？', '未経験の仕事に移ると、給料は下がることもあれば、変わらない・上がることもあります。今の年収の中身、提示された年収の中身、1年目と数年後の見通し、生活に必要な金額の4つを順番に確かめると、自分の場合を判断しやすくなります。', '「今の年収は300万円くらい。未経験の仕事に転職したら、もっと下がってしまうかも」。そんな不安から、転職に踏み出せずにいる人もいるかもしれません。

先に結論を言うと、未経験の職種に移ったときに給料が下がるかどうかは、職種や会社、そして**今の給料の中身**によって変わります。下がることもあれば、変わらないことも、上がることもあります。大事なのは、1年目の金額だけで決めないことと、「これ以上は下げられない」という生活の下限を先に決めておくことです。

## 未経験だと給料は下がる？

未経験で入社する場合、その仕事の経験者と同じ給与からスタートするとは限りません。一方で、今の職場で昇給がほとんどない場合や、正社員になって賞与（ボーナス）や手当が付く場合は、転職をきっかけに年収が上がることもあります。

どちらに転びやすいかは、たとえば次のような点で変わります。

| 下がる方向に働きやすいこと | 上がる方向に働きやすいこと |
| --- | --- |
| 今の給料に深夜手当や残業代が多く含まれている | 今の職場では昇給や賞与がほとんどない |
| 転職先では残業や夜の勤務が少なくなる | 転職先に昇給のしくみや資格手当がある |
| 試用期間中の給与が低めに設定されている | これまでの経験を評価してもらえる仕事を選ぶ |

自分がどちらに近いかは人によって違うので、次のステップで自分の数字を確かめていきましょう。

## まずは今の年収を分けてみる

給与明細や源泉徴収票を手元に用意して、今の年収を「毎月決まってもらえる分」と「働き方によって変わる分」に分けてみます。

たとえば年収300万円の場合で、次のような内訳だったとします（数字は仮の例です）。

- 基本給と毎月決まった手当：月19万円 × 12か月 = 228万円
- 残業代・深夜手当：月平均3万円 × 12か月 = 36万円
- 賞与：年36万円
- 合計：228万円 + 36万円 + 36万円 = 300万円

```figure
type: equation
title: 年収300万円の内訳（仮の例）
terms:
  - 基本給と手当 228万円
  - +
  - 残業代・深夜手当 36万円
  - +
  - 賞与 36万円
  - =
  - 年収300万円
```

この場合、残業や夜の勤務がない仕事に移ると、同じ基本給でも年36万円分が変わる可能性があります。反対に、転職先の基本給が今より高ければ、残業が減っても年収は大きく変わらないこともあります。「300万円」という合計だけを比べるより、**中身ごとに比べる**ほうが、下がるのか上がるのかが見えやすくなります。

## 提示された年収は「中身」を確認する

求人票や面接で示される年収にも、いろいろなものが含まれています。特に確認したいのは次の3つです。

- **固定残業代**：月給に一定時間分の残業代が含まれている場合、求人票などには、固定残業代を除いた基本給、何時間分でいくらか、その時間を超えた分を追加で支払うことを書くよう、厚生労働省が示しています。
- **賞与**：「年2回」と書かれていても、金額が決まっているのか、前年の実績なのかで意味が変わります。
- **試用期間中の条件**：試用期間がある場合、その間の給与が本採用後と同じかどうか。

また、2024年4月からは、求人の募集時などに明示される労働条件に「業務の変更の範囲」「就業場所の変更の範囲」が加わりました。給料と一緒に、入社後の仕事や勤務地がどこまで変わりうるかも確かめておきましょう。年収の内訳の読み方は[「土日休み」と「年収」をどう比較する？](/articles/donichi-yasumi-nenshu-hikaku)でも紹介しています。

## 1年目だけでなく、数年後も比べる

未経験の仕事では、1年目の年収が今と同じくらいか、少し下がることもあります。そのときは、**数年後にどうなっていそうか**もあわせて考えてみてください。

面接や面談では、たとえば次のように聞くと確かめやすくなります。

- 「昇給は年に何回ありますか。どのような基準で決まりますか」
- 「未経験で入社した方は、3年目くらいでどのような仕事を任されていますか」
- 「資格手当など、経験や資格に応じて増える手当はありますか」

今の職場で数年後も給料がほとんど変わらない見込みなら、1年目に少し下がっても、その後に伸びる道がある仕事のほうが合う人もいます。反対に、伸びる見込みがはっきりしないまま年収が下がる場合は、慎重に考えたほうがよいでしょう。

## 「これ以上は下げられない」金額を決める

最後に、生活に必要な金額から、ゆずれない下限を決めます。家賃、食費、通信費、奨学金の返済など、毎月かかるお金を書き出してみてください。

気をつけたいのは、求人票の月給や年収は、多くの場合、税金や社会保険料が引かれる前の金額（額面）だということです。生活費と比べるときは、手取りでいくら残るかで考えます。額面と手取りの違いは[手取り20万円から転職を考えるとき、何を比べればいい？](/articles/tedori-20man-hikaku)で紹介しています。

年収の差は、月にならすと実感しやすくなります。たとえば年収が20万円下がる場合、20万円 ÷ 12か月 = 約1万6,700円が、月あたりの差の目安です（額面での差で、賞与の有無などによって実際の月々の差は変わります）。この金額を生活費から減らせるかどうかが、判断の材料になります。

```figure
type: equation
title: 年収の差を月にならすと
terms:
  - 年収の差 20万円
  - ÷
  - 12か月
  - =
  - 月あたり約1万6,700円
```

下限が決まれば、それを下回る求人は候補から外し、下限を上回る求人の中で仕事内容や働き方を比べればよくなります。年収以外に何を比べるかは[年収だけで求人を選ばないほうがいい理由](/articles/nenshu-dake-erabanai)を参考にしてください。', 'review', true, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['tedori-20man-hikaku', 'nenshu-dake-erabanai', 'donichi-yasumi-nenshu-hikaku']::text[], '{}'::text[], array['kyuryo']::text[], array['hajimete', 'sekkyaku']::text[], array['年収300万円、', '転職したら下がる？']::text[], null, false, '[{"q":"未経験の職種に移ると、給料は下がるものですか？","a":"下がるとは限りません。今の給料に残業代や深夜手当が多く含まれている場合は下がることがありますが、今の職場で昇給や賞与がほとんどない場合は、転職をきっかけに上がることもあります。今の年収と提示された年収を、中身ごとに比べてみてください。"},{"q":"1年目の年収が今より下がる求人は、やめておいたほうがいいですか？","a":"一律には決められません。生活に必要な下限を下回らないか、昇給のしくみや数年後の見通しがあるかの2点で判断します。下限を下回らず、その後に伸びる道がある仕事なら、候補に残して考える方法もあります。"},{"q":"年収の差は、月にするとどのくらいですか？","a":"年収の差を12で割ると目安になります。たとえば年20万円の差なら、月あたり約1万6,700円です。ただし賞与の有無などで月々の差は変わり、これは額面での差なので、手取りの差とは一致しません。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"年収の数字だけで「下がる・上がる」を判断せず、今と提示額を中身ごとに比べ、生活の下限を先に決める","quotes":[{"source_url":"https://www.mhlw.go.jp/content/11600000/000498453.pdf","text":"固定残業代制を採用する場合は、募集要項や求人票などに、固定残業代を除いた基本給の額、固定残業代に関する労働時間数と金額等の計算方法、固定残業時間を超える時間外労働等に割増賃金を追加で支払う旨の3つを明示する（若者雇用促進法に基づく指針）","used_in":"提示された年収は「中身」を確認する"},{"source_url":"https://www.mhlw.go.jp/stf/newpage_32105.html","text":"2024年4月1日から、労働条件の明示事項に就業場所・業務の変更の範囲が追加された","used_in":"提示された年収は「中身」を確認する"},{"source_url":"https://www.mhlw.go.jp/content/001114110.pdf","text":"2024年4月1日から、労働者の募集や求人の申込みの際に明示すべき労働条件に、従事すべき業務の変更の範囲、就業場所の変更の範囲、有期労働契約を更新する場合の基準が追加された（改正職業安定法施行規則）","used_in":"提示された年収は「中身」を確認する"}],"not_used":["職種別・年齢別の平均年収などの統計値は使っていない。計算例はすべて仮の数字として明示"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'nenshu-300man-tenshoku' and c.slug = 'hatarakikata' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'nenshu-300man-tenshoku' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '固定残業代を賃金に含める場合は、適切な表示をお願いします', '厚生労働省', 'https://www.mhlw.go.jp/content/11600000/000498453.pdf', '2026-10-06'::date, '固定残業代がある場合に求人で明示する3つの項目（基本給・時間数と金額・超過分の追加支払い）', 0 from articles where slug = 'nenshu-300man-tenshoku';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年4月から労働条件明示のルールが変わります', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_32105.html', '2026-10-06'::date, '2024年4月から明示事項に「就業場所・業務の変更の範囲」が加わったこと', 1 from articles where slug = 'nenshu-300man-tenshoku';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '募集時等に明示すべき事項の追加（2024年4月1日施行・職業安定法施行規則の改正）', '厚生労働省', 'https://www.mhlw.go.jp/content/001114110.pdf', '2026-10-06'::date, '2024年4月から、求人の募集時などに明示する労働条件に「従事すべき業務の変更の範囲」「就業場所の変更の範囲」が加わったこと', 2 from articles where slug = 'nenshu-300man-tenshoku';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'nenshu-300man-tenshoku' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"8563a8dab273a20de651c439748d29b7bfe21eb4df3bc5efe8e3138131f4975a","findings":[]}'::jsonb from articles where slug = 'nenshu-300man-tenshoku';
update articles set status = 'published' where slug = 'nenshu-300man-tenshoku';

-- article: nenshu-dake-erabanai (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('nenshu-dake-erabanai', 'article', '年収だけで求人を選ばないほうがいい理由', '年収が高い求人は魅力的ですが、固定残業代や休日、仕事内容によっては、入社後に続けるのがつらくなることもあります。年収が高い理由の確かめ方、続けられるかを見るポイント、次の転職への影響を整理し、求人を比べるチェック表を紹介します。', '求人を探していると、つい年収の高い順に見てしまうことがあります。給料は生活に直結するので、それ自体は自然なことです。

ただ、年収だけで選ぶと、入社してから「こんなに残業があるとは思わなかった」「休みが少なくて続けられない」と感じて、また転職を考えることになりかねません。ここでは、年収と一緒に見ておきたいことを、**その仕事を続けられるか**という目線で整理します。

## 年収が高いのはなぜ？

年収が高めの求人を見つけたら、まず「なぜ高いのか」を確かめてみましょう。理由によっては、自分に合う働き方かどうかが見えてきます。考えられる理由には、たとえば次のようなものがあります。

- **固定残業代が含まれている**：月給に一定時間分の残業代が含まれていると、その分だけ月給や年収は高く見えます。固定残業代がある場合、求人票などには、固定残業代を除いた基本給、何時間分でいくらか、その時間を超えた分を追加で支払うことを書くよう、厚生労働省が示しています。たとえば「月給28万円（固定残業代5万円・30時間分を含む）」なら、固定残業代を除いた分は23万円で、月30時間ほどの残業を見込んだ働き方かもしれません（数字は仮の例です）。
- **成果によって変わる給与が含まれている**：営業職などでは、インセンティブ（成果に応じた手当）を含めた「年収例」が書かれていることがあります。入社何年目の、どんな成果を出した人の例なのかを確認しましょう。
- **働き方の負担が大きい**：休日が少ない、夜勤やシフトがある、転勤があるなど、働き方の負担が給料に反映されていることもあります。

```figure
type: equation
title: 固定残業代を除いた分を計算する（仮の例）
terms:
  - 月給28万円
  - −
  - 固定残業代5万円（30時間分）
  - =
  - 23万円
```

どれも悪いことではありませんが、理由を知らずに入社すると、「思っていた働き方と違う」と感じる原因になります。

## 続けられるかは「休み・時間・仕事内容」で変わる

年収が同じくらいでも、続けやすさは働き方で大きく変わります。次の3つは、年収と同じくらい丁寧に見ておきたいところです。

- **休み**：「完全週休2日制」か「週休2日制」か、年間休日は何日か。土日休みにしたい人は[「土日休み」を優先すると、どんな仕事がある？](/articles/donichi-yasumi-shigoto)も参考にしてください。
- **時間**：平均の残業時間や、忙しくなる時期。固定残業代の時間数も目安になります。
- **仕事内容**：2024年4月から、求人の募集時などに明示される労働条件に「業務の変更の範囲」「就業場所の変更の範囲」が加わりました。入社直後の仕事だけでなく、将来どこまで変わる可能性があるかも確認できます。

未経験で入る場合は、**研修や入社後のフォロー**も続けやすさに関わります。研修の確かめ方は[未経験求人の「研修あり」で確認すべきこと](/articles/mikeiken-kenshu-kakunin)で紹介しています。

## 次に転職するときにも関係する？

年収だけで選んで短い期間で辞めることになると、次の転職活動で、辞めた理由を聞かれることがあります。理由を説明できれば心配しすぎる必要はありませんが、短い期間での転職が続くと、自分でも気になってしまうものです。経歴の整理のしかたは[転職回数が気になるときに整理したいこと](/articles/tenshoku-kaisu-kininaru)にまとめています。

反対に、ひとつの職場で仕事を覚え、できることが増えていけば、それは次に仕事を選ぶときの材料になります。求人を見るときは「年収がいくらか」に加えて、「ここで1〜2年働いたら、どんなことができるようになっていそうか」も考えてみてください。

## 求人を比べるときのチェック表

気になる求人を2〜3件に絞れたら、次の表のように並べてみると違いが見えやすくなります。

| 見ること | 求人票で見る欄 | 面接で聞くなら |
| --- | --- | --- |
| 年収の中身 | 給与・固定残業代・賞与 | 「賞与は前年の実績ですか、決まった金額ですか」 |
| 休み | 休日・年間休日 | 「休日に出勤することはどのくらいありますか」 |
| 時間 | 就業時間・時間外労働 | 「配属予定の部署の、月の残業時間の目安を教えてください」 |
| 仕事内容 | 仕事内容・変更の範囲 | 「入社後1年間は、どんな仕事を担当しますか」 |
| 研修 | 研修・教育制度 | 「一人で担当できるようになるまで、どなたに教わりますか」 |
| 昇給 | 昇給 | 「昇給はどのような基準で決まりますか」 |

全部の欄を埋める必要はありません。空いている欄が、面接や面談で聞くことのリストになります。

## 年収をあきらめる、という話ではない

年収だけで選ばない、というのは、年収を気にしないということではありません。まずは生活に必要な下限を決めて、それを下回る求人は外します。そのうえで、下限を上回る求人の中から、休み・時間・仕事内容が自分に合うものを選ぶ、という順番で考えると迷いにくくなります。下限の決め方は[年収300万円から転職すると、給料は下がる？上げられる？](/articles/nenshu-300man-tenshoku)で紹介しています。

```figure
type: steps
title: 年収と働き方の両方で選ぶ順番
items:
  - label: 下限を決める
    text: 生活に必要な年収の下限
  - label: 下回る求人を外す
  - label: 働き方で選ぶ
    text: 休み・時間・仕事内容が合うものを
```', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['donichi-yasumi-nenshu-hikaku', 'mikeiken-kenshu-kakunin', 'tenshoku-kaisu-kininaru']::text[], '{}'::text[], array['kyuryo', 'yametai']::text[], array['hajimete', 'kaisu']::text[], array['年収が高い求人、', 'それだけで決めていい？']::text[], null, false, '[{"q":"年収が高い求人は、避けたほうがいいですか？","a":"避ける必要はありません。固定残業代が含まれている、成果に応じた給与が含まれている、休日が少ないなど、年収が高い理由を確かめたうえで、自分が続けられる働き方かどうかで判断しましょう。"},{"q":"固定残業代がある求人では、何を確認すればいいですか？","a":"固定残業代を除いた基本給、何時間分の残業代でいくらか、その時間を超えた分が追加で支払われるかの3つです。あわせて、配属予定の部署で実際にどのくらい残業があるかも、面接で聞いておくと安心です。"},{"q":"年収以外では、何を優先して見ればいいですか？","a":"休み、勤務時間、仕事内容の3つが、続けやすさに大きく関わります。未経験で入る場合は、研修や入社後のフォローの体制も確認しておきましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"時給換算（donichi-yasumi-nenshu-hikaku）とは別の角度で、「続けられるか」と「次の転職への影響」から年収以外の比べ方を示す","quotes":[{"source_url":"https://www.mhlw.go.jp/content/11600000/000498453.pdf","text":"固定残業代制を採用する場合は、募集要項や求人票などに、固定残業代を除いた基本給の額、固定残業代に関する労働時間数と金額等の計算方法、固定残業時間を超える時間外労働等に割増賃金を追加で支払う旨の3つを明示する（若者雇用促進法に基づく指針）","used_in":"年収が高いのはなぜ？"},{"source_url":"https://www.mhlw.go.jp/stf/newpage_32105.html","text":"2024年4月1日から、労働条件の明示事項に就業場所・業務の変更の範囲が追加された。変更の範囲は将来の配置転換などの見込みも含む","used_in":"続けられるかは「休み・時間・仕事内容」で変わる"},{"source_url":"https://www.mhlw.go.jp/content/001114110.pdf","text":"2024年4月1日から、労働者の募集や求人の申込みの際に明示すべき労働条件に、従事すべき業務の変更の範囲、就業場所の変更の範囲、有期労働契約を更新する場合の基準が追加された（改正職業安定法施行規則）","used_in":"続けられるかは「休み・時間・仕事内容」で変わる"}],"not_used":["早期離職率や平均勤続年数などの統計値は使っていない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'nenshu-dake-erabanai' and c.slug = 'hatarakikata' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'nenshu-dake-erabanai' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '固定残業代を賃金に含める場合は、適切な表示をお願いします', '厚生労働省', 'https://www.mhlw.go.jp/content/11600000/000498453.pdf', '2026-10-06'::date, '固定残業代がある場合に求人で明示する3つの項目（基本給・時間数と金額・超過分の追加支払い）', 0 from articles where slug = 'nenshu-dake-erabanai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年4月から労働条件明示のルールが変わります', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_32105.html', '2026-10-06'::date, '2024年4月から明示事項に「就業場所・業務の変更の範囲」が加わったこと', 1 from articles where slug = 'nenshu-dake-erabanai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '募集時等に明示すべき事項の追加（2024年4月1日施行・職業安定法施行規則の改正）', '厚生労働省', 'https://www.mhlw.go.jp/content/001114110.pdf', '2026-10-06'::date, '2024年4月から、求人の募集時などに明示する労働条件に「従事すべき業務の変更の範囲」「就業場所の変更の範囲」が加わったこと', 2 from articles where slug = 'nenshu-dake-erabanai';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'nenshu-dake-erabanai' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"9935430f5c90685fe271c57fa7b603c571af707db5ea2ef858e17393518e6755","findings":[]}'::jsonb from articles where slug = 'nenshu-dake-erabanai';
update articles set status = 'published' where slug = 'nenshu-dake-erabanai';

-- article: nyusha-go-hajime (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('nyusha-go-hajime', 'article', '転職して最初の1か月、どう過ごす？仕事の覚え方・メモと質問のしかた・試用期間中に確認すること', '転職して最初の1か月は、仕事を早く一人でこなすことより、「覚え方」「聞き方」「困ったときの相談先」の土台を作る期間と考えると、気持ちが楽になります。メモの取り方、質問の切り出し方の例、人間関係で気をつけたいこと、試用期間中に確かめること、社内外の相談先を紹介します。', '新しい職場に入って、覚えることが多すぎて頭がいっぱい。周りは忙しそうで、何を聞けばいいのかも分からない。転職したばかりのころは、そんな不安を抱えやすいものです。

先に結論を言うと、最初の1か月は**仕事を早く一人でこなせるようになる期間ではなく、「覚え方」「聞き方」「困ったときの相談先」の土台を作る期間**と考えると、気持ちが楽になります。

この記事で分かること：

- 仕事の**覚え方とメモの取り方**
- 質問の**切り出し方の例**
- **人間関係**で気をつけたいこと
- **試用期間中に確かめる**こと
- 困ったときの**社内・社外の相談先**

## 最初の1か月は、何を目標にする？

入社直後は、「早く役に立たなきゃ」と焦りがちです。でも、職場のやり方を知らないうちは、できないことがあって当たり前です。最初の1か月は、次のような小さな目標を置くのがおすすめです。

- いっしょに働く人の**名前と役割**を覚える
- 自分の仕事が、**どこから来て、どこへ渡るか**（仕事の流れ）を知る
- 分からないときに**誰に聞けばいいか**が分かる
- 教わった仕事を、**メモを見ながら**一人でやってみる

とくに未経験の職種に移った人は、前の仕事と比べて「できない自分」に落ち込みやすくなります。前の職場で身につけたこと（あいさつ、時間を守る、お客さんの話を聞くなど）は、新しい職場でもそのまま役に立っています。

## 仕事の覚え方：その場でメモし、その日のうちにまとめる

仕事を覚えるいちばんの近道は、**教わったことをその場でメモして、その日のうちに自分用の手順書にまとめる**ことです。教わったときは分かったつもりでも、翌日には細かいところを忘れていることがよくあります。

メモには、次のことを書いておくと、あとで見返したときに役立ちます。

```figure
type: checklist
title: 教わったときにメモすること
items:
  - 日付と、誰に教わったか
  - 何の仕事か（仕事の名前）
  - 手順（番号をつけて順番に）
  - 間違えやすいところ・注意点
  - 使うファイルや画面の場所
  - その場で分からなかったこと
```

メモの例（仮の例）：

> 〇月〇日　〇〇さんから
> 仕事：注文の入力
> 1. メールで届いた注文書を開く
> 2. 受注画面で「新規」を押し、お客さんの番号を入れる
> 3. 商品の番号と数を入れて、注文書と見比べる
> 注意：数の入れ間違いが多い。入力後に必ず注文書と照らし合わせる
> 分からなかったこと：急ぎの注文はどう扱う？

パソコンを使う仕事なら、画面の名前やボタンの位置も書いておくと、次に一人でやるときに迷いにくくなります。

## 質問のしかた：タイミングと聞き方を工夫する

入社したばかりの人が質問するのは当たり前のことです。ただ、聞き方を少し工夫すると、教える側も答えやすくなります。

### 聞くタイミング

- 相手が電話中や急ぎの作業中なら、「お手すきのときに、2点質問してもよいですか？」と先に声をかける
- 急がない質問は、いくつかまとめて聞く
- ミスやトラブルにつながりそうなことは、待たずにすぐ聞く

### 聞き方

「ここまで分かっていること」と「分からないこと」を分けて伝えると、話が早く進みます。

```figure
type: compare
style: before-after
title: 質問のしかたを変えてみる
columns:
  - label: 伝わりにくい聞き方
    items:
      - これ、どうすればいいですか？
      - 何が分からないかが相手に伝わらない
  - label: 伝わりやすい聞き方
    items:
      - メモの手順3まではできました
      - この画面で止まってしまいました
      - ここで何を選べばいいですか？
```

切り出し方の例（仮の例）：

> 「〇〇さん、今お時間よろしいでしょうか。注文の入力で、急ぎの注文の扱い方が分からなくて。メモでは手順3まで進められたのですが、この先どうすればいいか教えていただけますか。」

同じことをもう一度聞くときは、「前に教えていただいたのですが、この部分をもう一度確認させてください」と、メモを見せながら聞くと、自分で覚えようとしていることが伝わります。

## 人間関係で気をつけたいこと

新しい職場の人間関係は、最初から無理に仲良くなろうとしなくても大丈夫です。次のようなことを続けていると、少しずつ話しやすくなります。

- **あいさつとお礼**をはっきり言う（「ありがとうございます、助かりました」）
- 教えてもらった人の**名前を覚えて**、名前で呼ぶ
- 「前の職場ではこうでした」と**前の職場と比べる言い方を控える**
- 分からないことを分からないままにせず、**報告・連絡・相談**をこまめにする

前の職場のやり方のほうが良いと思うことがあっても、最初のうちは、まず今の職場のやり方を覚えることを優先しましょう。改善の提案は、仕事の流れが分かってからのほうが受け入れてもらいやすくなります。

接客や販売からオフィスワークに移った人は、働き方の違いにとまどうこともあります。どんなところが変わりやすいかは[接客からオフィスワークに移るとき、働き方はどう変わる？](/articles/sekkyaku-office)で紹介しています。

## 試用期間中に確かめること

多くの会社では、入社してしばらくは試用期間になっています。試用期間中に、次のことを確かめておきましょう。

```figure
type: checklist
title: 試用期間中に確かめること
items:
  - 試用期間はいつまでか
  - 本採用の前に面談などがあるか
  - 試用期間中と本採用後で給料が違うか
  - 社会保険に入っているか（給与明細で確認）
  - 仕事内容が労働条件の書面と合っているか
  - 有給休暇がいつから使えるか
```

有給休暇は、法律では、入社から6か月続けて働き、決められた出勤日の8割以上出勤すると付与されます。会社によっては入社時から付与されることもあるので、就業規則や人事の担当者に確認しましょう。

試用期間の法律上の扱いや、給料・社会保険のしくみは[試用期間って何？](/articles/shiyou-kikan)でくわしく紹介しています。入社前に聞いていた話と違うところがあるときの確かめ方は[転職で後悔しないために、入社前に確認したいこと](/articles/tenshoku-koukai-shinai)も参考にしてください。

## 困ったときの相談先

困ったことがあったら、ひとりで抱えこまないことが大切です。まずは社内で、それが難しければ社外の窓口を使いましょう。

| 相談先 | どんなとき？ |
| --- | --- |
| 教育係・直属の上司 | 仕事の進め方、分からないこと |
| 人事の担当者 | 労働条件、給料、社会保険、休みのこと |
| 総合労働相談コーナー | 聞いていた条件と違う、いじめ・嫌がらせなど |
| こころの耳 | ストレスや人間関係で気持ちがつらいとき |
| わかものハローワークなど | 就職後の職場定着について相談したいとき |

- **総合労働相談コーナー**：都道府県労働局や労働基準監督署にあり、労働条件やいじめ・嫌がらせなど、職場のトラブルの相談を無料で受け付けています
- **こころの耳**：厚生労働省の働く人のメンタルヘルスのサイトで、電話・SNS・メールで、匿名・無料で相談できます。受付時間は公式サイトで確認してください
- **わかものハローワーク**：正社員を目指すおおむね35歳未満の人を対象に、就職後の職場定着の支援も無料で行っています

## 「合わないかも」と思ったら

入社して1か月ほどは、慣れない仕事と人間関係で、誰でも疲れやすくなります。「この会社は合わないかも」と感じても、すぐに結論を出さず、**何が合わないのか**を書き出してみましょう。

- 仕事の内容が合わないのか、まだ慣れていないだけなのか
- 人間関係なのか、仕事の量なのか
- 入社前に聞いていた条件と違うのか

「慣れれば解決しそうなこと」と「入社前の話と違うこと」を分けると、上司や人事に相談すべきことが見えてきます。それでも続けるのがむずかしいと感じたときの考え方は、[入社1年以内に辞めた・辞めたいときの転職](/articles/souki-rishoku-tenshoku)で紹介しています。', 'review', false, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '転職後の最初の1か月の過ごし方｜仕事の覚え方と質問のしかた', '転職して入社した直後の1か月、どう過ごせばいい？仕事の覚え方とメモの取り方、質問の切り出し方の例、人間関係で気をつけたいこと、試用期間中に確かめること、困ったときに使える社内外の相談先を紹介します。', array['shiyou-kikan', 'souki-rishoku-tenshoku', 'sekkyaku-office', 'naitei-go-junbi', 'pawahara-soudan']::text[], '{}'::text[], array['mikeiken-shokushu', 'office']::text[], array['hajimete', 'seishain-keiken-sukunai']::text[], array['入社して1か月、', 'どう過ごせばいい？']::text[], null, false, '[{"q":"同じことを何度も聞いてしまいそうで、質問するのが怖いです。","a":"入社したばかりのころは、分からないことがあって当然です。同じことを聞かないために、教わったことはその場でメモし、聞く前にメモを見返すようにしましょう。それでも分からないときは「前に教えていただいたのですが、この部分をもう一度確認させてください」と、メモを見せながら聞くと伝わりやすくなります。"},{"q":"試用期間中は、有給休暇や残業代はどうなりますか？","a":"試用期間中も労働契約は結ばれているので、残業代などの労働条件は労働条件通知書などの書面で確かめましょう。有給休暇は、法律では入社から6か月たって条件を満たすと付与されるので、入社直後は使えないことが多いですが、会社によっては入社時に付与する場合もあります。分からないときは人事の担当者に確認しましょう。"},{"q":"入社前に聞いていた話と仕事の内容が違うとき、どこに相談すればいいですか？","a":"まずは上司や人事の担当者に、労働条件通知書などの書面を手元に置いて確認しましょう。社内で話しにくいときや、話しても解決しないときは、都道府県労働局や労働基準監督署にある総合労働相談コーナーに無料で相談できます。わかものハローワークなどで就職を決めた人は、就職後の職場定着の相談ができる場合もあります。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"入社直後の不安は「早く一人前にならなきゃ」という焦りから来やすい。最初の1か月の目標を「覚え方・聞き方・相談先を作る」に置き直し、メモの型、質問の切り出し方、人間関係での注意、試用期間中に書面で確かめること、社内外の相談先を具体的に示す。試用期間の法律上の扱いは既存記事 shiyou-kikan に任せる","quotes":[{"source_url":"https://www.mhlw.go.jp/general/seido/chihou/kaiketu/soudan.html","text":"47都道府県労働局や労働基準監督署に設置された総合労働相談コーナーでは、求職者、労働者、事業主が抱える仕事・職場でのトラブル相談を無料で受け付けている。解雇、配置転換、賃金の引下げ、いじめなどあらゆる分野の労働問題が対象（官公庁サイトに直接接続できなかったため、検索結果の記載で確認）","used_in":"困ったときの相談先"},{"source_url":"https://kokoro.mhlw.go.jp/soudan/","text":"厚生労働省委託事業の「こころの耳」では、全国の働く方やその家族、企業の人事労務担当者の方々からの相談を受けている。匿名で無料で相談できる。相談方法は電話、SNS、メールの3種類（検索結果の記載で確認）","used_in":"困ったときの相談先"},{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000181329.html","text":"担当者制による職業相談から自己理解・職務理解のサポート、能力開発の支援、応募準備のサポート、就職後の職場定着支援まで、一貫した支援を無料で実施（検索結果の記載で確認）","used_in":"困ったときの相談先"},{"source_url":"https://www.mhlw.go.jp/new-info/kobetu/roudou/gyousei/dl/140811-3.pdf","text":"雇い入れの日から6か月継続して雇われている労働者で、全労働日の8割以上を出勤した労働者に対して、年次有給休暇を与えなければならない（検索結果の記載で確認）","used_in":"試用期間中に確かめること（FAQ）"}],"not_used":["こころの耳の電話番号・受付時間は2025年12月1日に変更があり、時期によって変わるため書かない（公式サイトで確認するよう案内）","「入社後○か月で仕事を覚えるのが普通」といった目安は公的な根拠がなく、仕事や会社によって違うため書かない","試用期間中の解雇や本採用拒否の法的な扱いは shiyou-kikan で扱っているため、この記事ではリンクに任せた"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'nyusha-go-hajime' and c.slug = 'junbi' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'nyusha-go-hajime' and c.slug = 'hatarakikata' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '総合労働相談コーナーのご案内', '厚生労働省', 'https://www.mhlw.go.jp/general/seido/chihou/kaiketu/soudan.html', '2026-10-09'::date, '都道府県労働局や労働基準監督署にある総合労働相談コーナーで、労働者などの職場のトラブル（労働条件、いじめ・嫌がらせなど）の相談を無料で受け付けていること', 0 from articles where slug = 'nyusha-go-hajime';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '相談窓口案内（こころの耳）', '厚生労働省（働く人のメンタルヘルス・ポータルサイト こころの耳）', 'https://kokoro.mhlw.go.jp/soudan/', '2026-10-09'::date, '働く人やその家族などからの相談を、電話・SNS・メールで、匿名・無料で受け付けていること', 1 from articles where slug = 'nyusha-go-hajime';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'わかものハローワーク', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000181329.html', '2026-10-09'::date, '正社員を目指すおおむね35歳未満の若者を対象に、職業相談から就職後の職場定着支援まで一貫して無料で支援していること', 2 from articles where slug = 'nyusha-go-hajime';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '年次有給休暇の付与日数は法律で決まっています（リーフレット）', '厚生労働省', 'https://www.mhlw.go.jp/new-info/kobetu/roudou/gyousei/dl/140811-3.pdf', '2026-10-09'::date, '雇い入れの日から6か月継続して勤務し、全労働日の8割以上出勤した労働者に年次有給休暇が付与されること', 3 from articles where slug = 'nyusha-go-hajime';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'nyusha-go-hajime' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"47cd61b0f4342324dfe7c538e2dfa7ddfcdbcf8a7a0006596aa9a3bd3ea5f31b","findings":[]}'::jsonb from articles where slug = 'nyusha-go-hajime';
update articles set status = 'published' where slug = 'nyusha-go-hajime';

-- article: oubo-mail-kakikata (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('oubo-mail-kakikata', 'article', '転職の応募・面接日程・お礼のメールはどう書く？件名の付け方と返信のタイミング、例文', '転職活動のメールは「件名で用件と名前が分かる」「結論を先に書く」「署名を入れる」の3つを押さえれば、むずかしい言い回しはいりません。応募書類を送るとき、面接の日程を調整するとき、面接のあとにお礼を送るときの例文と、返信のタイミングを紹介します。', '転職活動を始めると、応募書類を送る、面接の日程を決める、面接のお礼を伝える、とメールを書く場面が続きます。「件名は何て書く？」「この敬語で合ってる？」と手が止まってしまう人も多いはずです。

先に結論を言うと、転職活動のメールで大事なのは、むずかしい言い回しより、**担当者が読んですぐに用件が分かること**です。次の3つを押さえれば、形は整います。

- **件名**で、用件と自分の名前が分かる
- **本文**は、結論（何をしてほしいか・何を伝えたいか）を先に書く
- **署名**に、名前と連絡先を入れる

この記事で分かること：

- メールの**基本の形**
- **応募書類**を送るときの例文
- **面接の日程調整**の返信・候補日の出し方・変更のお願い
- 面接のあとの**お礼メール**
- **返信のタイミング**

## 転職活動のメール、基本の形

採用担当者は、たくさんの応募者とメールでやりとりしています。件名と最初の数行で、誰から・何の用件かが分かるメールは、それだけで読みやすくなります。

```figure
type: steps
title: メールは上からこの順番で
items:
  - label: 件名
    text: 用件と名前（例：応募書類送付の件／山田太郎）
  - label: 宛名
    text: 会社名・部署名・担当者名
  - label: あいさつと名乗り
    text: 「お世話になっております。山田太郎です。」
  - label: 本文
    text: 結論を先に、用件を短く
  - label: 署名
    text: 名前・電話番号・メールアドレス
```

### 件名は「用件と名前」

青森労働局の資料では、件名は**「用件と氏名」で簡潔に**と示されています。

- 自分から送るとき：「応募書類送付の件／山田太郎」「面接日程のご相談／山田太郎」
- 会社からのメールに返信するとき：件名の「Re:」は残し、件名を変えずに返信するのが一般的です。担当者が、どのやりとりへの返事かをすぐに見つけられます

### 宛名と署名

宛名は「株式会社〇〇　人事部　佐藤様」のように、会社名・部署名・名前の順に書きます。担当者の名前が分からないときは「採用ご担当者様」とします。

署名には、名前と連絡先を入れます。青森労働局の資料では、氏名・郵便番号・住所・電話番号・メールアドレスの順で書く例が示されています（郵便番号と住所は省くこともあります）。

> 山田太郎（やまだ たろう）
> 電話：090-XXXX-XXXX
> メール：xxxx@example.com

メールソフトの署名機能に登録しておくと、毎回入力する手間が省け、書き忘れも防げます。

## 応募書類をメールで送るとき

求人で「応募書類はメールで」と指定されているときの例です（会社名・名前は仮の例です）。メールの本文が、紙の書類を送るときの送付状の代わりになります。

> 件名：応募書類送付の件／山田太郎
>
> 株式会社〇〇　人事部　採用ご担当者様
>
> はじめまして。山田太郎と申します。
> 貴社の求人を拝見し、一般事務職に応募したく、ご連絡いたしました。
> 履歴書と職務経歴書を添付いたしますので、ご確認いただけますと幸いです。
>
> ・履歴書（山田太郎）.pdf
> ・職務経歴書（山田太郎）.pdf
>
> お忙しいところ恐れ入りますが、どうぞよろしくお願いいたします。
>
> （署名）

書くときのポイントは次のとおりです。

- **志望動機は本文に長く書かない**：添付する書類に書いてあることは繰り返さず、応募したいことと、何を添付したかが分かれば十分です
- **添付ファイルはPDFに**：会社から指定がなければ、レイアウトが崩れにくいPDFにするのがすすめられています
- **ファイル名は「書類名と名前」**：「履歴書（山田太郎）.pdf」のように、開かなくても中身と送り主が分かる名前にします
- **送る前に確かめる**：宛先のメールアドレス、担当者名、添付ファイルを付け忘れていないか

書類の中身を整えたいときは、[履歴書に書くことがないと思ったとき](/articles/rirekisho-kakukoto-nai)や[アルバイト経験だけの職務経歴書、何を書けばいい？](/articles/shokumu-keirekisho-arubaito)を参考にしてください。

## 面接の日程を調整するとき

### 会社から候補日が届いたら

会社から「以下の日程からご都合のよい日時をお知らせください」と届いたときは、**選んだ日時を本文に書き写して**返信します。日時を書いておくと、おたがいの思い違いを防げます。

> 件名：Re: 面接日程のご連絡
>
> 株式会社〇〇　人事部　佐藤様
>
> お世話になっております。山田太郎です。
> 面接日程のご連絡をいただき、ありがとうございます。
> 以下の日時でお願いできますでしょうか。
>
> 10月15日（木）14時00分〜
>
> 当日はどうぞよろしくお願いいたします。
>
> （署名）

### 自分から候補日を出すとき

「ご都合のよい日時をいくつかお知らせください」と言われたら、**候補を複数**、日付と時間の幅で書きます。

> 以下の日時でしたら、伺うことができます。
>
> ・10月15日（木）13時〜17時
> ・10月16日（金）終日
> ・10月19日（月）10時〜12時
>
> ご調整いただけますと幸いです。

働きながら活動している人は、始業前や終業後、昼休みなど、出せる時間帯をあらかじめ決めておくと返事が早くなります。時間の作り方は[働きながらの転職活動、何から？](/articles/zaishoku-tenshoku-susumekata)で紹介しています。

### 日程を変えてほしいとき

決まった日程の都合が悪くなったら、分かった時点ですぐに連絡します。面接の直前なら、メールより電話のほうが確実です。

> 件名：面接日程変更のお願い／山田太郎
>
> 株式会社〇〇　人事部　佐藤様
>
> お世話になっております。10月15日（木）14時から面接のお約束をいただいております、山田太郎です。
> 大変申し訳ないのですが、仕事の都合により、当日伺うことがむずかしくなりました。
> お手数をおかけしますが、以下の日時でご調整いただくことは可能でしょうか。
>
> ・10月20日（火）13時〜17時
> ・10月21日（水）終日
>
> こちらの都合で申し訳ありません。どうぞよろしくお願いいたします。
>
> （署名）

## 面接のあとのお礼メール

お礼メールは、送らなければいけないものではありません。送る場合は、**時間をとってもらったお礼と、面接で印象に残ったことを短く**書きます。長い自己PRを付け足すと、かえって読む負担になります。

> 件名：本日の面接のお礼／山田太郎
>
> 株式会社〇〇　人事部　佐藤様
>
> お世話になっております。本日14時より面接をしていただきました、山田太郎です。
> お忙しいなか、お時間をいただき、ありがとうございました。
>
> 入社後の研修の進め方や、チームで電話対応を分担していることをうかがい、未経験からでも仕事を覚えていけるイメージを持つことができました。
> あらためて、貴社で働きたいという気持ちが強くなりました。
>
> 取り急ぎ、お礼を申し上げたくご連絡いたしました。
> どうぞよろしくお願いいたします。
>
> （署名）

「面接で聞いた話のうち、自分に響いたこと」を一つ入れると、定型文だけのお礼よりも気持ちが伝わります。

## 返信はいつまでに？

会社からのメールには、**できるだけその日のうちに**返信しましょう。とくに面接の日程は、返事が遅れると候補の日時が埋まってしまうことがあります。

- 会社の営業時間内に送るのが無難です。夜遅くに書いた場合は、メールソフトの予約送信を使う方法もあります
- すぐに答えられない内容（日程の確定など）でも、「メールを拝見しました。〇日までにお返事いたします」とまず返すと、相手が待たずに済みます
- お礼メールを送るなら、面接の当日か翌日までに

### 送る前のチェック

```figure
type: checklist
title: 送信ボタンを押す前に
items:
  - 件名に用件と名前が入っているか
  - 宛名の会社名・担当者名に誤りはないか
  - 日時を書き写したなら、曜日まで合っているか
  - 添付ファイルを付け忘れていないか
  - 署名に電話番号とメールアドレスがあるか
```

## 敬語に自信がないときは

ハローワーク浦和のコラムでは、就職活動では問い合わせや面接の日程調整、お礼などメールを使う機会が多い一方で、本文の敬語はむずかしいと書かれています。迷ったときはハローワークに相談できると案内されています。

ハローワークでは、応募書類の作り方や面接の受け答えについて、無料で相談できます。書いたメールを身近な人に読んでもらうのも、誤字や分かりにくいところに気づくきっかけになります。

敬語は完璧でなくても、**用件が分かり、相手への気づかいが伝わる**メールであれば十分です。面接そのものの準備は[未経験職種の面接、何を準備する？](/articles/mensetsu-junbi-mikeiken)で紹介しています。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '転職の応募メール・日程調整・お礼メールの書き方と例文', '転職活動で送るメールの書き方を紹介します。件名の付け方、応募書類を送るときの本文と添付ファイル、面接日程の返信・候補日の出し方・変更のお願い、面接後のお礼メールの例文、返信のタイミングが分かります。', array['mensetsu-junbi-mikeiken', 'rirekisho-kakukoto-nai', 'zaishoku-tenshoku-susumekata', 'naitei-jitai-tsutaekata', 'web-mensetsu-junbi']::text[], '{}'::text[], array['mensetsu']::text[], array['hajimete', 'pc-mikeiken']::text[], array['応募のメール、', '何て書けばいい？']::text[], null, false, '[{"q":"会社からのメールに返信するとき、件名は変えたほうがいいですか？","a":"返信のときは、件名の「Re:」を残したまま変えずに送るのが一般的です。担当者が、どのやりとりへの返事なのかをすぐに見つけられます。自分から新しく送るときは「応募書類送付の件／山田太郎」のように、用件と名前を入れます。"},{"q":"面接のあとのお礼メールは、送らないと不利になりますか？","a":"お礼メールを送るかどうかで結果が決まるとは言えません。送る場合は、長い自己PRは書かず、時間をとってもらったお礼と、面接で印象に残ったことを短く書けば十分です。送るなら、面接の当日か翌日までに送りましょう。"},{"q":"敬語が合っているか不安です。誰かに見てもらえますか？","a":"ハローワークでは、応募書類の作り方や面接の受け方について無料で相談でき、メールの書き方に迷ったときに相談できると案内しているハローワークもあります。身近な人に読んでもらうのも、誤字や分かりにくいところに気づくきっかけになります。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"メールのマナーを「覚える決まり」ではなく「担当者が迷わず処理できるか」で説明する。件名・結論・署名の3点と、場面ごとにそのまま使える例文を出す","quotes":[{"source_url":"https://jsite.mhlw.go.jp/aomori-roudoukyoku/content/contents/002105366.pdf","text":"件名は簡潔に「用件と氏名」（例：応募書類送付の件／青森太郎）。メールの本文が送付状になるので送付状と同様の文面を入力する。添付ファイルは企業の指示がない限りPDF形式に変換することをすすめ、ファイル名は「書類名、名前」など分かりやすいものに。署名は氏名・郵便番号・住所・電話番号・メールアドレスの順。宛先と添付ファイルを確認してから送信する（jsite.mhlw.go.jp に直接接続できなかったため、WebSearch の検索結果に表示された資料の記述で確認。資料の正式な題名は確認できなかったため、内容を表す題名で記録）","used_in":"応募書類をメールで送るとき"},{"source_url":"https://jsite.mhlw.go.jp/saitama-hellowork/content/contents/001671336.pdf","text":"就活では「説明会の問い合わせ」「ESの提出」「面接の日程調整」「お礼」などメールを利用する機会が多々ある。宛名・挨拶・署名の書き方はおおよそ調べれば分かるが、本文で使う敬語はむずかしい。迷ったらハローワークに相談できる（直接接続できなかったため、検索結果に表示された冒頭部分で確認）","used_in":"敬語に自信がないときは"},{"source_url":"https://www.mhlw.go.jp/stf/newpage_27742.html","text":"応募書類の作成、面接対策まで専門スタッフが無料でサポート。応募する求人に合わせた応募書類の書き方や面接の受け答えなどについて助言を行う（検索結果に表示されたページの記述で確認）","used_in":"敬語に自信がないときは"}],"not_used":["「返信は24時間以内」「お礼メールで評価が上がる」などの目安・効果は公的な根拠を確認できなかったので、数字は書かず「できるだけその日のうちに」とし、効果は断定しない","転職サイト各社のメールテンプレートは特定サービスに寄るため参考にとどめ、出典にしない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'oubo-mail-kakikata' and c.slug = 'shorui-mensetsu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'oubo-mail-kakikata' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '応募書類をメールで送る場合の例（資料）', '厚生労働省 青森労働局', 'https://jsite.mhlw.go.jp/aomori-roudoukyoku/content/contents/002105366.pdf', '2026-10-09'::date, '件名は「用件と氏名」で簡潔にすること（例：応募書類送付の件／氏名）、メール本文が送付状の役割をすること、添付ファイルは企業の指示がなければPDFにし、ファイル名を「書類名と氏名」にすること、署名に氏名と連絡先を入れること、送信前に宛先と添付ファイルを確かめること', 0 from articles where slug = 'oubo-mail-kakikata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '就活メールに困ったら（ハローワーク浦和 就職支援ナビゲーターのコラム）', '厚生労働省 埼玉労働局 ハローワーク浦和', 'https://jsite.mhlw.go.jp/saitama-hellowork/content/contents/001671336.pdf', '2026-10-09'::date, '就職活動では問い合わせ・面接の日程調整・お礼などでメールを使う機会が多いこと、本文の敬語はむずかしく、迷ったらハローワークに相談できること', 1 from articles where slug = 'oubo-mail-kakikata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ハローワークの相談支援', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_27742.html', '2026-10-09'::date, 'ハローワークで応募書類の作り方や面接の受け答えについて、無料で相談できること', 2 from articles where slug = 'oubo-mail-kakikata';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'oubo-mail-kakikata' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"6834a69570d6bea9ab3d7013afc30b09ee19e6b6bad4c2244e7acc4bc36441cd","findings":[]}'::jsonb from articles where slug = 'oubo-mail-kakikata';
update articles set status = 'published' where slug = 'oubo-mail-kakikata';

-- article: pawahara-soudan (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('pawahara-soudan', 'article', 'これってパワハラ？3つの要素と6つの類型で確かめる｜記録の残し方と相談先', 'パワハラかどうかは、厚生労働省が示す3つの要素と6つの類型で整理すると考えやすくなります。指導との違い、会社に義務づけられている相談窓口、相談の前に残しておきたい記録の書き方の例、会社の外の無料の相談先を紹介します。', '上司から毎日のように強い口調で責められる。自分だけ仕事を回してもらえない。でも「自分が仕事できないせいかも」「これくらいでパワハラと言うのは大げさかも」と迷って、誰にも言えずにいる。そんな人は少なくありません。

先に結論を言うと、パワハラかどうかを**ひとりで判定する必要はありません**。厚生労働省が示す「3つの要素」と「6つの類型」で今の状況を整理し、**記録を残して、相談窓口で一緒に考えてもらう**のが近道です。

この記事で分かること：

- パワハラかどうかを考える**3つの要素**と、指導との違い
- **6つの類型**と、それぞれの例
- 会社に義務づけられている**相談窓口**
- **記録の残し方**と、会社の外の**相談先**

## パワハラかどうかは「3つの要素」で考える

厚生労働省は、職場のパワハラを、次の3つの要素を**すべて満たすもの**としています。

1. **優越的な関係を背景とした言動**：上司から部下へ、のように、相手が抵抗したり断ったりしにくい関係の中で行われる言動。同僚や部下からでも、相手の協力がないと仕事が進まない場合などは含まれることがある
2. **業務上必要かつ相当な範囲を超えたもの**：仕事のうえで明らかに必要がない、またはやり方が相当な範囲を超えている
3. **労働者の就業環境が害されるもの**：体や心に苦痛を与えられ、働くうえで見過ごせないほどの支障が出ている

```figure
type: steps
title: パワハラの3つの要素
items:
  - label: 優越的な関係
    text: 断ったり抵抗したりしにくい関係の中での言動
  - label: 必要な範囲を超える
    text: 仕事に必要ない、またはやり方が行き過ぎている
  - label: 就業環境が害される
    text: 心や体の苦痛で、働くうえで支障が出ている
```

### 指導とパワハラの違い

仕事のうえで必要で、やり方も相当な範囲で行われる**指示や指導は、パワハラにはあたりません**。ミスを注意される、やり直しを求められる、というだけでは、パワハラとは言えないこともあります。

境目を考えるときは、次のような点を見てみましょう。

- 注意されている内容は、**仕事のこと**か、それとも**人格や私生活**のことか
- 必要以上に**長い時間**、**何度も**、**ほかの人の前で**責められていないか
- 自分だけが、理由なく**違う扱い**を受けていないか

## 6つの類型と例

厚生労働省は、パワハラの代表的な言動を6つの類型に分けて例を示しています。ただし、これがパワハラのすべてではありません。当てはまらなくても、つらい状況なら相談して大丈夫です。

| 類型 | どんなことか | 例 |
| --- | --- | --- |
| 身体的な攻撃 | 暴行・傷害 | 殴る、蹴る、物を投げつける |
| 精神的な攻撃 | 脅迫・名誉を傷つける・侮辱・ひどい暴言 | 人格を否定するようなことを言う。必要以上に長い時間の厳しい叱責をくり返す |
| 人間関係からの切り離し | 隔離・仲間外し・無視 | 同僚が集団で1人を無視して、職場で孤立させる |
| 過大な要求 | 明らかに不要なことや、できないことを強いる | 必要な教育をしないまま、到底こなせない量や目標を課す |
| 過小な要求 | 理由なく、能力や経験とかけ離れた簡単な仕事しか与えない、仕事を与えない | 嫌がらせのために仕事を与えない |
| 個の侵害 | 私的なことに過度に立ち入る | 病歴などの個人的なことを、本人の了解なくほかの人に話す |

「必要な教育がないまま、到底こなせない目標を課される」のように、未経験で入った職場で起きやすいものもあります。入ったばかりで比べる基準がないときこそ、表と照らし合わせてみてください。

## 会社には相談窓口を置く義務がある

パワハラを防ぐために、会社（事業主）には次のようなことが法律で義務づけられています。中小企業も、**2022年4月1日から**義務の対象です。

- パワハラを許さないという方針を決めて、働く人に知らせる
- **相談窓口を決めて、働く人に知らせる**。相談に適切に対応できる体制をつくる
- 相談があったら、事実を確認し、早く適切に対応する
- 相談した人や関係者のプライバシーを守る

そして、**パワハラについて相談したことや、会社の調査に協力して事実を話したことを理由に、解雇などの不利益な扱いをすることは禁止**されています。

社内の窓口は、就業規則、社内の掲示、イントラネット（社内サイト）、入社時の資料などに書かれていることが多いです。見つからなければ、人事・総務の担当者に「ハラスメントの相談窓口はどこですか」と聞いてみましょう。

## 相談の前に、記録を残しておく

相談するときに一番役に立つのは、**何があったかの記録**です。あとから思い出して書くより、その日のうちにメモしておくほうが正確に残せます。

```figure
type: checklist
title: 記録に残したいこと
items:
  - いつ（日付と時間）
  - どこで（会議室、売り場、オンライン会議など）
  - 誰から
  - 何を言われたか・されたか（言葉はそのまま）
  - その場にいた人
  - そのあと、自分の体や気持ちにどんな影響が出たか
```

書き方の例（仮の例）：

> 2026年9月14日（月）10時ごろ、売り場のバックヤードで、店長から。発注ミスについて「こんなこともできないなら辞めろ」「お前は何をやらせてもだめだ」と、ほかのスタッフ2人の前で約20分。その日は夜まで眠れなかった。

あわせて、次のようなものも残しておきましょう。

- メールやチャットのメッセージ（画面の保存）
- 業務の指示の内容が分かるもの
- 体調を崩して病院に行ったときの記録

会社の内部資料を持ち出すと、別のトラブルになることがあります。何を残しておけばいいか迷ったら、相談先に先に聞きましょう。

## 会社の外の相談先

社内の窓口に相談しづらい、相談したのに対応してもらえない、というときは、会社の外にも無料で相談できる窓口があります。

- **総合労働相談コーナー**：都道府県労働局や労働基準監督署の中などにあり、いじめ・嫌がらせを含む職場のトラブルを、予約不要・無料で、面談か電話で相談できる
- **都道府県労働局の雇用環境・均等部（室）**：会社に相談しても対応してもらえないときの相談先。会社との間のトラブルについて、助言・指導や調停による解決の手助けを受けられる
- **ハラスメント悩み相談室**：厚生労働省の委託事業。電話・メール・SNSで相談できる。受付時間は公式サイトで確認する

相談では、次の順で話すと伝わりやすくなります。

> 「上司からの言動について相談したいです。2026年7月ごろから、ほぼ毎日、ほかの人の前で人格を否定するようなことを言われています。日付と言われた言葉をメモしています。社内の相談窓口にはまだ相談していません。まず何をすればいいか知りたいです。」

眠れない、食欲がない、朝になると体が動かないといった状態が続くときは、相談と並行して、医療機関にかかることも考えてください。

## 辞めるかどうかは、そのあとで考えてもいい

パワハラがつらいとき、「もう辞めたい」と思うのは自然なことです。辞めるのも、ひとつの選択です。ただ、相談して状況が変わることもあるので、記録を残し、一度相談してから決めても遅くはありません。

辞める前に確認しておきたいことは[今の仕事を辞めたいとき、先に確認しておきたいこと](/articles/yametai-mae-kakunin)にまとめています。短い期間で辞めることになっても、次の面接での話し方は準備できます。[面接で退職理由を聞かれたら？](/articles/taishoku-riyuu-mensetsu)や[入社1年以内に辞めた・辞めたいときの転職](/articles/souki-rishoku-tenshoku)も参考にしてください。', 'review', false, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, 'これってパワハラ？3つの要素と6類型・記録の残し方と相談先', '上司の言動がパワハラにあたるか迷ったときに。厚生労働省が示すパワハラの3つの要素と6つの類型、指導との違い、会社の相談窓口の義務、記録の残し方の例、総合労働相談コーナーなど会社の外の無料の相談先を紹介します。', array['yametai-mae-kakunin', 'taishoku-riyuu-mensetsu', 'souki-rishoku-tenshoku', 'roudou-soudan-saki']::text[], '{}'::text[], array['yametai']::text[], array['hajimete', 'dainishinsotsu']::text[], array['これってパワハラ？', '迷ったときの確かめ方']::text[], null, false, '[{"q":"厳しく注意されるのは、全部パワハラですか？","a":"いいえ。仕事のうえで必要で、やり方も相当な範囲で行われる指示や指導は、パワハラにはあたらないとされています。ただし、人格を否定するような言動や、必要以上に長い時間の叱責をくり返すことは、パワハラの例として挙げられています。迷ったら、何を言われたかを記録して、相談窓口で一緒に整理してもらいましょう。"},{"q":"会社の相談窓口に相談したら、不利な扱いを受けませんか？","a":"法律で、パワハラについて相談したことや、会社の調査に協力して事実を話したことを理由に、解雇などの不利益な扱いをすることは禁止されています。それでも社内に相談しづらいときは、総合労働相談コーナーなど会社の外の窓口に相談する方法もあります。"},{"q":"小さな会社でも、パワハラの相談窓口はありますか？","a":"パワハラを防ぐための措置（相談窓口を決めて働く人に知らせることなど）は、2022年4月1日から中小企業でも事業主の義務になっています。どこが窓口かは、就業規則や社内の掲示、イントラネットなどで確認しましょう。分からなければ、人事・総務の担当者に聞いてみましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「パワハラかどうか」を自分ひとりで判定させず、3要素・6類型を「整理の道具」として示す。指導との境目、会社の窓口の義務と不利益取扱いの禁止、記録の書き方（例）、社外の相談先までを一続きにして、次の行動につなげる","quotes":[{"source_url":"https://www.no-harassment.mhlw.go.jp/foundation/harassment_list/power-hara/","text":"職場のパワハラは①優越的な関係を背景とした言動、②業務上必要かつ相当な範囲を超えたもの、③労働者の就業環境が害されるもの、の3要素をすべて満たすもの。客観的にみて業務上必要かつ相当な範囲で行われる適正な業務指示や指導は該当しない。6類型は身体的な攻撃・精神的な攻撃・人間関係からの切り離し・過大な要求・過小な要求・個の侵害で、すべてを網羅するものではない（検索結果に表示された内容で確認）","used_in":"パワハラかどうかは「3つの要素」で考える / 6つの類型と例"},{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyoukintou/seisaku06/index.html","text":"労働施策総合推進法により、事業主にパワハラ防止措置（方針の明確化、相談窓口の設置と周知、事後の迅速かつ適切な対応、プライバシー保護など）が義務づけられ、相談したことや事実を述べたことを理由とする解雇その他不利益な取扱いは禁止。中小事業主は令和4年4月1日から義務（それまでは努力義務）（検索結果で確認）","used_in":"会社には相談窓口を置く義務がある"},{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyoukintou/woman/index.html","text":"パワハラ等について民事上のトラブルが生じた場合、当事者の申出により都道府県労働局が助言・指導や調停により解決に向けた援助を行う。会社に相談しても対応してもらえなかったら都道府県労働局雇用環境・均等部（室）に相談できる（検索結果で確認）","used_in":"会社の外の相談先"},{"source_url":"https://harasu-soudan.mhlw.go.jp/","text":"厚生労働省の委託事業。セクハラ・パワハラ・妊娠出産等に関するハラスメントなどについて、電話・メール・SNSで無料で相談を受け付ける（受付時間は資料の版で違いがあったため本文には書かず、公式サイトで確認するよう案内）","used_in":"会社の外の相談先"},{"source_url":"https://www.mhlw.go.jp/general/seido/chihou/kaiketu/soudan.html","text":"総合労働相談コーナーは各都道府県労働局、労働基準監督署内などに設置され、いじめ・嫌がらせを含むあらゆる分野の労働問題を予約不要・無料で相談できる（検索結果で確認）","used_in":"会社の外の相談先"}],"not_used":["ハラスメント悩み相談室の受付時間は、資料ごとに記載が違ったため書かない","パワハラの相談件数などの統計は、読者の判断に直結しないため使わない","2026年10月1日からのカスタマーハラスメント対策の義務化は、資料の見出しまでしか確認できず、この記事のテーマ（上司・同僚からのパワハラ）からも外れるため扱わない","録音の可否や、損害賠償請求の見込みなど法的な判断は個別の事情によるため、断定せず相談をすすめるにとどめた"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'pawahara-soudan' and c.slug = 'seido' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'pawahara-soudan' and c.slug = 'hatarakikata' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'パワーハラスメントとは（あかるい職場応援団）', '厚生労働省', 'https://www.no-harassment.mhlw.go.jp/foundation/harassment_list/power-hara/', '2026-10-09'::date, 'パワハラの3つの要素、6つの類型とその例、適正な業務指示や指導はパワハラにあたらないこと', 0 from articles where slug = 'pawahara-soudan';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職場におけるハラスメントの防止のために', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyoukintou/seisaku06/index.html', '2026-10-09'::date, 'パワハラ防止措置（相談窓口の設置・周知など）が事業主の義務であること、中小企業は2022年4月1日から義務になったこと、相談を理由とする不利益取扱いの禁止', 1 from articles where slug = 'pawahara-soudan';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職場でのトラブル解決の援助を求める方へ', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyoukintou/woman/index.html', '2026-10-09'::date, '会社が対応しない場合に都道府県労働局の雇用環境・均等部（室）に相談でき、助言・指導や調停による解決の援助を受けられること', 2 from articles where slug = 'pawahara-soudan';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ハラスメント悩み相談室', '厚生労働省（委託事業）', 'https://harasu-soudan.mhlw.go.jp/', '2026-10-09'::date, 'パワハラなどについて電話・メール・SNSで無料で相談できること', 3 from articles where slug = 'pawahara-soudan';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '総合労働相談コーナーのご案内', '厚生労働省', 'https://www.mhlw.go.jp/general/seido/chihou/kaiketu/soudan.html', '2026-10-09'::date, 'いじめ・嫌がらせを含む職場のトラブルを、予約不要・無料で相談できること', 4 from articles where slug = 'pawahara-soudan';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'pawahara-soudan' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"eeda35927ada152dc3923b57bc2f658a44baec4c93e33e6e6b7ed428fd78cd2a","findings":[]}'::jsonb from articles where slug = 'pawahara-soudan';
update articles set status = 'published' where slug = 'pawahara-soudan';

-- article: pc-nigate-jimu (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('pc-nigate-jimu', 'article', 'PCが得意じゃなくても、事務職は目指せる？よく使う操作と練習のしかた', 'パソコンに自信がなくても、事務職を目指すことはできます。大事なのは「苦手」の中身を分けて、事務でよく使う操作から順に練習することです。求められやすい操作の目安、家でできる練習、資格の考え方、面接での伝え方を紹介します。', '「事務職に興味はあるけど、パソコンが得意じゃない」。そう感じて、応募をためらっている人もいると思います。

結論から言うと、パソコンに自信がなくても事務職を目指すことはできます。ただし、何も準備しないまま応募するより、**事務でよく使う操作を知って、少しずつ練習しておく**ほうが、面接でも入社後も気持ちが楽になります。

## 「PCが苦手」って、どのくらい？

まずは、自分の「苦手」の中身を分けてみましょう。全部が苦手という人は意外と少なく、つまずいているところは人によって違います。

| 項目 | できる | 少しできる | まだ |
| --- | --- | --- | --- |
| キーボードで文字を打つ | | | |
| メールを書いて、ファイルを添付する | | | |
| 表計算ソフトに数字を入れて、合計を出す | | | |
| 文書作成ソフトで、ひな形に文字を入れて印刷する | | | |
| ファイルをフォルダに分けて保存し、あとで探す | | | |

紙に書き写して印をつけてみてください。「まだ」が多い項目から練習すれば、限られた時間でも効率よく進められます。

## 事務でよく使うのは、どんな操作？

厚生労働省の職業情報提供サイト「job tag」では、一般事務は書類づくりや数字の集計にパソコンを使い、コピー機やFAXなどの事務機器もよく使う仕事だと説明されています。

求人によって求められる水準は違いますが、未経験の人がまず目指したいのは次のあたりです。

- **文字入力**: 画面の文字を見ながら、手元をあまり見ずに打てる
- **メール**: 宛先・CC の使い分け、件名のつけ方、添付ファイルの送り方
- **表計算**: データの入力、並べ替え、合計や平均を出す簡単な関数
- **文書作成**: 決まったひな形に入力して、印刷や PDF での保存をする

求人票の「必要なスキル」欄に「Excel（関数）」「Word（文書作成）」のように書かれていれば、それがその会社の目安です。事務の仕事内容やパソコン作業の多さは、[職種比較ページの事務](/jobs#jimu)でも確認できます。

## どうやって練習する？

いきなり難しい本を買うより、身近なものを題材にするほうが続けやすいです。たとえば2週間なら、こんな進め方があります。

- **1週目**: 毎日15分、タイピング練習。あわせて、自分あてに添付ファイルつきのメールを送ってみる
- **2週目**: 表計算ソフトで1か月分の支出を入力し、合計と平均を出す。項目ごとに並べ替えてみる
- **仕上げ**: 文書作成ソフトで、自分の職歴を1枚にまとめて PDF で保存する

```figure
type: steps
title: 2週間で練習するなら
items:
  - label: 1週目
    text: 毎日15分のタイピング練習と、添付ファイルつきのメール
  - label: 2週目
    text: 1か月分の支出を入力し、合計と平均を出す
  - label: 仕上げ
    text: 自分の職歴を1枚にまとめて PDF で保存
```

最後の職歴まとめは、そのまま応募書類の下書きにもなります。

仕事を探している人は、ハローワークで公的職業訓練（ハロートレーニング）について相談する方法もあります。厚生労働省によると、受講料は原則無料（テキスト代などは自己負担）で、事務系やITなどのコースがあります。対象になる人や申し込みの方法は、住んでいる地域のハローワークで確認してください。

## 資格は取ったほうがいい？

応募条件に資格が書かれていなければ、資格がなくても応募できます。

パソコンの資格としてよく知られているのが MOS（マイクロソフト オフィス スペシャリスト）です。Word や Excel などのソフトごとに試験があり、Word と Excel には一般レベルと上級レベルがあります。年齢などの受験資格の制限はなく、パソコンで実際にソフトを操作して答える試験です。

資格は「取らないと応募できないもの」ではなく、**練習のゴールを決めるための目安**として考えると気が楽になります。

## 面接ではどう伝える？

パソコンについて聞かれたら、できないことを隠すより、**今できることと、続けている練習**をセットで伝えるのがおすすめです。

```figure
type: compare
title: パソコンについて聞かれたら
columns:
  - label: 避けたい伝え方
    tone: mist
    items:
      - できないことを隠す
  - label: おすすめの伝え方
    tone: mint
    items:
      - 今できること
      - 続けている練習
```

> 表計算ソフトは、データの入力と並べ替え、合計や平均の計算までは自分で練習してできるようになりました。今は毎日タイピングの練習を続けています。入社後に使うソフトがあれば、早めに覚えたいと考えています。

逆質問で「入社後に使うソフトやシステムを教えていただけますか」と聞いておくと、入社までに何を練習すればいいかが分かります。入社後にどう教わるかの確かめ方は、[未経験求人の「研修あり」で確認すべきこと](/articles/mikeiken-kenshu-kakunin)も参考にしてください。

パソコンの操作は、使う回数が増えるほど慣れていきます。「苦手だから無理」と決める前に、5つの項目のうち1つから始めてみてください。パソコンの仕事が初めての人に向けた記事は、[パソコンの仕事をしたことがない人へ](/situations/pc-mikeiken)のページにまとめています。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['sekkyaku-office', 'mikeiken-kenshu-kakunin', 'eigyo-cs-it-support-chigai']::text[], array['jimu']::text[], array['office', 'mikeiken-shokushu']::text[], array['pc-mikeiken']::text[], array['PCが苦手でも、', '事務職って目指せる？']::text[], null, true, '[{"q":"タイピングが遅くても、事務職に応募していいですか？","a":"応募条件に入力の速さが書かれていなければ、応募して構いません。そのうえで、見ないで打てるように練習を続けておくと、入社後の負担が軽くなります。面接では「今どのくらい打てて、どんな練習をしているか」を伝えると印象が変わります。"},{"q":"MOSなどの資格は取ったほうがいいですか？","a":"応募条件に書かれていなければ、資格がなくても応募できます。MOSは受験資格の制限がなく、パソコンで実際にソフトを操作して答える試験なので、練習の目標として使うのは一つの方法です。資格よりも「何ができるか」を具体的に言えることが大切です。"},{"q":"パソコンを持っていなくても練習できますか？","a":"文字入力の練習やメールの書き方はスマートフォンでもある程度はできますが、表計算ソフトの操作はパソコンで練習したほうが身につきやすいです。仕事を探している人は、ハローワークで公的職業訓練（ハロートレーニング）について相談する方法もあります。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「PCが苦手」を分解し、事務でよく使う操作から順に練習する道筋を示す。資格は必須扱いしない","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/428","text":"一般事務は書類の作成・整理、メール対応、伝票、データ入力などを行う。書類作成や集計にはパソコンを使い、コピー機・FAXなどの事務機器もよく使う。","used_in":"事務でよく使うのは、どんな操作？"},{"source_url":"https://mos.odyssey-com.co.jp/","text":"MOSはWord・Excel・PowerPoint・Access・Outlookの操作スキルを証明する資格で、オデッセイコミュニケーションズが運営。CBT方式の実技試験で、年齢・国籍などの受験資格の制限はない（小学生以下は保護者の同意が必要）。","used_in":"資格は取ったほうがいい？"},{"source_url":"https://www.u-can.co.jp/course/data/in_html/158/column/column07.html","text":"MOSには一般レベル（アソシエイト）と上級レベル（エキスパート）があり、WordとExcelは両方のレベルがある。筆記はなく実技で、結果はその場で表示される。","used_in":"資格は取ったほうがいい？"},{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/jinzaikaihatsu/rishokusha.html","text":"公共職業訓練（離職者訓練）は主に雇用保険を受給している求職者、求職者支援訓練は主に雇用保険を受給できない求職者が対象で、いずれも受講料は無料（テキスト代等は自己負担）。","used_in":"どうやって練習する？"},{"source_url":"https://www.mhlw.go.jp/hellotraining/about","text":"ハロートレーニング（公的職業訓練）は就職に必要な技能・知識を身につけるための職業訓練制度で、受講料は原則無料。事務系をはじめ、介護、IT、製造、建設、デザインなどのコースがある。","used_in":"どうやって練習する？"}]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'pc-nigate-jimu' and c.slug = 'shokushu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'pc-nigate-jimu' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '一般事務 - 職業詳細（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/428', '2026-10-06'::date, '一般事務の仕事内容と、書類づくりや集計にパソコンを使い、コピー機・FAXなどの事務機器もよく使うこと', 0 from articles where slug = 'pc-nigate-jimu';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'マイクロソフト オフィス スペシャリスト（MOS）公式サイト', '株式会社オデッセイコミュニケーションズ', 'https://mos.odyssey-com.co.jp/', '2026-10-06'::date, 'MOSの試験科目（Word・Excelなど）、一般レベルと上級レベル、パソコンで操作して答える試験であること、受験資格の制限がないこと', 1 from articles where slug = 'pc-nigate-jimu';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'MOS 365とは｜MOS 2019やMOS 2016と違う点・試験詳細まで解説', 'ユーキャン', 'https://www.u-can.co.jp/course/data/in_html/158/column/column07.html', '2026-10-06'::date, 'Word・Excelに一般レベルと上級レベル（エキスパート）があること、実技形式の試験であること（公式サイトの補足）', 2 from articles where slug = 'pc-nigate-jimu';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ハロートレーニング（離職者訓練・求職者支援訓練）', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/jinzaikaihatsu/rishokusha.html', '2026-10-06'::date, '公的職業訓練の対象者、受講料が無料（テキスト代等は自己負担）であること', 3 from articles where slug = 'pc-nigate-jimu';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ハロートレーニングとは', '厚生労働省', 'https://www.mhlw.go.jp/hellotraining/about', '2026-10-06'::date, '受講料は原則無料であること、事務系やITなどの訓練コースがあること', 4 from articles where slug = 'pc-nigate-jimu';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'pc-nigate-jimu' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"503aa20f066789f580f9de2e3aa5be9f77dd01d5a23048539b0249d015ed66cc","findings":[]}'::jsonb from articles where slug = 'pc-nigate-jimu';
update articles set status = 'published' where slug = 'pc-nigate-jimu';

-- article: programmer-mikeiken (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('programmer-mikeiken', 'article', '未経験からプログラマーを目指すには？仕事内容・学び方と、研修のある求人の見方', 'プログラマーは、設計書をもとにプログラミング言語でプログラムを作り、正しく動くかを確かめる仕事です。未経験から目指すときの学び方の順番、「研修あり」の求人で確かめたいこと、ITサポートなど別の入口から近づく道との比べ方を紹介します。', '「プログラマーになってみたい。でも、プログラミングはほとんどしたことがない」。そう思ったときに最初に知っておきたいのは、**プログラマーの仕事の中身と、入社前にどこまで準備しておくと話がしやすいか**です。

先に結論を言うと、未経験から目指すなら、**①仕事内容を知る → ②小さなものを作ってみる → ③研修と配属後の教え方を確かめて応募する**の順で進めると、迷いが少なくなります。ITサポートのような「支える仕事」から近づく道もあります。

この記事で分かること：

- プログラマーの**仕事内容**
- 未経験からの**学び方の順番**
- 「研修あり」の求人で**確かめたいこと**
- ITサポートなど**別の入口**との比べ方

ITの仕事全体の地図は[未経験のIT、どんな仕事から始まる？](/articles/mikeiken-it-hajimari)にまとめています。この記事では「作る仕事」のプログラマーにしぼって紹介します。

## プログラマーって、どんな仕事？

厚生労働省の職業情報提供サイト「job tag」では、プログラマーは、システムエンジニア（SE）などが作った**設計書・仕様書をもとに、プログラミング言語を使ってシステムやソフトウェアを作る仕事**として紹介されています。作ったものが正しく動くかを**テストし、不具合（バグ）を直す**ところまでが仕事に入ります。

Webプログラマー、ソフトウェアプログラマーなど、作るものによって呼び方が変わります。仕事の流れは、おおまかに次のようになります。

```figure
type: steps
title: プログラマーの仕事の流れ
items:
  - label: 設計書を読む
    text: 何を作るか、どう動けばよいかを確かめる
  - label: プログラムを書く
    text: 決められた言語でプログラムを作る
  - label: テストする
    text: 思ったとおりに動くかを確かめる
  - label: 不具合を直す
    text: 原因を調べて直し、もう一度確かめる
```

イメージと違いやすいのは、**一日中ひとりで黙々と書いているわけではない**ところです。設計書で分からないところを確認したり、チームで進み具合を共有したりと、人とやりとりする時間もあります。また、書く時間と同じくらい、**動かない原因を調べる時間**が長くなることもあります。

### 向いているかを考えるヒント

- 思ったとおりに動かないとき、原因を一つずつ調べるのが苦にならない
- 分からないことを、自分で調べたり人に聞いたりできる
- 同じ確認を何度もくり返すことができる

全部に当てはまらなくても大丈夫です。実際に小さなものを作ってみると、自分に合うかどうかが見えてきます。

## 未経験からの学び方は？順番を決めておく

学び方で迷う人が多いのは、教材や言語の選択肢が多すぎるからです。次の順番で考えると、しぼりやすくなります。

### 1. 何を作る仕事に興味があるかを決める

Webサイト、会社の中で使う業務システム、スマホのアプリなど、作るものによって使う言語が変わります。求人をいくつか見て、「開発言語」の欄によく出てくる言語を書き出してみると、学ぶ言語を決める手がかりになります。

### 2. 入門の教材を1つ選び、最後までやる

教材を次々に変えるより、**1つを終わらせる**ことを目標にしましょう。本でも、無料の学習サイトでもかまいません。

### 3. 小さなものを自分で作ってみる

教材のまねだけで終わらせず、自分で考えて小さなものを作ってみます。たとえば次のようなものです。

- 自分の好きなお店を紹介する、1ページのWebサイト
- 毎月の出費を入力すると合計が出る、かんたんな計算ツール

### 4. 何をしたか、言葉にしておく

面接では「勉強しています」だけより、何を作り、どこでつまずき、どう解決したかを話せるほうが伝わります。

> 「独学で1ページのWebサイトを作りました。画像の位置がずれて表示されたときに、原因を調べて直すところがいちばん時間がかかりましたが、解決できたときにこの仕事をしたいと思いました。」

ひとりで続けるのが不安なら、国の職業訓練（ハロートレーニング）を調べてみるのも一つの方法です。どんな分野の訓練があるかは地域や時期で違うので、ハローワークで確認しましょう。しくみは[ハロートレーニング（公共職業訓練）とは？](/articles/hello-training)で紹介しています。

## 「研修あり」の求人、何を確かめる？

未経験可のプログラマーの求人には「研修あり」と書かれていることがありますが、中身は会社によって大きく違います。次の点を確かめましょう。

```figure
type: checklist
title: 研修のある求人で確かめたいこと
items:
  - 研修の期間と、学ぶ内容（言語・作るもの）
  - 研修中の給料や雇用形態は本採用と同じか
  - 配属後、誰に質問できるか
  - 一人で担当を持つまでの目安
  - 自社で開発するのか、取引先で働くのか
  - 研修後の配属先は開発の仕事か
```

最後の2つは見落としやすいところです。会社によっては、取引先の会社に常駐して働く場合や、研修のあとに開発以外の仕事（テストや運用など）から始める場合もあります。それが悪いわけではありませんが、**「プログラムを書く仕事ができると思っていたのに違った」**とならないよう、入社前に確かめておきましょう。

面接では、こんな聞き方ができます。

- 未経験で入社した方は、研修のあと、最初にどんな仕事を担当していますか
- 配属後に分からないことがあったとき、どなたに相談できますか
- 勤務先は自社ですか。それとも、お客さまの会社に常駐することもありますか

研修の確かめ方全体は[未経験求人の「研修あり」で確認すべきこと](/articles/mikeiken-kenshu-kakunin)でくわしく紹介しています。

## ITサポートから近づく道もある

プログラマーの求人に応募するだけが道ではありません。job tagで紹介されている**ヘルプデスク（IT）**は、システムや機器を使っている人からの疑問やトラブルの問い合わせに、電話・メール・訪問で応える仕事です。社内向けと社外向けがあります。

| | プログラマー | ITサポート（ヘルプデスク） |
| --- | --- | --- |
| 主にすること | 設計書をもとにプログラムを作り、テストする | 使う人の困りごとを聞き、解決を手伝う |
| 接客経験との近さ | やや遠い | 近い（聞き取り・説明） |
| 入社前の準備 | 小さなものを作ってみると話しやすい | パソコンやスマホのトラブルを調べた経験が話しやすい |

ITサポートで働きながら、システムのしくみや社内のツールに触れ、プログラミングの勉強を続けて開発の仕事を目指す人もいます。ただし、社内で開発の仕事に移れる道があるかどうかは会社によって違うので、面接で「この仕事のあと、どのような仕事に進む方が多いですか」と聞いてみましょう。ほかの職種との比べ方は[営業・カスタマーサポート・ITサポートの違い](/articles/eigyo-cs-it-support-chigai)も参考になります。

## 資格は必要？

プログラマーとして働くのに、なくてはならない資格はありません。

情報処理推進機構（IPA）が実施する**基本情報技術者試験**は、ITを使ったサービスやシステム、ソフトウェアを作る人に必要な基本的な知識・技能を対象にした国家試験です。勉強の目標を決めるために使う人もいます。

ただ、資格の勉強だけを先に進めるより、**手を動かして小さなものを作る経験**と並行するほうが、試験の内容も理解しやすくなります。応募条件に資格が書かれているかどうかは求人ごとに違うので、まずは気になる求人の応募条件を確かめましょう。', 'review', false, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '未経験からプログラマーへ｜仕事内容・学び方・求人の見方', '未経験からプログラマーを目指すときに知っておきたいことを紹介します。設計書をもとにプログラムを作りテストする仕事内容、独学・職業訓練など学び方の順番、研修のある求人で確かめたいこと、ITサポートから近づく道との比べ方が分かります。', array['mikeiken-it-hajimari', 'mikeiken-kenshu-kakunin', 'hello-training', 'web-marketing-mikeiken']::text[], array['it-support']::text[], array['mikeiken-shokushu']::text[], array['pc-mikeiken', 'hajimete']::text[], array['プログラマー、', '未経験からどう目指す？']::text[], null, false, '[{"q":"未経験でもプログラマーの求人に応募できますか？","a":"応募条件に「未経験可」とある求人なら応募できます。ただ、入社後に覚えることは多いので、研修の期間と内容、配属後に誰が教えてくれるかを確かめておくことが大切です。独学で小さなものを作ってみておくと、面接で学んでいることを具体的に話しやすくなります。"},{"q":"プログラミングの勉強は、何から始めればいいですか？","a":"まず、どんなものを作る仕事に興味があるか（Webサイト、業務システム、アプリなど）を決めると、学ぶ言語をしぼりやすくなります。そのうえで、入門の教材を1つ選んで最後までやり、小さなものを自分で作ってみる、という順番がおすすめです。教材を次々に変えるより、1つを終わらせることを目標にしましょう。"},{"q":"資格がないとプログラマーになれませんか？","a":"プログラマーとして働くために必須の資格はありません。情報処理推進機構（IPA）が実施する基本情報技術者試験は、ITのシステムやソフトウェアを作る人に必要な基本的な知識・技能を対象にした国家試験で、勉強の目標にする人もいます。資格より先に、実際に手を動かして作ってみる経験をしておくと、学ぶ内容が頭に入りやすくなります。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"既存の mikeiken-it-hajimari は「ITの入口になりやすい支える仕事」の全体図。この記事は「作る仕事（プログラマー）」に絞り、仕事内容・学び方の順番・研修のある求人の見方を具体的にし、ITサポートなど別の入口との比べ方は既存記事にリンクして役割を分ける","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/313","text":"プログラマーは、SE などが作った設計書・仕様書にもとづき、プログラミング言語を使ってシステムやソフトウェアを作り、正しく動くかテストして不具合を直す。別名に Webプログラマー、Webアプリケーションプログラマー、ソフトウェアプログラマーなどがある（job tag に直接接続できなかったため、検索結果に表示されたページ内容で確認）","used_in":"プログラマーって、どんな仕事？"},{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/320","text":"システムや情報機器などを使用している時に生じる疑問やトラブル等、利用者からの問い合わせに電話、メール、あるいは出向いて対応する。社内向けと社外向けがある（job tag に直接接続できなかったため、検索結果に表示されたページ内容で確認）","used_in":"ITサポートから近づく道もある"},{"source_url":"https://www.ipa.go.jp/shiken/kubun/fe.html","text":"基本情報技術者試験の対象者像は、ITを活用したサービス、製品、システム及びソフトウェアを作る人材に必要な基本的な知識・技能をもち、実践的な活用能力を身に付けた者（IPA のサイトに直接接続できなかったため、検索結果に表示されたページ内容で確認）","used_in":"資格は必要？"}],"not_used":["job tag のプログラマーの賃金・就業者数・求人倍率などの数値は、検索結果だけでは最新の値を確認できなかったので書かない","プログラミングスクールの費用や期間は、特定のサービスに触れることになり、公的な根拠もないため扱わない","「〇か月の勉強で就職できる」といった目安は根拠がなく、成果保証にもつながるため書かない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'programmer-mikeiken' and c.slug = 'shokushu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'programmer-mikeiken' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'プログラマー - 職業詳細（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/313', '2026-10-09'::date, 'プログラマーの仕事内容（設計書・仕様書にもとづいてプログラミング言語でプログラムを作り、テストして不具合を直すこと）、Webプログラマーなどの別名があること', 0 from articles where slug = 'programmer-mikeiken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ヘルプデスク（IT） - 職業詳細（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/320', '2026-10-09'::date, 'ヘルプデスクの仕事内容（利用者からの疑問やトラブルの問い合わせに電話・メール・訪問で対応すること、社内向けと社外向けがあること）', 1 from articles where slug = 'programmer-mikeiken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '基本情報技術者試験', '独立行政法人情報処理推進機構（IPA）', 'https://www.ipa.go.jp/shiken/kubun/fe.html', '2026-10-09'::date, '基本情報技術者試験がIPAの実施する国家試験で、ITを活用したサービス・製品・システム・ソフトウェアを作る人材に必要な基本的な知識・技能を対象にしていること', 2 from articles where slug = 'programmer-mikeiken';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'programmer-mikeiken' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"57e16873dce0b3fb080e7a38965848539e688a53caf5434c76edbdee3551e0d1","findings":[]}'::jsonb from articles where slug = 'programmer-mikeiken';
update articles set status = 'published' where slug = 'programmer-mikeiken';

-- article: remote-work-kyujin (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('remote-work-kyujin', 'article', '「リモートワーク可」の求人、どこを見る？頻度・条件・費用と入社直後の出社を確かめる', '求人の「リモート可」「在宅勤務あり」は、会社によって意味が大きく違います。週に何日か、誰が対象か、入社直後は出社か、通信費や機器はどうなるかを確かめましょう。厚生労働省のテレワークガイドラインをもとに、求人の読み方と面接での聞き方の例を紹介します。', '「リモートワーク可」「在宅勤務あり」と書かれた求人を見ると、通勤がなくなる、家で落ち着いて働ける、と期待がふくらみます。でも、入社してみたら「在宅は週1日だけだった」「最初の半年は毎日出社だった」ということもあります。

先に結論を言うと、「リモート可」という言葉は会社によって意味の幅が大きいので、**頻度・対象・入社直後の働き方・費用・書面**の5つに分けて確かめるのがおすすめです。

この記事で分かること：

- 「リモート可」の**書き方の違い**と読み方
- **入社直後は出社**になることがある理由
- **通信費・電気代・パソコン**の扱いの確かめ方
- 面接で聞くときの**質問例**

## 「リモート可」の書き方はいろいろ

同じ「リモート」でも、求人の書き方によって働き方はかなり違います。

| 求人の書き方（例） | 読み方 |
| --- | --- |
| フルリモート | 基本は出社しない。ただし研修や会議で出社する日があるかは確認したい |
| 在宅勤務 週〇日まで | 週の何日かは出社する。出社日を自分で選べるかは会社による |
| リモート可（部署・業務による） | 配属先によっては在宅がない場合もある |
| 入社後〇か月は出社 | 仕事を覚えるまでは出社。在宅を始める時期と条件を確認したい |
| リモートワーク制度あり | 制度はあるが、実際に使われているか、誰が使えるかは分からない |

「制度がある」ことと、「自分が入社して使える」ことは別です。読み方に迷ったら、次の5つに分けて確かめましょう。

```figure
type: checklist
title: リモート可の求人で確かめること
items:
  - 頻度：週に何日、在宅で働けるか
  - 対象：配属先の部署や職種でも使えるか
  - 入社直後：最初は出社か、いつから在宅か
  - 費用：通信費やパソコンの扱い
  - 書面：労働条件通知書の就業場所
```

## 頻度と対象：自分の仕事で使えるか

まず確かめたいのは、**週に何日在宅で働けるか**と、**自分が入る部署・職種でも使えるか**です。

- 会社全体では在宅が多くても、電話対応や書類の受け取りがある部署では出社が中心、ということもあります
- 「在宅は申請制」「上司の許可が必要」など、使うための条件がある会社もあります

厚生労働省の「テレワークの適切な導入及び実施の推進のためのガイドライン」では、テレワークの対象者を選ぶとき、**正社員か非正規かといった雇用形態の違いだけを理由に対象から外さないよう留意する**ことが示されています。とはいえ、どの仕事を在宅にするかは会社が決めることなので、自分の仕事がどうなるかは個別に確認しましょう。

## 入社直後は出社？

中途入社でよくあるのが、**入社してしばらくは出社**というケースです。

同じガイドラインでは、新入社員、中途採用の社員、異動直後の社員は、**テレワークと出社を組み合わせるなど、コミュニケーションに特に配慮することが望ましい**とされています。仕事を覚えるまでは、隣で聞いたり、画面をのぞいてもらったりしたほうが早いことも多いからです。

特に未経験の職種に移る場合は、最初から在宅だと、分からないことを聞くタイミングがつかみにくいこともあります。次のような点を聞いておくと、入社後の働き方を想像しやすくなります。

- 研修や最初の数か月は出社か在宅か
- 在宅を始める時期は決まっているか（期間で決まるのか、上司の判断なのか）
- 在宅のとき、チャットやオンライン会議ですぐ質問できるか

接客など現場の仕事からオフィスワークへ移るときの働き方の違いは、[接客からオフィスワークに移るとき、働き方はどう変わる？](/articles/sekkyaku-office)にまとめています。

## 通信費・電気代・パソコンはどうなる？

在宅で働くと、家のインターネットや電気を仕事に使うことになります。この費用の扱いは**会社によって違います**。

ガイドラインでは、テレワークによって働く人に**過度の負担が生じることは望ましくない**とし、費用の扱いは**労使で十分に話し合い、ルールを就業規則などに定めておくことが望ましい**とされています。また、働く人に機器などの費用を負担させる場合は、**就業規則に定めなければならない**とされています。

確かめたいのは、たとえば次の点です。

- パソコンや携帯電話は**会社から貸してもらえるか**、自分のものを使うのか
- 通信費や電気代に充てる**手当があるか**（在宅勤務手当など）
- 机や椅子など、**家の環境づくりの費用**の扱い
- 出社日の**交通費**はどう支払われるか（定期代か、日数分の実費か）

在宅の日が多い会社では、通勤手当を定期代ではなく実費で払う決まりにしていることもあります。手取りに関わるので、内定後の条件確認で聞いておきましょう。

## 書面のどこに書かれる？

内定後に受け取る労働条件通知書（雇用契約書）では、**就業場所**の欄を見ます。

2024年4月からは、入社直後の就業場所に加えて、その**変更の範囲**も書かれるようになりました。厚生労働省のQ&Aでは、その労働契約の期間中にテレワークを行うことが**通常想定される場合は、自宅やサテライトオフィスなどテレワークを行う場所を示す**こととされています。

面接で「在宅勤務ができます」と聞いていたのに、書面の就業場所が本社だけになっている場合は、在宅勤務の扱いがどうなるのかを確認しましょう。労働条件通知書の見方全体は、[内定をもらったら、承諾の前に確認すること](/articles/naitei-shodaku-mae)で紹介しています。

## 面接で、どう聞く？

リモートワークのことを聞くときは、「楽をしたい」と受け取られないように、**働き方を具体的に知りたい**という形で聞くと自然です。

### 質問の例

- 「配属予定の部署では、在宅勤務と出社はどのくらいの割合で働いている方が多いですか」
- 「入社後、研修や仕事に慣れるまでの期間は、出社と在宅のどちらが中心になりますか」
- 「在宅勤務のとき、分からないことはどのように質問できますか」
- 「在宅勤務で使うパソコンや通信環境は、会社から用意していただけるのでしょうか」

```figure
type: steps
title: リモートワークの確かめ方の順番
items:
  - label: 求人を読む
    text: 頻度・対象・入社直後の書き方を見る
  - label: 面接で聞く
    text: 配属先の実際の働き方と、最初の数か月
  - label: 書面で見る
    text: 就業場所と、手当・費用の扱い
```

面接の最後の質問で何を聞くかは、[面接の逆質問、何を聞けばいい？](/articles/gyaku-shitsumon)も参考になります。

## まとめ

- 「リモート可」は会社によって意味の幅が大きい
- 頻度・対象・入社直後・費用・書面の5つに分けて確かめる
- 中途入社は、最初は出社が中心になることもある
- 通信費やパソコンの扱いは会社ごとのルールを確認する
- 労働条件通知書の就業場所に、在宅勤務の扱いが書かれているかを見る

入社前に確かめておきたいこと全体は、[転職で後悔しないために、入社前に確認したいこと](/articles/tenshoku-koukai-shinai)にまとめています。', 'review', false, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, 'リモートワーク可の求人の見方｜頻度・費用・出社の確認', '「リモート可」「在宅勤務あり」の求人は何を確かめればいい？週の日数や対象者、入社直後は出社になるか、通信費やパソコンの扱い、労働条件通知書の就業場所の書き方を、厚生労働省のテレワークガイドラインをもとに紹介します。', array['sekkyaku-office', 'naitei-shodaku-mae', 'tenshoku-koukai-shinai', 'tenkin-kinmuchi-kakunin', 'fukuri-kousei-mikata']::text[], '{}'::text[], array['office']::text[], array['hajimete', 'sekkyaku']::text[], array['「リモート可」って', '毎日家で働ける？']::text[], null, false, '[{"q":"求人に「リモート可」とあれば、入社してすぐ在宅で働けますか？","a":"会社によって違います。入社後しばらくは出社して仕事を覚え、慣れてから在宅勤務を始める決まりにしている会社もあります。厚生労働省のテレワークガイドラインでも、中途採用の社員などは、出社と組み合わせるなどコミュニケーションに特に配慮することが望ましいとされています。入社直後の働き方は、面接で確かめておきましょう。"},{"q":"在宅勤務の通信費や電気代は、会社が払ってくれますか？","a":"会社によって違います。厚生労働省のガイドラインでは、テレワークにかかる費用は労使で十分に話し合い、ルールを就業規則などに定めておくことが望ましいとされています。働く人に費用を負担させる場合は、就業規則に定めることが必要です。手当があるか、パソコンなどの機器は貸してもらえるかを確認しましょう。"},{"q":"未経験の職種でも、リモートワークの求人に応募して大丈夫ですか？","a":"応募すること自体は問題ありません。ただ、仕事を覚えるまでは周りに聞きながら進めることが多いので、研修や最初の数か月が出社なのか在宅なのか、在宅のときに質問しやすいしくみがあるかを確かめておくと、入社後に困りにくくなります。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「リモート可」という言葉の幅の広さを示し、頻度・対象・入社直後・費用・書面の5つに分けて確かめる。未経験で入る人は「最初の数か月の働き方」と「聞きやすさ」が大事なので、そこに質問例を厚めにする","quotes":[{"source_url":"https://www.mhlw.go.jp/content/000759469.pdf","text":"テレワークの対象者を選定するに当たっては、正規雇用労働者、非正規雇用労働者といった雇用形態の違いのみを理由としてテレワーク対象者から除外することのないよう留意する。新入社員、中途採用の社員及び異動直後の社員は、テレワークと出社を組み合わせるなど、コミュニケーションの円滑化に特段の配慮をすることが望ましい（直接接続できなかったため、検索結果に表示された記述で確認）","used_in":"入社直後は出社？"},{"source_url":"https://www.mhlw.go.jp/content/000759469.pdf","text":"テレワークを行うことによって労働者に過度の負担が生じることは望ましくない。個々の企業ごとの業務内容、物品の貸与状況等により費用負担の取扱いは様々であるため、労使で十分に話し合い、企業ごとの状況に応じたルールを定め、就業規則等において規定しておくことが望ましい。労働者に情報通信機器等の負担をさせる定めをする場合は、就業規則に規定しなければならない（労働基準法第89条第5号）（直接接続できなかったため、検索結果に表示された記述で確認）","used_in":"通信費・電気代・パソコンはどうなる？"},{"source_url":"https://telework.mhlw.go.jp/info/qa/013/","text":"テレワーク総合ポータルサイトの Q&A「テレワーク実施の際に要した通信費用・水道光熱費などの費用は会社が負担すべきでしょうか。」（直接接続できず、回答本文は確認できなかったため、検索結果に表示された題名のみ確認。本文の費用負担の記述はガイドライン本文を根拠にした）","used_in":"通信費・電気代・パソコンはどうなる？"},{"source_url":"https://www.mhlw.go.jp/content/11200000/001156119.pdf","text":"労働契約の期間中にテレワークを行うことが通常想定される場合は、自宅やサテライトオフィスなど、テレワークを行う場所を就業場所（変更の範囲）として明示する（直接接続できなかったため、検索結果に表示された記述で確認）","used_in":"書面のどこに書かれる？"}],"not_used":["テレワークを導入している企業の割合などの統計は、調査によって数字が違い、年で変わるため書かない","在宅勤務手当の相場の金額は公的な根拠がないため書かない","在宅勤務手当の税金・社会保険の扱いは、記事の目的（求人の読み方）から外れるため扱わない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'remote-work-kyujin' and c.slug = 'hatarakikata' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'remote-work-kyujin' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'テレワークの適切な導入及び実施の推進のためのガイドライン', '厚生労働省', 'https://www.mhlw.go.jp/content/000759469.pdf', '2026-10-09'::date, '雇用形態の違いだけを理由にテレワークの対象から外さないこと。新入社員・中途採用・異動直後の社員はコミュニケーションに特に配慮し、出社と組み合わせることなどが望ましいこと。費用負担は労使で話し合い就業規則等に定めておくことが望ましく、働く人に負担させる場合は就業規則に定める必要があること', 0 from articles where slug = 'remote-work-kyujin';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'テレワーク実施の際に要した通信費用・水道光熱費などの費用は会社が負担すべきでしょうか。（テレワーク総合ポータルサイト Q&A）', '厚生労働省', 'https://telework.mhlw.go.jp/info/qa/013/', '2026-10-09'::date, '通信費・水道光熱費などテレワークにかかる費用を誰が負担するかが、よくある疑問として取り上げられていること（費用の扱いの根拠はガイドライン本文）', 1 from articles where slug = 'remote-work-kyujin';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '令和5年改正労働基準法施行規則等に係る労働条件明示等に関するQ&A', '厚生労働省', 'https://www.mhlw.go.jp/content/11200000/001156119.pdf', '2026-10-09'::date, 'テレワークを行うことが通常想定される場合、労働条件の明示で就業場所（変更の範囲）に自宅などテレワークを行う場所を示すこと', 2 from articles where slug = 'remote-work-kyujin';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'remote-work-kyujin' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"417b59a65382f575993a5bc0ac4a32378e4bfa5e3522075db594254c4bbe8f3b","findings":[]}'::jsonb from articles where slug = 'remote-work-kyujin';
update articles set status = 'published' where slug = 'remote-work-kyujin';

-- article: rirekisho-kakikata-kihon (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('rirekisho-kakikata-kihon', 'article', '転職の履歴書の書き方｜学歴・職歴・資格・志望動機・本人希望欄を欄ごとに確認', '転職の履歴書は、どの欄も「事実を正確に、応募先が読みやすく」が基本です。厚生労働省の履歴書様式例とハローワークの資料をもとに、日付・写真から学歴・職歴・免許資格・志望動機・本人希望記入欄まで、欄ごとの書き方と記入例、手書きとパソコンの考え方を紹介します。', 'はじめて転職の履歴書を書くとき、「学歴はどこから書く？」「日付はいつにする？」と、細かいところで手が止まりがちです。

先に結論を言うと、履歴書は**事実を正確に、応募先が読みやすい形で書く書類**です。凝った言い回しより、年月や会社名を正しく書くことのほうが大事です。

この記事では、厚生労働省の履歴書様式例とハローワークの資料をもとに、上の欄から順に書き方を紹介します。正社員の経験が少なくて「そもそも書くことがない」と感じている人は、[履歴書に書くことがないと思ったとき](/articles/rirekisho-kakukoto-nai)もあわせて読んでみてください。

## どの様式を使う？手書きとパソコンは？

### 様式に迷ったら、厚生労働省の様式例

市販の履歴書にはいろいろな種類がありますが、迷ったら**厚生労働省の履歴書様式例**を使う方法があります。2021年4月に作られたもので、ハローワークインターネットサービスで公開されています。

この様式例では、性別欄は任意記載（書かないことも可能）で、通勤時間・扶養家族数・配偶者の欄はありません。応募先から様式の指定がある場合は、そちらに合わせましょう。

### 手書きかパソコンかは、指定がなければどちらでもいい

ハローワークの資料では、「手書きでもパソコンでも構わない」とする企業が多いので、特に指定がなければ、履歴書を作るのに使える時間などを考えて決めるよう案内されています。

| | 手書き | パソコン |
| --- | --- | --- |
| 向いている場面 | 手書きの指定がある、郵送や持参で出す | メールやWebで出す、何社かに出す |
| 気をつけること | 黒のペンで書く。書き間違えたら新しい用紙に書き直す | 誤字の見落とし。ほかの会社名が残っていないか |

どちらで出すにしても、和暦か西暦かを全体でそろえ、文の終わりは「です・ます」でそろえると読みやすくなります。

## 日付と写真

### 日付は「出す日」を書く

様式例のいちばん上にある「年 月 日現在」の日付は、書いた日ではなく**提出する日**です。ハローワークの資料では、郵送なら投函する日、持参なら持っていく日を書くよう案内されています。

### 写真は「証明写真」を使う

ハローワークの資料では、本人だけが写った正面の上半身で、帽子をかぶらず、背景のない証明写真を使うよう案内されています。スナップ写真を切り取ったものは使いません。撮影はおおむね3か月以内のものが目安です。

- 様式の写真の枠に合う大きさにする
- はがれたときのために、裏に名前を書いてから貼る
- Webで出すときは、写真のデータを取り込める様式か確認する

## 学歴・職歴の書き方

学歴と職歴は、同じ欄に**古い順**で書きます。1行目の中央に「学歴」、学歴を書き終えたら1行あけて中央に「職歴」と書き、最後に右寄せで「以上」と書くのが一般的な形です。

### 学歴：高校卒業から書く人が多い

ハローワークの資料では、学歴はどの時点から書いても差し支えないとされています。転職では「高校卒業」から書く人が多く、学校名は「〇〇高校」と略さず「〇〇県立〇〇高等学校」のように正式な名前で書きます。

### 職歴：会社名・入社と退職・仕事の中身を書く

職歴は、入社と退職をそれぞれ1行ずつ書き、入社の下に**どんな仕事をしていたか**を1行添えると、読む人に伝わりやすくなります。会社名は「(株)」と略さず「株式会社」と書きます。

書き方の例です（架空の学校名・会社名です）。

| 年 | 月 | 学歴・職歴 |
| --- | --- | --- |
| | | 学歴 |
| 2017 | 3 | 〇〇県立〇〇高等学校 卒業 |
| 2017 | 4 | 〇〇専門学校 ビジネス学科 入学 |
| 2019 | 3 | 〇〇専門学校 ビジネス学科 卒業 |
| | | 職歴 |
| 2019 | 4 | 株式会社〇〇 入社（正社員） |
| | | 店舗スタッフとして販売・在庫管理・新人の指導を担当 |
| 2022 | 3 | 一身上の都合により退職 |
| 2022 | 4 | 〇〇株式会社 入社（契約社員） |
| | | コールセンターで問い合わせ対応を担当 |
| | | 現在に至る |
| | | 以上 |

退職の理由は、自分の都合なら「一身上の都合により退職」、会社の倒産や事業所の閉鎖などなら「会社都合により退職」と書くのが一般的です。在職中なら、最後の職歴の次の行に「現在に至る」と書きます。

職歴が多くて欄に入りきらないときや、仕事の中身をもっとくわしく伝えたいときは、職務経歴書で補います。アルバイトの経験を書くときは、[アルバイト経験だけの職務経歴書、何を書けばいい？](/articles/shokumu-keirekisho-arubaito)も参考になります。

働いていなかった期間があっても、年月は事実のまま書きます。説明のしかたは[職歴に空白期間があるとき、面接でどう説明する？](/articles/kuhaku-kikan-setsumei)で紹介しています。

## 免許・資格の書き方

免許・資格は、**取った順に正式な名前で**書きます。

| よくある書き方 | 履歴書に書くときの名前の例 |
| --- | --- |
| 普通免許 | 普通自動車第一種運転免許 取得 |
| 簿記3級 | 日本商工会議所簿記検定試験3級 合格 |
| 英検2級 | 実用英語技能検定2級 合格 |

正式な名前が分からないときは、合格証や免許証、資格を出している団体のサイトで確かめましょう。勉強中のものは「〇〇の取得に向けて勉強中」と、勉強中であることが分かる形で書けます。持っている資格がなければ「特になし」で大丈夫です。

## 志望動機の欄の書き方

様式例では、志望動機は特技やアピールポイントと同じ欄にまとまっています。欄が小さいので、**3〜4行で読める長さ**にまとめます。

書く順番は次の3つです。

1. その会社・仕事に興味を持ったきっかけ
2. これまでの経験とのつながり
3. 入社後に取り組みたいこと

> 販売の仕事で、お客様の問い合わせに答えるうちに、困りごとを聞いて解決する仕事を専門にしたいと考えるようになりました。貴社の求人で、電話とメールでの問い合わせ対応を一から教わりながら担当できると知り、応募しました。接客で身につけた、相手の話を最後まで聞く姿勢を活かし、早く一人で対応できるようになりたいと考えています。

「御社」は話し言葉なので、書類では「貴社」と書きます。どの会社にも出せる文になっていないか、応募する求人の仕事内容と照らし合わせてみてください。くわしい組み立て方は[未経験職種の志望動機、何を書けばいい？](/articles/shiboudouki-mikeiken)で紹介しています。

## 本人希望記入欄の書き方

本人希望記入欄は、給料・職種・勤務時間・勤務地などで**特に希望があるときに書く欄**です。ハローワークの資料では、空欄にはせず、次のように書く方法が紹介されています。

> 勤務条件は貴社の規定に従います。

> 〇〇職を希望します。

具体的な条件の希望は、書類にそのまま並べるより、面接などで相談するのが一般的とされています。家族の事情で勤務地が限られるなど、どうしてもゆずれない条件があるときだけ、理由とあわせて短く書きましょう。

> 家族の介護があるため、〇〇市内の事業所での勤務を希望します。

希望の給料を書くかどうか迷ったときは、[希望年収・希望給与の書き方と面接での答え方](/articles/kibou-nenshu-kakikata)を参考にしてください。

## 出す前に確認したいこと

書き終えたら、次の項目を見直しましょう。

```figure
type: checklist
title: 履歴書を出す前のチェック
items:
  - 日付は提出する日になっている
  - 写真はおおむね3か月以内の証明写真
  - 和暦・西暦がそろっている
  - 学校名・会社名を略さず書いた
  - 入社・退職の年月が合っている
  - 職歴の最後に「以上」がある
  - 志望動機に応募先の名前や仕事が入っている
  - 本人希望記入欄が空欄になっていない
```

とくに入社・退職の年月は、雇用保険の書類や給与明細、年金の記録などで確かめておくと安心です。書いた内容は面接でそのまま質問されることがあるので、**自分の言葉で説明できることだけ**を書いておきましょう。

書き方に自信が持てないときは、ハローワークの窓口で応募書類の書き方を相談する方法もあります。', 'review', false, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '転職の履歴書の書き方｜各欄の記入例と手書き・パソコン', '転職の履歴書はどう書く？厚生労働省の履歴書様式例とハローワークの資料をもとに、日付・写真、学歴・職歴・免許資格・志望動機・本人希望記入欄の書き方と記入例、手書きとパソコンの選び方、提出前のチェック項目を紹介します。', array['rirekisho-kakukoto-nai', 'shiboudouki-mikeiken', 'kibou-nenshu-kakikata', 'shokumu-keirekisho-kakikata', 'shorui-senkou-tooranai']::text[], '{}'::text[], array['mensetsu']::text[], array['hajimete', 'dainishinsotsu']::text[], array['はじめての履歴書、', 'どの欄から書く？']::text[], null, false, '[{"q":"転職の履歴書は、手書きとパソコンのどちらがいいですか？","a":"応募先から指定がなければ、どちらでもかまいません。ハローワークの資料でも、手書きでもパソコンでも構わないとする企業が多いため、書くのに使える時間などを考えて決めるよう案内されています。応募先の指定がある場合は、それに従いましょう。"},{"q":"履歴書の日付は、書いた日と出す日のどちらですか？","a":"提出する日を書きます。ハローワークの資料では、郵送するなら投函する日、持参するなら持っていく日を書くよう案内されています。メールやWebで送る場合も、送る日にそろえておくと迷いません。"},{"q":"本人希望記入欄に書くことがないときは、空欄でいいですか？","a":"空欄にせず、「貴社の規定に従います。」と書くか、「〇〇職を希望します。」のように応募する職種を書く方法がハローワークの資料で紹介されています。勤務地など、どうしてもゆずれない条件があるときだけ、短く書き添えましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「履歴書の基本の書き方」を欄ごとに、記入例つきで一通り示す。書く材料が少ないときの考え方は既存の rirekisho-kakukoto-nai に任せ、本文からリンクして役割を分ける。数字は資料にある「3か月以内」「2021年4月」だけ","quotes":[{"source_url":"https://www.mhlw.go.jp/content/11601000/000769679.pdf","text":"JIS規格の解説から履歴書の様式例が削除されたことを受け、厚生労働省が2021年4月に履歴書の様式例を作成。性別欄は任意記載で未記載も可能。「通勤時間」「扶養家族数（配偶者を除く）」「配偶者」「配偶者の扶養義務」の欄は設けていない（官公庁サイトは直接開けなかったため、既存記事での確認内容と検索結果で確認）","used_in":"どの様式を使う？"},{"source_url":"https://www.hellowork.mhlw.go.jp/doc/kouroushourirekishoA4.pdf","text":"厚生労働省履歴書様式例。「年 月 日現在」「※性別」、学歴・職歴、免許・資格、志望の動機・特技・好きな学科・アピールポイントなど、本人希望記入欄（特に給料・職種・勤務時間・勤務地・その他についての希望などがあれば記入）の欄がある（直接開けなかったため検索結果で確認）","used_in":"どの様式を使う？／本人希望記入欄"},{"source_url":"https://www.hellowork.mhlw.go.jp/doc/oubosyorui_pamphlet_01_070531.pdf","text":"日付は記載日ではなく提出日（郵送の場合は投函日、持参の場合は持参日）。写真は本人のみの正面上半身、無背景・無帽、スナップ写真は不可、概ね3か月以内に撮影したもの。「手書きでもパソコンでも構わない」とする企業が多いので、指定がない場合は履歴書作成に充てられる時間などを考えて判断する。学歴はどの時点から記載しても差し支えない。本人希望記入欄は空欄にせず、「勤務条件は貴社の規定に従います。」や「〇〇職を希望します。」などと記載し、具体的な条件の希望は面接などで相談するのが一般的（直接開けなかったため、ハローワークインターネットサービスの PDF の検索結果の抜粋で確認）","used_in":"日付と写真／手書きとパソコン／学歴／本人希望記入欄"}],"not_used":["手書きとパソコンで選考の結果に差が出るかどうかの調査データは公的な根拠を確認できなかったので書かない","写真のサイズ（縦横の寸法）は様式や地域の資料で書き方が異なり、今回確認しきれなかったので「様式の枠に合わせる」にとどめた","学歴を「中学卒業から」「高校入学から」どちらで書くべきかは資料によって表現が違うため、断定せず「高校卒業から書く人が多いが決まりはない」程度にとどめた"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'rirekisho-kakikata-kihon' and c.slug = 'shorui-mensetsu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'rirekisho-kakikata-kihon' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '履歴書の様式例の作成について', '厚生労働省', 'https://www.mhlw.go.jp/content/11601000/000769679.pdf', '2026-10-09'::date, '厚生労働省が2021年4月に履歴書の様式例を作成したこと、性別欄が任意記載（未記載も可）であること、通勤時間・扶養家族数・配偶者・配偶者の扶養義務の欄を設けていないこと', 0 from articles where slug = 'rirekisho-kakikata-kihon';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '厚生労働省履歴書様式例（A4）', 'ハローワークインターネットサービス（厚生労働省）', 'https://www.hellowork.mhlw.go.jp/doc/kouroushourirekishoA4.pdf', '2026-10-09'::date, '様式例がハローワークインターネットサービスで公開されていること、「年 月 日現在」の日付欄や学歴・職歴、免許・資格、志望の動機など、本人希望記入欄の欄の構成', 1 from articles where slug = 'rirekisho-kakikata-kihon';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '応募書類の作り方「1 履歴書」', 'ハローワークインターネットサービス（厚生労働省）', 'https://www.hellowork.mhlw.go.jp/doc/oubosyorui_pamphlet_01_070531.pdf', '2026-10-09'::date, '日付は提出日（郵送は投函日、持参は持参日）を書くこと、写真は無帽・無背景の正面上半身の証明写真でおおむね3か月以内に撮ったものを使うこと、手書きかパソコンかは指定がなければ時間などを考えて決めること、学歴はどの時点から書いても差し支えないこと、本人希望記入欄を空欄にせず「勤務条件は貴社の規定に従います。」や希望職種を書くこと', 2 from articles where slug = 'rirekisho-kakikata-kihon';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'rirekisho-kakikata-kihon' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"3f9dacb724746b8d307cd8a8ac1f8a7bb74224b35fd0ba3a9b501d1b357bb3e4","findings":[]}'::jsonb from articles where slug = 'rirekisho-kakikata-kihon';
update articles set status = 'published' where slug = 'rirekisho-kakikata-kihon';

-- article: rirekisho-kakukoto-nai (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('rirekisho-kakukoto-nai', 'article', '履歴書に書くことがないと思ったとき｜アルバイト歴・資格・自己PRの書き方', '「正社員の経験がない」「資格もない」と、履歴書の欄が埋まらずに手が止まっていませんか。アルバイト歴の書き方、資格欄が空くとき、空白期間、自己PR欄の考え方を、厚生労働省の履歴書様式例やハローワークの資料をもとに欄ごとに整理します。', '「正社員で働いたことがない」「資格もない」。履歴書を前にして、欄が埋まらずに手が止まってしまう人は少なくありません。

でも多くの場合、書くことが「ない」のではなく、**何を書いていいか分からない**だけです。欄ごとに分けて、ひとつずつ見ていきましょう。

## どの欄で手が止まっている？

迷いやすい欄と、この記事での考え方をまとめました。

| 迷いやすい欄 | 考え方 |
| --- | --- |
| 職歴 | アルバイトも「アルバイト」と明記して書く |
| 免許・資格 | なければ「特になし」。勉強中のものは書ける |
| 空白期間 | 年月は事実のまま。説明は面接で一言 |
| 志望動機・自己PR | アルバイトで「やっていたこと」から書く |

どの様式を使うか迷ったら、厚生労働省が2021年4月に作成した履歴書の様式例を使う方法もあります。ハローワークインターネットサービスで公開されていて、性別欄は任意記載（書かないことも可能）、通勤時間や扶養家族数、配偶者の欄はありません。応募先から様式の指定がある場合は、そちらに合わせましょう。

## アルバイトしかしてない。職歴に書いていい？

書いて大丈夫です。ハローワークの資料では、卒業後のアルバイトや、応募先の仕事に関係するアルバイトは、**アルバイトであることを明記したうえで**書くよう案内されています。

書き方の例です（架空の会社名です）。

| 年 | 月 | 学歴・職歴 |
| --- | --- | --- |
| 2020 | 4 | 株式会社〇〇 〇〇店 入社（アルバイト） |
|  |  | ホールスタッフとして接客・会計・新人への説明を担当 |
| 2023 | 3 | 一身上の都合により退職 |
| 2023 | 4 | 〇〇株式会社 入社（アルバイト） |
|  |  | 現在に至る |
|  |  | 以上 |

書くときのポイントは3つです。

- 和暦か西暦か、どちらかにそろえる
- 店名だけでなく会社名も書く（分からなければ給与明細などで確認する）
- 「何をしていたか」を1行添える

```figure
type: checklist
title: アルバイトを職歴に書くときのポイント
items:
  - 和暦か西暦か、どちらかにそろえる
  - 店名だけでなく会社名も書く
  - 「何をしていたか」を1行添える
```

## 資格がない。空欄でいい？

持っている免許・資格がなければ、「特になし」と書けば十分です。応募資格に資格が書かれていない求人なら、資格欄が空いていても応募できます。運転免許など、仕事に直接関係なさそうなものでも、持っていれば書いておきましょう。

また、ハローワークの資料では、**取得に向けて勉強中のもの**も、勉強中であることをはっきり書けば記入してよいとされています。

> 現在、〇〇検定（〇級）の取得に向けて勉強中

応募する仕事に関係する勉強なら、意欲を伝える材料にもなります。

## 空白期間がある。どう書く？

働いていなかった期間があっても、入社・退職の年月は**事実のまま**書きます。期間をつなげて見せようと年月をずらすと、面接で話がかみ合わなくなり、あとで説明に困ります。

履歴書に理由まで書く必要はありません。そのかわり、面接で聞かれたときに一言で説明できるよう準備しておきましょう。「事実 → 今の状態 → これから」の順に話すと短くまとまります。

```figure
type: steps
title: 空白期間は面接で一言にまとめる
items:
  - label: 事実
    text: 例：1年ほど、家族の介護で仕事を離れていた
  - label: 今の状態
    text: 例：フルタイムで働ける状態
  - label: これから
    text: 例：事務の仕事で長く働きたい
```

> 1年ほど、家族の介護のために仕事を離れていました。今は家族の状況が落ち着き、フルタイムで働ける状態です。これからは事務の仕事で長く働きたいと考えています。

説明の組み立て方は[フリーターから正社員を目指すとき、最初に確認したいこと](/articles/freeter-seishain-hajimeni)でも紹介しています。

## 自己PR欄、実績がなくても書ける？

自己PRや志望動機の欄は、目立つ実績がなくても書けます。アルバイトで**実際にやっていたこと**を、次の順に書き出してみてください。

1. 担当していたこと（例：レジ、発注、新人への説明）
2. その中で工夫したこと（例：混む時間の前に釣り銭を準備した）
3. 応募する仕事でどう使えそうか（例：段取りを考えて動くことを、事務でも大事にしたい）

つなげると、たとえばこんな文になります。

> コンビニエンスストアで約3年、レジや発注、新人への説明を担当しました。混雑する時間帯の前に釣り銭や袋を準備しておくなど、段取りを考えて動くことを心がけてきました。事務の仕事でも、締め切りから逆算して準備することを大切にしたいと考えています。

書いた内容は面接でくわしく聞かれることがあるので、自分の言葉で説明できることだけを書きましょう。アルバイトの経験をもっとくわしく伝えたいときは[アルバイト経験だけの職務経歴書、何を書けばいい？](/articles/shokumu-keirekisho-arubaito)を、志望動機の組み立て方は[未経験職種の志望動機、何を書けばいい？](/articles/shiboudouki-mikeiken)も参考にしてください。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['shokumu-keirekisho-arubaito', 'shiboudouki-mikeiken', 'freeter-seishain-hajimeni', 'rirekisho-kakikata-kihon']::text[], '{}'::text[], array['mensetsu', 'seishain']::text[], array['seishain-keiken-sukunai', 'freeter']::text[], array['履歴書に', '書くことがない…？']::text[], null, false, '[{"q":"アルバイトの経歴は、全部書かないといけませんか？","a":"ハローワークの資料では、学生時代のアルバイトは通常は書かず、卒業後のアルバイトや、応募する仕事に関係するアルバイトなどは「アルバイト」と明記して書くよう案内されています。履歴書に書ききれない仕事の中身は、職務経歴書でくわしく補いましょう。"},{"q":"免許・資格の欄に書けるものがないときは、どうすればいいですか？","a":"「特になし」と書けば十分です。取得に向けて勉強中のものがあれば、「〇〇の取得に向けて勉強中」のように、勉強中であることが分かる形で書くこともできます。"},{"q":"履歴書の性別欄は、書かないといけませんか？","a":"厚生労働省の履歴書様式例では、性別欄は任意記載で、書かないこともできるとされています。応募先から様式の指定がある場合は、その様式に沿って書きましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「書くことがない」を欄ごとに分けて、職歴（アルバイト）・資格・空白期間・自己PRの順に、何をどう書けばいいかを具体例で示す。年月をずらすなど事実と違う書き方はしないよう明記する","quotes":[{"source_url":"https://www.mhlw.go.jp/content/11601000/000769679.pdf","text":"JIS規格の解説から履歴書の様式例が削除されたことを受け、厚生労働省が新たに履歴書の様式例を作成（2021年4月）。性別欄は〔男・女〕の選択ではなく任意記載欄で、未記載も可能。「通勤時間」「扶養家族数（配偶者を除く）」「配偶者」「配偶者の扶養義務」の欄は設けていない","used_in":"どの欄で手が止まっている？／FAQ"},{"source_url":"https://www.hellowork.mhlw.go.jp/doc/kouroushourirekisho.pdf","text":"ハローワークインターネットサービスで公開されている厚生労働省履歴書様式例（性別欄に※印で任意記載の注記）","used_in":"どの欄で手が止まっている？"},{"source_url":"https://www.hellowork.mhlw.go.jp/doc/oubosyorui_pamphlet_01_070531.pdf","text":"学業期間中のアルバイトは通常記載しないが、卒業後のアルバイトや、応募先の職務に関係する場合、責任を与えられた仕事だった場合などは、アルバイト就業であることを明記の上で記載する。免許・資格は、勉強中のものなども、その旨を明示の上で記載するとアピールになる","used_in":"アルバイトしかしてない。職歴に書いていい？／資格がない。空欄でいい？"}],"not_used":["書類選考の通過率や、資格の有無による採否の差などの統計は使っていない","空白期間の書き方について公的な決まりは確認できなかったため、事実をそのまま書くこと・面接での説明の準備をすすめるにとどめた"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'rirekisho-kakukoto-nai' and c.slug = 'shorui-mensetsu' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '履歴書の様式例の作成について', '厚生労働省', 'https://www.mhlw.go.jp/content/11601000/000769679.pdf', '2026-10-06'::date, '厚生労働省が2021年4月に履歴書の様式例を作成したこと、性別欄が任意記載（未記載も可）であること、通勤時間・扶養家族数・配偶者などの欄を設けていないこと', 0 from articles where slug = 'rirekisho-kakukoto-nai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '厚生労働省履歴書様式例', 'ハローワークインターネットサービス（厚生労働省）', 'https://www.hellowork.mhlw.go.jp/doc/kouroushourirekisho.pdf', '2026-10-06'::date, '様式例がハローワークインターネットサービスで公開されていること', 1 from articles where slug = 'rirekisho-kakukoto-nai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '応募書類の作り方「1 履歴書」', 'ハローワークインターネットサービス（厚生労働省）', 'https://www.hellowork.mhlw.go.jp/doc/oubosyorui_pamphlet_01_070531.pdf', '2026-10-06'::date, '卒業後や応募先に関係するアルバイトは「アルバイト」と明記して職歴に書くこと、勉強中の資格も勉強中であることを明示して書けること', 2 from articles where slug = 'rirekisho-kakukoto-nai';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'rirekisho-kakukoto-nai' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"65cff9af0bcc44d4213ecc6ab7ff79e23659f047148381612c03f2021a432a19","findings":[]}'::jsonb from articles where slug = 'rirekisho-kakukoto-nai';
update articles set status = 'published' where slug = 'rirekisho-kakukoto-nai';

-- article: roudou-soudan-saki (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('roudou-soudan-saki', 'article', '給料未払い・残業代・解雇の相談先は？総合労働相談コーナー・労基署・法テラスの違いと相談の準備', '職場のトラブルで迷ったら、まずは無料・予約不要の総合労働相談コーナーに相談するのが入口になります。労働基準監督署、労働条件相談ほっとライン、法テラスとの違い、相談の前にそろえておく記録と、相談での話し方の例を紹介します。', '「今月の給料が振り込まれていない」「残業代が一度も出たことがない」「明日から来なくていいと言われた」「求人に書いてあった条件と違う」。職場でこうしたことが起きたとき、どこに相談すればいいか分からず、ひとりで抱え込んでしまう人は少なくありません。

先に結論を言うと、**迷ったら、まずは総合労働相談コーナー**に相談するのが入口になります。無料で、予約もいりません。そこで話を聞いたうえで、必要なら労働基準監督署などにつないでもらえます。

この記事で分かること：

- 4つの相談先（総合労働相談コーナー・労働基準監督署・労働条件相談ほっとライン・法テラス）の**違い**
- トラブルの種類ごとの**相談先の選び方**
- 相談の前に**そろえておく記録**と、**話し方の例**

## 4つの相談先は、何が違う？

公的な相談先には、それぞれ得意なことがあります。

| 相談先 | どんなところ | 向いている相談 |
| --- | --- | --- |
| 総合労働相談コーナー | 都道府県労働局や労働基準監督署の中などにある、職場のトラブル全般の相談窓口 | 何から相談すればいいか分からないとき。解雇、労働条件の引き下げ、いじめ・嫌がらせなど |
| 労働基準監督署 | 労働基準法などの法律が守られているかを調べ、会社に是正を求める役所 | 給料の未払い、残業代が出ない、違法な長時間労働など |
| 労働条件相談ほっとライン | 厚生労働省の委託事業の電話相談。平日の夜と土日祝日に受け付け | 平日の昼に電話できないとき。まず話を聞いてほしいとき |
| 法テラス | 国が設立した法律の相談窓口。条件を満たすと弁護士などに無料で相談できる | 会社にお金を請求したい、裁判なども含めて考えたいとき |

総合労働相談コーナーと労働基準監督署は同じ建物の中にあることも多く、つながっています。「どっちに行けばいいか」で迷う必要はあまりありません。

### まずは総合労働相談コーナーへ

総合労働相談コーナーは、都道府県労働局や全国の労働基準監督署の中などに置かれています。

- 解雇、雇止め、配置転換、賃金の引き下げ、いじめ・嫌がらせなど、職場のトラブルなら分野を問わず相談できる
- 面談でも電話でもよく、**予約は不要・無料**
- 話を聞いて、法律に違反している疑いがある内容は、労働基準監督署など担当の部署につないでもらえる

近くの総合労働相談コーナーは、住んでいる都道府県の労働局のホームページで探せます。

### 法律違反を正してほしいなら、労働基準監督署

労働基準監督署は、給料の未払いや残業代の不払い、違法な長時間労働など、**労働基準法などの法律に違反していないか**を会社に対して調べる役所です。違反が見つかれば、会社に是正を求めます。

ただし、労働基準監督署は「会社の違反を正す」役所で、あなたの代わりにお金を取り立てるところではありません。会社に払ってもらうための話し合いや請求をどう進めるかは、相談しながら考えることになります。

### 平日の昼に電話できないなら、労働条件相談ほっとライン

仕事中で平日の昼に電話できない人は、厚生労働省の委託事業「労働条件相談ほっとライン」が使えます。

- 電話番号：0120-811-610（無料）
- 受付時間：月〜金は17:00〜22:00、土・日・祝日は9:00〜21:00（12月29日〜1月3日を除く）
- 匿名でも相談できる
- 違法な残業、長時間労働による体調の悪化、賃金の不払い残業（サービス残業）などの相談に、専門の相談員が対応する

ほっとラインは相談を受けて、法律の考え方や相談先を案内するところで、**会社に指導をすることはできません**。会社に動いてもらいたいときは、案内された労働基準監督署などに相談します。受付時間は変わることがあるので、電話する前に厚生労働省のサイト「確かめよう労働条件」で確認しましょう。

### 弁護士に相談したいなら、法テラス

法テラス（日本司法支援センター）は、国が設立した法律の相談窓口です。

- 収入と資産が一定の基準以下の人は、弁護士・司法書士に**無料で法律相談**ができる（同じ問題について3回まで、1回30分程度で、原則予約制）
- 弁護士などに依頼する費用を立て替えてもらう制度もある
- 基準は住んでいる地域や家族の人数で変わるので、法テラスのサイトか電話で確認する

会社に払ってもらえないお金を請求したい、解雇が納得できないので争いたい、といった場合に、法律の専門家の意見を聞く入口になります。

## トラブル別：最初にどこへ相談する？

相談先の選び方を、よくあるトラブルごとにまとめます（あくまで目安です。迷ったら総合労働相談コーナーへ）。

- **給料が支払われない・残業代が出ない**：総合労働相談コーナーか労働基準監督署。平日の昼に動けないならほっとライン
- **突然、解雇された・契約を更新しないと言われた**：総合労働相談コーナー。納得できず争うことも考えるなら法テラス
- **求人や面接で聞いた条件と、実際の条件が違う**：総合労働相談コーナー。労働条件通知書（雇用契約書）の内容と比べながら相談する
- **上司からの嫌がらせ・いじめがつらい**：総合労働相談コーナー

### 話し合いで解決したいときは「あっせん」も

会社とのトラブルを話し合いで解決したいときは、都道府県労働局の**助言・指導**や、紛争調整委員会による**あっせん**という制度もあります。あっせんは、弁護士や大学教授などの専門家が会社とあなたの間に入って話し合いを進めるもので、無料・非公開です。使えるかどうかは、総合労働相談コーナーで相談するときに聞いてみましょう。

```figure
type: compare
title: どこに相談するか迷ったら
columns:
  - label: 総合労働相談コーナー
    tone: mint
    items:
      - 職場のトラブル全般の入口
      - 予約不要・無料
      - 必要なら担当の部署につなぐ
  - label: 労働基準監督署
    tone: sky
    items:
      - 法律に違反していないかを調べる
      - 未払い・違法な残業など
      - 会社に是正を求める
  - label: 法テラス
    tone: sand
    items:
      - 弁護士などに相談できる
      - 収入・資産の条件がある
      - 請求や裁判も含めて考える
```

## 給料・残業代の未払いは早めに

未払いの給料や残業代を会社に請求できる権利には、期限（時効）があります。2020年4月1日以降に支払日が来た賃金は、法律では5年、ただし**当分の間は3年**とされています。

「辞めてから考えよう」と後回しにしていると、古い月の分から請求できなくなっていきます。今の職場を辞めるかどうかに関係なく、気づいた時点で相談しておくと安心です。

## 相談の前にそろえておくもの

相談は手ぶらでもできますが、記録があると「何が起きているか」が早く伝わり、具体的な助言をもらいやすくなります。手元にあるものだけで大丈夫です。

```figure
type: checklist
title: 相談の前にそろえたい記録
items:
  - 労働条件通知書・雇用契約書
  - 求人票や求人サイトの画面の保存
  - 給与明細（できれば数か月分）
  - 出勤・退勤の時刻が分かる記録
  - 就業規則（見られる場合）
  - 上司とのやりとりのメール・チャット
  - 起きたことを日付順に書いたメモ
```

- **出勤・退勤の記録**：タイムカードの写しがなければ、自分の手帳やスマートフォンのメモ、パソコンのログイン時刻、退勤時に送ったメッセージなども手がかりになります。毎日、始業と終業の時刻を書き残しておきましょう
- **解雇されたとき**：いつ、誰から、何と言われたかをメモしておきます。解雇の理由を書いた書面がほしいときは、会社に請求できるか相談のときに聞いてみましょう
- **会社の書類を持ち出すとき**：会社の内部資料を勝手に持ち出すと、別のトラブルになることがあります。何を持っていけばいいか分からなければ、先に相談先に聞きましょう

## 相談では、どう話す？

相談の時間は限られています。**何が起きたか → いつから → 手元にある記録 → どうしたいか**の順に話すと、短く伝わります。

> 「残業代についての相談です。2026年4月に入社してから、毎日1〜2時間ほど残業していますが、給与明細に残業代の記載が一度もありません。手元には給与明細と、自分で付けた出勤・退勤のメモがあります。会社に払ってもらうには、どうすればいいか知りたいです。」

> 「突然の解雇についての相談です。昨日、上司から口頭で『今月末で辞めてもらう』と言われました。理由の説明はありませんでした。言われた日時と内容はメモしています。納得できないので、まず何をすればいいか知りたいです。」

「どうしたいか」は、決まっていなくても大丈夫です。「辞めずに改善してほしい」「辞めてもいいので払われていないお金は受け取りたい」など、今の気持ちを伝えると、相談先も進め方を考えやすくなります。

相談のときに聞いておきたいこと：

- 自分のケースは、法律違反にあたる可能性があるか
- 次にどこへ、何を持って相談すればいいか
- 会社に話をするとき、自分で気をつけることは何か

## 辞めるかどうかは、相談のあとで決めてもいい

トラブルが続くと「もう辞めたい」と思うのは自然なことです。ただ、未払いのお金のことや、解雇なのか自分から辞めるのかといった扱いは、あとから変えるのが難しいこともあります。辞める前に一度相談して、自分の状況を整理しておくと、次の一歩を落ち着いて選べます。

辞める前に確認しておきたいこと全体は[今の仕事を辞めたいとき、先に確認しておきたいこと](/articles/yametai-mae-kakunin)に、退職を伝えるときの進め方は[退職の伝え方は？誰に・いつ・どう言うか](/articles/taishoku-tsutaekata)にまとめています。次の職場で残業代のトラブルを避けたい人は、[固定残業代（みなし残業）がある求人の見方](/articles/koteizangyo-kyujin)も参考にしてください。', 'review', false, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '給料未払い・残業代・解雇の相談先｜労基署と法テラスの違い', '給料の未払い、残業代が出ない、突然の解雇、聞いていた条件と違う。そんなときの相談先（総合労働相談コーナー・労働基準監督署・労働条件相談ほっとライン・法テラス）の違いと、相談前にそろえる記録、話し方の例を紹介します。', array['yametai-mae-kakunin', 'koteizangyo-kyujin', 'taishoku-tsutaekata', 'pawahara-soudan']::text[], '{}'::text[], array['yametai', 'kyuryo']::text[], array['hajimete']::text[], array['給料が出ない…', 'どこに相談する？']::text[], null, false, '[{"q":"労働基準監督署と総合労働相談コーナーは何が違いますか？","a":"総合労働相談コーナーは、解雇やいじめ・嫌がらせ、労働条件の引き下げなど、職場のトラブル全般の相談を受ける窓口です。労働基準監督署は、賃金の未払いや違法な長時間労働など、労働基準法などの法律に違反していないかを会社に対して調べ、是正を求める役所です。どちらに行けばいいか分からないときは、総合労働相談コーナーに相談すれば、法律違反の疑いがある内容は担当の部署につないでもらえます。"},{"q":"相談したことは会社に知られますか？","a":"相談しただけで会社に連絡がいくわけではありません。労働条件相談ほっとラインは匿名でも相談できます。会社に対して調査や話し合いの手続きを進める段階になると、会社側も内容を知ることになるので、どこまで進めたいかを相談のときに伝えておきましょう。"},{"q":"未払いの給料や残業代は、いつまで請求できますか？","a":"2020年4月1日以降に支払日が来た賃金は、法律では5年、ただし当分の間は3年で請求できる権利が消えるとされています。時間がたつほど請求できる分が減っていくので、気づいたら早めに相談しましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「どこに相談するか」で止まらないように、入口は総合労働相談コーナー、法律違反の是正は労基署、夜・土日はほっとライン、お金を取り戻す手続きまで考えるなら法テラス、と役割で分ける。相談の質を上げる「記録の準備」と「話し方の型」を具体例で示す","quotes":[{"source_url":"https://www.mhlw.go.jp/general/seido/chihou/kaiketu/soudan.html","text":"総合労働相談コーナーは各都道府県労働局、全国の労働基準監督署内などに設置。解雇、雇止め、配置転換、賃金の引下げ、募集・採用、いじめ・嫌がらせなど、あらゆる分野の労働問題を対象に、面談または電話で、予約不要・無料で相談できる（mhlw.go.jp に直接接続できなかったため、検索結果に表示された内容で確認）","used_in":"まずは総合労働相談コーナーへ"},{"source_url":"https://www.mhlw.go.jp/general/seido/chihou/kaiketu/index.html","text":"個別労働紛争解決制度は総合労働相談、都道府県労働局長による助言・指導、紛争調整委員会によるあっせんの3つ。いずれも無料。法令違反の疑いがある場合は行政指導の権限を持つ担当部署に取り次ぐ。あっせんは弁護士・大学教授などの専門家が間に入り、非公開で行われる（検索結果で確認）","used_in":"まずは総合労働相談コーナーへ / 話し合いで解決したいとき"},{"source_url":"https://www.check-roudou.mhlw.go.jp/lp/hotline","text":"違法な時間外労働・過重労働による健康障害・賃金不払残業などの労働基準関係法令に関する問題について、専門知識を持つ相談員が相談対応や関係機関の紹介を行う電話相談。0120-811-610、月〜金17:00〜22:00、土・日・祝日9:00〜21:00（12月29日〜1月3日を除く）。無料・匿名可。委託事業のため事業場に対する指導等はできない（検索結果で確認）","used_in":"平日の昼に電話できないなら、労働条件相談ほっとライン"},{"source_url":"https://www.houterasu.or.jp/site/soudan-tatekae/","text":"収入（手取りの平均月収）や資産が一定基準以下の人が対象。基準は住んでいる地域や家族の人数などで異なる。無料法律相談は同一の問題につき3回まで、1回30分程度、原則予約制。刑事事件は対象外。弁護士・司法書士費用の立替制度もある（検索結果で確認）","used_in":"弁護士に相談したいなら、法テラス"},{"source_url":"https://www.check-roudou.mhlw.go.jp/qa/roudousya/chingin/q9.html","text":"改正法の施行日（2020年4月1日）以後に支払期日が到来する賃金の請求権の消滅時効期間は2年から5年に延長。ただし経過措置として当分の間は3年（検索結果で確認）","used_in":"給料・残業代の未払いは早めに"}],"not_used":["法テラスの収入・資産基準の具体的な金額は、地域・家族の人数で細かく分かれ、改定もあるため本文に書かず、公式サイトで確認するよう案内した","総合労働相談件数などの統計は、読者の行動に直結しないため使わない","労働組合（ユニオン）や都道府県の労働委員会・自治体の労働相談は、窓口がさまざまで条件の確認が難しいため扱わない","労働基準監督署への「申告」の具体的な手続きは労働基準監督署ごとに案内が異なるため、相談時に確認するよう書くにとどめた"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'roudou-soudan-saki' and c.slug = 'seido' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'roudou-soudan-saki' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '総合労働相談コーナーのご案内', '厚生労働省', 'https://www.mhlw.go.jp/general/seido/chihou/kaiketu/soudan.html', '2026-10-09'::date, '総合労働相談コーナーが都道府県労働局・労働基準監督署内などにあり、職場のトラブル全般を予約不要・無料で、面談または電話で相談できること', 0 from articles where slug = 'roudou-soudan-saki';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '個別労働紛争解決制度（労働相談、助言・指導、あっせん）', '厚生労働省', 'https://www.mhlw.go.jp/general/seido/chihou/kaiketu/index.html', '2026-10-09'::date, '法令違反の疑いがある相談は行政指導の権限を持つ部署（労働基準監督署など）に取り次がれること、労働局長の助言・指導と紛争調整委員会のあっせんが無料で利用できること', 1 from articles where slug = 'roudou-soudan-saki';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '労働条件相談ほっとライン（確かめよう労働条件）', '厚生労働省', 'https://www.check-roudou.mhlw.go.jp/lp/hotline', '2026-10-09'::date, '違法な時間外労働・賃金不払残業などを平日夜間・土日祝日に無料・匿名で電話相談できること、受付時間、事業場への指導はできないこと', 2 from articles where slug = 'roudou-soudan-saki';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '無料法律相談・弁護士等費用の立替', '日本司法支援センター（法テラス）', 'https://www.houterasu.or.jp/site/soudan-tatekae/', '2026-10-09'::date, '収入・資産が一定の基準以下の人が無料で法律相談を受けられること、同じ問題で3回まで、弁護士費用の立替制度があること', 3 from articles where slug = 'roudou-soudan-saki';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '賃金請求権の消滅時効は、どのように変更されたのでしょうか？（確かめよう労働条件 Q&A）', '厚生労働省', 'https://www.check-roudou.mhlw.go.jp/qa/roudousya/chingin/q9.html', '2026-10-09'::date, '2020年4月1日以降に支払期日が来る賃金の請求権の時効が5年（当分の間は3年）になったこと', 4 from articles where slug = 'roudou-soudan-saki';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'roudou-soudan-saki' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"364afc09e093cf1abcccc6b4bd26561f9ac9d2fab39410232526f44b75914594","findings":[]}'::jsonb from articles where slug = 'roudou-soudan-saki';
update articles set status = 'published' where slug = 'roudou-soudan-saki';

-- article: saishushoku-teate (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('saishushoku-teate', 'article', '再就職手当とは？早く次の仕事が決まったときにもらえる条件と金額の考え方', '失業手当（基本手当）を受け取っている途中で早めに次の仕事が決まると、残りの日数に応じて「再就職手当」を受け取れる場合があります。支給の条件、支給残日数と金額の関係、自己都合で辞めた人が気をつけたい点、申請の期限を整理します。', '失業手当（雇用保険の基本手当）を受け取りながら転職活動をしていると、「早く決まったら、残りの手当はもったいない？」と迷うことがあるかもしれません。

先に結論です。

- 基本手当の給付日数を3分の1以上残して安定した仕事に就くと、**再就職手当**を受け取れる場合があります
- 金額は「基本手当日額 × 支給残日数 × 60％または70％」で、**残りの日数が多いほど多く**なります
- 自己都合で辞めて給付制限を受けた人は、待期のあと1か月の間に就職する場合、ハローワークなどの紹介で決まった仕事であることが条件になります

条件はいくつもあるので、就職が決まりそうになったら、入社日を決める前にハローワークで確認するのが確実です。

## 再就職手当ってどんな手当？

再就職手当は、基本手当の受給資格が決まった人が、早めに安定した仕事に就いたときに支給される手当です。ハローワークインターネットサービスでは「就職促進給付」のひとつとして案内されています。

基本手当は、仕事が決まると原則としてそこで止まります。再就職手当は、受け取らずに残った日数の一部をまとめて受け取れるイメージです。早く決めた人が、手当の面で大きく損をしないためのしくみといえます。

## もらえる条件は？

ハローワークの案内では、次の条件をすべて満たす必要があります。

```figure
type: checklist
title: 再就職手当の主な条件
items:
  - 7日間の待期が終わったあとに就職した
  - 支給残日数が所定給付日数の3分の1以上ある
  - 1年を超えて働くことが確実と認められる
  - 辞めた会社や、関係の深い会社への就職ではない
  - 原則として雇用保険の被保険者になる
  - 手続きの前から内定していた会社ではない
```

このほか、次のような条件もあります。

- 就職日の前日までの失業の認定を受けていること
- 就職日前3年以内に、再就職手当や常用就職支度手当を受けていないこと
- 給付制限を受けた人は、待期のあと1か月の間の就職について、ハローワークなどの紹介によるものであること（次の見出しで説明します）

「1年を超えて働くことが確実」かどうかは、正社員かどうかという名前ではなく、雇用契約の期間や更新の条件などを見て判断されます。契約社員などで就職する場合は、雇用契約書の期間と更新のルールを確認しておきましょう。

## いくらもらえる？支給残日数との関係

金額は、次の式で計算します。

```figure
type: equation
title: 再就職手当の計算式
terms:
  - 基本手当日額
  - ×
  - 支給残日数
  - ×
  - 給付率（60％または70％）
  - =
  - 再就職手当の額
```

給付率は、支給残日数（まだ受け取っていない日数）が、所定給付日数（もともと受け取れる日数）のどれくらい残っているかで決まります。

| 支給残日数 | 給付率 |
| --- | --- |
| 所定給付日数の3分の2以上 | 70％ |
| 所定給付日数の3分の1以上（3分の2未満） | 60％ |
| 所定給付日数の3分の1未満 | 支給されない |

### 計算の仮の例

所定給付日数が90日、基本手当日額が5,000円の人で考えてみます（数字は仮の例です）。90日の3分の2は60日、3分の1は30日です。

- 支給残日数が70日で就職：60日以上なので70％。5,000円 × 70日 × 70％ ＝ 245,000円
- 支給残日数が40日で就職：30日以上60日未満なので60％。5,000円 × 40日 × 60％ ＝ 120,000円
- 支給残日数が29日で就職：30日未満なので、再就職手当は出ない

このように、残りの日数が多いうちに決まるほど、手当の額も多くなります。なお、再就職手当の計算に使う基本手当日額には上限があり、受給資格者証に書かれた金額とそのまま同じにならない場合があります。自分の金額は、ハローワークで確認してください。

## 自己都合で辞めた人が気をつけたいこと

正当な理由のない自己都合で辞めた場合、7日間の待期のあとに給付制限があります。離職日が2025年4月1日以降なら、給付制限は原則1か月です。

給付制限を受けた人が、待期が終わってから1か月の間に就職する場合は、**ハローワーク、または許可・届出のある職業紹介事業者などの紹介で決まった仕事**であることが条件になります。たとえば、この期間に自分で会社のホームページから直接応募して決めた場合は、対象にならない可能性があります。

```figure
type: steps
title: 自己都合で辞めた人の時間の流れ
items:
  - label: 受給資格の決定
    text: ハローワークで手続き
  - label: 待期7日間
    text: この間に就職すると対象外
  - label: 待期のあと1か月
    text: ハローワークや職業紹介事業者の紹介による就職が条件
  - label: その後
    text: 紹介の条件はなくなる
```

転職エージェントを使っている場合、その会社が許可を受けた職業紹介事業者かどうかは、担当者に聞くと確認できます。転職エージェントへの相談のしかたは[転職エージェントに、何を相談すればいい？](/articles/agent-soudan-nani)で紹介しています。

## 申請のしかたと期限

就職が決まったら、次の順で進めます。

1. 就職日の前日までに、ハローワークで失業の認定を受ける（就職が決まったことを伝える）
2. 就職先に「再就職手当支給申請書」の事業主の証明欄を書いてもらう
3. 原則として、就職した日の翌日から1か月以内に、ハローワークへ申請書を出す

申請書は、本人が持っていくほか、代理人（委任状が必要）や郵送でも出せます。書類や手順は地域のハローワークの案内で確認してください。

## 再就職後に給料が下がったときの手当

再就職手当を受け取った人が、同じ会社で6か月以上雇用保険の被保険者として働き、その6か月間の給料の1日分が、辞める前の賃金日額より低い場合は、**就業促進定着手当**を受け取れる場合があります。

ハローワークのリーフレットでは、上限は基本手当の支給残日数の20％とされています（2025年4月1日以降に再就職した場合）。未経験の仕事に移って、最初の給料が前の職場より下がることもあるので、そのときは思い出してください。

## 「早く決まると損」とは限らない

再就職手当は、基本手当を最後まで受け取る場合と比べると、受け取る総額は少なくなります。ただ、早く働き始めれば、そのぶん給料が入り、職場での経験も早く積めます。手当の額だけで入社日を先のばしにするより、働く条件が自分に合っているかで判断するほうが、あとで後悔しにくくなります。

辞める前の段階で迷っている人は、[今の仕事を辞めたいとき、先に確認しておきたいこと](/articles/yametai-mae-kakunin)や、[自己都合退職の給付制限が原則1か月に](/news/news-koyou-hoken-kyufu-seigen)もあわせて読んでみてください。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-07'::timestamptz, '再就職手当の条件と金額｜支給残日数で60％・70％が決まる', '失業手当を受け取っている途中で早く就職が決まったときの再就職手当。支給の条件、支給残日数が3分の1以上・3分の2以上で変わる金額の計算、自己都合で辞めた人の注意点、申請期限を仮の例つきで整理します。', array['yametai-mae-kakunin', 'news-koyou-hoken-kyufu-seigen', 'agent-soudan-nani']::text[], '{}'::text[], array['yametai']::text[], array['hajimete']::text[], array['早く就職が決まったら、', 'もらえる手当がある？']::text[], null, false, '[{"q":"失業手当の手続きをする前に内定していた会社でも、再就職手当はもらえますか？","a":"受給資格の決定（求職の申込み）の前から採用が内定していた会社に就職した場合は、再就職手当の対象になりません。退職前に次の会社が決まっている人は、そもそも失業の状態に当たらないことも多いので、ハローワークで確認しましょう。"},{"q":"契約社員やパートで就職しても対象になりますか？","a":"雇用の形の名前ではなく、1年を超えて引き続き雇われることが確実と認められるか、原則として雇用保険の被保険者になるかなどで判断されます。契約期間や更新の条件を雇用契約書で確認し、迷ったら就職が決まった段階でハローワークに相談してください。"},{"q":"再就職手当の申請はいつまでにすればいいですか？","a":"ハローワークの案内では、再就職手当支給申請書は原則として就職した日の翌日から1か月以内に提出します。本人のほか、代理人（委任状が必要）や郵送でも提出できます。就職が決まったら、就職日の前日までの失業の認定を受けておくことも大切です。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「早く決まると損」と思って就職を先のばしにしないよう、残日数と金額の関係を計算例で見せる。人によって変わる上限額などは数字を出さない","quotes":[{"source_url":"https://www.hellowork.mhlw.go.jp/insurance/insurance_stepup.html","text":"支給残日数が所定給付日数の3分の2以上の場合は基本手当日額×支給残日数×70％、3分の1以上の場合は基本手当日額×支給残日数×60％","used_in":"いくらもらえる？支給残日数との関係"},{"source_url":"https://www.hellowork.mhlw.go.jp/doc/saishuushokuteate.pdf","text":"離職理由による給付制限を受けた場合は、待期満了後1か月間については、ハローワーク等または許可・届出のある職業紹介事業者等の紹介により就職したものであること","used_in":"自己都合で辞めた人が気をつけたいこと"},{"source_url":"https://www.hellowork.mhlw.go.jp/doc/syuugyousokushin.pdf","text":"再就職手当の支給を受けた方で、再就職先に6か月以上雇用され、6か月間の賃金が離職前の賃金よりも低い場合に、基本手当の支給残日数の20％を上限として、低下した賃金の6か月分を支給","used_in":"再就職後に給料が下がったときの手当"}],"not_used":["再就職手当の計算に使う基本手当日額の上限額（年齢ごと）の具体的な金額は、2026年10月時点の最新額を一次情報で確認しきれなかったので書かない","就業促進定着手当の申請期限の詳しい日付の数え方は、本文では「ハローワークで確認」とした"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'saishushoku-teate' and c.slug = 'seido' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'saishushoku-teate' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ハローワークインターネットサービス - 就職促進給付', '厚生労働省（ハローワークインターネットサービス）', 'https://www.hellowork.mhlw.go.jp/insurance/insurance_stepup.html', '2026-10-07'::date, '再就職手当の支給要件（待期満了後の就職、支給残日数3分の1以上、離職前の事業主・関連事業主でないこと、原則として雇用保険の被保険者になること、受給資格決定前から内定していた事業主でないこと）と給付率（3分の2以上で70％、3分の1以上で60％）', 0 from articles where slug = 'saishushoku-teate';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '再就職手当のご案内（リーフレット LL080801保02）', '厚生労働省・都道府県労働局・ハローワーク', 'https://www.hellowork.mhlw.go.jp/doc/saishuushokuteate.pdf', '2026-10-07'::date, '1年を超えて勤務することが確実と認められること、給付制限を受けた場合は待期満了後1か月はハローワーク等または許可・届出のある職業紹介事業者の紹介による就職であること、就職日前3年以内に再就職手当等を受けていないこと', 1 from articles where slug = 'saishushoku-teate';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '再就職手当を受給した皆さまへ（就業促進定着手当のリーフレット LL080801保03）', '厚生労働省・都道府県労働局・ハローワーク', 'https://www.hellowork.mhlw.go.jp/doc/syuugyousokushin.pdf', '2026-10-07'::date, '就業促進定着手当の要件（同じ事業主に6か月以上雇用、再就職後6か月間の賃金が離職前より低い）と上限（支給残日数の20％）', 2 from articles where slug = 'saishushoku-teate';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '再就職手当について', 'ハローワーク犬山（愛知労働局）', 'https://jsite.mhlw.go.jp/aichi-hellowork/list/inuyama/info/saisyuusyokuteate.html', '2026-10-07'::date, '再就職手当支給申請書は原則として就職した日の翌日から1か月以内に、本人・代理人（委任状）・郵送で提出すること', 3 from articles where slug = 'saishushoku-teate';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ハローワークインターネットサービス - 基本手当について', '厚生労働省（ハローワークインターネットサービス）', 'https://www.hellowork.mhlw.go.jp/insurance/insurance_basicbenefit.html', '2026-10-07'::date, '待期7日間、2025年4月1日以降の自己都合離職の給付制限が原則1か月であること', 4 from articles where slug = 'saishushoku-teate';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '再就職手当関係書類の記入方法（事業主・証明担当者用）', 'ハローワーク墨田（東京労働局）', 'https://jsite.mhlw.go.jp/tokyo-hellowork/content/contents/002225440.pdf', '2026-10-07'::date, '再就職手当支給申請書などに、就職先の事業主が証明を記入すること', 5 from articles where slug = 'saishushoku-teate';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'saishushoku-teate' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"1b81b8ba6784ca1fdc9d2776f7aabc0899ab1d49cedbc601549a09641826269f","findings":[]}'::jsonb from articles where slug = 'saishushoku-teate';
update articles set status = 'published' where slug = 'saishushoku-teate';

-- article: seizou-koujou-shigoto (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('seizou-koujou-shigoto', 'article', '工場の仕事内容は？ライン作業・検査・機械オペレーターの違いと、交替制・雇用の形の確認', '製造業の工場の仕事には、ラインで部品を組み立てる仕事、製品を確かめる検査、機械や設備を動かして見守るオペレーターなどがあります。それぞれの仕事内容、交替制勤務と深夜の割増賃金、正社員・期間従業員・派遣の違いと、求人で確認することを紹介します。', '「黙々とできる仕事がいい」「未経験でも正社員の求人がある仕事を探したい」。そう考えたときに候補に入りやすいのが、製造業の工場の仕事です。

先に結論を言うと、工場の仕事は**ラインでの組み立て、製品を確かめる検査、機械や設備を動かすオペレーター**などに分かれていて、未経験から始めやすいもの、経験を積んでから担当するものがあります。また、同じ工場でも**交替制かどうか**と、**正社員・期間従業員・派遣のどれで働くか**で、働き方が大きく変わります。

この記事で分かること：

- ライン作業・検査・機械オペレーターの**仕事内容**
- **交替制勤務**のしくみと、深夜の割増賃金
- **正社員・期間従業員・派遣**の違い
- 応募前に**確認すること**

## 工場の仕事にはどんな種類がある？

工場で働く仕事は、作るものや工場の規模でさまざまですが、未経験の人が求人でよく見かけるのは次の3つです。

| 仕事 | どんなことをする？ |
| --- | --- |
| ライン作業 | 流れてくる製品に、決められた部品の取り付けや作業をする |
| 検査 | できた製品や部品が、決められた基準どおりかを確かめる |
| 機械オペレーター | 機械や設備を動かし、正しく動いているか見守る |

### ライン作業

厚生労働省の職業情報提供サイト（job tag）では、自動車の組み立てについて、コンベア（荷物を運ぶ装置）を組み合わせたラインで**流れ作業**の形で行われ、1人が担当する作業は1分から10分程度で終わると紹介されています。

作業が細かく分けられているので、決められた手順を覚えて、同じ品質で繰り返すことが中心になります。未経験の人は、まず1つの工程を覚え、慣れてきたら担当できる工程を増やしていく形が多くなります。

### 検査

job tag では、検査工（工業製品）を、作っている途中の部品や完成した製品の外観・品質・機能が**規格どおりか**を確かめる仕事として紹介しています。検査には次のような種類があります。

- **受入検査**：材料や部品が届いたときに確かめる
- **工程内検査**：作っている途中で確かめる
- **完成品検査**：できあがった製品を確かめる

すべてを確かめる「全数検査」と、一部を取り出して確かめる「抜取検査」を組み合わせることもあります。目で見て確かめるほか、ノギス（長さを測る道具）や顕微鏡、測定器を使います。

job tag では、検査の仕事は入社してすぐ担当するより、**製造の部署から社内で移って就くことが多い**と説明されています。「検査をやりたい」場合は、未経験から担当できる求人か、製造を経験してからかを確認しましょう。

### 機械オペレーター

機械や設備を動かし、材料の補充、運転状況の確認、異常がないかの見守りをする仕事です。job tag では、化学工場で装置を運転・制御する仕事が「化学製品製造オペレーター」として紹介されているように、扱う設備によって呼び方が変わります。

ボタン操作だけでなく、数値やランプの変化に気づいて報告すること、決められた点検を毎回同じようにすることが大事にされます。

## 交替制勤務とは？

工場では、機械や設備を止めずに動かすために、働く時間帯をチームで分ける**交替制勤務**をとることがあります。job tag では、自動車の組み立てについて、昼勤と夜勤の**2交替勤務が多い**と紹介されています。

日勤のみの職場では、毎日だいたい同じ時間帯に働きます。交替制では、昼に働く週と夜に働く週が入れ替わるなど、時間帯が変わるので、睡眠や生活のリズムを切り替える工夫が必要になります。交替のパターン（何日・何週ごとに入れ替わるか）は職場によって違います。

### 深夜の割増賃金

労働基準法では、**午後10時から午前5時まで**の間に働いた時間について、通常の賃金の**2割5分以上**の割増賃金を払うことになっています。交替制の求人で給料の例が書かれているときは、深夜の割増や手当が含まれた金額かどうかを確かめましょう。夜勤がある週とない週で、月の給料がどう変わるかも聞いておくと安心です。

### 残業はいつ増える？

job tag の検査工の説明では、残業は**生産数が増えるとき、新しい製品を作り始めるとき、製造の工程でトラブルがあったとき**などに発生するとされています。工場の繁忙期は作る製品によって違うので、面接で「忙しくなる時期」を聞いておきましょう。

## 正社員・期間従業員・派遣の違い

工場の求人では、同じ仕事内容でも、雇用の形がいくつかあります。大きな違いは**誰が雇い主か**と**期間が決まっているか**です。

```figure
type: compare
title: 工場で働く3つの雇用の形
columns:
  - label: 正社員
    tone: mint
    items:
      - 工場の会社と直接契約
      - 期間の定めがないことが多い
  - label: 期間従業員
    tone: sky
    items:
      - 工場の会社と直接契約
      - 期間を決めた契約で、更新がある場合も
  - label: 派遣社員
    tone: sand
    items:
      - 派遣会社と雇用契約
      - 仕事の指示は派遣先の工場から受ける
```

- **期間従業員**は、期間の決まった契約（有期契約）で働く形です。契約が更新されるかどうか、更新の上限があるかは、契約の書類で確認しましょう。有期契約が続いたときの「無期転換ルール」は、[契約社員と正社員は何が違う？](/articles/muki-tenkan-keiyaku)で紹介しています
- **派遣社員**は、厚生労働省の説明では、派遣会社が雇う人が、派遣先の指示を受けて派遣先のために働くしくみです。給料を払うのも、困ったときにまず相談するのも派遣会社です。派遣から正社員を考えるときの比べ方は、[派遣から正社員を考えるとき、最初に確認したいこと](/articles/haken-seishain)にまとめています

どの形が合うかは、「すぐに働き始めたい」「長く同じ会社で働きたい」「いずれ正社員になりたい」など、何を優先するかで変わります。期間従業員や派遣から正社員になる道があるかどうかは会社によって違うので、これまでに登用された例があるかを聞いてみましょう。

## 向いている人と、面接での伝え方

### 向いている人

- 決められた手順を守り、同じ作業を同じ品質で続けられる
- 小さな違い（傷・ずれ・いつもと違う音）に気づける
- 気づいたことを、すぐに報告・相談できる

接客や飲食のアルバイト経験がある人は、**決められた手順で作業してきたこと**や、**衛生や安全のルールを守ってきたこと**が工場の仕事とつながります。面接では、たとえば次のように伝えられます。

> 「飲食店のキッチンで、決められた分量と手順で料理を作ってきました。忙しい時間帯でも手順を飛ばさないことを大事にしていました。工場の仕事でも、決められた手順を守り、気づいたことはすぐに報告するようにしたいと考えています。」（仮の例です）

## 応募前に、確認すること

```figure
type: checklist
title: 工場の求人で確認すること
items:
  - 担当する仕事（ライン・検査・オペレーター）
  - 作っている製品と、扱う部品の重さ
  - 日勤のみか交替制か、交替のパターン
  - 夜勤の割増・手当が給料の例に含まれるか
  - 正社員・期間従業員・派遣のどれか
  - 契約期間と更新、正社員登用の実績
  - 入社後、ひとりで担当するまでの期間
```

求人に書かれていないことは、面接や工場見学で質問してかまいません。

- 「最初はどの工程を担当することが多いですか」
- 「交替のパターンは、何週ごとに入れ替わりますか」
- 「期間従業員から正社員になった方はいますか」

「研修あり」の求人で確かめたいことは、[未経験求人の「研修あり」で確認すべきこと](/articles/mikeiken-kenshu-kakunin)にまとめています。工場の仕事は、担当する仕事・時間帯・雇用の形の3つで働き方が変わります。自分が優先したいことを決めてから求人を比べると、入社後のずれを減らせます。', 'review', false, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '工場の仕事内容は？ライン・検査と交替制の確認点', '未経験から工場の仕事を考える人へ。ライン作業・検査・機械オペレーターの仕事の違い、2交替などの交替制勤務と深夜の割増賃金、正社員・期間従業員・派遣の雇い主と契約期間の違い、求人や面接で確認したいことを紹介します。', array['haken-seishain', 'muki-tenkan-keiyaku', 'mikeiken-kenshu-kakunin', 'butsuryu-soko-shigoto', 'gentei-seishain']::text[], array['sonota']::text[], array['mikeiken-shokushu', 'seishain']::text[], array['freeter', 'haken']::text[], array['工場の仕事、', '未経験でも大丈夫？']::text[], null, false, '[{"q":"工場の仕事は、未経験でも始められますか？","a":"ラインでの組み立てなどは、作業を細かく分けて1人ひとりに割り当てる形が多く、未経験から始める人もいる仕事です。一方、検査の仕事は、製造の部署で経験を積んでから社内で移ることが多いと、職業情報提供サイト（job tag）で紹介されています。応募資格と、入社後に教えてもらう期間を求人で確認しましょう。"},{"q":"交替制勤務の夜勤は、給料が上がりますか？","a":"労働基準法では、午後10時から午前5時までの間に働いた時間には、通常の賃金の2割5分以上の割増賃金を払うことになっています。ただし、基本給や手当の決め方は会社によって違うので、夜勤のある週とない週で月の給料がどう変わるかを、求人票や面接で確認しましょう。"},{"q":"期間従業員と派遣社員は、何が違いますか？","a":"期間従業員は、働く工場の会社と、期間を決めた契約を直接結んで働く形です。派遣社員は、派遣会社と雇用契約を結び、派遣先の工場で、その工場の指示を受けて働く形です。給料を払う会社や、困ったときの相談先が違うので、雇い主がどこかを確認しておきましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「工場の仕事」をライン・検査・オペレーターの3つに分け、未経験からの入口になりやすいのはどれかを job tag の記述で示す。交替制は深夜割増の法律のルールまでにとどめ、手当は会社ごとに確認する形にする。雇用の形は「誰が雇い主か」「期間が決まっているか」の2軸で比べる","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/264","text":"コンベアを組み合わせたラインで流れ作業の形態で行われ、1人が担当する作業は1分から10分程度で終わる。昼勤と夜勤の2交替勤務が多い（job tag へ直接接続できなかったため、検索結果に表示されたページ内容で確認）","used_in":"ライン作業 / 交替制勤務とは？"},{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/526","text":"生産工程における中間生産物や製品の外観、品質、機能等が規格どおりであるか等を検査、確認する。受入検査、工程内検査、完成品検査があり、全数検査と抜取検査を組み合わせる場合もある。入職後すぐに検査工になるのではなく、製造部門からの社内異動を経て就くことが多い。残業は生産数の増加時や新製品の生産開始時、トラブル発生時などに発生する。目視検査では立ち仕事が多い（検索結果で確認）","used_in":"検査"},{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/300","text":"化学工場で装置を運転・制御する職業。厚生労働省編職業分類では化学製品生産設備オペレーターに対応する（検索結果で確認）","used_in":"機械オペレーター"},{"source_url":"https://www.mhlw.go.jp/bunya/roudoukijun/faq_kijyunhou_25.html","text":"使用者が午後10時から午前5時までの間において労働させた場合には、その時間の労働について通常の労働時間の賃金の計算額の2割5分以上の率で計算した割増賃金を支払わなければならない（労働基準法第37条第4項）（検索結果で確認）","used_in":"交替制勤務とは？"},{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/roudoushahakennjigyou.html","text":"労働者派遣は、派遣元事業主が自己の雇用する労働者を、派遣先の指揮命令を受けて、派遣先のために労働に従事させること（検索結果で確認）","used_in":"正社員・期間従業員・派遣の違い"}],"not_used":["工場の仕事の賃金や、期間従業員の満了金・手当の金額は、会社ごとに違い一次情報で確認できないため書かない","交替制勤務の健康面の影響についての調査データは確認していないので書かない","派遣の3年ルールや同一労働同一賃金の詳細は、別の記事（派遣から正社員）の役割なので、本文ではリンクにとどめた"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'seizou-koujou-shigoto' and c.slug = 'shokushu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'seizou-koujou-shigoto' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '自動車組立 - 職業詳細（職業情報提供サイト job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/264', '2026-10-09'::date, 'ラインでの組み立てがコンベアによる流れ作業で行われ、1人が担当する作業は1分から10分程度で終わること、昼勤と夜勤の2交替勤務が多いこと', 0 from articles where slug = 'seizou-koujou-shigoto';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '検査工（工業製品） - 職業詳細（職業情報提供サイト job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/526', '2026-10-09'::date, '製品の外観・品質・機能が規格どおりかを検査すること、受入検査・工程内検査・完成品検査、全数検査と抜取検査、ノギスや顕微鏡などの道具、製造部門からの社内異動で就くことが多いこと、残業が生産数の増加時やトラブル時に発生すること', 1 from articles where slug = 'seizou-koujou-shigoto';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '化学製品製造オペレーター - 職業詳細（職業情報提供サイト job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/300', '2026-10-09'::date, '工場の装置を運転・制御する仕事がオペレーターと呼ばれること', 2 from articles where slug = 'seizou-koujou-shigoto';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'アルバイトで18時から23時まで働いています。深夜は割増になるということを聞きました。どういう事でしょうか。', '厚生労働省', 'https://www.mhlw.go.jp/bunya/roudoukijun/faq_kijyunhou_25.html', '2026-10-09'::date, '午後10時から午前5時までの労働には通常の賃金の2割5分以上の割増賃金を払う必要があること（労働基準法第37条）', 3 from articles where slug = 'seizou-koujou-shigoto';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '労働者派遣事業', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/roudoushahakennjigyou.html', '2026-10-09'::date, '派遣は、派遣元が雇用する労働者を、派遣先の指揮命令を受けて派遣先のために働かせるしくみであること', 4 from articles where slug = 'seizou-koujou-shigoto';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'seizou-koujou-shigoto' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"3928254926490b2bae8bb4e14de38477337d8e03c5badc4903bebf98eb9055a5","findings":[]}'::jsonb from articles where slug = 'seizou-koujou-shigoto';
update articles set status = 'published' where slug = 'seizou-koujou-shigoto';

-- article: sekkyaku-keiken-ikasu (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('sekkyaku-keiken-ikasu', 'article', '接客経験は転職でどう活かせる？職種別のつながりと伝え方', '接客の仕事には、相手の要望を聞き取る力や、混雑時の段取り、クレーム対応など、ほかの職種でも使える経験が含まれています。経験を分解して、営業・カスタマーサポート・事務などにどうつながるかを整理します。', '「接客しかしてこなかったから、アピールできることがない」。転職を考え始めたとき、そう感じて手が止まっていませんか。

けれど、接客の仕事を細かく分けてみると、ほかの職種でも求められる経験がたくさん含まれています。大事なのは「接客をしていました」とまとめずに、**中身を分解して言葉にする**ことです。

## 接客の仕事を分解すると見えてくる経験

まずは、接客の仕事でふだんやっていることを書き出してみましょう。たとえば飲食店や販売店なら、次のような作業が含まれていることが多いはずです。

| 接客での場面 | その中に含まれている経験 |
| --- | --- |
| 注文や要望を聞く | 相手の話を聞き取り、必要な情報を確認する |
| 混雑時の対応 | 優先順位をつけて、複数の作業を同時に進める |
| クレーム対応 | 相手の気持ちを受け止めつつ、できることとできないことを伝える |
| 新人への説明 | 手順を分かりやすく言葉にして教える |
| 売上や客単価の目標 | 数字を意識して、おすすめのしかたを工夫する |
| レジ締め・在庫確認 | 数字を正確に扱い、ミスを防ぐ |

すべてに当てはまる必要はありません。自分が実際にやっていたものに印をつけ、その中で「工夫したこと」や「任されていたこと」を思い出してみてください。

## 職種ごとのつながり方

分解した経験は、職種によって活きる場面が変わります。代表的な職種とのつながりを見てみましょう。

### 営業

営業では、お客さまの困りごとを聞き取り、それに合う提案をします。接客で「お客さまの好みを聞いておすすめを選んでいた」経験は、そのまま提案の土台になります。売上目標を意識していた経験があれば、数字への向き合い方として伝えられます。

### カスタマーサポート

電話やメール、チャットで問い合わせに対応する仕事です。接客でのクレーム対応や、よくある質問への説明は、もっとも近い経験の一つです。対面と違って表情が見えないため、言葉だけで状況を確認する丁寧さが求められます。

### 事務

事務と聞くとパソコン作業のイメージが強いですが、来客対応や電話対応、社内からの依頼の受付など、人とのやりとりも多い仕事です。レジ締めや在庫確認で数字を正確に扱っていた経験は、データ入力や書類チェックにつながります。

### ITサポート

社内外の「パソコンが動かない」「設定が分からない」といった困りごとに対応する仕事です。ITの知識は入社後に学ぶ部分も多く、相手が何に困っているかを聞き取る力は接客経験が活きる部分です。

それぞれの仕事内容の違いは、[営業・カスタマーサポート・ITサポートの違い](/articles/eigyo-cs-it-support-chigai)や[職種比較ページ](/jobs)で詳しく比べられます。

## 職務経歴書での書き方の例

経験を分解できたら、書類で伝えるときは「状況 → 自分がしたこと → 結果」の順に書くと伝わりやすくなります。

```figure
type: steps
title: 職務経歴書はこの順で書く
items:
  - label: 状況
    text: 例：席数40席の飲食店でホールを担当
  - label: 自分がしたこと
    text: 例：待ち時間の案内を声がけで行うよう提案
  - label: 結果
    text: 例：お待たせに関するご意見が減った
```

**よくある書き方**

> 飲食店でホールスタッフとして接客を担当。コミュニケーション力を活かしてお客さまに対応しました。

**分解して書いた例**

> 席数40席の飲食店で、ホールスタッフとして注文受付・会計・新人教育を担当（約2年）。混雑する週末に待ち時間の案内を声がけで行うよう店長に提案し、お待たせに関するご意見が減った。新人向けにレジ操作の手順を1枚にまとめ、教える側の負担も軽くなった。

```figure
type: compare
style: before-after
title: 「接客を担当」を分解して書く
columns:
  - label: よくある書き方
    items:
      - 飲食店でホールスタッフとして接客を担当
      - コミュニケーション力を活かして対応
  - label: 分解して書いた例
    items:
      - 注文受付・会計・新人教育を担当（約2年）
      - 新人向けにレジ操作の手順を1枚にまとめた
      - 教える側の負担も軽くなった
```

数字は正確なものだけを書きましょう。覚えていない数字を盛る必要はありません。「約」「〜くらい」で正直に書くほうが、面接で深掘りされたときにも答えやすくなります。

## 伝えるときに気をつけたいこと

接客経験を伝えるときは、次の2点を意識すると印象が変わります。

- **「好き」だけで終わらせない**: 「人と話すのが好き」に加えて、どんな場面でどう対応していたかを添える
- **応募する仕事との接点を一言入れる**: 「問い合わせ対応の経験を、カスタマーサポートでの電話対応に活かしたい」のように、つながりを自分の言葉で示す

志望動機での伝え方は、[未経験職種の志望動機、何を書けばいい？](/articles/shiboudouki-mikeiken)で例文つきで紹介しています。

接客の経験は、どの職種でも「人を相手にする仕事」の基礎になります。自分では当たり前だと思っていた工夫こそ、書き出してみる価値があります。', 'review', true, '2026-10-06'::timestamptz, '2026-10-07'::timestamptz, '2026-10-07'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['shiboudouki-mikeiken', 'eigyo-cs-it-support-chigai', 'mikeiken-tenshoku-hajimekata', 'callcenter-shigoto']::text[], array['hanbai', 'customer-support', 'eigyo']::text[], array['mikeiken-shokushu', 'mensetsu']::text[], array['sekkyaku']::text[], array['接客の経験、', 'ほかの仕事で活かせる？']::text[], null, false, '[{"q":"アルバイトの接客経験でも、職務経歴書に書いていいのでしょうか？","a":"書いて構いません。雇用形態よりも、どんな業務をどのくらいの期間担当し、何を工夫したかが判断材料になります。正社員経験と区別がつくよう、雇用形態と期間は正確に書きましょう。"},{"q":"「コミュニケーション力があります」とだけ書くのはダメですか？","a":"ダメではありませんが、読み手に伝わりにくくなります。「1日に何人くらいのお客さまに対応していたか」「どんな問い合わせが多かったか」など、場面が浮かぶ事実を添えると説得力が増します。"}]'::jsonb, null, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'sekkyaku-keiken-ikasu' and c.slug = 'keiken' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'sekkyaku-keiken-ikasu' and c.slug = 'shorui-mensetsu' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業情報提供サイト（job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/', '2026-10-06'::date, '各職種の仕事内容・求められるスキルの確認', 0 from articles where slug = 'sekkyaku-keiken-ikasu';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'sekkyaku-keiken-ikasu' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"6cc225f1218c151cde0ac138d0a9e481fa0b266ad01f6a7a1230dd8605681541","findings":[{"code":"C03","severity":"warning","message":"出典が1件のみ。可能なら2件以上で裏付ける"}]}'::jsonb from articles where slug = 'sekkyaku-keiken-ikasu';
update articles set status = 'published' where slug = 'sekkyaku-keiken-ikasu';

-- article: sekkyaku-office (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('sekkyaku-office', 'article', '接客からオフィスワークに移るとき、働き方はどう変わる？', '立ち仕事から座り仕事へ、シフトから決まった勤務時間へ、対面から電話やメールへ。接客からオフィスワークに移ると、仕事の中身だけでなく1日の過ごし方も変わります。変わること・変わらない強み・移りやすい仕事・応募前に確かめたいことを整理しました。', '「立ちっぱなしがつらい」「シフトで予定が立てにくい」。接客や販売の仕事を続けるなかで、オフィスワークに移りたいと考える人は少なくありません。

オフィスワークに移ると、仕事の中身だけでなく、**1日の過ごし方そのものが変わります**。良くなることもあれば、慣れるまでしんどいこともあります。移る前に、どんな変化があるのかを知っておきましょう。

## 何が変わる？まずは働き方を並べてみる

接客の仕事とオフィスワークを、よくある形で比べてみます。会社や職種によって違うので、あくまで傾向として見てください。

| | 接客・販売でよくある形 | オフィスワークでよくある形 |
| --- | --- | --- |
| 体の使い方 | 立ち仕事・歩き回る | 座ってパソコンに向かう時間が長い |
| 勤務時間 | シフト制で毎週変わる | 始業・終業が決まっている職場が多い |
| 休み | 平日休み・不定休 | 会社の休日に合わせる（土日休みとは限らない） |
| お客さまとの接し方 | 対面で、表情を見ながら | 電話・メール・チャットで、言葉だけで |
| 仕事の区切り | お客さまが帰れば一区切り | 書類やデータの締め切りに合わせて進める |

注意したいのは「オフィスワーク＝土日休み」とは限らないことです。たとえばカスタマーサポートは、窓口が開いている時間に合わせてシフトで働く職場もあります。休日の見方は[「土日休み」と「年収」をどう比較する？](/articles/donichi-yasumi-nenshu-hikaku)でくわしく紹介しています。

## 座り仕事って、楽じゃないの？

立ち仕事がつらかった人ほど、「座れるなら楽そう」と思いがちです。けれど、座りっぱなしで画面を見続けると、肩や目、腰に別の疲れが出てきます。

厚生労働省の「情報機器作業における労働衛生管理のためのガイドライン」（2019年7月策定）では、会社が取り組むこととして、パソコンなどを使う作業について、連続作業が1時間を超えないようにし、次の連続作業までに10〜15分の作業休止を設けること、連続作業の途中に1〜2回の小休止を入れることなどが示されています。

```figure
type: stats
title: パソコン作業の休み方の目安
items:
  - value: "1"
    unit: 時間
    label: 連続作業はここまで
    note: 超えないようにする
  - value: "10〜15"
    unit: 分
    label: 次の作業までの休止
  - value: "1〜2"
    unit: 回
    label: 連続作業の途中の小休止
```

入社してから困らないよう、面接では次のように聞いておくと安心です。

- 1日のうち、パソコンに向かっている時間はどのくらいですか
- 休憩はどのように取っている方が多いですか

## 接客の経験は、どこで活きる？

働き方は変わっても、接客で身についたことはオフィスでも役に立ちます。

- **相手の用件を最初に確かめる**: 電話の取り次ぎや問い合わせ対応でそのまま使える
- **言葉づかいと気配り**: 来客対応や、取引先とのやりとりで見られやすい
- **混んでいるときの段取り**: 締め切りが重なったときの優先順位づけにつながる

経験の書き出し方や職務経歴書での伝え方は、[接客経験は転職でどう活かせる？](/articles/sekkyaku-keiken-ikasu)で例文つきで紹介しています。

## 移りやすいのは、どんな仕事？

接客経験との近さで見ると、次のような仕事が候補になりやすいです。

| 仕事 | 主な内容 | 接客との近いところ | 気をつけたいところ |
| --- | --- | --- | --- |
| カスタマーサポート | 電話・メール・チャットで、注文や予約、問い合わせに応える | お客さまの困りごとを聞いて対応する | 対応件数などの目標がある職場もある。シフトの有無 |
| 受付事務 | 来た人の用件を聞いて担当者に取り次ぐ、会議室へ案内する | 対面での案内や言葉づかい | 受付以外の事務も任されることがある |
| 一般事務・営業事務 | 書類やデータの入力、電話の取り次ぎ、来客対応 | 電話対応やレジ締めの正確さ | パソコン作業の時間が長い |
| 採用アシスタント（人事） | 応募者への連絡、面接の日程調整、来社した応募者の案内 | シフト調整や、来た人を迎えて案内する場面 | 応募者の個人情報を扱うので、正確さと慎重さが求められる |

それぞれの仕事の違いは、[職種比較ページ](/jobs)でも並べて確認できます。人事の仕事については[人事・採用の仕事に未経験から近づくには](/articles/jinji-saiyo-mikeiken)でくわしく紹介しています。

## 移る前に確かめておきたいこと

最後に、応募前にチェックしておきたいことをまとめます。

- 勤務時間は固定か、シフト制か
- 休日は何曜日か、年間休日は何日か
- 電話・メール・チャットのどれが中心か
- 対応件数など、数字の目標はあるか
- 1日のうち座っている時間と、休憩の取り方

```figure
type: checklist
title: オフィスワークに移る前に確かめたいこと
items:
  - 勤務時間は固定か、シフト制か
  - 休日は何曜日か、年間休日は何日か
  - 電話・メール・チャットのどれが中心か
  - 対応件数など、数字の目標はあるか
  - 1日のうち座っている時間と、休憩の取り方
```

接客からオフィスワークへの移り方に、決まった正解はありません。「何がつらくて、何を続けたいか」を書き出してから求人を見ると、自分に合う仕事を選びやすくなります。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['sekkyaku-keiken-ikasu', 'eigyo-cs-it-support-chigai', 'donichi-yasumi-nenshu-hikaku']::text[], array['customer-support', 'jimu', 'jinji']::text[], array['office', 'donichi']::text[], array['sekkyaku']::text[], array['接客からオフィスへ。', '働き方はどう変わる？']::text[], null, false, '[{"q":"オフィスワークに移れば、土日休みになりますか？","a":"そうとは限りません。会社の休日に合わせて働く事務などは土日休みの職場もありますが、カスタマーサポートのように問い合わせ窓口を開けている時間に合わせてシフトで働く仕事もあります。求人票の休日欄と年間休日の日数で確かめましょう。"},{"q":"ずっと座っている仕事に慣れられるか不安です。","a":"立ち仕事とは別の疲れ方をするので、不安に思うのは自然なことです。厚生労働省のガイドラインでは、会社が取り組むこととして、パソコンなどを使う作業の連続作業が1時間を超えないようにし、次の作業までに10〜15分の作業休止を設けることなどが示されています。面接で休憩の取り方や、席を離れる作業があるかを聞いておくと安心です。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"接客経験の言語化（sekkyaku-keiken-ikasu）ではなく、働き方・1日の過ごし方の変化に焦点をあてる","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/64","text":"コールセンターオペレーターは主に電話で顧客とやりとりする。顧客からの電話を受けるインバウンド（商品の注文受付、予約、資料請求、問い合わせ対応など）と、顧客に電話をかけるアウトバウンドに分かれる。","used_in":"移りやすいのは、どんな仕事？"},{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/428","text":"一般事務は書類の作成・整理、データ入力、電話の取り次ぎ、来客への対応などを行う。","used_in":"移りやすいのは、どんな仕事？"},{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/427","text":"受付事務は来訪者の用件を確認し、担当者や部署に取り次ぎ、案内する。","used_in":"移りやすいのは、どんな仕事？"},{"source_url":"https://www.mhlw.go.jp/content/000539603.pdf","text":"事業者が講ずべき措置として、一連続作業時間が1時間を超えないようにし、次の連続作業までの間に10〜15分の作業休止時間を設け、かつ一連続作業時間内に1〜2回程度の小休止を設けるよう指導することとされている。令和元年7月12日付け基発0712第3号で策定（旧VDTガイドラインを改めたもの）。","used_in":"座り仕事って、楽じゃないの？"}]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'sekkyaku-office' and c.slug = 'keiken' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'sekkyaku-office' and c.slug = 'shokushu' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'コールセンターオペレーター - 職業詳細（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/64', '2026-10-06'::date, '電話で問い合わせに応える仕事の内容（注文・予約・問い合わせを受ける受信業務と、こちらから電話をかける発信業務）', 0 from articles where slug = 'sekkyaku-office';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '一般事務 - 職業詳細（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/428', '2026-10-06'::date, '一般事務の仕事内容（書類・データ入力、電話の取り次ぎ、来客対応など）', 1 from articles where slug = 'sekkyaku-office';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '受付事務 - 職業詳細（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/427', '2026-10-06'::date, '受付事務の仕事内容（来訪者の用件を確認して取り次ぎ、案内する）', 2 from articles where slug = 'sekkyaku-office';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '情報機器作業における労働衛生管理のためのガイドラインと解説（令和元年7月12日策定）', '厚生労働省', 'https://www.mhlw.go.jp/content/000539603.pdf', '2026-10-06'::date, 'パソコンなどを使う作業での連続作業時間と作業休止時間の目安', 3 from articles where slug = 'sekkyaku-office';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'sekkyaku-office' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"acf8969509a25fa6ebbdcdf27857c6447c8b60b8ab7a7fabf37b22a585f0c4e8","findings":[]}'::jsonb from articles where slug = 'sekkyaku-office';
update articles set status = 'published' where slug = 'sekkyaku-office';

-- article: seko-kanri-mikeiken (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('seko-kanri-mikeiken', 'article', '施工管理の仕事内容は？4つの管理と資格の段階、未経験から目指す前に確認する働き方', '施工管理は、工事現場で工事が予定どおり・安全に進むよう、工程・品質・安全・原価を管理する仕事です。建築と土木の違い、施工管理技士の資格の段階（技士補・技士）と2024年度からの受検資格、2024年4月から建設業に適用された残業の上限、応募前に確認することを紹介します。', '「ものづくりの現場に関わりたい」「資格を取って長く続けられる仕事に就きたい」。そう考えたときに候補に挙がりやすいのが、建設業の施工管理です。一方で、「未経験でも大丈夫？」「残業が多いって本当？」と不安に思う人も多い仕事です。

先に結論を言うと、施工管理は**現場で自分が作業をするのではなく、工事が予定どおり・安全に進むように段取りと確認をする仕事**です。資格は働きながら段階を踏んで取るもので、残業については**2024年4月から建設業にも上限の規制が適用**されています。

この記事で分かること：

- 施工管理の**仕事内容**と、4つの管理
- **建築と土木**の違い
- 施工管理技士の**資格の段階**（技士補・技士）と受検資格
- 2024年4月からの**残業の上限**と、応募前に確認すること

## 施工管理の仕事内容は？

厚生労働省の職業情報提供サイト（job tag）では、建築施工管理技術者を、建築工事の現場で工事が適切に、予定どおりに行われるよう監督・指導する仕事として紹介しています。下請けの業者を選ぶこと、費用や工程の調整、安全の管理なども仕事に含まれます。建物の設計は主に設計の担当者が行い、施工管理は**現場の監督**が中心です。

### 4つの管理

施工管理の仕事は、よく**工程・品質・安全・原価**の4つの「管理」に分けて説明されます。具体的な場面にすると、たとえば次のような仕事です。

- **工程管理**：「来週は雨の予報なので、屋内の作業を先に回そう」と日程を組み替える
- **品質管理**：決められた寸法や材料で施工されているかを確認し、写真や書類で記録する
- **安全管理**：朝の打ち合わせで、その日の危ない作業と注意点を共有する。足場や手すりの状態を確かめる
- **原価管理**：材料の発注量や、職人さんの手配の人数が予算に合っているかを確認する

現場の職人さんや協力会社、発注者（工事を頼んだ側）とのやりとりが多く、**人と話しながら段取りを組む仕事**ともいえます。

## 建築と土木の違い

施工管理は、扱う工事によって大きく2つに分かれます。

| 種類 | 主な工事 |
| --- | --- |
| 建築施工管理 | マンション・ビル・住宅・店舗などの建物 |
| 土木施工管理 | 橋・道路・鉄道・ダムなど |

job tag では、土木施工管理技術者を、橋や道路、鉄道、ダムなどの工事を計画し、現場の作業を監督・指導する仕事として紹介しています。施工・安全・品質・工程の管理をする点は建築と同じです。このほか、電気工事や管工事（空調・給排水）など、設備の工事を担当する施工管理もあります。

## 資格は「技士補」→「技士」の段階で考える

施工管理の資格は、国家試験の**施工管理技術検定**で取ります。建築・土木・電気工事・管工事などの種類があり、それぞれ1級と2級があります。

2021年4月の制度の改正で、検定は**第一次検定**と**第二次検定**に分かれました。

```figure
type: steps
title: 施工管理技士の資格の段階
items:
  - label: 第一次検定に合格
    text: 「技士補」の称号。2級は17歳以上で受検できる
  - label: 現場で実務経験を積む
    text: 先輩の補佐をしながら、工事の流れを覚える
  - label: 第二次検定に合格
    text: 「技士」の称号。現場を任される道が広がる
```

- **第一次検定**に合格すると「技士補」、**第一次検定と第二次検定の両方**に合格すると「技士」の称号が与えられます
- 2024年度から受検資格が見直され、**1級の第一次検定は19歳以上、2級の第一次検定は17歳以上**（どちらも受検する年度の末の時点）であれば、実務経験がなくても受検できるようになりました
- 第二次検定は、第一次検定に合格したあと、**一定の実務経験**を積んでから受検します。必要な経験の年数は級や経路によって違うので、試験を行う機関の「受検の手引」で確認しましょう

未経験の人は、入社前に第一次検定を目指すか、入社後に現場を知ってから受けるかを選べます。資格を先に取るべきか迷ったら、[未経験の転職に資格は必要？](/articles/mikeiken-shikaku)も参考にしてください。

## 残業はどうなった？2024年4月からの上限規制

施工管理は「残業が多い」と言われてきた仕事です。建設業は、残業（時間外労働）の上限の規制の適用が猶予されていましたが、**2024年4月から建設業にも適用**されています。厚生労働省の資料では、次のように説明されています。

| ルール | 上限 |
| --- | --- |
| 原則 | 月45時間・年360時間 |
| 特別な事情があり、労使が合意した場合 | 年720時間以内 |
| 同上（休日労働を含む） | 月100時間未満、2〜6か月の平均80時間以内 |
| 月45時間を超えられる回数 | 年6回まで |

ただし、**災害の復旧・復興の事業**では、「月100時間未満」と「複数月の平均80時間以内」の規制は適用されません。

これは法律の上限で、実際の残業時間は会社や現場によって違います。現場が動いている時間と、書類や写真の整理をする時間が別にある仕事なので、求人票と面接で具体的に確かめておきましょう。固定残業代がついている求人の読み方は、[固定残業代（みなし残業）がある求人の見方](/articles/koteizangyo-kyujin)にまとめています。

## 向いている人・合わないと感じやすい場面

### 向いている人

- 予定を立てて、その通りに進んでいるか確かめるのが好き
- 年上の職人さんや取引先とも、落ち着いてやりとりできる
- 「なぜ危ないか」を考えて、先回りして手を打てる

### 合わないと感じやすい場面

- 現場は屋外が多く、暑さ寒さの中で歩き回る
- 工事の終わりが近づくと、日程の調整が立て込みやすい
- 現場の場所が変わると、通勤のしかたが変わることがある

接客や販売の経験がある人は、**相手の話を聞いて調整すること**や**シフトや段取りを組んできたこと**が活かせます。面接では、たとえば次のように伝えられます。

> 「飲食店でアルバイトリーダーとして、スタッフのシフトや開店前の準備の段取りを組んでいました。施工管理でも、関わる人の予定を聞きながら、工事が予定どおり進むよう調整する仕事に取り組みたいと考えています。」（仮の例です）

## 応募前に、確認すること

```figure
type: checklist
title: 施工管理の求人で確認すること
items:
  - 建築・土木・設備のどの工事か
  - 元請けか下請けか、扱う工事の規模
  - 入社後の研修と、先輩の補佐をする期間
  - 資格の受検費用や講習の支援があるか
  - 月の残業時間の実績と、固定残業代の有無
  - 休日の決まり方（現場の休みに合わせるか）
  - 現場への通勤のしかたと、出張・転勤の有無
```

求人に書かれていないことは、面接で質問してかまいません。質問の例です。

- 「入社後、ひとりで現場を担当するまで、どのくらい先輩と一緒に動きますか」
- 「直近1年間の、月の平均の残業時間はどのくらいですか」
- 「施工管理技士の受検について、会社の支援はありますか」
- 「休みは会社のカレンダーで決まりますか、それとも現場ごとですか」

残業や有休の取りやすさ、若い人の定着の状況は、求人の「職場の情報」で確かめられる場合があります。見方は[求人で「職場の情報」を確かめるには？](/articles/shokuba-jouhou-wakamono)を参考にしてください。施工管理は、資格と経験を積み重ねていく仕事です。どの工事を、どんな働き方で担当したいかを決めてから求人を比べると、入社後のずれを減らせます。', 'review', false, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '施工管理の仕事内容は？未経験から目指す前の確認点', '未経験から施工管理を考える人へ。工程・品質・安全・原価の4つの管理の中身、建築と土木の違い、施工管理技士の技士補・技士の段階と受検資格、2024年4月から建設業に適用された時間外労働の上限、求人で確認することを紹介します。', array['koteizangyo-kyujin', 'mikeiken-shikaku', 'shokuba-jouhou-wakamono', 'driver-shigoto', 'seizou-koujou-shigoto']::text[], array['sonota']::text[], array['mikeiken-shokushu', 'kyuryo']::text[], array['hajimete', 'dainishinsotsu']::text[], array['施工管理って、', '未経験でもなれる？']::text[], null, false, '[{"q":"施工管理は、資格がなくても始められますか？","a":"施工管理技士の資格は、実務の経験を積みながら段階を踏んで取っていくものです。2024年度から受検資格が見直され、1級の第一次検定は受検する年度の末に19歳以上、2級の第一次検定は17歳以上であれば受検できるようになりました。未経験の場合は、先輩の補佐から始めて、働きながら資格を目指す形が考えられます。応募資格は求人ごとに違うので、求人票で確認しましょう。"},{"q":"施工管理は残業が多いと聞きます。今はどうなっていますか？","a":"建設業は時間外労働の上限規制の適用が猶予されていましたが、2024年4月から適用されています。原則は月45時間・年360時間までで、特別な事情があって労使が合意した場合でも年720時間以内などの上限があります（災害の復旧・復興の事業は一部の規制が適用されません）。実際の残業時間は職場によって違うので、求人票や面接で確認しましょう。"},{"q":"「技士補」と「技士」は何が違いますか？","a":"施工管理技術検定は、第一次検定と第二次検定に分かれています。第一次検定に合格すると「技士補」、第一次検定と第二次検定の両方に合格すると「技士」の称号が与えられます。第二次検定は、第一次検定に合格したあとに一定の実務経験を積んでから受検します。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"施工管理を「現場で手を動かす人」ではなく「工事を予定どおり・安全に進める段取り役」として説明し、4つの管理を具体的な場面で見せる。資格は技士補→技士の段階で、働きながら取るものだと伝え、2024年4月からの残業の上限規制を「求人で何を確かめるか」に落とす","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/21","text":"建築工事現場で工事が適切に予定どおり行われるよう監督・指導する。下請業者の選定、コストや工程の調整、安全管理などを行う。設計や調査は主に建築設計技術者が担当し、施工管理技術者は現場の監督が中心（job tag へ直接接続できなかったため、検索結果に表示されたページ内容で確認）","used_in":"施工管理の仕事内容は？"},{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/23","text":"橋梁・道路・鉄道・ダムなどの土木工事を計画し、現場で作業を監督・指導する。施工管理、安全管理、品質管理、工程管理などを行う（検索結果で確認）","used_in":"建築と土木の違い"},{"source_url":"https://www.mlit.go.jp/tochi_fudousan_kensetsugyo/const/tochi_fudousan_kensetsugyo_const_tk1_000001_00005.html","text":"第一次検定の合格者を「技士補」（今回の改正により新設）、第一次検定及び第二次検定の両方の合格者に「技士」の称号を付与することとした（国土交通省サイトへ直接接続できなかったため、検索結果に表示された内容で確認）","used_in":"資格は「技士補」→「技士」の段階で考える"},{"source_url":"https://www.mlit.go.jp/tochi_fudousan_kensetsugyo/const/content/001707687.pdf","text":"令和6年度より、1級の第一次検定は19歳以上（受検年度末時点）であれば受検可能。2級の第一次検定は17歳以上（受検年度末時点）であれば受検可能（従前から変更なし）。第二次検定は第一次検定合格後の実務経験で受検（検索結果で確認）","used_in":"資格は「技士補」→「技士」の段階で考える"},{"source_url":"https://www.mhlw.go.jp/content/001232856.pdf","text":"2024年4月から建設業にも上限規制が適用。原則月45時間・年360時間。特別条項でも年720時間以内、時間外労働と休日労働の合計が月100時間未満、複数月平均80時間以内、月45時間を超えるのは年6回まで。災害の復旧・復興の事業では月100時間未満・複数月平均80時間以内は適用しない（検索結果で確認）","used_in":"残業はどうなった？2024年4月からの上限規制"}],"not_used":["施工管理技術者の平均年収・労働時間の数字は、job tag のページを直接開いて確認できず、二次情報サイトでしか見られなかったため書かない","第二次検定に必要な実務経験の年数は、級や経路（特定実務経験・経過措置など）で細かく分かれるため、本文では「一定の実務経験」とし、受検の手引での確認をすすめた","主任技術者・監理技術者の配置要件の詳細は、この記事の読者の最初の疑問から外れるため扱わない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'seko-kanri-mikeiken' and c.slug = 'shokushu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'seko-kanri-mikeiken' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '建築施工管理技術者 - 職業詳細（職業情報提供サイト job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/21', '2026-10-09'::date, '建築工事の現場で工事が適切に予定どおり行われるよう監督・指導する仕事であること、下請業者の選定、コストや工程の調整、安全の管理をすること、設計は建築設計技術者が担当すること', 0 from articles where slug = 'seko-kanri-mikeiken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '土木施工管理技術者 - 職業詳細（職業情報提供サイト job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/23', '2026-10-09'::date, '橋・道路・鉄道・ダムなどの工事を計画し、現場の作業を監督・指導すること、施工・安全・品質・工程の管理をすること', 1 from articles where slug = 'seko-kanri-mikeiken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '技術検定制度の改正（令和3年4月1日施行）', '国土交通省', 'https://www.mlit.go.jp/tochi_fudousan_kensetsugyo/const/tochi_fudousan_kensetsugyo_const_tk1_000001_00005.html', '2026-10-09'::date, '技術検定が第一次検定と第二次検定に分かれ、第一次検定の合格者に「技士補」、両方の合格者に「技士」の称号が与えられること', 2 from articles where slug = 'seko-kanri-mikeiken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '令和６年度より施工管理技術検定の受検資格が変わります', '国土交通省', 'https://www.mlit.go.jp/tochi_fudousan_kensetsugyo/const/content/001707687.pdf', '2026-10-09'::date, '2024年度から、1級の第一次検定は19歳以上、2級の第一次検定は17歳以上（いずれも受検年度末時点）で受検できること、第二次検定は第一次検定合格後の実務経験で受検すること', 3 from articles where slug = 'seko-kanri-mikeiken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '建設業の時間外労働の上限規制（建設業の事業主の皆さまへ）', '厚生労働省', 'https://www.mhlw.go.jp/content/001232856.pdf', '2026-10-09'::date, '2024年4月から建設業に時間外労働の上限規制が適用されたこと、原則月45時間・年360時間、特別条項でも年720時間以内・月100時間未満・複数月平均80時間以内・月45時間超は年6回まで、災害の復旧・復興の事業の例外', 4 from articles where slug = 'seko-kanri-mikeiken';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'seko-kanri-mikeiken' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"94d211200941550e74026323ce2277e78cf18b8f7716b42388b865e80120a7eb","findings":[]}'::jsonb from articles where slug = 'seko-kanri-mikeiken';
update articles set status = 'published' where slug = 'seko-kanri-mikeiken';

-- article: shiboudouki-mikeiken (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('shiboudouki-mikeiken', 'article', '未経験職種の志望動機、何を書けばいい？3つの要素と例文', '未経験の職種に応募するとき、志望動機に「経験がないこと」をどう書けばいいか迷う人は多いはずです。きっかけ・経験との接点・入社後に取り組みたいことの3つの要素で組み立てる方法を、例文つきで紹介します。', '未経験の職種に応募するとき、志望動機で手が止まってしまう人は多いと思います。「経験がないのに、何をアピールすればいいのか」と悩むのは自然なことです。

未経験の志望動機は、**きっかけ**・**経験との接点**・**入社後に取り組みたいこと**の3つの要素で組み立てると、書きやすくなります。

```figure
type: steps
title: 志望動機は3つの要素で組み立てる
items:
  - label: きっかけ
    text: その仕事に興味を持った自分の体験
  - label: 経験との接点
    text: これまでの経験で活かせそうなこと
  - label: 入社後に取り組みたいこと
    text: 学ぶ姿勢を具体的に
```

## 要素1：その仕事に興味を持ったきっかけ

まずは、なぜその職種に興味を持ったのかを書きます。立派な理由である必要はありません。大切なのは、**自分の実際の体験にもとづいていること**です。

- アルバイト先で、お客さまの問い合わせに答えるのが一番やりがいを感じた
- 職場のパソコンのトラブルを解決したら感謝されたことがあった
- 営業担当の人と話す中で、提案の仕事に興味を持った

「成長できる環境だから」「将来性があるから」といった理由は、どの会社にも当てはまるため、それだけだと印象に残りにくくなります。

## 要素2：これまでの経験との接点

次に、これまでの経験の中で、応募する仕事に活かせそうな部分を書きます。職種そのものの経験がなくても、仕事の中の作業に共通点があることは多いものです。

| 応募する職種 | 接点になりやすい経験の例 |
| --- | --- |
| 営業 | お客さまの好みを聞いておすすめしていた、売上目標を意識していた |
| カスタマーサポート | 問い合わせやクレームに対応していた、説明を工夫していた |
| ITサポート | パソコンの設定を調べて解決した、手順書をつくった |
| 事務 | 数字の入力や確認をしていた、電話対応をしていた |

応募する職種の仕事内容は、事前に調べておきましょう。厚生労働省の職業情報提供サイト（job tag）や、[職種比較ページ](/jobs)で、どんな作業があるのかを確認できます。

## 要素3：入社後に取り組みたいこと

最後に、入社後にどう取り組みたいかを書きます。未経験であることは事実なので、**学ぶ姿勢を具体的に示す**ことがポイントです。

- 研修で基礎を身につけ、まずは一人で対応できる問い合わせの種類を増やしたい
- 先輩の商談に同行しながら、提案のしかたを学びたい
- 業務に必要な資格の勉強を始めている

すでに始めている勉強や準備があれば、それを書くと意欲が伝わりやすくなります。

## 3つの要素を組み合わせた例文

カスタマーサポート職に応募する場合の例です。

> 飲食店でのアルバイトで、約2年間ホールスタッフを担当しました。中でも、お客さまからのご意見やお問い合わせに対応したときに、相手の状況を聞いて最適な対応を考えることにやりがいを感じ、カスタマーサポートの仕事に興味を持ちました。混雑時にお待たせしているお客さまへ状況を説明し、ご理解いただけるよう工夫した経験は、お問い合わせへの対応でも活かせると考えています。入社後は研修で製品やサービスの知識を身につけ、まずは一人で対応できる内容を着実に増やしていきたいです。

例文はあくまで型の参考です。そのまま使うのではなく、自分の体験に置き換えて書いてみてください。

## 書いたあとに確認したいこと

志望動機を書き終えたら、次の3点を確認しましょう。

- ほかの会社の名前に置き換えても通じる内容になっていないか
- 書いた経験について、面接で具体的に聞かれても答えられるか
- 応募する会社の仕事内容と、書いた内容がずれていないか

```figure
type: checklist
title: 志望動機を書いたあとに確認する3点
items:
  - ほかの会社の名前に置き換えても通じる内容になっていないか
  - 書いた経験を面接で具体的に聞かれても答えられるか
  - 応募する会社の仕事内容と、書いた内容がずれていないか
```

経験の言葉にしかたで迷ったら[接客経験は転職でどう活かせる？](/articles/sekkyaku-keiken-ikasu)を、経歴の説明に不安があれば[転職回数が気になるときに整理したいこと](/articles/tenshoku-kaisu-kininaru)も参考にしてください。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['sekkyaku-keiken-ikasu', 'tenshoku-kaisu-kininaru', 'eigyo-cs-it-support-chigai', 'jiko-pr-mikeiken']::text[], '{}'::text[], array['mensetsu', 'mikeiken-shokushu']::text[], array['sekkyaku']::text[], array['未経験の志望動機、', '何を書けばいい？']::text[], null, false, '[{"q":"「未経験ですが頑張ります」だけでは伝わりませんか？","a":"意欲は伝わりますが、それだけだとほかの応募者との違いが見えにくくなります。なぜその仕事に興味を持ったのか、これまでの経験のどこが活かせそうかを添えると、同じ意欲でも説得力が変わります。"},{"q":"志望動機はどれくらいの長さで書けばいいですか？","a":"履歴書の志望動機欄なら、200〜300文字程度にまとめると読みやすくなります。面接では、その内容を1分前後で話せるように準備しておくと安心です。"}]'::jsonb, null, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'shiboudouki-mikeiken' and c.slug = 'shorui-mensetsu' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業情報提供サイト（job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/', '2026-10-06'::date, '応募する職種の仕事内容を調べる方法', 0 from articles where slug = 'shiboudouki-mikeiken';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'shiboudouki-mikeiken' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"54b016e7214c412e7316ff726f2dbfe3dead43e5bd33c6bd6ab20146a43c5ad0","findings":[{"code":"C03","severity":"warning","message":"出典が1件のみ。可能なら2件以上で裏付ける"}]}'::jsonb from articles where slug = 'shiboudouki-mikeiken';
update articles set status = 'published' where slug = 'shiboudouki-mikeiken';

-- article: shigoto-sagashikata (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('shigoto-sagashikata', 'article', 'やりたい仕事が分からない。自分に合う仕事の探し方3ステップ', '「やりたいことが見つからない」と止まってしまったら、やりたいことから探すのをいったんやめてみましょう。「避けたいこと」「続けられた作業」「ゆずれない条件」の3つから候補を2〜3職種にしぼり、比べて確かめる方法を、書き出し例つきで紹介します。', '「やりたい仕事は？」と聞かれて、答えに詰まってしまう。転職を考え始めたときに、よくぶつかる悩みです。

やりたいことがはっきりしないときは、「やりたいこと」から探すのをいったんやめてみましょう。代わりに、**避けたいこと・続けられた作業・ゆずれない条件**の3つから候補をしぼっていくと、自分に合いそうな仕事が見えやすくなります。

## やりたいことが分からなくても大丈夫？

大丈夫です。やりたいことは、働きながら見えてくることもあります。最初から1つに決めようとすると、かえって動けなくなりがちです。

この記事では、次の3ステップで候補を2〜3職種にしぼります。紙かスマホのメモを用意して、思いつくまま書いてみてください。

1. 避けたいことを書き出す
2. 続けられた作業を書き出す
3. ゆずれない条件を3つまで決める

## ステップ1：避けたいことは？

これまでの仕事やアルバイトで「これはつらかった」と感じたことを書き出し、求人で確かめられる言葉に置きかえます。

| 避けたいこと（書き出し例） | 求人で見るところ |
| --- | --- |
| 1日中立ちっぱなしがつらかった | 仕事内容（座ってする作業が中心か） |
| 土日に休めないのがしんどい | 休日の欄（完全週休2日制か、年間休日は何日か） |
| 夜遅いシフトが続いた | 勤務時間の欄（シフト制か、夜勤があるか） |
| 毎月の売上目標がプレッシャーだった | 仕事内容・給与の欄（個人の目標や成果給があるか） |

避けたいことがはっきりすると、合わない求人を早めに外せるようになります。

## ステップ2：続けられた作業は？

次に、「得意なこと」ではなく、**苦にならずに続けられた作業**を書き出します。得意と言い切れなくても構いません。

| 続けられた作業（書き出し例） | つながりやすい仕事の例 |
| --- | --- |
| レジ締めでお金をぴったり合わせる | 事務 |
| 新人にレジや品出しを教える | カスタマーサポート、人事・採用のアシスタント |
| 常連さんの好みを覚えて商品をすすめる | 営業、販売 |
| スマホやパソコンの設定を調べて直す | ITサポート |

厚生労働省の職業情報提供サイト「job tag」には、仕事の内容から職業を探せる検索もあります。書き出した作業に近い言葉で探すと、知らなかった職業が見つかることもあります。

## ステップ3：ゆずれない条件は？

土日休み、年収の下限、通勤時間など、仕事選びの条件を書き出して、**ゆずれないものを3つまで**にしぼります。全部を「ゆずれない」にすると、当てはまる求人がほとんど残らなくなるからです。

ここでの条件は、職種を選ぶための「ふるい」として使います。たとえば「土日休み」がゆずれないなら、土日も営業する店での仕事は、職種の候補からいったん外して考えます。迷ったら、[条件整理チェック](/check)の質問に答えていくと、ゆずれない条件と、できればほしい条件を分けて整理できます。

## 候補を2〜3職種にしぼって比べる

3つのステップで書き出したものを並べると、候補が見えてきます。たとえば、こんな人の場合です（例）。

- 避けたいこと: 立ちっぱなし、夜遅いシフト
- 続けられた作業: レジ締め、新人に教える
- ゆずれない条件: 土日休み、自宅から通える

```figure
type: steps
title: 例：書き出しから候補が見えるまで
items:
  - label: 避けたいこと
    text: 立ちっぱなし、夜遅いシフト
  - label: 続けられた作業
    text: レジ締め、新人に教える
  - label: ゆずれない条件
    text: 土日休み、自宅から通える
  - label: 候補を2〜3職種に
    text: 事務、カスタマーサポート、ITサポート
```

この場合、「事務」「カスタマーサポート」「ITサポート」などが候補になります。次に、同じ表で比べます。

| 候補 | 合っていそうな点 | 気になる点 | 確かめること |
| --- | --- | --- | --- |
| 事務 | 座り仕事で、数字を正確に扱う | パソコン作業が多い | 求められるPCスキル |
| カスタマーサポート | 教える・説明する経験が活きる | シフト制の職場もある | 休日と勤務時間 |
| ITサポート | 順を追って説明する経験が活きる | 新しい知識を覚え続ける | 研修の内容、夜間・休日の対応 |

「確かめること」は、応募する前に小さく試せます。

- 候補ごとに求人を3件ずつ読み、「仕事内容」の欄でよく出てくる作業に印をつける
- 印をつけた作業を、1日続けている自分を想像できるかを考える
- 「確かめること」の列を、面接で聞く質問の形に書き直しておく

```figure
type: checklist
title: 応募する前に小さく試す
items:
  - 候補ごとに求人を3件ずつ読み、よく出る作業に印をつける
  - 印をつけた作業を1日続ける自分を想像できるか考える
  - 「確かめること」を面接で聞く質問の形に書き直す
```

職種ごとの仕事内容や、人と話す量・パソコン作業の多さは、[職種比較ページ](/jobs)で並べて見られます。

## 調べてもしぼれないときは？

job tag には、職業興味検査や仕事価値観検査など、興味や大事にしたいことから職業を探すツールもあります。ただし、job tag のよくある質問では、検査で出てくる職業は学歴・職務経験・資格などを考えずに挙げたものなので、参考として使うよう案内されています。結果は候補を広げるヒントにして、ステップ1〜3で確かめましょう。

ひとりで決めきれないときは、書き出したメモを持って相談するのも一つの方法です。正社員を目指すおおむね35歳未満の人は、わかものハローワークで担当者に無料で相談できます。キャリアアドバイザーへの相談については[キャリア相談について](/consultation)で紹介しています。

候補が決まったあとの準備の流れは、[未経験転職は何から始める？](/articles/mikeiken-tenshoku-hajimekata)にまとめています。', 'review', true, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['mikeiken-tenshoku-hajimekata', 'eigyo-cs-it-support-chigai', 'sekkyaku-keiken-ikasu', 'jiko-bunseki-yarikata', 'tenshoku-agent-merit']::text[], array['sonota']::text[], array['yaritai', 'mikeiken-shokushu']::text[], array['hajimete', 'seishain-keiken-sukunai']::text[], array['やりたい仕事が', '分からないときは。']::text[], null, false, '[{"q":"やりたいことが決まっていないまま、転職活動を始めてもいいですか？","a":"始めて大丈夫です。やりたいことがはっきりしていなくても、避けたいこと・続けられた作業・ゆずれない条件の3つを書き出せば、候補をしぼって比べることはできます。働きながら、やりたいことが見えてくる人もいます。"},{"q":"適職診断の結果は、どこまで参考にしていいですか？","a":"結果は候補を広げるヒントとして使うのがおすすめです。job tag のよくある質問でも、職業興味検査や仕事価値観検査で出てくる職業は、学歴・職務経験・資格などを考えずに挙げたものなので、参考として使うよう案内されています。出てきた職業は、この記事の3ステップで確かめてみてください。"},{"q":"候補の職種はいくつくらいにしぼればいいですか？","a":"2〜3職種がおすすめです。1つだけだと比べる相手がなく、多すぎると一つひとつを調べきれなくなります。比べてみて合わないと分かった職種は、外して入れ替えて構いません。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"ホームのメイン導線の着地先。「やりたいこと」から探さず、避けたいこと・続けられた作業・ゆずれない条件の3ステップで候補を2〜3職種にしぼり、比べて確かめる。mikeiken-tenshoku-hajimekata（転職準備の5項目）とは重ならないよう、職種の候補を見つける手順に絞る","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/Search/WorkActivity","text":"job tag では、仕事の内容（具体的な作業）から職業を検索できる。","used_in":"ステップ2：続けられた作業は？"},{"source_url":"https://shigoto.mhlw.go.jp/User/faq","text":"職業興味検査や仕事価値観検査で表示される職業リストは、回答者の学歴・職務経験・取得資格・専門性などを考慮しておらず、興味や価値観の特徴と職業との類似度から作成されているので、参考として利用すること。","used_in":"調べてもしぼれないときは？"},{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000181329.html","text":"わかものハローワークは、正社員を目指す若者（おおむね35歳未満）を対象に、担当者制による職業相談や自己理解・職務理解のサポートなどを無料で行っている。","used_in":"調べてもしぼれないときは？"}]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'shigoto-sagashikata' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'shigoto-sagashikata' and c.slug = 'shokushu' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '仕事の内容で検索（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/Search/WorkActivity', '2026-10-06'::date, '仕事の内容から職業を探せる検索があること', 0 from articles where slug = 'shigoto-sagashikata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'よくあるお問い合わせ（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/faq', '2026-10-06'::date, '職業興味検査・仕事価値観検査があること、結果の職業リストは学歴・職務経験・資格などを考慮していないため参考として使うこと', 1 from articles where slug = 'shigoto-sagashikata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'わかものハローワーク', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000181329.html', '2026-10-06'::date, '正社員を目指すおおむね35歳未満の若者を対象に、担当者制の職業相談などを無料で行っていること', 2 from articles where slug = 'shigoto-sagashikata';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'shigoto-sagashikata' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"94b1082c88fd9f60d64f327d10dcdea85db69b2acb5e2155163c66762c22c790","findings":[]}'::jsonb from articles where slug = 'shigoto-sagashikata';
update articles set status = 'published' where slug = 'shigoto-sagashikata';

-- article: shitsugyo-teate-kihon (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('shitsugyo-teate-kihon', 'article', '退職後の失業手当はもらえる？条件・自己都合と会社都合の違い・手続きの流れ', '雇用保険の基本手当（いわゆる失業手当）を受け取るための条件、自己都合と会社都合で何が変わるか、2025年4月1日以降の退職で原則1か月になった給付制限、ハローワークでの手続きの流れを、はじめて退職する人向けに整理します。', '「仕事を辞めたら、失業手当って出るの？」。はじめて退職する人がまず気になるのがここだと思います。

先に結論です。

- 失業手当の正式な名前は、雇用保険の**基本手当**です。雇用保険に入っていた期間などの条件を満たし、ハローワークで手続きをした人が受け取れます
- 自己都合で辞めた場合は、7日間の待期のあとに**給付制限**があります。離職日が2025年4月1日以降なら、給付制限は原則1か月です
- 受け取れる金額と日数は、辞める前の給料・年齢・雇用保険に入っていた期間・辞めた理由で決まります

この記事では、もらえる条件、自己都合と会社都合の違い、手続きの順番を整理します。

## 失業手当（基本手当）って何？

基本手当は、雇用保険に入って働いていた人が仕事を辞めたあと、次の仕事を探している間の生活を支えるためのお金です。ハローワークの説明では、受け取るには次の両方を満たす必要があります。

1. ハローワークで求職の申込みをしていて、働く気持ちと、いつでも働ける状態があるのに、仕事が見つからない「失業の状態」であること
2. 雇用保険に一定の期間入っていたこと（次の見出しで説明します）

つまり、「辞めた」だけでは受け取れません。病気やけがですぐに働けない人、しばらく休むつもりの人、すでに次の仕事が決まっている人は、原則として対象になりません。

## もらえる人の条件は？

雇用保険に入っていた期間の条件は、辞めた理由で変わります。

| 辞めた理由 | 必要な被保険者期間 |
| --- | --- |
| 自己都合など（一般の離職者） | 離職の日以前2年間に、通算12か月以上 |
| 倒産・解雇など（特定受給資格者）、正当な理由のある自己都合（特定理由離職者） | 離職の日以前1年間に、通算6か月以上 |

ここでいう「被保険者期間」は、ただ在籍していた月数とは数え方が違う場合があります。また、前の職場で雇用保険に入っていた期間を合わせて数えられる場合もあるので、自分で判断せず、離職票を持ってハローワークで確認するのが確実です。

```figure
type: checklist
title: 失業手当を受け取る前に確認すること
items:
  - 雇用保険に入っていたか（給与明細の雇用保険料の欄）
  - 離職の日以前2年間に通算12か月以上あるか
  - すぐに働ける状態か
  - 会社から離職票が届いたか
  - 住んでいる地域のハローワークはどこか
```

## 自己都合と会社都合で何が違う？

よく「自己都合」「会社都合」と言われますが、ハローワークでは次のように分けて判断します。

- **特定受給資格者**：倒産や解雇（本人に重大な責任がある解雇を除く）などで、準備する時間がないまま辞めることになった人
- **特定理由離職者**：契約の更新を希望したのにされなかった人や、体力の不足・病気・けが、結婚にともなう引っ越しなどで通勤が難しくなった人など、正当な理由がある自己都合で辞めた人
- **一般の離職者**：上のどちらにも当たらない自己都合などで辞めた人

違いが出るのは、主に次の3つです。

**1. 必要な被保険者期間**：前の見出しのとおりです。

**2. 給付制限があるかどうか**：正当な理由のない自己都合で辞めた場合、7日間の待期のあとに、手当が出ない「給付制限期間」があります。離職日が2025年3月31日以前なら原則2か月、2025年4月1日以降なら原則1か月です。

```figure
type: compare
style: before-after
title: 自己都合で辞めたときの給付制限
columns:
  - label: 2025年3月31日までの離職
    items:
      - 原則2か月
  - label: 2025年4月1日以降の離職
    items:
      - 原則1か月
      - 教育訓練を受けると解除されるしくみも
```

ただし、離職日からさかのぼって5年間に2回以上、正当な理由のない自己都合退職で受給資格の決定を受けている場合は、給付制限が3か月になります。

また、2025年4月1日以降に受講を始めた教育訓練給付の対象講座や公共職業訓練などを、離職日前1年以内に受けた人や離職日以後に受けている人は、給付制限が解除されて、待期のあとから基本手当を受け取れるしくみができました（途中でやめた場合は対象外です）。

**3. 受け取れる日数（所定給付日数）**：辞めた理由・年齢・雇用保険に入っていた期間で決まります。

離職票に書かれた退職理由が実際と違う、と感じたときは、ハローワークで異議があることを伝えて相談できます。ハローワークが事実関係を確かめたうえで離職理由を判定します。退職を勧められたときのメールやメモなど、いきさつが分かるものを残しておきましょう。

## いくら・何日分もらえる？

### 1日あたりの金額

1日あたりの金額を「基本手当日額」といいます。おおまかな考え方は次のとおりです。

1. 辞める直前の6か月に、毎月決まって支払われた給料の合計を180で割る（これを「賃金日額」といいます。賞与は入りません）
2. 賃金日額のおよそ50〜80％が基本手当日額になります（60歳〜64歳は45〜80％）

給料が低い人ほど、高い割合が使われます。また、年齢ごとに上限額があります。たとえば（仮の例）辞める前6か月の給料の合計が120万円なら、賃金日額は120万円 ÷ 180 ＝ 約6,667円です。基本手当日額はこのおよそ50〜80％の範囲になりますが、実際の割合はハローワークの計算で決まります。

### 受け取れる日数

一般の離職者（自己都合など）の場合、雇用保険に入っていた期間が10年未満なら90日です。倒産・解雇などの特定受給資格者で30歳未満の人は、入っていた期間に応じて90日〜180日です。

| 30歳未満の特定受給資格者 | 所定給付日数 |
| --- | --- |
| 1年未満 | 90日 |
| 1年以上5年未満 | 90日 |
| 5年以上10年未満 | 120日 |
| 10年以上20年未満 | 180日 |

全体では90日〜360日の間で決まります。30歳以上の人や、特定理由離職者の扱いは、ハローワークインターネットサービスの「基本手当の所定給付日数」のページで確認してください。

### 受け取れる期間には期限がある

基本手当を受け取れる期間（受給期間）は、原則として離職した日の翌日から1年間です。この期間を過ぎると、給付日数が残っていても受け取れなくなります。辞めたら、離職票が届きしだい早めに手続きをしましょう。

## ハローワークでの手続きの流れ

手続きは、住んでいる地域を担当するハローワークで行います。

```figure
type: steps
title: 基本手当を受け取るまでの流れ
items:
  - label: 求職の申込み
    text: 離職票などを持ってハローワークへ
  - label: 受給資格の決定
    text: 条件を満たしているか、離職理由を確認
  - label: 待期7日間
    text: この間は手当が出ない
  - label: 受給説明会
    text: 指定された日時に出席する
  - label: 失業の認定
    text: 原則4週間に1度。求職活動の実績が必要
```

### 持っていくもの

ハローワークインターネットサービスでは、次のものが案内されています。

- 雇用保険被保険者離職票（-1、-2）
- マイナンバーが確認できるもの（マイナンバーカード、マイナンバーの記載がある住民票など）
- 本人確認書類（運転免許証、マイナンバーカードなど）
- 写真2枚（縦3.0cm×横2.4cm。マイナンバーカードを提示すれば省略できる場合があります）
- 本人名義の預金通帳またはキャッシュカード

離職票は、退職したあとに会社が手続きをして本人に届くものです。届くのが遅いときは、まず会社に確認しましょう。

### 失業の認定と求職活動

受給資格が決まると、原則4週間に1度、ハローワークで「失業の認定」を受けます。認定を受けるには、前回の認定日から今回の認定日の前日までの間に、原則2回以上（最初の認定日までの期間は1回）の求職活動の実績が必要です。求人への応募や、ハローワークでの職業相談などが実績になります。何が実績として認められるかは、受給説明会やハローワークの窓口で確認してください。

## 辞める前にやっておきたいこと

退職してから「思っていたより手当が少ない」「すぐには出ない」と気づくと、生活費の計画が崩れてしまいます。辞める前に、次の3つを確認しておくと安心です。

1. 給与明細で雇用保険料が引かれているか、何か月分あるか
2. 辞める理由が、自己都合・特定理由離職者・特定受給資格者のどれに当たりそうか（迷ったらハローワークで相談）
3. 給付制限の期間も含めて、手当が出るまでの生活費が足りるか

在職中に転職活動をするか、辞めてから活動するかで迷っているなら、[今の仕事を辞めたいとき、先に確認しておきたいこと](/articles/yametai-mae-kakunin)もあわせて読んでみてください。給付制限の見直しについては[自己都合退職の給付制限が原則1か月に](/news/news-koyou-hoken-kyufu-seigen)でも紹介しています。手取りから生活費を逆算する方法は[手取り20万円から転職を考えるとき、何を比べればいい？](/articles/tedori-20man-hikaku)が参考になります。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-07'::timestamptz, '失業手当の条件と手続き｜自己都合と会社都合の違い・給付制限1か月', '退職後の失業手当（雇用保険の基本手当）をもらうための条件、自己都合と会社都合の違い、2025年4月から原則1か月になった給付制限、ハローワークでの手続きの流れと持ち物を、はじめての人向けに整理します。', array['yametai-mae-kakunin', 'news-koyou-hoken-kyufu-seigen', 'tedori-20man-hikaku']::text[], '{}'::text[], array['yametai']::text[], array['hajimete', 'dainishinsotsu']::text[], array['辞めたあとの失業手当、', 'わたしはもらえる？']::text[], null, false, '[{"q":"1年未満で辞めた場合でも、失業手当はもらえますか？","a":"自己都合で辞めた場合は、原則として離職の日以前2年間に雇用保険の被保険者期間が通算12か月以上必要です。前の職場の期間も合わせて数えられる場合があるので、離職票を持ってハローワークで確認しましょう。倒産・解雇などで辞めた人や、正当な理由のある自己都合で辞めた人は、離職の日以前1年間に通算6か月以上でよいとされています。"},{"q":"自己都合で辞めると、いつから手当が出ますか？","a":"受給資格の決定を受けた日から通算7日間の待期期間があり、そのあとに給付制限期間があります。離職日が2025年4月1日以降で、正当な理由のない自己都合で辞めた場合、給付制限は原則1か月です。ただし、離職日からさかのぼって5年間に2回以上、正当な理由のない自己都合退職で受給資格決定を受けている場合は3か月になります。"},{"q":"離職票の退職理由が、実際と違うときはどうすればいいですか？","a":"ハローワークで、離職理由に異議があることを伝えて相談できます。ハローワークが事実関係を確かめたうえで離職理由を判定します。退職に至ったいきさつが分かるメールや書類があれば、持っていくと説明しやすくなります。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「辞めたらすぐ手当が出る」と思っている人に、条件・待つ期間・手続きの順番を先に見せる。金額は人によって違うので計算式の考え方だけにする","quotes":[{"source_url":"https://www.hellowork.mhlw.go.jp/insurance/insurance_basicbenefit.html","text":"離職の日以前2年間に被保険者期間が通算して12か月以上あること。特定受給資格者または特定理由離職者は離職の日以前1年間に通算6か月以上でも可","used_in":"もらえる人の条件は？"},{"source_url":"https://www.hellowork.mhlw.go.jp/insurance/insurance_basicbenefit.html","text":"正当な理由のない自己都合によって離職した方の給付制限期間は、離職日が令和7年4月1日以降である場合は原則1か月、同年3月31日以前である場合は原則2か月","used_in":"自己都合と会社都合で何が違う？"},{"source_url":"https://www.hellowork.mhlw.go.jp/insurance/insurance_basicbenefit.html","text":"基本手当日額は原則として離職した日の直前の6か月に毎月きまって支払われた賃金の合計を180で割った賃金日額のおよそ50〜80％（60歳〜64歳は45〜80％）。賃金の低い方ほど高い率","used_in":"いくら・何日分もらえる？"},{"source_url":"https://www.hellowork.mhlw.go.jp/insurance/insurance_procedure.html","text":"失業の認定は原則として4週間に1度。認定対象期間中に原則2回以上（最初の認定日の認定対象期間中は1回）の求職活動実績が必要","used_in":"ハローワークでの手続きの流れ"},{"source_url":"https://jsite.mhlw.go.jp/gunma-roudoukyoku/content/contents/002182062.pdf","text":"退職日から遡って5年間のうちに2回以上正当な理由なく自己都合退職し受給資格決定を受けた場合、給付制限は3か月","used_in":"自己都合と会社都合で何が違う？"}],"not_used":["基本手当日額の上限額・下限額の具体的な金額は、年齢や改定時期で変わり、2026年10月時点の最新額を一次情報で確認しきれなかったので書かない","30歳以上の所定給付日数の表は、読者層に合わせて省略（ハローワークのページで確認するよう案内）","求職活動として認められる活動の具体的な一覧は、ハローワークごとの案内で確認するよう書き、本文では列挙しない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'shitsugyo-teate-kihon' and c.slug = 'seido' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'shitsugyo-teate-kihon' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ハローワークインターネットサービス - 基本手当について', '厚生労働省（ハローワークインターネットサービス）', 'https://www.hellowork.mhlw.go.jp/insurance/insurance_basicbenefit.html', '2026-10-07'::date, '受給要件（失業の状態、離職の日以前2年間に被保険者期間12か月以上・特定受給資格者等は1年間に6か月以上）、受給期間（原則離職日の翌日から1年間）、基本手当日額（賃金日額のおよそ50〜80％）、待期7日間、給付制限期間（2025年4月1日以降の離職は原則1か月）', 0 from articles where slug = 'shitsugyo-teate-kihon';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ハローワークインターネットサービス - 基本手当の所定給付日数', '厚生労働省（ハローワークインターネットサービス）', 'https://www.hellowork.mhlw.go.jp/insurance/insurance_benefitdays.html', '2026-10-07'::date, '所定給付日数（一般の離職者は被保険者であった期間10年未満で90日、特定受給資格者等の30歳未満は90〜180日）、給付日数が90〜360日の間で決まること', 1 from articles where slug = 'shitsugyo-teate-kihon';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ハローワークインターネットサービス - 特定受給資格者及び特定理由離職者の範囲の概要', '厚生労働省（ハローワークインターネットサービス）', 'https://www.hellowork.mhlw.go.jp/insurance/insurance_range.html', '2026-10-07'::date, '倒産・解雇などによる離職（特定受給資格者）と、体力の不足や通勤困難など正当な理由のある自己都合離職（特定理由離職者）の例', 2 from articles where slug = 'shitsugyo-teate-kihon';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ハローワークインターネットサービス - 雇用保険の具体的な手続き', '厚生労働省（ハローワークインターネットサービス）', 'https://www.hellowork.mhlw.go.jp/insurance/insurance_procedure.html', '2026-10-07'::date, '住居を管轄するハローワークで求職の申込みと離職票の提出、必要書類、受給説明会、原則4週間に1度の失業の認定、求職活動実績が原則2回以上（最初の認定は1回）必要なこと', 3 from articles where slug = 'shitsugyo-teate-kihon';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '令和７年４月以降に教育訓練等を受ける場合、給付制限が解除され、基本手当を受給できます', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000160564_00045.html', '2026-10-07'::date, '2025年4月以降に教育訓練等を受けた（受けている）場合に給付制限が解除されること', 4 from articles where slug = 'shitsugyo-teate-kihon';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '給付制限が解除され基本手当を受給できる方（リーフレット）', '厚生労働省・都道府県労働局・ハローワーク', 'https://www.mhlw.go.jp/content/001441564.pdf', '2026-10-07'::date, '解除の対象は2025年4月1日以降に受講を開始した教育訓練給付の対象講座・公共職業訓練等で、離職日前1年以内に受けた人または離職日以後に受けている人であること', 5 from articles where slug = 'shitsugyo-teate-kihon';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '令和７年４月１日以降に離職された方は、正当な理由がない自己都合により退職した場合、給付制限期間が原則１か月となります。', '群馬労働局・ハローワーク', 'https://jsite.mhlw.go.jp/gunma-roudoukyoku/content/contents/002182062.pdf', '2026-10-07'::date, '離職日からさかのぼって5年間に2回以上、正当な理由のない自己都合退職で受給資格決定を受けた場合は給付制限が3か月になること', 6 from articles where slug = 'shitsugyo-teate-kihon';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '退職勧奨後、離職票に自己都合退職と記載されました。対処法は？', '厚生労働省（確かめよう労働条件）', 'https://www.check-roudou.mhlw.go.jp/qa/roudousya/kaiko/q6.html', '2026-10-07'::date, '離職理由に異議がある場合はハローワークに申し出て、事実関係の調査のうえ離職理由が判定されること', 7 from articles where slug = 'shitsugyo-teate-kihon';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'shitsugyo-teate-kihon' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"12ce7a3c4f56d3423f950443b3b8676c5a60988dd25790726e10f0bd37a30f67","findings":[]}'::jsonb from articles where slug = 'shitsugyo-teate-kihon';
update articles set status = 'published' where slug = 'shitsugyo-teate-kihon';

-- article: shiyou-kikan (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('shiyou-kikan', 'article', '試用期間って何？法律上の扱い・給料と社会保険・入社前に確認したいこと', '試用期間は、会社が本採用するかを判断するための期間です。法律上の扱い（解雇予告が必要になる「14日」の決まり）、求人や労働条件通知書での書かれ方、期間中の給料と社会保険、入社前に確認したいことを整理します。', '求人票に「試用期間3か月」と書いてあると、「その間にクビになることもあるの？」「給料は下がるの？」と不安になる人もいると思います。

先に結論をまとめます。

- 試用期間は、会社が本採用するかどうかを判断するための期間です。**長さは法律で決まっていません**が、試用期間中も労働契約は成立しています
- 入社して**14日を超えたあと**に解雇するときは、試用期間中でも、原則として30日以上前の予告か解雇予告手当が必要です
- 試用期間中と本採用後で給料などの条件が違う場合、会社は求人の段階でそれぞれを明示することになっています
- 社会保険（健康保険・厚生年金保険）は、加入の条件を満たしていれば、試用期間中でも入社日から加入するのが原則です

## 試用期間とは？法律ではどう扱われる？

試用期間は、入社した人の働きぶりや仕事への向き不向きを見て、そのまま本採用するかを会社が判断するための期間です。期間の長さは会社が就業規則などで決めます。

厚生労働省のモデル就業規則の解説では、**試用期間の長さについて労働基準法に決まりはない**としたうえで、あまりに長い期間を試用期間にすることは好ましくないとしています。実際に、適性を判断するのに必要な期間を超える長すぎる試用期間を、公序良俗に反して無効とした裁判例もあります。

大事なのは、**試用期間中も「お試し」ではなく、すでに労働契約が結ばれている**という点です。裁判例では、試用期間中の契約は「会社が契約を解約する権利を残した労働契約」と考えられています。そのため、本採用しないこと（本採用拒否）は、通常の解雇よりは広く認められるものの、客観的に合理的な理由があり、社会通念上相当と認められる場合に限られます。「なんとなく合わない」だけで自由に辞めさせられるわけではありません。

## 解雇予告のルールは「入社14日」が分かれ目

会社が働く人を解雇するときは、労働基準法第20条により、原則として**30日以上前に予告**するか、予告の代わりに**平均賃金の30日分以上の解雇予告手当**を払う必要があります。予告が30日に足りない場合は、足りない日数分の手当を払う形もあります。

試用期間中の人には、労働基準法第21条に特別な決まりがあります。

- 入社してから14日以内：解雇予告の決まりは適用されない
- 14日を超えて引き続き働いているとき：試用期間中でも、解雇予告の決まりが適用される

```figure
type: compare
title: 試用期間中の解雇予告は「14日」で変わる
columns:
  - label: 入社14日以内
    tone: sand
    items:
      - 解雇予告の決まりは適用されない
  - label: 14日を超えたあと
    tone: mint
    items:
      - 試用期間中でも解雇予告の決まりが適用される
      - 30日以上前の予告か、30日分以上の手当
```

つまり、会社の試用期間が3か月や6か月でも、15日目以降は通常の解雇予告のルールが当てはまります。なお、14日以内であっても、前の章のとおり、理由がなくても辞めさせてよいという意味ではありません。

「試用期間中に急に来なくていいと言われた」など困ったときは、ひとりで判断せず、都道府県労働局や労働基準監督署の中にある「総合労働相談コーナー」に無料で相談できます。

## 求人や労働条件通知書では、どう書かれる？

2018年1月1日に施行された職業安定法の改正で、会社が求人を出すときに明示する労働条件に「試用期間の有無と内容」が加わりました。さらに、**試用期間中と本採用後で労働条件が違う場合は、それぞれの条件を明示する**ことになっています。最初の一定期間を有期契約（契約社員など）にして、それを試用期間として使う場合も、その期間中の条件を示す必要があります。

求人票では、たとえば次のような書き方を見かけます（いずれも仮の例です）。

| 書き方の例（仮の例） | 読み取れること |
| --- | --- |
| 試用期間あり（3か月）、期間中の条件変更なし | 3か月の試用期間があり、給料などは本採用後と同じ |
| 試用期間3か月（期間中は月給20万円、本採用後は月給22万円） | 試用期間中は給料が本採用後より低い |
| 試用期間6か月（期間中は契約社員） | 最初の6か月は雇用形態そのものが違う |

内定が出たら、労働条件通知書や雇用契約書で、求人票と同じ内容になっているかを確かめましょう。求人や内定時に明示される労働条件のルールは、[求人で明示される労働条件が増えた｜「業務・就業場所の変更の範囲」とは](/news/news-roudou-jouken-meiji)でも紹介しています。

## 試用期間中の給料はどうなる？

試用期間中の給料が本採用後と同じ会社もあれば、少し低く設定している会社もあります。ここは会社によって違うので、求人票と労働条件通知書で金額を確認します。

ただし、試用期間中でも**最低賃金は守られるのが原則**です。最低賃金法には、試用期間中の人について最低賃金を下回ってよい「減額の特例」がありますが、使えるのは会社が都道府県労働局長の許可を受けた場合だけです。許可を受けても、減額率の上限は20%、期間は最長6か月とされています。

給料を比べるときは、試用期間中の月給だけでなく、本採用後の月給や手当、賞与の扱いも並べて見ておくと、入社後に「思っていたより少ない」と感じにくくなります。額面と手取りの違いは[手取り20万円から転職を考えるとき、何を比べればいい？](/articles/tedori-20man-hikaku)で紹介しています。

## 社会保険は入社日から？

健康保険・厚生年金保険は、試用期間かどうかで加入の判断が変わるものではありません。日本年金機構は、**試用期間中でも報酬が支払われる場合は使用関係が認められる**としています。加入の条件を満たしていれば、試用期間を含めて入社日から加入するのが原則です。

入社後は、最初の給与明細で健康保険料・厚生年金保険料が引かれているかを見てみましょう。「試用期間が終わってから加入」と言われた場合や、明細を見ても分からない場合は、会社の担当者に確認するか、年金事務所に相談できます。

## 入社前に確認したいこと

試用期間の扱いは、求人票、労働条件通知書、就業規則で確認できます。面接や内定後の面談で聞きにくいときは、「入社までに確認しておきたいので」と前置きすると聞きやすくなります。

```figure
type: checklist
title: 入社前に確認したい試用期間のこと
items:
  - 試用期間があるか、長さは何か月か
  - 期間中の給料・手当は本採用後と同じか
  - 期間中の雇用形態（正社員か、契約社員か）
  - 延長することがあるか、どんな場合か
  - 社会保険は入社日から加入か
  - 本採用の判断で何を見るのか
```

質問の例をいくつか挙げます。

- 「試用期間中と本採用後で、給料や手当に違いはありますか」
- 「試用期間が延びることはありますか。ある場合、どのようなときですか」
- 「試用期間中に、どんなことができるようになっていると良いでしょうか」

最後の質問は、研修の内容や入社後の目標を知る手がかりにもなります。未経験の仕事なら、研修の期間や内容もあわせて確認しておくと安心です。研修の確かめ方は[未経験求人の「研修あり」で確認すべきこと](/articles/mikeiken-kenshu-kakunin)で紹介しています。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-07'::timestamptz, '試用期間とは？給料・社会保険・解雇予告と入社前の確認点', '試用期間は本採用するかを判断するための期間で、長さに法律の決まりはありません。入社14日を超えると解雇予告のルールが適用されること、期間中の給料や社会保険、求人や労働条件通知書で確認したいことを紹介します。', array['mikeiken-kenshu-kakunin', 'donichi-yasumi-nenshu-hikaku', 'tedori-20man-hikaku']::text[], '{}'::text[], array['seishain', 'mikeiken-shokushu']::text[], array['hajimete', 'seishain-keiken-sukunai']::text[], array['試用期間って', '何を確認すればいい？']::text[], null, false, '[{"q":"試用期間中なら、会社はいつでも自由に辞めさせられるのですか？","a":"いいえ。試用期間中も労働契約は成立しています。本採用しないことや期間中の解雇は、通常よりは広く認められるとされていますが、客観的に合理的な理由があり、社会通念上相当と認められる場合に限られます。また、入社して14日を超えたあとは、原則として30日以上前の予告か、平均賃金30日分以上の解雇予告手当が必要です。"},{"q":"試用期間中は社会保険に入れないのですか？","a":"試用期間かどうかで加入の判断は変わりません。日本年金機構は、試用期間中でも報酬が支払われる場合は使用関係が認められるとしています。加入の条件を満たしていれば、入社日から健康保険・厚生年金保険に加入するのが原則です。給与明細で保険料が引かれているかを確認しましょう。"},{"q":"試用期間の長さは何か月までと決まっていますか？","a":"法律で長さは決められていません。ただし、適性を判断するのに必要な期間を超える長すぎる試用期間は、公序良俗に反して無効とされた裁判例があります。期間の長さと、延長があるかどうかは、求人や労働条件通知書、就業規則で確認しましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「試用期間＝お試しだから何をされても仕方ない」と思い込まないように、法律の線（14日・30日予告・社会保険）と、会社ごとに違う部分（長さ・条件・延長）を分けて示す","quotes":[{"source_url":"https://www.check-roudou.mhlw.go.jp/qa/roudousya/kaiko/q2.html","text":"労働基準法第21条により、試の使用期間中の者には解雇予告の規定が適用されないが、14日を超えて引き続き使用されるに至った場合は適用される","used_in":"解雇予告のルールは「入社14日」が分かれ目"},{"source_url":"https://www.check-roudou.mhlw.go.jp/qa/roudousya/kaiko/q3.html","text":"解雇の予告は少なくとも30日前に行う必要があり、予告しない場合は30日分以上の平均賃金（解雇予告手当）を支払う。予告日数が足りない場合は、足りない日数分の手当を支払う","used_in":"解雇予告のルールは「入社14日」が分かれ目"},{"source_url":"https://www.check-roudou.mhlw.go.jp/hanrei/shogu/shiyou.html","text":"試用期間中の契約は解約権留保付労働契約。解約権の行使は通常の解雇より広く認められるが、客観的に合理的な理由が存在し社会通念上相当として是認される場合にのみ許される。適性判断に必要な合理的期間を超える試用期間は公序良俗に反し、その限りで無効とした裁判例がある","used_in":"試用期間とは？法律ではどう扱われる？"},{"source_url":"https://www.mhlw.go.jp/bunya/roudoukijun/model/dl/02.pdf","text":"試用期間を設ける場合の期間の長さに関する定めは労基法上ないが、あまりに長い期間は好ましくない。試用期間中の者も14日を超えて雇用した後に解雇する場合は、原則として30日以上前の予告か、平均賃金の30日分以上の解雇予告手当が必要","used_in":"試用期間とは？法律ではどう扱われる？"},{"source_url":"https://www.mhlw.go.jp/file/06-Seisakujouhou-11600000-Shokugyouanteikyoku/0000171017_1.pdf","text":"2018年1月1日施行の職業安定法改正で、募集時に明示する事項に「試みの使用期間」が追加。試用期間と本採用が一つの労働契約であっても、試用期間中の労働条件が本採用後と異なる場合は、それぞれの労働条件を明示する","used_in":"求人や労働条件通知書では、どう書かれる？"},{"source_url":"https://jsite.mhlw.go.jp/fukuoka-roudoukyoku/content/contents/000822926.pdf","text":"試の使用期間中の者について、使用者が都道府県労働局長の許可を受けた場合に限り最低賃金の減額の特例が認められる。減額率の上限は20%、許可の期間は最長6か月","used_in":"試用期間中の給料はどうなる？"},{"source_url":"https://www.nenkin.go.jp/service/kounen/tekiyo/jigyosho/20150518.html","text":"試用期間中でも報酬が支払われる場合は、使用関係が認められることとなる","used_in":"社会保険は入社日から？"}],"not_used":["試用期間の長さの分布（「3か月程度が最も多い」などの割合）は、公的な一次情報で調査年と数値を確認できなかったので書かない","雇用保険の加入が試用期間に左右されないことは、公的な一次情報の該当箇所を確認できなかったので本文では健康保険・厚生年金保険に絞った","試用期間の延長の条件（就業規則の定めや本人の同意など）は、公的な一次情報で確認できなかったので「就業規則で確認する」とだけ書く"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'shiyou-kikan' and c.slug = 'seido' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'shiyou-kikan' and c.slug = 'hatarakikata' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '試用期間｜裁判例｜確かめよう労働条件', '厚生労働省', 'https://www.check-roudou.mhlw.go.jp/hanrei/shogu/shiyou.html', '2026-10-07'::date, '試用期間中の契約は解約権留保付の労働契約とされ、本採用拒否には客観的に合理的な理由と社会通念上の相当性が必要なこと。長すぎる試用期間を無効とした裁判例', 0 from articles where slug = 'shiyou-kikan';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '即時解雇OK？解雇予告や予告手当の不要な場合はありますか？｜Q&A｜確かめよう労働条件', '厚生労働省', 'https://www.check-roudou.mhlw.go.jp/qa/roudousya/kaiko/q2.html', '2026-10-07'::date, '試の使用期間中の者は解雇予告の対象外だが、14日を超えて引き続き使用されると解雇予告が必要になること（労働基準法第21条）', 1 from articles where slug = 'shiyou-kikan';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '解雇予告期間は30日ですが、予告期間が足りない場合の対応は？｜Q&A｜確かめよう労働条件', '厚生労働省', 'https://www.check-roudou.mhlw.go.jp/qa/roudousya/kaiko/q3.html', '2026-10-07'::date, '解雇するときは30日以上前に予告するか、平均賃金30日分以上の解雇予告手当を支払うこと。予告が足りない日数分を手当で払えること（労働基準法第20条）', 2 from articles where slug = 'shiyou-kikan';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'モデル就業規則 第2章 採用、異動等', '厚生労働省', 'https://www.mhlw.go.jp/bunya/roudoukijun/model/dl/02.pdf', '2026-10-07'::date, '試用期間の長さに労働基準法上の定めはないこと、長すぎる試用期間は好ましくないこと、14日を超えて雇用したあとの解雇には予告が必要なこと', 3 from articles where slug = 'shiyou-kikan';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '労働者を募集する企業の皆様へ ～労働者の募集や求人申込みの制度が変わります～（職業安定法の改正、2018年1月1日施行）', '厚生労働省', 'https://www.mhlw.go.jp/file/06-Seisakujouhou-11600000-Shokugyouanteikyoku/0000171017_1.pdf', '2026-10-07'::date, '求人で明示する労働条件に「試用期間の有無と内容」が加わったこと。試用期間中と本採用後で条件が違う場合はそれぞれを明示すること', 4 from articles where slug = 'shiyou-kikan';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '最低賃金の減額の特例許可申請について ～「試の使用期間中の者」（最低賃金法第7条第2号）～', '福岡労働局（厚生労働省）', 'https://jsite.mhlw.go.jp/fukuoka-roudoukyoku/content/contents/000822926.pdf', '2026-10-07'::date, '試用期間中の人の最低賃金の減額は、都道府県労働局長の許可が必要で、減額率の上限は20%、期間は最長6か月であること', 5 from articles where slug = 'shiyou-kikan';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '適用事業所と被保険者', '日本年金機構', 'https://www.nenkin.go.jp/service/kounen/tekiyo/jigyosho/20150518.html', '2026-10-07'::date, '試用期間中でも報酬が支払われる場合は使用関係が認められ、健康保険・厚生年金保険の被保険者になること', 6 from articles where slug = 'shiyou-kikan';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '総合労働相談コーナーのご案内', '厚生労働省', 'https://www.mhlw.go.jp/general/seido/chihou/kaiketu/soudan.html', '2026-10-07'::date, '解雇などの相談を、都道府県労働局や労働基準監督署内の総合労働相談コーナーで無料で受け付けていること', 7 from articles where slug = 'shiyou-kikan';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'shiyou-kikan' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"8b46a6764f69f59633f48e88f3d73d991c2040e8729dcf5534dcaefaa102be9e","findings":[]}'::jsonb from articles where slug = 'shiyou-kikan';
update articles set status = 'published' where slug = 'shiyou-kikan';

-- article: shokuba-jouhou-wakamono (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('shokuba-jouhou-wakamono', 'article', '求人で「職場の情報」を確かめるには？離職者数・残業・有休とユースエール認定', '若者雇用促進法では、新卒者などを募集する会社に、離職者数・残業時間・有休の取得日数・研修などの「青少年雇用情報」の提供を求めています。どんな情報を求められるか、ユースエール認定企業とは何か、応募前に情報を確かめる方法を整理します。', '求人票には、給料や休日、勤務時間は書いてあっても、「入った人がどのくらい辞めているか」「実際の残業は月何時間か」までは分からないことがほとんどです。でも、ここが気になって応募をためらう人も多いと思います。

先に結論をまとめます。

- 若者雇用促進法により、**新卒者などを募集する会社は、応募者から求められたら職場の情報（青少年雇用情報）を出す**ことになっています
- 聞けるのは、過去3年間の離職者数、平均勤続年数、研修の内容、前年度の残業時間、有休の平均取得日数などです
- 「ユースエール認定企業」は、離職率や残業時間などが国の基準を満たした中小企業です
- 中途採用の求人では法律上の義務の対象にならない場合もありますが、「しょくばらぼ」などで調べたり、面接で質問したりできます

## 青少年雇用情報とは？

青少年雇用情報は、若者雇用促進法（青少年の雇用の促進等に関する法律）にもとづいて、会社が応募者に提供する職場の情報です。2016年3月1日から、新卒者などを募集する会社に提供が義務づけられました。

ルールは2段階になっています。

1. 新卒者などを募集する会社は、いろいろな情報を積極的に出すよう努める（努力義務）
2. 応募者や応募を考えている人から**求めがあったら**、3つの分野（類型）ごとに1つ以上の情報を出さなければならない（義務）

対象になるのは、学校を卒業する見込みの人や、学校を卒業した人などを対象にした募集です。いわゆる新卒枠のほか、卒業した人も応募できる募集が当てはまります。ハローワークや職業紹介事業者（転職エージェントなど）を通じて応募するときは、そこを通じて情報を求めることもできます。

## どんな情報を聞ける？

情報は、次の3つの分野に分かれています。

| 分野 | 主な項目 |
| --- | --- |
| 募集・採用に関する状況 | 過去3年間の新卒採用者数・離職者数、男女別の採用者数、平均勤続年数 |
| 職業能力の開発・向上に関する状況 | 研修の有無と内容、自己啓発の支援、メンター制度、キャリアコンサルティングの制度、社内検定などの制度 |
| 企業における雇用管理に関する状況 | 前年度の月平均の所定外労働時間（残業時間）、前年度の有休の平均取得日数、育児休業の取得者数、役員・管理職に占める女性の割合 |

求めがあったときに会社が出す義務があるのは「分野ごとに1つ以上」です。そのため、知りたい項目がはっきりしているなら、**項目を指定して聞く**のがおすすめです。指針では、項目を指定して求められた場合は、特別な事情がない限りその項目を出すよう会社に求めています。

未経験の仕事に移るなら、「研修の有無と内容」は特に役立ちます。研修について確認したいことは[未経験求人の「研修あり」で確認すべきこと](/articles/mikeiken-kenshu-kakunin)でも紹介しています。

## 応募前に情報を求めるには

厚生労働省の指針では、個別に求められた情報は、メールや書面で提供することとされています。また、**情報を求めたことを理由に応募者を不利に扱わない**よう会社に求めています。

```figure
type: steps
title: 青少年雇用情報を求める流れ
items:
  - label: 知りたい項目を決める
    text: 離職者数、残業時間、研修など
  - label: 問い合わせる
    text: 採用担当へメール。ハローワーク経由でもよい
  - label: メールや書面で受け取る
    text: ほかの求人と並べて比べる
```

メールの書き方の例です（仮の例です）。

> 件名：青少年雇用情報についてのお問い合わせ
>
> 〇〇株式会社 採用ご担当者様
>
> 〇〇職の求人について、応募を検討している〇〇と申します。応募の前に、青少年雇用情報のうち、次の項目について教えていただけますでしょうか。
>
> ・過去3年間の新卒採用者数と離職者数
> ・前年度の月平均の所定外労働時間
> ・研修の有無と内容
>
> お忙しいところ恐れ入りますが、どうぞよろしくお願いいたします。

返ってきた数字は、ひとつの数字だけで良い・悪いを決めつけず、同じ職種の別の求人と並べて比べるのがおすすめです。

## ユースエール認定企業とは？

ユースエール認定は、若者の採用や育成に積極的で、雇用管理の状況が良い中小企業（常時雇用する労働者が300人以下）を、厚生労働大臣が認定する制度です。確認日時点で、主な認定基準には次のようなものがあります。

- 直近3事業年度に新卒者などで正社員として就職した人の離職率が20%以下
- 前事業年度の正社員の月平均の所定外労働時間が20時間以下で、月平均の法定時間外労働が60時間以上の正社員が1人もいない
- 前事業年度の正社員の有休の取得率が平均70%以上、または取得日数が平均10日以上

```figure
type: stats
title: ユースエール認定の主な基準
items:
  - value: "20"
    unit: "%以下"
    label: 新卒者などの離職率
    note: 直近3事業年度
  - value: "20"
    unit: 時間以下
    label: 月平均の所定外労働
    note: 前事業年度の正社員
  - value: "10"
    unit: 日以上
    label: 有休の平均取得日数
    note: または取得率が平均70%以上
```

認定企業は、厚生労働省の「若者雇用促進総合サイト」で探せます。認定企業は、ハローワークなどでも重点的に紹介されています。基準は見直されることもあるので、最新の内容は厚生労働省のページで確認しましょう。

認定は会社選びの手がかりのひとつです。仕事内容や配属先、自分に合うかどうかまでは分からないので、ほかの求人と同じように中身を確認しましょう。

## 中途採用ならどう調べる？

社会人経験のある人向けの中途採用の求人では、青少年雇用情報の提供義務の対象にならない場合もあります。その場合も、次の方法で職場の情報を集められます。

- **しょくばらぼ（職場情報総合サイト）**：厚生労働省のサイトで、会社ごとの残業時間や有休の取得実績などを検索・比較できます。掲載されている項目は会社によって違います
- **面接・面談で質問する**：「配属予定の部署の、月の残業時間はどのくらいですか」「中途で入社した方は、どのくらいの期間で一人で仕事を任されていますか」など、具体的に聞きます
- **転職エージェントやハローワークに聞く**：紹介を受けている場合、担当者を通じて確認してもらうこともできます

休日や残業を含めた求人の比べ方は[「土日休み」と「年収」をどう比較する？](/articles/donichi-yasumi-nenshu-hikaku)で紹介しています。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-07'::timestamptz, '青少年雇用情報とは？離職者数・残業・有休を応募前に確認', '若者雇用促進法の「青少年雇用情報」では、離職者数や残業時間、有休の取得日数、研修の有無などを会社に求められます。対象になる求人、ユースエール認定企業の基準、しょくばらぼでの調べ方、情報の求め方の例を紹介します。', array['mikeiken-kenshu-kakunin', 'donichi-yasumi-nenshu-hikaku', 'dainishinsotsu-nansai']::text[], '{}'::text[], array['yametai', 'mikeiken-shokushu']::text[], array['dainishinsotsu', 'hajimete']::text[], array['残業や離職者数、', '応募前に確かめる']::text[], null, false, '[{"q":"青少年雇用情報を求めたら、選考で不利になりませんか？","a":"厚生労働省の指針では、情報の提供を求めたことを理由に、応募者を不利に扱わないよう会社に求めています。たとえば、情報を求めた人にだけ説明会や選考の案内をしない、といった扱いは不利益な取扱いの例とされています。"},{"q":"中途採用の求人でも、青少年雇用情報を出してもらえますか？","a":"法律で提供が義務になっているのは、新卒者や学校を卒業した人を対象にした募集（新卒枠など）です。社会人経験のある人向けの中途採用の求人では、法律上の義務の対象にならない場合があります。その場合も、職場情報総合サイト「しょくばらぼ」で公開情報を調べたり、面接で質問したりして確かめられます。"},{"q":"ユースエール認定企業なら、どの会社でも働きやすいと考えていいですか？","a":"認定は、離職率や残業時間、有休の取得などが国の基準を満たしている中小企業であることを示すもので、会社選びの手がかりのひとつです。ただし、仕事内容や配属先、自分に合うかどうかまでは分からないので、ほかの求人と同じように、仕事内容や条件を確認しましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"求人票の条件だけでは分からない「働き続けやすさ」を、法律にもとづいて会社に聞ける・調べられる、という行動につなげる。中途採用では義務の対象外になりうることも正直に書く","quotes":[{"source_url":"https://www.mhlw.go.jp/file/06-Seisakujouhou-11600000-Shokugyouanteikyoku/0000134614.pdf","text":"新卒者等の募集を行う企業は、幅広い情報提供が努力義務。応募者等から求めがあった場合は、（ア）募集・採用に関する状況、（イ）職業能力の開発・向上に関する状況、（ウ）企業における雇用管理に関する状況の3類型ごとに1つ以上の情報提供が義務","used_in":"青少年雇用情報とは？"},{"source_url":"https://www.mhlw.go.jp/file/06-Seisakujouhou-11600000-Shokugyouanteikyoku/0000184082.pdf","text":"項目は、過去3年間の新卒採用者数・離職者数、男女別採用者数、平均勤続年数、研修の有無及び内容、自己啓発支援、メンター制度、キャリアコンサルティング制度、社内検定等、前年度の月平均所定外労働時間、有給休暇の平均取得日数、育児休業取得者数、役員・管理職の女性割合","used_in":"どんな情報を聞ける？"},{"source_url":"https://www.mhlw.go.jp/file/05-Shingikai-12602000-Seisakutoukatsukan-Sanjikanshitsu_Roudouseisakutantou/0000101753.pdf","text":"学校卒業見込者等とは、学校等に在学し卒業が見込まれる者、公共職業能力開発施設等の訓練を修了見込みの者、およびこれらの卒業者・修了者。第14条ではハローワーク・職業紹介事業者を通じた求めにも対応","used_in":"青少年雇用情報とは？"},{"source_url":"https://www.mhlw.go.jp/content/11800000/000922209.pdf","text":"情報提供を求めた者に対し不利益な取扱いをしないこと。個別の求めには電子メールまたは書面で提供。情報を求めた者にだけ説明会や選考の案内をしないことは不利益な取扱いの例","used_in":"応募前に情報を求めるには"},{"source_url":"https://wakamono-koyou-sokushin.mhlw.go.jp/search/service/staticpage.action?action=nintei","text":"直近3事業年度の新卒者などの正社員として就職した人の離職率が20%以下、前事業年度の正社員の月平均所定外労働時間が20時間以下かつ月平均の法定時間外労働60時間以上の正社員がいない、有給休暇の年間付与日数に対する取得率が平均70%以上または年間取得日数が平均10日以上 など","used_in":"ユースエール認定企業とは？"},{"source_url":"https://shokuba.mhlw.go.jp/010/20180302201542.html","text":"企業の残業時間や有給休暇の取得実績などの職場情報を横断的に検索・比較できる厚生労働省のサイト","used_in":"中途採用ならどう調べる？"}],"not_used":["しょくばらぼの掲載企業数や、ユースエール認定企業の社数は、時点によって変わり、本文で使う必要もないので書かない","ユースエール認定基準の細かい項目（育児休業の取得実績、解雇・勧奨退職をしていないことなど）は、主な基準に絞り、全項目は厚生労働省のページで確認するよう案内した","認定基準が2025〜2026年に見直されたかどうかは公的な一次情報で確認できなかったので、基準は「確認日時点の主な基準」として書き、最新は厚生労働省のページで確かめるよう書いた"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'shokuba-jouhou-wakamono' and c.slug = 'seido' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'shokuba-jouhou-wakamono' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職場情報の提供制度', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000122234.html', '2026-10-07'::date, '2016年3月1日から、新卒者などの募集で青少年雇用情報の提供が義務になったこと', 0 from articles where slug = 'shokuba-jouhou-wakamono';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職場情報の積極的な提供（平成28年3月1日施行）', '厚生労働省', 'https://www.mhlw.go.jp/file/06-Seisakujouhou-11600000-Shokugyouanteikyoku/0000134614.pdf', '2026-10-07'::date, '情報提供は努力義務で、応募者などから求めがあった場合は3つの類型ごとに1つ以上の情報を提供する義務があること。類型ごとの項目', 1 from articles where slug = 'shokuba-jouhou-wakamono';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '青少年雇用情報シートの書き方のポイント', '厚生労働省', 'https://www.mhlw.go.jp/file/06-Seisakujouhou-11600000-Shokugyouanteikyoku/0000184082.pdf', '2026-10-07'::date, '過去3年間の新卒採用者数・離職者数、平均勤続年数、研修の有無と内容、前年度の月平均所定外労働時間、有休の平均取得日数などの項目', 2 from articles where slug = 'shokuba-jouhou-wakamono';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '青少年の雇用の促進等に関する法律第13条及び第14条に基づく青少年雇用情報の提供について', '厚生労働省', 'https://www.mhlw.go.jp/file/05-Shingikai-12602000-Seisakutoukatsukan-Sanjikanshitsu_Roudouseisakutantou/0000101753.pdf', '2026-10-07'::date, '提供義務の対象が学校卒業見込者等（卒業見込みの人と卒業者など）の募集であること。ハローワークや職業紹介事業者を通じて求めることもできること', 3 from articles where slug = 'shokuba-jouhou-wakamono';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '青少年の雇用機会の確保及び職場への定着に関して事業主、特定地方公共団体、職業紹介事業者等その他の関係者が適切に対処するための指針', '厚生労働省', 'https://www.mhlw.go.jp/content/11800000/000922209.pdf', '2026-10-07'::date, '情報を求めた人を不利益に取り扱わないこと、個別の求めにはメールや書面で提供すること', 4 from articles where slug = 'shokuba-jouhou-wakamono';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ユースエール認定制度', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000100266.html', '2026-10-07'::date, 'ユースエール認定は、若者の採用・育成に積極的で雇用管理が優良な常時雇用300人以下の中小企業を厚生労働大臣が認定する制度であること。主な認定基準', 5 from articles where slug = 'shokuba-jouhou-wakamono';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '認定制度とは｜若者雇用促進総合サイト', '厚生労働省', 'https://wakamono-koyou-sokushin.mhlw.go.jp/search/service/staticpage.action?action=nintei', '2026-10-07'::date, '離職率20%以下、月平均所定外労働時間20時間以下、有休の取得率70%以上または取得日数10日以上などの認定基準。認定企業を検索できること', 6 from articles where slug = 'shokuba-jouhou-wakamono';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'しょくばらぼについて｜職場情報総合サイト しょくばらぼ', '厚生労働省', 'https://shokuba.mhlw.go.jp/010/20180302201542.html', '2026-10-07'::date, '残業時間や有休の取得実績などの職場情報を、企業ごとに検索・比較できるサイトであること', 7 from articles where slug = 'shokuba-jouhou-wakamono';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'shokuba-jouhou-wakamono' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"a45e62a152a6370c80782f2bb867b00c58f6f637dd4a3272a84eb83655572b83","findings":[]}'::jsonb from articles where slug = 'shokuba-jouhou-wakamono';
update articles set status = 'published' where slug = 'shokuba-jouhou-wakamono';

-- article: shokumu-keirekisho-arubaito (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('shokumu-keirekisho-arubaito', 'article', 'アルバイト経験だけの職務経歴書、何を書けばいい？構成と書き出し例', '正社員の経験がなくても、アルバイトで担当した仕事や工夫したことは職務経歴書に書けます。職務要約・職務経歴・工夫したこと・活かせる経験・自己PRの5つの構成と書き出し例、雇用形態や数字の書き方で気をつけたいことをまとめました。', '「職務経歴書も出してください」と言われて、「アルバイトしかしていないのに、何を書けば？」と困っていませんか。

職務経歴書は、正社員の経験がある人だけのものではありません。アルバイトで担当した仕事、工夫したこと、任されたことは、どれも書く材料になります。

## 職務経歴書って、履歴書と何が違う？

履歴書が住所や学歴・職歴などの基本情報をまとめる書類なのに対して、職務経歴書は**これまでの仕事の中身をくわしく伝える書類**です。

```figure
type: compare
title: 履歴書と職務経歴書の違い
columns:
  - label: 履歴書
    tone: mist
    items:
      - 住所や学歴・職歴などの基本情報をまとめる
  - label: 職務経歴書
    tone: mint
    items:
      - これまでの仕事の中身をくわしく伝える
      - アルバイトの経験も書く材料になる
```

ハローワークの資料では、職務経歴書はA4の用紙1〜2枚程度に、自由な様式で書くものとされています。「標題」「氏名」「日付」「職務経歴」を入れ、そのほかに資格、パソコンスキル、活かせる能力、自己PR、志望動機などを自分で選んで加えるのが一般的です。

```figure
type: stats
title: 職務経歴書の分量の目安
items:
  - value: "1〜2"
    unit: 枚
    label: A4の用紙で
    note: 様式は自由
```

同じ資料では、職務経歴や資格がなく自信がない場合でも、応募する仕事に関連するアルバイト経験、研修の経験、いま勉強している分野、性格や行動の特徴、仕事への意欲、将来の目標といった面から伝えられると紹介されています。

## 何を、どの順で書く？

迷ったら、次の順で組み立てると書きやすくなります。

| ブロック | 書くこと |
| --- | --- |
| 職務要約 | どこで、どのくらい、何をしてきたかを3行ほどで |
| 職務経歴 | 勤務先・期間・雇用形態・担当した業務 |
| 工夫したこと・任されたこと | 自分で考えて動いたこと、頼まれていた役割 |
| 活かせる経験・スキル | 応募する仕事に近い作業、パソコンでできること |
| 自己PR | 経験から言える強みと、入社後にどう使いたいか |

職務経歴は、古い順に書く方法（編年体）が一般的です。ハローワークの資料でも、迷ったときは古い順に書くよう案内されています。アルバイトがいくつかある場合は、応募する仕事に近いものほどくわしく書きましょう。

## 書き出し例（飲食店のアルバイトから事務職に応募する場合）

架空の例です。店名や数字は、自分の経験に置き換えて使ってください。

> **■職務要約**
>
> 飲食店で約3年、アルバイトとしてホール業務・会計・新人への説明を担当してきました。2年目からはシフト表の作成補助も任され、スタッフの希望を聞きながら人数を調整していました。
>
> **■職務経歴**
>
> 2023年9月〜現在　株式会社〇〇（飲食店）　アルバイト（週4日勤務）
>
> 担当業務：ホールでの接客、会計・レジ締め、新人スタッフへの手順説明、シフト表の作成補助
>
> **■工夫したこと**
>
> 閉店後のレジ締めで金額が合わない日が続いたため、数える順番をメモにして、毎回同じ手順で確認するようにしました。
>
> **■活かせる経験・スキル**
>
> レジ締めでの金額の確認、表計算ソフトでのシフト表の入力（基本的な入力と並べ替え）
>
> **■自己PR**
>
> 決まった手順を正確にこなすことと、分かりにくいところを整理して人に伝えることが得意です。事務の仕事でも、ミスなく処理することと、周りが使いやすい形で情報をまとめることを大切にしたいと考えています。

「工夫したこと」は、小さなことで構いません。ハローワークの資料でも、アルバイトやパートの仕事の中身をよく見直して、応募先で活かせそうなところを探してアピールするようすすめています。経験を細かく分けて書き出すコツは[接客経験は転職でどう活かせる？](/articles/sekkyaku-keiken-ikasu)で紹介しています。

## 雇用形態や数字は、どこまで書く？

アルバイトの経験を書くときは、次の2つを守りましょう。

**雇用形態をはっきり書く**

「アルバイト」「パート」など、どの働き方だったかを書きます。ぼかして書くと、履歴書や面接での説明と食い違う原因になります。

**数字は確かなものだけ**

「約3年」「週4日」「新人5人に説明」のように、数字があると伝わりやすくなります。ただし、覚えていない数字を作る必要はありません。あいまいなものは「約」「〜程度」をつけるか、数字を使わずに具体的な作業で伝えましょう。お店の売上など、外に出していいか分からない数字は書かないようにします。

## 書けたら確認したいこと

- 履歴書の職歴欄と、勤務先や期間がそろっているか
- 応募する仕事に近い経験を、くわしく書いているか
- 書いたことを、面接で具体的に説明できるか
- A4で1〜2枚に収まっているか

履歴書の欄の埋め方は[履歴書に書くことがないと思ったとき](/articles/rirekisho-kakukoto-nai)、書いた内容を面接でどう話すかは[未経験職種の面接、何を準備する？](/articles/mensetsu-junbi-mikeiken)もあわせて確認してみてください。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['rirekisho-kakukoto-nai', 'sekkyaku-keiken-ikasu', 'shiboudouki-mikeiken', 'shokumu-keirekisho-kakikata']::text[], '{}'::text[], array['mensetsu']::text[], array['freeter', 'seishain-keiken-sukunai', 'sekkyaku']::text[], array['職務経歴書、', 'アルバイトだけでも？']::text[], null, false, '[{"q":"アルバイトをいくつもしてきた場合、全部くわしく書くべきですか？","a":"職務経歴書は自由な様式なので、期間が長いものや応募する仕事に近いものをくわしく書き、ほかは短くまとめる方法があります。履歴書の職歴欄と、勤務先や期間がずれないようにしておきましょう。"},{"q":"職務経歴書は手書きとパソコン、どちらで作ればいいですか？","a":"ハローワークの資料では、A4の用紙1〜2枚程度にパソコンで横書きで作るのが一般的で、黒のボールペンなどによる手書きでも差し支えないとされています。応募先から指定があれば、それに従いましょう。"},{"q":"売上や人数など、正確な数字を覚えていません。","a":"覚えていない数字を作る必要はありません。「約3年」「週4日」のように確かなものだけを書き、あいまいなものは「約」「〜程度」をつけるか、数字を使わずに具体的な作業で伝えましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"アルバイトしか経験がない人向けに、職務経歴書の全体の構成（5ブロック）と、そのまま置き換えて使える書き出し例を示す。既存の sekkyaku-keiken-ikasu（経験の分解）とは、書類全体の組み立てに焦点を置くことで分ける","quotes":[{"source_url":"https://www.hellowork.mhlw.go.jp/doc/oubosyorui_pamphlet_02_070531.pdf","text":"職務経歴書はA4縦1〜2枚程度に、これまでの職務の内容を自由様式で詳しく記載する書類。冒頭の「標題」「氏名」「日付」と「職務経歴」は必須で、「取得資格」「パソコンスキル」「活かせる能力」「自己PR」「志望動機」などを選んで追加するのが一般的。パソコンで横書きが一般的だが手書きでも差し支えない","used_in":"職務経歴書って、履歴書と何が違う？／FAQ"},{"source_url":"https://www.hellowork.mhlw.go.jp/doc/oubosyorui_pamphlet_02_070531.pdf","text":"職務経歴や資格がなく実務能力に自信がない場合でも、①応募職種と関連するアルバイト経験、②訓練・研修の経験、③現在勉強中の分野、④性格・行動特性、⑤仕事への姿勢・意欲、⑥将来目標などの面からアピールできる","used_in":"職務経歴書って、履歴書と何が違う？"},{"source_url":"https://www.hellowork.mhlw.go.jp/doc/syokurekisyo_pamphlet_070531.pdf","text":"職務経歴の記載スタイルには編年体式・逆編年体式・キャリア式があり、わからないときは編年体式（古い職務経歴から記載する方法）とする。アルバイト・パートの仕事の内容をよく分析し、応募先企業で活かせそうな要素を探してアピールする","used_in":"何を、どの順で書く？／書き出し例"}],"not_used":["書類選考の通過率や、職務経歴書の有無による差などの統計は使っていない","書き出し例の店舗・期間・人数は架空の例として明記した"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'shokumu-keirekisho-arubaito' and c.slug = 'shorui-mensetsu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'shokumu-keirekisho-arubaito' and c.slug = 'keiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '応募書類の作り方「2 職務経歴書」', 'ハローワークインターネットサービス（厚生労働省）', 'https://www.hellowork.mhlw.go.jp/doc/oubosyorui_pamphlet_02_070531.pdf', '2026-10-06'::date, '職務経歴書はA4で1〜2枚程度・自由様式で、標題・氏名・日付・職務経歴を入れ、資格や自己PRなどを加えるのが一般的なこと、パソコン作成が一般的だが手書きでも差し支えないこと、実務能力に自信がない場合にアピールできる6つの面', 0 from articles where slug = 'shokumu-keirekisho-arubaito';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職務経歴書（パンフレット）', 'ハローワークインターネットサービス（厚生労働省）', 'https://www.hellowork.mhlw.go.jp/doc/syokurekisyo_pamphlet_070531.pdf', '2026-10-06'::date, '職務経歴は古い順（編年体）が一般的で、迷ったときは編年体で書くこと、アルバイト・パートの仕事の内容を見直して応募先で活かせる要素を探すこと', 1 from articles where slug = 'shokumu-keirekisho-arubaito';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'shokumu-keirekisho-arubaito' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"5bf7f1c7f810faa6457ca7c631860e1431ae24c50ab6b7f0b5a4e88154772569","findings":[]}'::jsonb from articles where slug = 'shokumu-keirekisho-arubaito';
update articles set status = 'published' where slug = 'shokumu-keirekisho-arubaito';

-- article: shokumu-keirekisho-kakikata (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('shokumu-keirekisho-kakikata', 'article', '職務経歴書の書き方｜編年体と逆編年体の選び方と、職務要約・職務内容・自己PRの例', '職務経歴書は、決まった様式がない分、「何を、どの順で書くか」で読みやすさが変わります。正社員や契約社員として働いた経験がある人向けに、編年体と逆編年体の選び方、職務要約・職務内容・活かせる経験・自己PRの書き方と例を、ハローワークや厚生労働省の資料をもとに紹介します。', '正社員や契約社員として働いてきたけれど、職務経歴書を書くのははじめて。「履歴書と何が違う？」「どこまでくわしく書けばいい？」と迷う人は多いです。

先に結論を言うと、職務経歴書は**「どんな仕事を、どのくらい、どんなふうにしてきたか」を、応募先が読みやすい順に並べる書類**です。決まった様式がないので、次の順番で組み立てると書きやすくなります。

1. 職務要約（3〜4行のまとめ）
2. 職務内容（会社ごと・担当ごとのくわしい中身）
3. 活かせる経験・知識・資格
4. 自己PR

この記事は、正社員・契約社員・派遣社員として働いた経験がある人向けです。アルバイトの経験が中心の人は、[アルバイト経験だけの職務経歴書、何を書けばいい？](/articles/shokumu-keirekisho-arubaito)のほうが合っています。

## 職務経歴書は「何ができるか」を伝える書類

厚生労働省のマイジョブ・カードのコラムでは、履歴書は応募者の基本的なプロフィールを見る書類、職務経歴書は**仕事の経験や実務の力が、会社の求めているものに合うか**を見る書類と説明されています。

| | 履歴書 | 職務経歴書 |
| --- | --- | --- |
| 役割 | 学歴・職歴などの基本を伝える | 仕事の中身と、できることを伝える |
| 様式 | 決まった様式がある | 決まった様式はない |
| 職歴の書き方 | 入社・退職の年月と会社名 | 担当した仕事・工夫・成果まで |

ハローワークの資料では、職務経歴書はA4で1〜2枚程度が目安とされています。パソコンで作るのが一般的です。

## 編年体と逆編年体、どちらで書く？

職務内容の並べ方には、主に次の2つがあります。

```figure
type: compare
title: 編年体と逆編年体の違い
columns:
  - label: 編年体
    tone: mist
    items:
      - 古い仕事から順に書く
      - 経歴の流れが追いやすい
      - 迷ったときはこちら
  - label: 逆編年体
    tone: mint
    items:
      - 新しい仕事から順に書く
      - 今の仕事を先に見てもらえる
      - 今の仕事が応募先に近いとき
```

ハローワークの資料では、どちらにするか分からないときは**編年体**にするよう案内されています。たとえば「前職の販売で身につけたことを、いまの契約社員の問い合わせ対応で深めてきた」のように、経歴の流れそのものを伝えたいときも、編年体が向いています。

一方、今の仕事が応募する仕事に近く、そこをまず見てほしいときは、**逆編年体**も選べます。

このほかに、時期ではなく仕事の種類ごとにまとめる「キャリア式」もあります。転職を何度かして、似た仕事をいくつかの会社でしてきた人が使うことがあります。転職回数が気になる人は[転職回数が気になるときに整理したいこと](/articles/tenshoku-kaisu-kininaru)もあわせて読んでみてください。

## 職務要約：3〜4行で全体をまとめる

職務要約は、職務経歴書のいちばん上に書く**経歴のまとめ**です。ハローワークの資料では、職務経歴の概要を書く欄とされています。読む人が最初に目を通すところなので、長くしすぎないことが大事です。

> 大学卒業後、株式会社〇〇に正社員として入社し、衣料品店で3年間、販売・在庫管理・新人の指導を担当しました。2022年からは〇〇株式会社で契約社員として、通信サービスのコールセンターで電話とメールによる問い合わせ対応を担当しています。お客様の話を整理して聞き、分かりやすく説明することを強みとしています。

書き方のポイントです。

- 「いつ・どこで・何を」を1社1文で書く
- 最後の1文で、応募する仕事につながる強みを書く
- 細かい数字や工夫は、次の「職務内容」に回す

## 職務内容：会社ごとに「担当・工夫・成果」を書く

職務内容は、会社ごと（同じ会社で部署が変わったなら部署ごと）に、期間・会社名・働き方・担当した仕事を書きます。表の形にすると読みやすくなります。

書き方の例です（逆編年体、架空の会社名です）。

**2022年4月〜現在　〇〇株式会社（契約社員）**

事業内容：通信サービスの販売・サポート

| 期間 | 担当した仕事 |
| --- | --- |
| 2022年4月〜現在 | コールセンターで、料金や契約内容に関する問い合わせに電話とメールで対応 |
| | よくある質問の回答例を自分用にまとめ、チームで共有するようになった |
| | 2023年10月から、新しく入った人の研修の補助を担当 |

**2019年4月〜2022年3月　株式会社〇〇（正社員）**

事業内容：衣料品の企画・販売

| 期間 | 担当した仕事 |
| --- | --- |
| 2019年4月〜2022年3月 | 衣料品店で接客・レジ・商品の補充・在庫の数の管理を担当 |
| | 入荷の多い日の作業の順番を見直し、閉店後の作業時間を短くした |
| | 2年目から、アルバイトスタッフの指導とシフト作成の補助を担当 |

書くときのポイントは3つです。

- **担当**：毎日していた仕事を、動詞で具体的に書く（「対応」「作成」「管理」）
- **工夫**：自分で考えて変えたこと、続けてきたことを書く
- **成果**：会社の記録などで確かめられる数字があれば書く。覚えていない数字や、盛った数字は書かない

派遣で働いていた場合は、雇われていた派遣会社と、実際に働いた派遣先の両方が分かるように書くのが一般的です。

## 活かせる経験・知識・資格

この欄には、応募する仕事で使えそうな経験や知識、資格をまとめます。ハローワークの資料では、店舗の新規開店や業務の見直しといったプロジェクト、決算の棚卸しのような大きな行事など、ふだんの仕事とは別に経験したことも、書く材料の例として挙げられています。

> - 電話とメールでの問い合わせ対応（通信サービスの料金・契約内容）
> - 新しく入った人への研修の補助、アルバイトスタッフの指導
> - 新店舗の開店準備（商品の陳列、スタッフの受け入れ）
> - パソコン：表計算ソフトでの集計・グラフ作成、文書作成ソフトでの資料作成
> - 資格：日本商工会議所簿記検定試験3級

パソコンのスキルは「使えます」ではなく、**何の作業に使っていたか**を書くと、読む人がイメージしやすくなります。

## 自己PR：強みを1つにしぼって、経験とつなげる

自己PRは、職務経歴書の最後に書く欄です。いくつも強みを並べるより、**応募する仕事に関係の深い強みを1つ**選び、それを裏づける経験を書きます。

書く順番は次のとおりです。

1. 強み（一言で）
2. その強みが出た場面（職務内容に書いた経験から選ぶ）
3. 応募先での活かし方

> 私の強みは、相手の話を整理して、分かりやすく伝え直すことです。コールセンターでは、料金の問い合わせで話が込み入ったときも、お客様の言葉をくり返して確かめてから説明するようにしてきました。チームで共有した回答例は、新しく入った人の研修でも使われています。貴社の事務の仕事でも、社内外からの問い合わせに正確に答え、周りの人が仕事を進めやすくなるよう取り組みたいと考えています。

自分の強みが見つからないときは、[転職のための自己分析のやり方](/articles/jiko-bunseki-yarikata)で経験を書き出してみると、材料が見つかりやすくなります。未経験の職種に応募するときの自己PRの書き方は、[未経験の仕事の自己PR、何を書く？](/articles/jiko-pr-mikeiken)でも紹介しています。

## 書けたら確認したいこと

最後に、次の項目を見直しましょう。

```figure
type: checklist
title: 職務経歴書を出す前のチェック
items:
  - A4で1〜2枚程度に収まっている
  - いちばん上に日付と氏名がある
  - 和暦・西暦がそろっている
  - 会社名を略さず、働き方を書き添えた
  - 職務要約は3〜4行に収まっている
  - 応募先の仕事に近い経験が先に目に入る
  - 自己PRの強みを裏づける経験が書いてある
```

職務経歴書の内容は、面接でそのまま質問のきっかけになります。「この工夫について教えてください」と聞かれたときに話せるよう、書いたことは自分の言葉で説明できるようにしておきましょう。

ひとりで見直すのが不安なときは、ハローワークの窓口で応募書類の書き方を相談する方法もあります。', 'review', false, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '職務経歴書の書き方｜編年体・逆編年体と職務要約の例', '職務経歴書は何をどの順で書けばいい？正社員・契約社員の経験がある人向けに、編年体と逆編年体の選び方、職務要約・職務内容・活かせる経験・自己PRの書き方と例、A4で1〜2枚にまとめるコツと見直しのチェック項目を紹介します。', array['shokumu-keirekisho-arubaito', 'jiko-pr-mikeiken', 'jiko-bunseki-yarikata', 'rirekisho-kakikata-kihon', 'shorui-senkou-tooranai']::text[], '{}'::text[], array['mensetsu']::text[], array['dainishinsotsu', 'haken', 'hajimete']::text[], array['職務経歴書、', '何から書けばいい？']::text[], null, false, '[{"q":"職務経歴書は、編年体と逆編年体のどちらで書けばいいですか？","a":"応募先から指定がなければ、どちらでもかまいません。ハローワークの資料では、迷ったときは古い順に書く編年体にするよう案内されています。今の仕事が応募する仕事に近く、まず今の経験を見てほしいときは、新しい順に書く逆編年体も選べます。"},{"q":"職務経歴書は何枚くらいにまとめればいいですか？","a":"ハローワークの資料では、A4で1〜2枚程度が目安とされています。経験が少ない場合でも1枚にまとめれば十分です。入りきらないときは、応募する仕事に関係の薄い部分を短くして調整しましょう。"},{"q":"契約社員や派遣の経験も、職務経歴書に書いていいですか？","a":"書いて大丈夫です。会社名のあとに「（契約社員）」のように働き方を書き添えると、読む人に経歴が正しく伝わります。派遣で働いていた場合は、雇われていた派遣会社と、実際に働いていた派遣先の両方が分かるように書くのが一般的です。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"正社員・契約社員の経験がある人が、はじめて職務経歴書を書くときの「構成と順番」を示す。編年体と逆編年体の選び方を図で比べ、職務要約・職務内容・活かせる経験・自己PRをそれぞれ例つきで書く。アルバイト経験だけの人向けの既存記事 shokumu-keirekisho-arubaito とは対象を分け、本文からリンクする","quotes":[{"source_url":"https://www.hellowork.mhlw.go.jp/doc/syokurekisyo_pamphlet_070531.pdf","text":"職務経歴の記載方法には、古い職務経歴から書く編年体式、新しいものから遡る逆編年体式、職務内容ごとにまとめるキャリア式がある。わからないときは編年体式とする。職務要約は職務経歴の概要（エッセンス）を記載する。活かせる経験の例として、プロジェクト経験（店舗の新規開店、業務改善など）、イベント経験（株主総会、決算棚卸しなど）、特命業務が挙げられている（官公庁サイトは直接開けなかったため、検索結果の抜粋で確認）","used_in":"編年体と逆編年体、どちらで書く？／活かせる経験"},{"source_url":"https://www.hellowork.mhlw.go.jp/doc/oubosyorui_pamphlet_02_070531.pdf","text":"職務経歴書は自由様式で、A4で1〜2枚程度。パソコンでの作成が一般的だが手書きでも差し支えない。年号や文体は統一する（直接開けなかったため、既存記事 shokumu-keirekisho-arubaito での確認内容と検索結果で確認）","used_in":"職務経歴書は「何ができるか」を伝える書類／書けたら確認したいこと"},{"source_url":"https://www.job-card.mhlw.go.jp/column/employed/cv-resume","text":"履歴書は応募者の基本的なプロフィールを見て次の選考に進めるかを判断するもの、職務経歴書は職務経験と実務能力が企業のニーズに合うかを見極めるために使われる。職務経歴書には応募職種、職務経歴、活かせる経験・能力、自己PRなどを書く（直接開けなかったため検索結果で確認）","used_in":"職務経歴書は「何ができるか」を伝える書類"},{"source_url":"https://www.job-card.mhlw.go.jp/column/employed/self-pr","text":"職務経歴書には履歴書のような決まった書式がなく、一般的な項目を設けて書く。自己PRは経験の事実と結びつけて書く（直接開けなかったため検索結果で確認）","used_in":"自己PR"}],"not_used":["文字の大きさ（ポイント数）や余白の目安は資料によって違うため書かない","採用担当者が職務経歴書を読む時間など、出典を確認できない数字は書かない","キャリア式は転職回数が多い人などに向くとされるが、この記事の対象（はじめて書く人）では使う場面が少ないので、紹介を短くした"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'shokumu-keirekisho-kakikata' and c.slug = 'shorui-mensetsu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'shokumu-keirekisho-kakikata' and c.slug = 'keiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職務経歴書（パンフレット）', 'ハローワークインターネットサービス（厚生労働省）', 'https://www.hellowork.mhlw.go.jp/doc/syokurekisyo_pamphlet_070531.pdf', '2026-10-09'::date, '職務経歴の書き方に編年体（古い順）・逆編年体（新しい順）・キャリア式があり、迷ったときは編年体にすること、職務要約は職務経歴の概要を書くこと、活かせる経験の例（新規開店や業務改善などのプロジェクト、決算棚卸しなどのイベント）', 0 from articles where slug = 'shokumu-keirekisho-kakikata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '応募書類の作り方「2 職務経歴書」', 'ハローワークインターネットサービス（厚生労働省）', 'https://www.hellowork.mhlw.go.jp/doc/oubosyorui_pamphlet_02_070531.pdf', '2026-10-09'::date, '職務経歴書は決まった様式がなく、A4で1〜2枚程度が目安であること、パソコンでの作成が一般的なこと、和暦・西暦や文体をそろえること', 1 from articles where slug = 'shokumu-keirekisho-kakikata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '履歴書と職務経歴書の違いとは？', 'マイジョブ・カード（厚生労働省）', 'https://www.job-card.mhlw.go.jp/column/employed/cv-resume', '2026-10-09'::date, '履歴書は基本的なプロフィールを見る書類、職務経歴書は職務経験と実務能力が企業のニーズに合うかを見る書類であること、職務経歴書に書く主な項目', 2 from articles where slug = 'shokumu-keirekisho-kakikata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職務経歴書における自己PR欄の必要性と書き方について', 'マイジョブ・カード（厚生労働省）', 'https://www.job-card.mhlw.go.jp/column/employed/self-pr', '2026-10-09'::date, '職務経歴書には決まった書式がなく、一般的な項目を設けて書くこと、自己PRは具体的な経験と結びつけて書くこと', 3 from articles where slug = 'shokumu-keirekisho-kakikata';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'shokumu-keirekisho-kakikata' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"73453a273041ca006bda88eb6ad43d527cf1f1e1c6fd7c205398235eb3774b5f","findings":[]}'::jsonb from articles where slug = 'shokumu-keirekisho-kakikata';
update articles set status = 'published' where slug = 'shokumu-keirekisho-kakikata';

-- article: shorui-senkou-tooranai (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('shorui-senkou-tooranai', 'article', '書類選考が通らないときの見直しポイント｜応募先の選び方・求人票の条件・書類の書き方', '書類選考が続けて通らないときは、書類の文章だけでなく、応募先の選び方や求人票の条件との合い方から順に見直すと、原因をしぼりやすくなります。求人票の「必須」「あれば尚可」の読み方、書類の見直し項目、応募の記録のつけ方を紹介します。', '何社に応募しても、書類選考で落ちてしまう。理由が分からないまま「お見送り」の連絡が続くと、自分の経歴に問題があるのではと落ち込んでしまいますよね。

先に結論を言うと、書類選考が通らないときは、**書類の文章を直す前に、応募先の選び方と求人票の条件との合い方から見直す**のがおすすめです。書類をどれだけ整えても、求人の条件と合っていなければ、結果は変わりにくいからです。

選考で落ちた理由は、会社から教えてもらえないこともあります。そのため、次の順に自分で見直していきます。

```figure
type: steps
title: 書類選考が通らないときの見直しの順番
items:
  - label: 1. 応募先の選び方
    text: 応募している職種や求人の種類にかたよりはないか
  - label: 2. 求人票の条件
    text: 「必須」の経験・資格を満たしているか
  - label: 3. 書類の書き方
    text: その求人に合わせて書いているか
  - label: 4. 応募数と記録
    text: 記録をつけて、通った求人との違いを見る
```

## 1. 応募先の選び方は合っている？

まず、これまでに応募した求人を並べてみましょう。次のような傾向がないかを確かめます。

- **経験者向けの求人に多く応募していないか**：未経験の職種なら、「未経験歓迎」「経験不問」と書かれた求人や、研修について書かれた求人を中心に探す
- **職種を広げすぎていないか**：営業も事務もITもと、毎回ちがう職種に応募していると、志望動機が浅くなりやすい
- **条件をしぼりすぎていないか**：給料・休日・勤務地のすべてで高い条件を求めると、応募できる求人そのものが少なくなる

職種をしぼるのがむずかしいときは、ゆずれない条件をいくつかにしぼって、ほかは「できれば」にしておくと、応募先を選びやすくなります。未経験の職種を選ぶときの考え方は、[未経験転職は何から始める？](/articles/mikeiken-tenshoku-hajimekata)で紹介しています。

## 2. 求人票の条件と合っている？

次に、応募した求人票の**応募の条件**を見直します。

ハローワークの求人では、必要な経験・知識・技能がある場合、会社は「必須」か「あれば尚可」を選んで内容を書き、特にない場合は「不問」を選ぶしくみになっています。

| 求人票の表示 | 意味 | 応募するときの考え方 |
| --- | --- | --- |
| 必須 | 応募の条件として必要 | 満たしていなければ、対象外になる可能性が高い |
| あれば尚可 | あれば望ましい | なくても応募できる。近い経験があれば書類で伝える |
| 不問 | 条件にしていない | 経験や資格がなくても応募できる |

たとえば、求人票に次のように書かれていたとします（架空の例です）。

> 必要な経験等：必須　法人向け営業の経験
> 必要な免許・資格：あれば尚可　普通自動車運転免許

この場合、法人向け営業の経験がない人は、応募しても対象外になる可能性が高いと考えられます。運転免許は「あれば尚可」なので、持っていなくても応募できます。

ハローワークの求人以外でも、「必須」「歓迎」「尚可」のように、条件の強さを分けて書いている求人は多くあります。書き方は求人によって違うので、迷ったら次のところを読み比べましょう。

- 「応募資格」「必要な経験」「必要な免許・資格」の欄
- 「仕事の内容」の欄（使うソフトや、担当する仕事の範囲）
- 「特記事項」など、ほかの欄に書かれた補足

厚生労働省の求人票の見方の資料では、「求人に関する特記事項」に応募の条件など大事なことが書かれている場合があるとされています。最後まで目を通しましょう。

## 3. 書類の書き方を見直す

応募先の選び方と条件に問題がなさそうなら、書類そのものを見直します。とくに見落としやすいのは、**どの会社にも出せる書類になっていないか**です。

書類で伝えたいのは、「求人に書かれている仕事」と「自分の経験」のつながりです。求人票の仕事内容から言葉を拾い、自分の経験と結びつけて書きます。

**どの会社にも出せる書き方（見直し前）**

> 人と接することが好きで、コミュニケーション能力を活かせると考え、応募しました。

**求人に合わせた書き方（見直し後）**

> 貴社の求人で、電話とメールでのお客様の問い合わせ対応を担当すると知り、応募しました。飲食店で3年間、ご注文や苦情をうかがってきた経験を活かし、お客様の話を正確に聞き取って対応したいと考えています。

見直し後のほうは、求人に書かれた仕事（電話とメールの問い合わせ対応）と、自分の経験（注文や苦情をうかがってきた）がつながっています。志望動機の組み立て方は[未経験職種の志望動機、何を書けばいい？](/articles/shiboudouki-mikeiken)で、正社員経験が少ないときの履歴書の書き方は[履歴書に書くことがないと思ったとき](/articles/rirekisho-kakukoto-nai)でくわしく紹介しています。

文章の中身のほかに、次の点も確かめましょう。

```figure
type: checklist
title: 応募書類の見直しチェック
items:
  - 志望動機に応募先の仕事の内容が入っている
  - 求人の「必須」に関係する経験を書いている
  - ほかの会社の名前が残っていない
  - 誤字・脱字、年月の間違いがない
  - 空欄のままの欄がない
  - 写真が貼ってある（データなら添付されている）
  - 職務経歴書で仕事の中身が分かる
```

## 4. 応募数と記録を見直す

応募数については、「何社に出せばいい」という決まった数はありません。大事なのは、**数を増やす前に、これまでの応募をふり返れる状態にしておく**ことです。

そのために、応募の記録をつけておきましょう。記録の例です（架空の会社です）。

| 応募日 | 会社・職種 | 必須の条件 | 条件との合い方 | 結果 |
| --- | --- | --- | --- | --- |
| 10月1日 | 〇〇株式会社・事務 | パソコンの基本操作 | 満たしている | 書類通過 |
| 10月3日 | 株式会社〇〇・営業事務 | 営業事務の経験 | 満たしていない | 不通過 |
| 10月6日 | 〇〇株式会社・受付 | 不問 | 満たしている | 結果待ち |

何社か出すごとに記録を見直すと、「必須の条件を満たしていない求人ばかり落ちている」「同じ職種でも、仕事内容をくわしく書いた書類のほうが通っている」といった傾向が見えてきます。

一方で、応募が少なすぎると、通らない理由が書類にあるのか、たまたまなのかが分かりにくくなります。働きながら準備に使える時間も考えて、**1社ずつ書類を合わせられるペース**で応募を続けるのが現実的です。

## ひとりで見直しても分からないときは

自分で見直しても原因が分からないときは、人に書類を見てもらうのがいちばんの近道です。

- **ハローワーク**：応募する求人に合わせた書類の書き方について、無料で相談できます
- **転職エージェント**：担当者に、紹介された求人に合わせて書類を見てもらえることがあります

どこに相談するかは、[転職サイト・転職エージェント・ハローワークの違いは？](/articles/tenshoku-service-chigai)を参考に選んでみてください。相談するときは、応募した求人票と、出した書類、応募の記録をいっしょに持っていくと、具体的なアドバイスをもらいやすくなります。', 'review', false, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '書類選考が通らないときの見直しポイントと求人票の読み方', '書類選考が通らないときは何を見直せばいい？応募先の選び方、求人票の「必須」「あれば尚可」「不問」の読み方と条件との合い方、履歴書・職務経歴書の見直しのチェック項目、応募の記録のつけ方と相談先を紹介します。', array['shiboudouki-mikeiken', 'rirekisho-kakukoto-nai', 'tenshoku-service-chigai', 'rirekisho-kakikata-kihon', 'kigyou-kenkyu-yarikata']::text[], '{}'::text[], array['mensetsu', 'mikeiken-shokushu']::text[], array['seishain-keiken-sukunai', 'freeter']::text[], array['書類選考が', 'なかなか通らない']::text[], null, false, '[{"q":"書類選考で落ちた理由を、会社に聞いてもいいですか？","a":"聞くこと自体はできますが、選考の理由は答えてもらえないこともあります。理由を待つより、応募した求人の条件と自分の書類を並べて、合っていなかったところがないかを自分で見直すほうが次につながります。ハローワークや転職エージェントを使っているなら、担当者に書類を見てもらう方法もあります。"},{"q":"求人票の「あれば尚可」の経験がなくても、応募していいですか？","a":"応募してかまいません。「あれば尚可」は、あれば望ましいという意味で、応募の条件ではありません。条件として必要なものは「必須」と書かれます。「必須」の経験や資格がない場合は、応募しても対象外になる可能性が高いので、応募先を選び直すことも考えましょう。"},{"q":"応募する数は増やしたほうがいいですか？","a":"数を増やす前に、これまでの応募をふり返ることをおすすめします。条件に合わない求人に数多く出しても、結果は変わりにくいからです。応募の記録をつけて、何社か出すごとに通った求人と通らなかった求人の違いを見直し、そのうえで応募のペースを決めましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"書類選考が通らないとき、書類の文章だけを直すのではなく「応募先の選び方 → 求人票の条件との合い方 → 書類の書き方 → 応募数と記録」の順に見直すと原因をしぼりやすい。求人票の「必須」「あれば尚可」「不問」の違いはハローワークの求人入力のしくみを根拠にする。通過率などの数字は出典がないので書かない","quotes":[{"source_url":"https://www.mhlw.go.jp/content/000616349.pdf","text":"求人票の見方。「求人に関する特記事項」には労働条件や応募条件など重要なことが記載されている場合がある（官公庁サイトは直接開けなかったため、検索結果の抜粋で確認）","used_in":"2. 求人票の条件と合っている？"},{"source_url":"https://jsite.mhlw.go.jp/kanagawa-hellowork/content/contents/001418112.pdf","text":"必要な経験・知識・技能等がある場合は「必須」または「あれば尚可」を選択し、具体的な内容を記載する。特にない場合は「不問」を選択する。学歴は「必須」を選択した場合、必要学歴を選択する（直接開けなかったため検索結果の抜粋で確認）","used_in":"2. 求人票の条件と合っている？"},{"source_url":"https://jsite.mhlw.go.jp/tokyo-hellowork/content/contents/002655962.pdf","text":"事業主向けに、経験や免許・資格を「必須」とする場合においては、求める経験や免許・資格は必要最低限とするよう案内している（直接開けなかったため検索結果で確認）","used_in":"2. 求人票の条件と合っている？"},{"source_url":"https://www.mhlw.go.jp/stf/newpage_27742.html","text":"ハローワークでは、応募書類の作り方などの個別相談やセミナーを無料で行い、応募する求人に合わせた書類の書き方について助言している（直接開けなかったため、既存記事での確認内容と検索結果で確認）","used_in":"ひとりで見直しても分からないときは"}],"not_used":["書類選考の通過率、平均の応募社数、内定までの応募数などは公的な出典を確認できなかったので書かない","企業が書類で重視する項目のランキング調査（大阪のハローワーク資料の求職者向け調査）は、書類選考の話とずれるため使わない","年齢や学歴が書類選考にどう影響するかは、出典がなく会社によって違うため書かない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'shorui-senkou-tooranai' and c.slug = 'shorui-mensetsu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'shorui-senkou-tooranai' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '求人票の見方', '厚生労働省', 'https://www.mhlw.go.jp/content/000616349.pdf', '2026-10-09'::date, 'ハローワークの求人票の項目の見方、「求人に関する特記事項」に労働条件や応募条件など重要なことが書かれている場合があること', 0 from articles where slug = 'shorui-senkou-tooranai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '求人情報の入力のしかた', '神奈川労働局・ハローワーク（厚生労働省）', 'https://jsite.mhlw.go.jp/kanagawa-hellowork/content/contents/001418112.pdf', '2026-10-09'::date, 'ハローワークの求人では、必要な経験・知識・技能がある場合に「必須」か「あれば尚可」を選んで内容を書き、特にない場合は「不問」を選ぶしくみであること', 1 from articles where slug = 'shorui-senkou-tooranai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '求人票の記載内容を見直しましょう！～その『経験』や『免許・資格』はホントに必要ですか？～', 'ハローワーク飯田橋（東京労働局）', 'https://jsite.mhlw.go.jp/tokyo-hellowork/content/contents/002655962.pdf', '2026-10-09'::date, '事業主に対して、経験や免許・資格を「必須」とする場合は必要最低限にするよう案内していること（「必須」は応募の条件として扱われること）', 2 from articles where slug = 'shorui-senkou-tooranai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ハローワークの相談支援', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_27742.html', '2026-10-09'::date, 'ハローワークで、応募する求人に合わせた書類の書き方などについて無料で相談・助言を受けられること', 3 from articles where slug = 'shorui-senkou-tooranai';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'shorui-senkou-tooranai' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"fb446c565a814912a6fbb1951f81ccb58deb466614de1f226bb16cd14502f543","findings":[]}'::jsonb from articles where slug = 'shorui-senkou-tooranai';
update articles set status = 'published' where slug = 'shorui-senkou-tooranai';

-- article: shoyo-kyujin-mikata (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('shoyo-kyujin-mikata', 'article', '求人の「賞与年2回」「昨年実績」はどう読む？ボーナスの見方と面接での聞き方', '求人票の賞与（ボーナス）欄は、過去の実績を示していることが多く、次の支給額を約束するものではありません。「賞与年2回」「昨年実績〇か月分」の読み方、業績や評価で変わるしくみ、試用期間中や入社1年目の支給、面接での聞き方の例を紹介します。', '求人票の「賞与年2回」「昨年実績〇か月分」を見て、「入社したらこのくらいもらえるのかな」と考える人は多いと思います。

先に結論を言うと、求人票の賞与（ボーナス）欄は**過去にどれだけ出たかの実績**であることが多く、**次の支給額を約束するものではありません**。年収を見込むときは、賞与を除いた月給でも比べておき、気になる点は面接や内定後の条件確認で聞くのが安心です。

この記事で分かること：

- 「賞与年2回」「昨年実績」の**読み方**
- 「〇か月分」の**元になる金額**の確かめ方
- **試用期間中・入社1年目**のボーナスの扱い
- 面接や内定後に**聞くときの言い方の例**

## 「昨年実績」は約束ではない

労働局の求人票の見方の資料では、昇給や賞与は**会社の業績や個人の評価で大きく変わる項目**のため、求人票には**すでに確定した前年の実績**を載せている、と説明されています。そのうえで、「賞与（実績）〇か月分」とあっても、**次回も同じ月数がもらえるという意味ではない**と注意しています。

つまり、求人票の賞与欄は「この会社では、前の年にこれくらい出た」という参考の数字です。業績が下がれば減ることもありますし、評価によって人ごとに差が出ることもあります。

### よくある書き方と読み方の例

| 求人の書き方（例） | 読み方 |
| --- | --- |
| 賞与年2回（昨年実績 計〇か月分） | 前の年は2回に分けて合計〇か月分が出た。次の年も同じとは限らない |
| 賞与あり（業績による） | 制度はあるが、金額や回数は会社の業績で決まる |
| 決算賞与あり | 決算のあとに、業績に応じて出ることがある賞与。毎年出るとは限らない |
| 賞与なし | ボーナスはない。月給だけで年収を考える |
| 賞与 年〇回 計〇か月分 | 実績か、会社の決まり（基準）かを確認したい |

「実績」と書いてあるのか、それとも「基準」「予定」と書いてあるのかで意味が変わります。どちらか分からない書き方なら、確認しておきたいところです。

## 「〇か月分」は何の〇か月分？

「賞与〇か月分」の「1か月分」が**何の金額を元にしているか**も大事なポイントです。

求人票の月給には、基本給のほかに手当（職務手当・資格手当・固定残業代など）が含まれていることがあります。賞与を**基本給を元に**計算する会社だと、手当が多い求人では、月給から想像するより賞与が小さくなります。

たとえば、同じ「月給〇万円・賞与〇か月分」でも、

- 月給のほとんどが基本給の会社
- 月給のうち手当の割合が大きい会社

では、賞与の金額が変わってきます。固定残業代が含まれている求人の読み方は、[固定残業代（みなし残業）がある求人の見方](/articles/koteizangyo-kyujin)で紹介しています。

### 年収の目安は「賞与あり」「賞与なし」の両方で

求人の年収例は、賞与を含めて計算していることが多いです。比べるときは、次の2つを並べてみると、賞与にどれだけ頼っているかが分かります。

```figure
type: equation
title: 年収の目安を2通りで出す
terms:
  - 月給 × 12
  - +
  - 賞与の実績
  - =
  - 賞与を含めた目安
```

もう1つは、賞与を0として「月給×12」で出した金額です。賞与が減った年でも生活できるかは、こちらの金額で考えておくと安心です。年収の数字だけで決めないほうがいい理由は、[年収だけで求人を選ばないほうがいい理由](/articles/nenshu-dake-erabanai)にまとめています。

## 賞与のルールはどこに書いてある？

賞与を出すことを会社が決めている場合、そのルールは**就業規則**（または賃金規程）に書かれます。労働基準法第89条では、賞与のような臨時の賃金について定めをする場合は、就業規則に記載することになっています。

また、労働局の資料では、臨時に支払われる賃金・賞与などは、**会社に定めがある場合に示す労働条件**の一つとされています。内定後に受け取る労働条件通知書（雇用契約書）にも、賞与の有無や扱いが書かれていることが多いので、求人票と見比べましょう。

労働条件通知書で見るところ全体は、[内定をもらったら、承諾の前に確認すること](/articles/naitei-shodaku-mae)で紹介しています。

## 試用期間中・入社1年目のボーナスは？

中途入社で見落としやすいのが、**入社した年の賞与の扱い**です。ここは会社の決まりによって違うので、決めつけずに確認しましょう。

よくある決め方の例：

- **算定期間**：賞与の金額を決めるための期間（例：前の年の〇月〜〇月）があり、その期間に在籍していないと対象外、または在籍した期間に応じて減らす
- **支給日の在籍**：支給日に会社に在籍していることを条件にする
- **試用期間の扱い**：試用期間中は算定期間に含めない、または含める

たとえば、算定期間の途中で入社すると、初回の賞与は少なくなったり、出なかったりすることがあります。入社時期によって1年目の年収が求人の年収例より低くなることもあるので、「1年目はいくらぐらいになりそうか」を考えておくと、入社後に慌てずにすみます。試用期間そのもののしくみは、[試用期間って何？](/articles/shiyou-kikan)で紹介しています。

```figure
type: checklist
title: 賞与で確認したいこと
items:
  - 求人の数字は「実績」か「基準」か
  - 支給の回数と、支給される時期
  - 「〇か月分」は基本給が元か、月給が元か
  - 業績や評価でどのくらい変わるか
  - 入社した年の賞与はどう扱われるか
  - 試用期間中は算定期間に入るか
```

## 面接やオファー面談で、どう聞く？

賞与のことを聞くのは、ためらう人も多いと思います。ポイントは、**求人票を読んだうえで、確認したいことを1つか2つに絞って短く聞く**ことです。

### 質問の例

- 「求人票に賞与の昨年実績が書かれていましたが、これは全社員の平均でしょうか、それとも中途入社の方も同じくらいでしょうか」
- 「賞与の金額は、会社の業績と個人の評価のどちらで決まることが多いですか」
- 「〇月に入社した場合、その年の賞与はどのような扱いになりますか」
- 「賞与の計算の元になるのは、基本給でしょうか」

### 聞くタイミング

- **1次面接**：仕事内容の質問が中心の場なので、聞くなら1問だけにする
- **最終面接・内定後の条件確認（オファー面談）**：条件の話をする場なので、細かい点も聞きやすい
- **転職エージェント経由**：担当者に「入社1年目の賞与の扱いを確認してほしい」と頼む方法もある

逆質問全体で何を聞くかは、[面接の逆質問、何を聞けばいい？](/articles/gyaku-shitsumon)も参考になります。

## まとめ：賞与は「参考」、月給は「土台」

- 求人票の賞与欄は過去の実績であることが多く、次の支給額の約束ではない
- 「〇か月分」が何を元にした金額かで、実際の金額が変わる
- 入社1年目は、算定期間や支給日の在籍の決まりで少なくなることがある
- 年収は「賞与あり」「賞与なし」の両方で見込んでおく
- 分からないことは、面接や内定後の条件確認で短く聞く

賞与は会社の業績や評価で変わるものなので、まずは毎月の給料で生活が成り立つかを土台に考え、そのうえで賞与を上乗せとして見ると、求人どうしを比べやすくなります。', 'review', false, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '求人の賞与（ボーナス）の見方｜「昨年実績」の読み方', '求人票の「賞与年2回」「昨年実績〇か月分」は何を表している？実績は次回の約束ではない理由、「〇か月分」の元になる金額、入社1年目や試用期間中の支給、面接やオファー面談での聞き方の例を紹介します。', array['koteizangyo-kyujin', 'naitei-shodaku-mae', 'nenshu-dake-erabanai', 'fukuri-kousei-mikata', 'taishokukin-kakunin']::text[], '{}'::text[], array['kyuryo']::text[], array['hajimete', 'seishain-keiken-sukunai']::text[], array['ボーナス「昨年実績」', 'そのままもらえる？']::text[], null, false, '[{"q":"求人票に「賞与 昨年実績〇か月分」とあれば、入社後も同じだけもらえますか？","a":"同じ額になるとは限りません。労働局の資料でも、賞与は会社の業績や個人の評価で大きく変わる項目のため、求人票にはすでに確定した前年の実績を載せていて、次回も同じ月数がもらえるという意味ではないと説明されています。実績は「この会社ではこれくらい出たことがある」という参考として読みましょう。"},{"q":"入社1年目でもボーナスはもらえますか？","a":"会社の決まりによって違います。賞与の金額を決めるための期間（算定期間）や、支給日に在籍していることを条件にしているかどうかで、入社時期によっては初回が対象外になったり、少なくなったりすることがあります。入社前に「入社した年の賞与はどう扱われますか」と確認しておくと安心です。"},{"q":"ボーナスのことを面接で聞くと、印象が悪くなりませんか？","a":"聞き方とタイミングを選べば、失礼にはあたりにくいです。最初の面接で何度も聞くより、求人票の記載を確認したうえで「入社した年の賞与の扱いを教えていただけますか」のように短く聞く、内定後の条件確認の場で聞く、といった方法があります。転職エージェントを使っている場合は、担当者に確認してもらうこともできます。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"求人の賞与欄は「過去の実績」であって「約束」ではない、という読み方を軸に、「〇か月分」の元になる金額・回数・入社1年目の扱いを分けて確認できるようにする。年収の見込みを立てるときは、賞与を除いた月給ベースでも比べる","quotes":[{"source_url":"https://jsite.mhlw.go.jp/hyogo-roudoukyoku/content/contents/002078962.pdf","text":"昇給や賞与は、会社の業績や個人の評価により大きな違いがでてくる項目。将来の予定があっても変更になる可能性があるため、すでに確定している前年の実績をお知らせしている。求人票で「賞与（実績）△ヵ月分」となっていても、次回も同じ月数がもらえるという意味ではない（直接接続できなかったため、検索結果に表示された資料の記述で確認）","used_in":"「昨年実績」は約束ではない"},{"source_url":"https://laws.e-gov.go.jp/law/322AC0000000049","text":"第八十九条（就業規則の作成及び届出の義務）の相対的必要記載事項として、臨時の賃金等（退職手当を除く。）及び最低賃金額の定めをする場合においては、これに関する事項（e-Gov への直接接続ができなかったため、検索結果に表示された条文の解説で確認）","used_in":"賞与のルールはどこに書いてある？"},{"source_url":"https://jsite.mhlw.go.jp/kanagawa-roudoukyoku/content/contents/001875667.pdf","text":"定めをした場合に明示すべき事項として、退職手当に関する事項、臨時に支払われる賃金・賞与等に関する事項が挙げられている（直接接続できなかったため、検索結果に表示された資料の記述で確認）","used_in":"賞与のルールはどこに書いてある？"}],"not_used":["賞与の平均支給額や支給月数の統計は、業種・規模・年で大きく変わるため書かない","賞与の定義に関する昭和22年の通達は、民間の解説サイト経由でしか確認できなかったので出典にしない","賞与にかかる社会保険料の計算は、記事の目的（求人の読み方）から外れるため扱わない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'shoyo-kyujin-mikata' and c.slug = 'hatarakikata' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'shoyo-kyujin-mikata' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '求人票の見方（兵庫労働局の資料）', '兵庫労働局', 'https://jsite.mhlw.go.jp/hyogo-roudoukyoku/content/contents/002078962.pdf', '2026-10-09'::date, '昇給や賞与は会社の業績や個人の評価で大きく変わるため、求人票には確定した前年の実績を載せていること。「賞与（実績）〇か月分」は次回も同じ月数がもらえるという意味ではないこと', 0 from articles where slug = 'shoyo-kyujin-mikata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '労働基準法（昭和二十二年法律第四十九号）第八十九条', 'e-Gov法令検索（デジタル庁）', 'https://laws.e-gov.go.jp/law/322AC0000000049', '2026-10-09'::date, '臨時の賃金等（賞与など）の定めをする場合は、就業規則に記載する必要があること', 1 from articles where slug = 'shoyo-kyujin-mikata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '労働条件の明示に関する資料（神奈川労働局）', '神奈川労働局', 'https://jsite.mhlw.go.jp/kanagawa-roudoukyoku/content/contents/001875667.pdf', '2026-10-09'::date, '臨時に支払われる賃金・賞与等に関する事項は、定めをした場合に明示すべき労働条件にあたること', 2 from articles where slug = 'shoyo-kyujin-mikata';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'shoyo-kyujin-mikata' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"78cec79951762c1f827505daf835b3dfec8646112db7ae8e87e397df13749f1d","findings":[]}'::jsonb from articles where slug = 'shoyo-kyujin-mikata';
update articles set status = 'published' where slug = 'shoyo-kyujin-mikata';

-- article: souki-rishoku-tenshoku (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('souki-rishoku-tenshoku', 'article', '入社1年以内に辞めた・辞めたいときの転職｜面接での説明のしかたと、次に同じことを繰り返さない確認', '入社して早く辞めた経験は、隠すより「何が合わなかったか」と「次は何を確かめて選んだか」をセットで話すほうが伝わりやすくなります。面接での説明の型と例文、次の会社で同じことを繰り返さないための確認ポイント、第二新卒としての応募の考え方と相談先を紹介します。', '「入社して半年で辞めてしまった」「1年もたたずに、もう辞めたいと思っている」。早く辞めた経験があると、次の面接で何を言われるか不安になり、転職活動そのものに踏み出しにくくなるかもしれません。

先に結論を言うと、早く辞めた経験は、**「何が合わなかったか」と「次は何を確かめて選んだか」をセットで話す**と、面接で伝わりやすくなります。そして、この2つを整理する作業は、そのまま**次の会社で同じことを繰り返さないための準備**にもなります。

この記事で分かること：

- 面接官が早期退職について**何を知りたいか**
- 面接での**説明の型**と、理由別の**例文**（仮の例）
- 次は同じことを繰り返さないための**確認ポイント**
- **第二新卒**として応募するときの考え方

## 面接官は、早く辞めたことの何を知りたい？

職歴の期間が短いと、面接では理由を聞かれることが多いです。ただ、責めるためではなく、多くは次のことを確かめるためです。

- 入社したら、続けて働けそうか
- 辞めた理由が、うちの会社でも起きそうなことか
- 自分の経験から何を学び、どう考えているか

つまり、聞かれているのは「辞めたこと」そのものより、**「次は続けられるのか」**です。答えもここを中心に組み立てます。

## 面接での説明は「4つの順番」で

次の順番で話すと、言い訳に聞こえにくく、前向きにまとまります。

```figure
type: steps
title: 早く辞めた理由の説明の型
items:
  - label: 事実
    text: いつ入社して、いつ辞めたか（辞める予定か）
  - label: 合わなかったこと
    text: 何が希望と違ったかを、自分の言葉で短く
  - label: 学んだこと
    text: 入社前に確かめるべきだったこと
  - label: これから
    text: 今回は何を確かめて、この会社に応募したか
```

話す量は、「事実」と「合わなかったこと」を短く、「学んだこと」と「これから」を少し厚めにするのがコツです。全体で1分くらいを目安にしましょう。

### 言わないほうがいいこと

- **前の会社や上司の悪口**：事実であっても、聞く側は「うちでも同じことを言われるのでは」と感じやすくなります
- **「なんとなく合わなかった」**：理由が分からないと、次も同じことが起きるのではと思われます
- **事実と違う理由**：深く聞かれたときに話が食い違います

## 理由別の例文（仮の例）

自分の言葉に置き換えて使ってください。

### 仕事の内容が聞いていた話と違った

> 「新卒で入社した会社では、企画の仕事と聞いていましたが、配属後は飛び込みの営業が中心でした。続けるうちに、自分は相手の困りごとを聞いて解決する仕事のほうが力を出せると気づき、8か月で退職を決めました。入社前に、配属先と仕事の中身を具体的に確かめなかったことは反省しています。今回は、求人票と面接で、入社後の担当業務と1日の流れをうかがったうえで応募しました。」

### 働く時間や休みが合わなかった

> 「前職では、残業が多い月が続き、体調を崩しかけたため、10か月で退職しました。働く時間について、入社前に実際の残業の様子を確かめていなかったのが反省点です。御社については、求人に記載のある残業時間の実績を確認し、面接でも繁忙期の働き方をうかがったうえで、長く続けられると考えて応募しています。」

### 人間関係で悩んだ

> 「前職では、上司と相談しながら仕事を進める機会が少なく、ひとりで判断することが多い環境でした。私は、分からないことを確かめながら進めるほうが力を発揮できると分かり、退職を決めました。今回は、研修やチームでの仕事の進め方を面接でうかがい、相談しながら仕事を覚えられる環境だと感じて志望しています。」

人間関係の理由は、「〇〇さんが合わなかった」ではなく、**「どんな環境なら力を出せるか」**の言葉に置き換えるのがポイントです。

## 次は同じことを繰り返さない確認ポイント

面接の説明で使った「合わなかったこと」は、次の会社選びでいちばん大事な確認ポイントになります。

### 1. 辞めた理由を「確認すること」に言い換える

まず、辞めた理由（辞めたい理由）を書き出し、それぞれ**入社前に何を確かめれば防げたか**に言い換えます。

| 合わなかったこと | 次に確かめること |
| --- | --- |
| 仕事の内容が聞いていた話と違った | 入社直後の担当業務、仕事内容の変更の範囲、配属の決まり方 |
| 残業が多かった | 平均の残業時間の実績、繁忙期の働き方、固定残業代の有無 |
| 休みが取りにくかった | 年間休日の日数、有給休暇の取得の実績 |
| 教えてもらえる人がいなかった | 研修の期間と内容、相談できる先輩や担当者がいるか |
| 若手がすぐ辞めていく職場だった | 新卒などの採用者数と離職者数の実績 |

### 2. 求人票・面接・書面で確かめる

言い換えた確認ポイントは、次の3か所で確かめます。

```figure
type: checklist
title: 応募から内定までに確かめること
items:
  - 求人票：仕事内容・休日・残業時間の実績
  - 職場の情報：採用者数と離職者数・研修の有無
  - 面接の逆質問：入社後の仕事と1日の流れ
  - 労働条件通知書：仕事内容と働く場所の変更の範囲
  - 迷ったら：承諾の前に返事の期限を相談する
```

新卒などを対象にした求人では、採用者数と離職者数、研修の有無、残業の実績といった「職場の情報」を確認できることがあります。見方は[求人で「職場の情報」を確かめるには？](/articles/shokuba-jouhou-wakamono)で紹介しています。

### 3. まだ在職中なら、辞める前にもう一度考える

いま「辞めたい」と思っている段階なら、辞める前に、異動や働き方の相談で解決できないかも考えてみましょう。辞めると決めた場合も、次の仕事を決めてから辞めるか、先に辞めるかで、お金や手続きの準備が変わります。確認しておきたいことは[今の仕事を辞めたいとき、先に確認しておきたいこと](/articles/yametai-mae-kakunin)にまとめています。

## 「第二新卒」として応募するときは

学校を卒業して数年以内に転職する人は「第二新卒」と呼ばれることがあります。ただ、何歳まで・卒業後何年までという決まった定義はありません。くわしくは[第二新卒って何歳まで？](/articles/dainishinsotsu-nansai)で紹介しています。

### 新卒の採用枠に応募できることもある

厚生労働省の青少年雇用機会確保指針では、事業主は、学校を卒業した人が**卒業後少なくとも3年間**は新卒の採用枠に応募できるよう努め、できる限り上限の年齢を設けないよう努めることとされています。

ただし、一度就職して辞めた人を新卒枠の対象にするかどうかは、会社によって違います。募集要項に「既卒可」「卒業後〇年以内」などの書き方がないかを確かめ、分からなければ応募の前に問い合わせましょう。

> 「〇年3月に大学を卒業し、一度就職したのち、現在は退職しております。新卒の採用枠に応募することは可能でしょうか。」

### 中途採用の枠で応募するとき

中途採用の枠では、「社会人としての基本的な経験があること」を前提にした求人もあれば、「未経験歓迎」として育てることを前提にした求人もあります。短い期間でも、前の職場で身につけた電話の受け答えやメールの書き方、報告のしかたなどは、職務経歴書に具体的に書いておきましょう。

## ひとりで整理しきれないときの相談先

辞めた理由をうまく言葉にできないときは、人に聞いてもらうのがいちばんの近道です。

- **新卒応援ハローワーク**：学生や、学校を卒業しておおむね3年以内の人の就職を支援しています
- **わかものハローワーク**：正社員の仕事を目指すおおむね35歳未満の人を支援しています。働いた経験が少ないことや、転職を繰り返していることに悩む人の相談も受け付けています

早く辞めたことは、次の選び方を見直すきっかけにもなります。転職回数そのものが気になる人は、[転職回数が気になるときに整理したいこと](/articles/tenshoku-kaisu-kininaru)も読んでみてください。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '入社1年以内に辞めた人の転職｜面接での説明と次の選び方', '入社1年以内に辞めた・辞めたいときの転職の進め方を紹介します。面接での退職理由の説明の型と例文、言わないほうがいいこと、次は同じことを繰り返さないための確認ポイント、第二新卒・既卒としての応募と相談先が分かります。', array['dainishinsotsu-nansai', 'tenshoku-kaisu-kininaru', 'shokuba-jouhou-wakamono', 'taishoku-riyuu-mensetsu', 'tenshoku-koukai-shinai']::text[], '{}'::text[], array['mensetsu', 'yametai']::text[], array['dainishinsotsu', 'seishain-keiken-sukunai']::text[], array['早く辞めた経験、', '面接でどう話す？']::text[], null, false, '[{"q":"入社して数か月で辞めた職歴は、履歴書に書かなくてもいいですか？","a":"短い期間でも、正社員などとして雇われていた職歴は書くのが基本です。書かずにいて、あとで分かると、説明が食い違って信用を失うおそれがあります。期間が短いことは面接で聞かれやすいので、話す内容を準備しておきましょう。"},{"q":"早く辞めた理由が「人間関係」でも、正直に話していいですか？","a":"うそをつく必要はありませんが、特定の人への不満として話すと、「次の職場でも同じことが起きるのでは」と受け取られやすくなります。「何が合わなかったのか」を自分の希望の言葉に置き換え、「だから次は〇〇を確かめて応募した」とつなげると伝わりやすくなります。"},{"q":"第二新卒として新卒の採用枠に応募できますか？","a":"厚生労働省の青少年雇用機会確保指針では、事業主は学校を卒業した人が卒業後少なくとも3年間は新卒の採用枠に応募できるよう努めることとされています。ただし、一度就職した人を新卒枠の対象にするかどうかは会社によって違うので、募集要項を確かめ、分からなければ問い合わせましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"早期離職を「弱み」として隠すのではなく、「合わなかったこと」を次の会社選びの確認ポイントに変える。面接の説明と、次の選び方を同じ材料で組み立てる","quotes":[{"source_url":"https://jsite.mhlw.go.jp/tottori-roudoukyoku/hourei_seido_tetsuzuki/shokugyou_shoukai/22seishonen_shishin.html","text":"青少年雇用機会確保指針では、学校卒業見込者の採用枠について、既卒者が卒業後少なくとも3年間は応募できるよう努めること、できる限り上限年齢を設けないよう努めることとしている（jsite.mhlw.go.jp に直接接続できなかったため、WebSearch の検索結果に表示されたページの記述で確認）","used_in":"「第二新卒」として応募するときは"},{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/jakunen/index.html","text":"新卒応援ハローワークは大学・短大・高専・専修学校などの学生や学校卒業後おおむね3年以内の人の就職を支援。わかものハローワークは正社員就職を目指すおおむね35歳未満の若者を支援（直接接続できなかったため、検索結果に表示された記述で確認）","used_in":"ひとりで整理しきれないときの相談先"},{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000132151.html","text":"「就業経験が少ない」「さまざまな事情で離転職を繰り返している」ことにひとりで悩んでいないかと呼びかけ、正社員就職を目指す若者を支援している（直接接続できなかったため、検索結果に表示された記述で確認）","used_in":"ひとりで整理しきれないときの相談先"}],"not_used":["新規学卒者の3年以内離職率などの統計は、年度で数字が変わり、本記事の主題（説明と選び方）に直接必要ないため使わない","「1年未満の職歴は書類選考で不利」などの評価に関する一般論は公的な根拠を確認できなかったので書かない","第二新卒の年齢・卒業後年数の定義は法律で決まっていないため断定せず、既存記事 dainishinsotsu-nansai へのリンクにとどめた"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'souki-rishoku-tenshoku' and c.slug = 'junbi' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'souki-rishoku-tenshoku' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '青少年雇用機会確保指針について', '厚生労働省 鳥取労働局', 'https://jsite.mhlw.go.jp/tottori-roudoukyoku/hourei_seido_tetsuzuki/shokugyou_shoukai/22seishonen_shishin.html', '2026-10-09'::date, '学校卒業見込者の採用枠について、既卒者が卒業後少なくとも3年間は応募できるよう努めること、できる限り上限年齢を設けないよう努めることが指針に示されていること', 0 from articles where slug = 'souki-rishoku-tenshoku';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '若者への就職支援', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/jakunen/index.html', '2026-10-09'::date, '新卒応援ハローワークが学生や学校卒業後おおむね3年以内の人の就職を支援していること、わかものハローワークが正社員就職を目指すおおむね35歳未満の若者を支援していること', 1 from articles where slug = 'souki-rishoku-tenshoku';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '正社員就職を目指す若者の皆さまへ', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000132151.html', '2026-10-09'::date, '就業経験が少ないことや、離転職を繰り返していることに悩む若者を、わかものハローワークなどで支援していること', 2 from articles where slug = 'souki-rishoku-tenshoku';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'souki-rishoku-tenshoku' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"9b889ecc126fd85ef4978f4a93295bd6caca0ee59be39847d5e504d5b4b61be5","findings":[]}'::jsonb from articles where slug = 'souki-rishoku-tenshoku';
update articles set status = 'published' where slug = 'souki-rishoku-tenshoku';

-- article: taishoku-juminzei (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('taishoku-juminzei', 'article', '退職したあとの住民税はどう払う？辞める時期による違いと、転職先で続ける方法', '給料から引かれていた住民税は、会社を辞めると払い方が変わります。辞める時期が1〜5月か6〜12月かでの違い、自分で払う「普通徴収」への切り替え、次の会社で給料からの天引きを続ける方法を紹介します。', '会社員の住民税は、ふつう毎月の給料から引かれています。会社を辞めるとこの天引きができなくなるため、残りの住民税をどう払うかが変わります。

**この記事で分かること**

- 住民税は前の年の所得をもとに、6月から翌年5月までの12回に分けて給料から引かれている
- 6月〜12月に辞めると、残りは自分で払う「普通徴収」か、最後の給料からの一括払いになる
- 1月〜4月に辞めると、原則として残りは最後の給料や退職金から一括で引かれる
- 次の会社が決まっていれば、そこで給料からの天引きを続けてもらう方法もある

## 住民税のしくみをおさらい

住民税は、その年の1月1日に住んでいる市区町村から、**前の年の所得をもとに**かかる税金です。たとえば2026年6月から2027年5月まで払う住民税は、2025年の所得をもとに計算されています。

会社員の場合、会社が毎月の給料から住民税を引いて、本人の代わりに市区町村に納めています。これを「特別徴収」といいます。特別徴収は、6月から翌年5月までの12回に分けて行われます。

会社を辞めるとこの天引きが続けられないので、まだ払っていない分を別の方法で払うことになります。住民税は前の年の所得で決まるため、**辞めて収入がなくなっても、前の年に働いた分の住民税はかかる**ことを覚えておきましょう。

## 6月〜12月に辞めた場合

6月1日から12月31日までに辞めた場合、残りの住民税は、原則として**自分で払う「普通徴収」に切り替わります**。

ただし、本人が会社に申し出れば、残りの分を最後の給料や退職金からまとめて引いてもらう（一括徴収）こともできます。

| 払い方 | どうなる？ | 向いている人 |
| --- | --- | --- |
| 普通徴収に切り替える | 市区町村から届く納税通知書で、自分で払う | 最後の給料を生活費に回したい人 |
| 一括徴収を申し出る | 残りを最後の給料や退職金からまとめて引く | あとで払う手間をなくしたい人 |

たとえば2026年9月30日に辞める場合、2026年10月から2027年5月までの8回分が残ります（仮の例です）。一括で引いてもらうと最後の手取りはその分少なくなるので、生活費の見通しとあわせて決めましょう。

## 1月〜5月に辞めた場合

1月1日から4月30日までに辞めた場合は、5月31日までに払われる給料や退職金が残りの住民税より多ければ、**本人が申し出なくても、残りが一括で引かれます**。たとえば2027年3月31日に辞めると、4月分と5月分の住民税が最後の給料などからまとめて引かれます（仮の例です）。最後の手取りが少なく感じる理由になるので、知っておくと安心です。

5月は、6月から始まった12回の最後の月です。5月の給料から5月分が引かれれば、その年度の住民税はそこで払い終わります。

1月〜5月のどの月に辞めた場合も、**6月からは新しい年度の住民税**が始まります。これは辞めた年の前の年の所得をもとにしたものです。6月の時点で次の会社に入っていなければ、ふつうは市区町村から届く納税通知書で自分で払います。

```figure
type: compare
style: vs
title: 辞める時期で住民税の払い方が変わる
columns:
  - label: 6月〜12月に退職
    tone: sky
    items:
      - 残りは原則、普通徴収に切り替え
      - 申し出れば最後の給料から一括
  - label: 1月〜4月に退職
    tone: sand
    items:
      - 残りは原則、最後の給料などから一括
      - 本人の申し出がなくても一括になる
```

## 自分で払う「普通徴収」とは

普通徴収は、市区町村から届く納税通知書（納付書）で、自分で住民税を払う方法です。

- 会社が市区町村に退職の届出（給与所得者異動届出書）を出したあと、市区町村から納税通知書が届きます
- 年度のはじめから普通徴収の場合、横浜市では6月、8月、10月、翌年1月の4回に分けて払います。年度の途中で切り替わった場合の納期は、届いた通知書で確認しましょう
- 払える場所や払い方も市区町村によって違うので、通知書と一緒に届く案内を確認しましょう

普通徴収になると、1回に払う金額が給料からの天引きより大きくなることがあります。納期の月に慌てないよう、届いた通知書の金額と納期限をカレンダーに書いておきましょう。払うのが難しいときは、納期限が来る前に住んでいる市区町村の税の窓口に相談してください。

## 次の会社で給料からの天引きを続ける方法

次の会社が決まっているなら、住民税の天引きを次の会社で続けてもらう方法があります。そうすると、自分で納付書で払う手間がありません。

```figure
type: steps
title: 転職先で天引きを続ける流れ
items:
  - label: 両方の会社に伝える
    text: 次の会社で住民税の天引きを続けたいと伝える
  - label: 前の会社が届出書を作る
    text: 給与所得者異動届出書に記入して、次の会社に送る
  - label: 次の会社が市区町村に出す
    text: 新しい勤務先の欄を書いて、市区町村に提出する
  - label: 次の会社の給料から引かれる
    text: 前の会社で引けなかった分を、次の会社で引く
```

この方法を使うには、前の会社と次の会社の両方が手続きをする必要があります。退職日と入社日が決まったら、なるべく早く両方の人事・総務の担当者に伝えましょう。

すでに普通徴収に切り替わったあとでも、次の会社を通して、普通徴収から特別徴収（給料からの天引き）に切り替える手続きがあります。どの月の分から切り替えられるかは、市区町村や次の会社の担当者に確認しましょう。

## 辞める前に確認しておくこと

- 退職日が何月か（6月〜12月か、1月〜4月か）
- 6月〜12月に辞めるなら、残りを一括で引いてもらうか、普通徴収にするか
- 次の会社が決まっていれば、そこで天引きを続けてもらうか
- 最後の給料の手取りと、辞めたあとの生活費の見通し

転職した年に手取りが思ったより少なく感じる理由は、[手取り20万円から転職を考えるとき、何を比べればいい？](/articles/tedori-20man-hikaku)でも紹介しています。辞める前の確認の全体は[今の仕事を辞めたいとき、先に確認しておきたいこと](/articles/yametai-mae-kakunin)を見てください。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-07'::timestamptz, '退職後の住民税の払い方｜普通徴収への切り替えと退職時期の違い', '会社を辞めると、給料から引かれていた住民税の払い方が変わります。1月〜4月の退職は残りを一括で、6月〜12月の退職は自分で払う普通徴収か一括かを選ぶのが基本です。転職先で天引きを続ける方法もあわせて整理しました。', array['tedori-20man-hikaku', 'yametai-mae-kakunin', 'nenshu-300man-tenshoku']::text[], '{}'::text[], array['yametai', 'kyuryo']::text[], array['hajimete']::text[], array['辞めたあとの', '住民税はどう払う？']::text[], null, false, '[{"q":"会社を辞めて収入がなくなっても、住民税は払うのですか？","a":"払います。住民税は前の年の所得をもとに計算されるため、辞めたあとも、前の年に働いていた分の住民税がかかります。払うのが難しいときは、住んでいる市区町村の税の窓口に早めに相談しましょう。"},{"q":"次の会社が決まっています。住民税はどうすればいいですか？","a":"前の会社と次の会社の両方に「住民税を次の会社で引き続き給料から引いてほしい」と伝えましょう。前の会社が給与所得者異動届出書を作って次の会社に送り、次の会社が市区町村に出すと、残りの分を次の会社の給料から引いてもらえます。"},{"q":"普通徴収の納付書はいつ届きますか？","a":"会社が市区町村に退職の届出（給与所得者異動届出書）を出したあと、市区町村から納税通知書が届きます。届く時期や納期限は市区町村によって違うので、退職から時間がたっても届かないときは、住んでいる市区町村の税の窓口に問い合わせましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「いつ辞めるか」と「次の会社が決まっているか」の2つで払い方が分かれることを、絶対的な月日で示す。滞納をあおらず、払えないときの相談先を示す","quotes":[{"source_url":"https://www.tax.metro.tokyo.lg.jp/kazei/life/kojin_ju/tokubetsu/tetsuzuki","text":"6月1日から12月31日までに退職等をした場合、残りの税額は普通徴収に切り替わる。従業員から申し出があれば未徴収税額を給与や退職金等から一括して特別徴収する。翌年1月1日から4月30日までに退職等をした場合、5月31日までに支給される給与・退職金等が残りの税額を超えるときは、申し出がなくても一括して特別徴収する","used_in":"6月〜12月に辞めた場合 / 1月〜5月に辞めた場合"},{"source_url":"https://www.city.yokohama.lg.jp/faq/kukyoku/zaisei/hojin-kazei/20230227132420610.html","text":"給与所得者異動届出書の給与支払者欄は異動前の勤務先、新しい勤務先欄は異動後の勤務先が記入し、異動後の勤務先から提出する。異動前の勤務先で徴収できなくなった月割額を新勤務先で引き続き特別徴収できる","used_in":"次の会社で給料からの天引きを続ける方法"},{"source_url":"https://www.city.yokohama.lg.jp/kurashi/koseki-zei-hoken/zeikin/y-shizei/kojin-shiminzei-kenminzei/kojin-shiminzei-shosai/shinkokunouzei.html","text":"普通徴収は、6月初旬に送られる税額決定・納税通知書により、6月、8月、10月、翌年1月の4回の納期に分けて納める","used_in":"自分で払う「普通徴収」とは"}],"not_used":["年度の途中で普通徴収に切り替わった場合の具体的な納期は、市区町村によって違い一律の情報を確認できなかったため書かない（通知書で確認するよう書いた）","住民税の減免や徴収猶予の条件は市区町村ごとに違うため、具体的には書かず窓口への相談をすすめた","異動届出書の提出期限（翌月10日など）は会社側の手続きなので、読者向けには「会社が届け出る」とだけ書いた"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'taishoku-juminzei' and c.slug = 'seido' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'taishoku-juminzei' and c.slug = 'hatarakikata' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '個人住民税と特別徴収について（個人住民税の特別徴収推進ステーション）', '東京都主税局', 'https://www.tax.metro.tokyo.lg.jp/kazei/life/kojin_ju/tokubetsu/about', '2026-10-07'::date, '特別徴収は会社が毎月の給与から住民税を差し引いて納めるしくみで、6月から翌年5月までの12回に分けて差し引くこと。所得割は前年の所得に応じて課税されること', 0 from articles where slug = 'taishoku-juminzei';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '個人住民税（暮らしと税金）', '東京都主税局', 'https://www.tax.metro.tokyo.lg.jp/kazei/life/kojin_ju', '2026-10-07'::date, '1月1日現在に住所がある人に、前年の所得をもとに課税されること', 1 from articles where slug = 'taishoku-juminzei';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '特別徴収にかかる手続きについて（個人住民税の特別徴収推進ステーション）', '東京都主税局', 'https://www.tax.metro.tokyo.lg.jp/kazei/life/kojin_ju/tokubetsu/tetsuzuki', '2026-10-07'::date, '6月1日から12月31日の退職は残りを普通徴収に切り替え（本人の申出があれば一括徴収）、1月1日から4月30日の退職は5月31日までに支払う給与・退職手当等が残りの税額を超える場合は申出がなくても一括徴収すること。転職先で引き続き特別徴収する場合は新しい事業主を経由して給与所得者異動届出書を出すこと', 2 from articles where slug = 'taishoku-juminzei';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '退職・転勤などがあった場合（給与所得者異動届出書の提出）', '大阪市', 'https://www.city.osaka.lg.jp/zaisei/page/0000098571.html', '2026-10-07'::date, '退職などの異動があったときは、会社が給与所得者異動届出書を市区町村に提出すること', 3 from articles where slug = 'taishoku-juminzei';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '現在、個人住民税が特別徴収されている従業員が、転勤先または再就職先で引き続き特別徴収を希望する場合、どのような手続が必要ですか。', '横浜市', 'https://www.city.yokohama.lg.jp/faq/kukyoku/zaisei/hojin-kazei/20230227132420610.html', '2026-10-07'::date, '異動届出書の給与支払者欄を前の勤務先、新しい勤務先欄を次の勤務先が書き、次の勤務先から提出すると、前の勤務先で引けなくなった月割額を次の勤務先で特別徴収できること', 4 from articles where slug = 'taishoku-juminzei';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '入社等で個人住民税を普通徴収から特別徴収へ切り替える場合、どのような手続が必要ですか。', '横浜市', 'https://www.city.yokohama.lg.jp/faq/kukyoku/somu/hojin-kazei/20230227131711811.html', '2026-10-07'::date, '入社などで普通徴収から特別徴収へ切り替える手続きがあること', 5 from articles where slug = 'taishoku-juminzei';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '納税の方法（個人の市民税・県民税）', '横浜市', 'https://www.city.yokohama.lg.jp/kurashi/koseki-zei-hoken/zeikin/y-shizei/kojin-shiminzei-kenminzei/kojin-shiminzei-shosai/shinkokunouzei.html', '2026-10-07'::date, '普通徴収は税額決定・納税通知書により、6月、8月、10月、翌年1月の4回の納期に分けて本人が納めること（横浜市の例）', 6 from articles where slug = 'taishoku-juminzei';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'taishoku-juminzei' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"5fb52428142082270a815cad8e98b29f9b12af810e5582a89ac2901429fa4256","findings":[]}'::jsonb from articles where slug = 'taishoku-juminzei';
update articles set status = 'published' where slug = 'taishoku-juminzei';

-- article: taishoku-kakutei-shinkoku (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('taishoku-kakutei-shinkoku', 'article', '年の途中で退職して年内に再就職しなかったら？確定申告（還付申告）の流れと必要な書類', '年の途中で辞めて、その年のうちに次の会社に入らなかった人は、年末調整を受けていないため、所得税を納めすぎている場合があります。翌年1月1日から5年間出せる還付申告のしくみ、源泉徴収票など必要な書類、失業手当や退職金の扱い、作成コーナーでの入力の流れを紹介します。', '年の途中で会社を辞めて、その年のうちには次の会社に入らなかった。そんな年は、**翌年に確定申告をすると、納めすぎた所得税が戻ってくる場合があります**。

会社員のときは、会社が年末調整で税金の精算をしてくれていました。でも、年の途中で辞めて年内に再就職しなかった人は、どこの会社でも年末調整を受けません。そのぶんを、自分で確定申告して精算します。

この記事で分かること：

- なぜ税金が**戻る場合がある**のか
- 申告は**いつから、いつまで**出せるか
- **そろえる書類**（源泉徴収票など）
- **失業手当・退職金・国民年金**の扱い
- 確定申告書等作成コーナーでの**入力の流れ**

年内に次の会社に入った人は、新しい会社で年末調整を受けるのが基本です。その場合の手続きは[転職した年の年末調整と確定申告](/articles/tenshoku-nenmatsu-chosei)で紹介しています。

## なぜ税金が戻る場合があるの？

毎月の給料から引かれている所得税は、「1年間この給料で働き続ける」という見込みで計算されています。年末調整では、実際の1年分の収入や控除をもとに、最終的な税額を計算し直して精算します。

年の途中で辞めると、

- 辞めたあとの月は給料がないので、1年分の収入は見込みより少なくなる
- 辞めたあとに自分で払った国民年金や国民健康保険の保険料も、控除（税金を計算するときに収入から差し引けるもの）の対象になる

といった理由で、毎月引かれていた所得税が**納めすぎになっている場合があります**。年内に再就職しなかった人は年末調整を受けないので、この納めすぎを確定申告で返してもらいます。この申告を**還付申告**といいます。

ただし、源泉徴収票の「源泉徴収税額」が0円なら、もともと所得税を納めていないので、戻ってくる税金はありません。

## いつから、いつまで出せる？

還付申告は、**確定申告の期間とは関係なく、辞めた年の翌年1月1日から5年間**出せます。

たとえば、2026年8月末に辞めて、2026年中は次の会社に入らなかった場合：

- 出せるのは：2027年1月1日から
- 期限は：2031年12月31日まで

5年間あるとはいえ、書類をなくしたり、忘れたりしやすくなります。書類がそろったら、早めに出しておきましょう。

```figure
type: steps
title: 還付申告の流れ
items:
  - label: 書類をそろえる
    text: 源泉徴収票と、辞めたあとに払った保険料の分かるもの
  - label: 申告書を作る
    text: 確定申告書等作成コーナーで画面の案内に沿って入力
  - label: 提出する
    text: e-Tax で送信するか、印刷して税務署に出す
  - label: 還付を受ける
    text: 指定した本人名義の口座に振り込まれる
```

## そろえる書類

```figure
type: checklist
title: 還付申告の前にそろえるもの
items:
  - 前の会社の源泉徴収票
  - 国民年金の保険料の控除証明書
  - 国民健康保険の保険料を払った金額が分かるもの
  - 退職金をもらった人は退職所得の源泉徴収票
  - マイナンバーが分かるもの
  - 還付金を受け取る本人名義の口座
```

### 源泉徴収票

一番大事なのが、**前の会社の源泉徴収票**です。その年にいくら給料をもらって、いくら所得税が引かれたかが書かれています。

会社は、年の途中で辞めた人に、**退職の日から1か月以内**に源泉徴収票を渡すことになっています。届かないときは、前の会社の人事・総務に連絡しましょう。その年に、ほかにも給料をもらった会社（アルバイトを含む）があれば、その会社の源泉徴収票も用意します。

退職のときに受け取る書類全体は、[退職するときに受け取る書類・返す書類](/articles/taishoku-shorui)にまとめています。

### 辞めたあとに払った保険料の分かるもの

辞めたあとに自分で払った保険料は、**社会保険料控除**の対象です。申告すると、税金が少なくなり、戻る額が増える場合があります。

- **国民年金の保険料**：日本年金機構から届く「社会保険料（国民年金保険料）控除証明書」を、申告書に添付するか、提出するときに見せる必要があります。e-Tax で出す場合は、証明書の内容を入力して送信すれば、添付を省略できます
- **国民健康保険の保険料（税）**：払った金額を入力します。金額は、市区町村から届いた納付書や領収書、口座振替の記録などで確認しましょう
- **任意継続の健康保険の保険料**：これも社会保険料控除の対象です。払った金額を確認しておきます

払った金額は、その年の1月1日から12月31日までに**実際に払った分**です。

## 失業手当と退職金はどうする？

### 失業手当（基本手当）は申告に入れない

雇用保険の基本手当などの求職者給付は、**所得税がかからない（非課税の）もの**です。確定申告の収入には入れません。ハローワークから受け取った金額を書く欄を探す必要はありません。

失業手当のしくみは、[退職後の失業手当はもらえる？](/articles/shitsugyo-teate-kihon)で紹介しています。

### 退職金は「申告書」を出したかどうかで変わる

退職金は、給料とは別に税金を計算します。

- 退職金を受け取るときに「**退職所得の受給に関する申告書**」を会社に出していれば、会社が税金を計算して源泉徴収しているので、原則として退職金について確定申告をする必要はありません
- この申告書を出していなかった場合は、退職金の20.42%が一律に源泉徴収されています。この場合は確定申告で精算します

自分が申告書を出したか分からないときは、退職所得の源泉徴収票を見たり、前の会社に聞いたりして確かめましょう。給料の還付申告で退職金をどう扱うかは、作成コーナーの案内に沿って入力するか、税務署で確認してください。

## 作成コーナーでの入力の流れ

国税庁のホームページの「**確定申告書等作成コーナー**」では、画面の案内に沿って入力すると、税額の計算もしてくれます。おおまかな流れは次のとおりです。

1. 作成する申告書の年分を選ぶ（2026年に辞めたなら「令和8年分」）
2. 提出方法を選ぶ（マイナンバーカードを使った e-Tax、または印刷して提出）
3. 「給与所得」の欄に、源泉徴収票の「支払金額」「源泉徴収税額」「社会保険料等の金額」などを、そのまま写す
4. 「社会保険料控除」の欄に、辞めたあとに自分で払った国民年金・国民健康保険の保険料を入力する
5. 計算結果で、戻ってくる金額（還付される税金）を確認する
6. 還付金を受け取る口座を入力して、提出する

源泉徴収票の欄と、作成コーナーの入力欄は名前がほぼ同じなので、横に並べて1つずつ写していくと迷いにくくなります。分からないところは、住んでいる地域の税務署に相談しましょう。

## 住民税は別に届く

所得税の還付申告とは別に、**住民税**は前の年の所得をもとに、市区町村から納付書が届いて払うことがあります。辞めた年の翌年は収入が少なくても住民税の支払いがあるので、お金の準備をしておきましょう。くわしくは[退職したあとの住民税はどう払う？](/articles/taishoku-juminzei)で紹介しています。

## チェックリスト：辞める前・辞めたあと

辞める前：

- 源泉徴収票をいつ、どうやって受け取れるか（郵送なら送り先の住所）
- 退職金がある場合、「退職所得の受給に関する申告書」を出すかどうか

辞めたあと：

- 国民年金の控除証明書が届いたら保管する
- 国民健康保険の保険料の領収書や納付の記録を保管する
- 年内に次の会社に入ったかどうか（入ったなら、新しい会社で年末調整を受ける）', 'review', false, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '退職後に再就職しなかった年の確定申告｜還付申告と必要書類', '年の途中で退職し、年内に再就職しなかったときの確定申告（還付申告）を紹介します。税金が戻る場合があるしくみ、翌年1月1日から5年間という申告できる期間、源泉徴収票や国民年金の控除証明書など必要な書類、失業手当や退職金の扱いが分かります。', array['tenshoku-nenmatsu-chosei', 'taishoku-shorui', 'taishoku-juminzei', 'kokumin-nenkin-menjo']::text[], '{}'::text[], array['yametai']::text[], array['hajimete']::text[], array['辞めた年の税金、', '戻ってくるかも？']::text[], null, false, '[{"q":"確定申告は3月15日までに出さないといけませんか？","a":"納めすぎた税金を返してもらうための申告（還付申告）は、確定申告の期間とは関係なく、その年の翌年1月1日から5年間出せます。たとえば2026年に辞めて年内に再就職しなかった場合は、2027年1月1日から2031年12月31日まで出せます。ただし、書類がそろったら早めに出しておくと安心です。"},{"q":"失業手当（基本手当）も申告に入れる必要がありますか？","a":"雇用保険の基本手当などの求職者給付は、所得税がかからない（非課税の）ものなので、確定申告の所得には入れません。申告に書くのは、辞めた会社からもらった給料など、源泉徴収票に書かれている金額です。"},{"q":"前の会社から源泉徴収票が届きません。どうすればいいですか？","a":"まずは前の会社の人事・総務の担当者に、送ってもらえるよう連絡しましょう。会社は、年の途中で退職した人に、退職の日から1か月以内に源泉徴収票を渡すことになっています。連絡しても受け取れないときは、住んでいる地域の税務署に相談しましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"既存の tenshoku-nenmatsu-chosei は「年内に再就職したら年末調整」が中心で、再就職しなかった場合の確定申告は概要だけ。この記事はその後者に絞り、なぜ戻る場合があるのか、いつから出せるか、そろえる書類、失業手当・退職金・国民年金の扱い、作成コーナーで入力する順番まで、手を動かせる形で書く","quotes":[{"source_url":"https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1910.htm","text":"中途退職したまま再就職しない場合は年末調整を受けられないため、所得税及び復興特別所得税が納め過ぎとなっている場合がある。中途退職した年の翌年以降に確定申告をすれば還付を受けられる（nta.go.jp に直接接続できなかったため、検索結果に表示された内容で確認）","used_in":"なぜ税金が戻る場合があるの？"},{"source_url":"https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2030.htm","text":"還付申告書は、確定申告期間とは関係なく、その年の翌年1月1日から5年間提出することができる。令和7年分は令和8年1月1日から令和12年12月31日まで。源泉徴収税額がない場合は還付はない（検索結果で確認）","used_in":"いつから、いつまで出せる？"},{"source_url":"https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1130.htm","text":"国民健康保険の保険料（税）や国民年金保険料は社会保険料控除の対象。国民年金保険料・国民年金基金の掛金は、その金額を証する書類を確定申告書に添付するか、提出時に提示する必要がある（検索結果で確認）","used_in":"そろえる書類"},{"source_url":"https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1420.htm","text":"退職所得の受給に関する申告書を提出している場合は、支払者が所得税額を計算して源泉徴収するため原則として確定申告は不要。提出していない場合は支払金額の20.42%が源泉徴収され、確定申告で精算する（検索結果で確認）","used_in":"失業手当と退職金はどうする？"},{"source_url":"https://www.keisan.nta.go.jp/r3yokuaru/cat2/cat22/cat22a/cid021.html","text":"雇用保険法の規定に基づき支給される求職者給付は、同法第10条に規定する失業等給付に該当し、同法第12条の規定により課税されない（検索結果で確認）","used_in":"失業手当と退職金はどうする？"},{"source_url":"https://www.nta.go.jp/taxes/shiraberu/taxanswer/hotei/7411.htm","text":"給与所得の源泉徴収票は、年の中途で退職した人には退職の日以後1か月以内に交付しなければならない（既存記事 tenshoku-nenmatsu-chosei の出典。検索結果で確認）","used_in":"FAQ（源泉徴収票が届かない）"}],"not_used":["還付される金額の目安は、給料の額や控除で人によって大きく変わるため書かない","2025年分からの基礎控除・給与所得控除の見直しの具体的な金額は、年分によって変わり読者が自分で計算しにくいため書かず、作成コーナーで計算する流れを示した","医療費控除やふるさと納税（寄附金控除）は、退職と直接関係しないため扱わない","住民税は所得税と別のしくみのため、既存記事 taishoku-juminzei へのリンクにとどめた"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'taishoku-kakutei-shinkoku' and c.slug = 'seido' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'taishoku-kakutei-shinkoku' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'No.1910 中途退職で年末調整を受けていないとき', '国税庁', 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1910.htm', '2026-10-09'::date, '中途退職したまま再就職しない場合は年末調整を受けられず、所得税を納めすぎている場合があること、翌年以降に確定申告をすると還付を受けられること', 0 from articles where slug = 'taishoku-kakutei-shinkoku';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'No.2030 還付申告', '国税庁', 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2030.htm', '2026-10-09'::date, '還付申告は確定申告期間とは関係なく、その年の翌年1月1日から5年間提出できること。源泉徴収税額がなければ還付はないこと', 1 from articles where slug = 'taishoku-kakutei-shinkoku';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'No.1130 社会保険料控除', '国税庁', 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1130.htm', '2026-10-09'::date, '退職後に自分で払った国民健康保険料・国民年金保険料が社会保険料控除の対象になること、国民年金保険料は証明する書類の添付か提示が必要なこと', 2 from articles where slug = 'taishoku-kakutei-shinkoku';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'No.1420 退職金を受け取ったとき（退職所得）', '国税庁', 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1420.htm', '2026-10-09'::date, '退職所得の受給に関する申告書を出していれば原則として確定申告は不要で、出していない場合は20.42%が源泉徴収され確定申告で精算すること', 3 from articles where slug = 'taishoku-kakutei-shinkoku';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '雇用保険法上の求職者給付を受給している配偶者（確定申告書等作成コーナー よくある質問）', '国税庁', 'https://www.keisan.nta.go.jp/r3yokuaru/cat2/cat22/cat22a/cid021.html', '2026-10-09'::date, '雇用保険の求職者給付は雇用保険法の規定により課税されないこと', 4 from articles where slug = 'taishoku-kakutei-shinkoku';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'taishoku-kakutei-shinkoku' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"c4478e7180970ddc469ab67e64f8e8fc0643e6e7aabad0223d0d4aef16fb04e5","findings":[]}'::jsonb from articles where slug = 'taishoku-kakutei-shinkoku';
update articles set status = 'published' where slug = 'taishoku-kakutei-shinkoku';

-- article: taishoku-kenko-hoken (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('taishoku-kenko-hoken', 'article', '退職後の健康保険はどうする？任意継続・国民健康保険・家族の扶養の選び方', '会社を辞めて次の会社に入るまで間が空くときは、健康保険を自分で選んで手続きします。任意継続・国民健康保険・家族の扶養の3つについて、入れる条件、手続きの期限と窓口、保険料の比べ方を整理します。', '会社を辞めてから次の会社に入るまで、少しでも間が空くなら、その間の健康保険を自分で選んで手続きする必要があります。選べるのは次の3つです。

**この記事で分かること**

- 退職後の健康保険は「任意継続」「国民健康保険」「家族の扶養」の3つから選ぶ
- 任意継続は資格喪失日から20日以内、国民健康保険は14日以内が手続きの期限
- どれが安いかは人によって違う。保険料はそれぞれの窓口で金額を確かめて比べる

退職日の翌日に次の会社に入るなど、間を空けずに次の会社の健康保険に入る場合は、ここで紹介する手続きはいりません。

## 退職したら、健康保険はどうなる？

会社の健康保険は、退職日の翌日に資格がなくなります。この日を「資格喪失日」といいます。たとえば9月30日に退職したなら、10月1日が資格喪失日です。

資格がなくなったあとも、病院で保険診療を受けるには、どこかの健康保険に入っている必要があります。次の会社に入るまでの間は、次の3つのうちどれかに入ります。

| 選択肢 | どんな保険？ | 手続きの窓口 |
| --- | --- | --- |
| 任意継続 | 辞めた会社で入っていた健康保険を、個人で続ける | 協会けんぽの都道府県支部（健康保険組合の場合は組合） |
| 国民健康保険 | 住んでいる市区町村の健康保険 | 市区町村の国民健康保険の窓口 |
| 家族の扶養 | 家族が会社で入っている健康保険に、被扶養者として入る | 家族の勤め先 |

```figure
type: compare
style: vs
title: 退職後の健康保険3つの選択肢
columns:
  - label: 任意継続
    tone: mint
    items:
      - 2か月以上入っていた人
      - 資格喪失日から20日以内に申し出る
      - 加入は2年間
  - label: 国民健康保険
    tone: sky
    items:
      - 14日以内に市区町村へ届け出る
      - 保険料は前の年の所得などで決まる
  - label: 家族の扶養
    tone: sand
    items:
      - 年間収入130万円未満などの条件
      - 家族の勤め先を通して届け出る
```

## 任意継続：今の健康保険を続ける

任意継続は、辞めた会社で入っていた健康保険に、個人として最長2年間入り続けるしくみです。ここでは、多くの会社が入っている協会けんぽの場合を説明します。

**入れる条件（協会けんぽの場合）**

- 資格喪失日の前日までに、健康保険に続けて2か月以上入っていたこと
- 資格喪失日から20日以内に「任意継続被保険者資格取得申出書」を出すこと（20日目が土日・祝日なら翌営業日まで）

20日を過ぎると、原則として任意継続には入れません。迷っているなら、退職前に書類を用意しておくと間に合わせやすくなります。

**保険料の決まり方**

- 退職したときの標準報酬月額（給料を区切りのいい金額に当てはめたもの）に、住んでいる都道府県の保険料率をかけて計算します
- 標準報酬月額には上限があり、退職したときの額と、協会けんぽ全体の平均をもとに決まる額のうち、低いほうが使われます。上限の額は年度ごとに協会けんぽが案内しています
- 会社で働いていたときは会社と半分ずつ負担していましたが、任意継続では**全額を自分で払います**
- 保険料は、原則として2年間変わりません

健康保険組合に入っていた人は、保険料の決まり方などが組合によって違うことがあります。辞める前に、組合の案内を確認しておきましょう。

## 国民健康保険：市区町村の保険に入る

国民健康保険は、住んでいる市区町村が運営する健康保険です。会社の健康保険の資格がなくなった日（退職日の翌日）から加入することになります。

**手続き**

- 期限：健康保険の資格がなくなってから14日以内
- 窓口：住んでいる市区町村の国民健康保険の窓口（郵送やオンラインで受け付ける市区町村もあります）
- 必要なもの：健康保険の資格がなくなった日が分かる書類（健康保険資格喪失証明書など）と本人確認書類。何が必要かは市区町村によって違うので、ホームページで確認しましょう

**保険料の決まり方**

国民健康保険の保険料は、前の年の所得や世帯の人数などをもとに、市区町村ごとの計算方法で決まります。会社で働いていた前の年の収入をもとに計算されるため、辞めた直後は「思ったより高い」と感じることがあります。多くの市区町村では、窓口やホームページで保険料の目安を試算できます。

**会社の倒産や解雇などで辞めた場合**

倒産・解雇・雇い止めなどで離職し、雇用保険で「特定受給資格者」「特定理由離職者」にあたる人は、届け出ると、前の年の給与所得を100分の30とみなして保険料を計算する軽減があります。対象かどうかは、ハローワークで受け取る雇用保険受給資格者証などに書かれた離職理由で決まります。届出が必要なので、市区町村の窓口に確認しましょう。

## 家族の扶養：家族の健康保険に入る

親や配偶者などが会社の健康保険に入っていれば、その被扶養者になれることがあります。被扶養者は、自分で保険料を払う必要がありません。

**主な収入の条件**

- 年間収入が130万円未満であること
- 2025年10月1日以降は、19歳以上23歳未満の人（被保険者の配偶者を除く）は150万円未満
- 家族と同じ世帯に住んでいる場合は、その家族の年間収入の2分の1未満であること（別に住んでいる場合は、家族からの仕送りの額より少ないこと）

ここでいう年間収入は、過去の収入ではなく、**これから先1年間に見込まれる収入**です。雇用保険の基本手当（いわゆる失業手当）を受け取る場合は、その金額も収入として見られることがあります。

手続きは家族の勤め先を通して行います。健康保険組合によって確認のしかたや必要な書類が違うので、家族に頼んで勤め先に確認してもらいましょう。

## 保険料はどう比べる？

どれがいちばん安いかは、前の年の収入、住んでいる市区町村、家族の人数などで変わるため、一律には言えません。次の順番で、自分の場合の金額を確かめるのが確実です。

```figure
type: steps
title: 退職後の健康保険の選び方
items:
  - label: 家族の扶養に入れるか
    text: 入れるなら保険料はかからない。家族の勤め先に条件を確認
  - label: 任意継続の保険料を確かめる
    text: 協会けんぽの支部か、健康保険組合に問い合わせる
  - label: 国民健康保険の保険料を確かめる
    text: 市区町村の窓口やホームページの試算で目安を出す
  - label: 期限までに手続きする
    text: 任意継続は20日以内、国民健康保険は14日以内
```

比べるときは、次の点もあわせて考えておきましょう。

- **次の会社に入るまでの期間**：短い間だけなら、手続きの手間も含めて考える
- **保険料が変わるタイミング**：任意継続は原則2年間同じ額、国民健康保険は前の年の所得をもとに年度ごとに計算し直される
- **家族の分**：任意継続では、扶養している家族の分の保険料はかからない。国民健康保険では、加入する人数に応じた保険料がかかる

協会けんぽの任意継続は、本人が申し出れば、申出が受け付けられた月の翌月1日に資格がなくなります。はじめに任意継続を選び、あとで国民健康保険や家族の扶養に移ることもできます。

## 退職前にやっておくこと

- 会社に、健康保険資格喪失証明書をいつ、どうやってもらえるかを聞いておく
- 任意継続を考えているなら、申出書の書き方と提出先を確認しておく
- 住んでいる市区町村の国民健康保険の保険料の目安を調べておく
- 家族の扶養に入れそうなら、家族の勤め先の条件を確認してもらう

年金や住民税の手続きも同じ時期に必要になります。辞める前に確認しておきたいことの全体は[今の仕事を辞めたいとき、先に確認しておきたいこと](/articles/yametai-mae-kakunin)で紹介しています。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-07'::timestamptz, '退職後の健康保険｜任意継続・国保・扶養の条件と期限、比べ方', '会社を辞めたあとの健康保険は、任意継続・国民健康保険・家族の扶養の3つから選びます。それぞれの入れる条件、20日以内・14日以内といった手続きの期限、保険料の確かめ方と比べ方を、はじめて転職する人向けに整理しました。', array['yametai-mae-kakunin', 'tedori-20man-hikaku', 'news-koyou-hoken-kyufu-seigen']::text[], '{}'::text[], array['yametai']::text[], array['hajimete']::text[], array['辞めたあとの', '健康保険はどれにする？']::text[], null, false, '[{"q":"退職日の翌日に次の会社に入る場合も、手続きは必要ですか？","a":"間を空けずに次の会社の健康保険に入る場合は、任意継続や国民健康保険の手続きはいりません。次の会社で健康保険に入る手続きをしてもらいます。1日でも空く場合は、その間の健康保険をどうするかを決めておきましょう。"},{"q":"任意継続と国民健康保険、どちらが安いですか？","a":"人によって違います。任意継続の保険料は退職したときの標準報酬月額などで決まり、国民健康保険の保険料は前の年の所得や住んでいる市区町村、世帯の人数などで決まるためです。両方の金額をそれぞれの窓口で確かめてから決めましょう。"},{"q":"任意継続に入ったあと、途中で国民健康保険や家族の扶養に移れますか？","a":"協会けんぽの任意継続では、本人が申し出れば、申出が受け付けられた月の翌月1日に資格がなくなります。そのあと、国民健康保険や家族の扶養に入る手続きをします。加入している健康保険が健康保険組合の場合は、組合に確認しましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"3つの選択肢を「入れる条件」「期限と窓口」「保険料の決まり方」の同じ軸で並べ、どれが得かは断定せずに金額を確かめる先を示す","quotes":[{"source_url":"https://www.kyoukaikenpo.or.jp/faq/voluntary_continuation/002/index.html","text":"資格喪失日の前日までに被保険者期間が継続して2か月以上あること。資格喪失日（退職日の翌日等）から20日（20日目が土日・祝日の場合は翌営業日）以内に任意継続被保険者資格取得申出書を提出すること","used_in":"任意継続：今の健康保険を続ける"},{"source_url":"https://www.kyoukaikenpo.or.jp/faq/voluntary_continuation/005/index.html","text":"退職時の標準報酬月額に住所地の都道府県の保険料率をかけた額。上限がある。在職中は事業所と本人で半分ずつだったが、退職後は全額本人負担。保険料は原則2年間変わらない","used_in":"任意継続：今の健康保険を続ける"},{"source_url":"https://www.kyoukaikenpo.or.jp/faq/voluntary_continuation/009/index.html","text":"任意継続をやめたい旨を申し出た場合、申出が受理された日の属する月の翌月1日に資格を喪失する","used_in":"よくある質問"},{"source_url":"https://www.mhlw.go.jp/stf/newpage_21539.html","text":"国民健康保険の被保険者となったとき、脱退するときなどは、14日以内に、お住まいの市町村の国民健康保険の窓口まで関係書類を提出する","used_in":"国民健康保険：市区町村の保険に入る"},{"source_url":"https://www.city.setagaya.lg.jp/02060/online_tetsuzuki/10679.html","text":"雇用保険受給資格者証等の離職理由コードが特定受給資格者・特定理由離職者にあたる人は、届出により前年の給与所得を100分の30とみなして保険料を計算する。対象期間は離職日の翌日の属する月から翌年度末まで","used_in":"国民健康保険：市区町村の保険に入る"},{"source_url":"https://www.nenkin.go.jp/oshirase/taisetu/2025/202508/0819.html","text":"扶養認定日が令和7年10月1日以降で、19歳以上23歳未満（被保険者の配偶者を除く）の場合、年間収入要件が130万円未満から150万円未満に変わる。年齢は扶養認定日の属する年の12月31日時点で判定","used_in":"家族の扶養：家族の健康保険に入る"}],"not_used":["令和8年度の任意継続の標準報酬月額の上限額は、検索結果の説明で前年度との関係がはっきり確かめられなかったため、具体的な金額は書かない（上限があることと、確認先だけを書く）","雇用保険の基本手当の日額による扶養の判断の目安額は、出典ページを特定できなかったため書かない","健康保険組合ごとの任意継続の保険料の決め方は組合によって違うため、具体的には書かず「組合に確認」とした"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'taishoku-kenko-hoken' and c.slug = 'seido' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'taishoku-kenko-hoken' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '退職後の健康保険について（よくあるご質問）', '全国健康保険協会（協会けんぽ）', 'https://www.kyoukaikenpo.or.jp/faq/voluntary_continuation/001/index.html', '2026-10-07'::date, '退職後は任意継続・国民健康保険・家族の健康保険（被扶養者）のいずれかに入る手続きが必要なこと、任意継続では扶養家族の分の保険料はかからないこと', 0 from articles where slug = 'taishoku-kenko-hoken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '任意継続の加入条件について（よくあるご質問）', '全国健康保険協会（協会けんぽ）', 'https://www.kyoukaikenpo.or.jp/faq/voluntary_continuation/002/index.html', '2026-10-07'::date, '任意継続の条件（資格喪失日の前日までに継続して2か月以上の被保険者期間、資格喪失日から20日以内の申出）', 1 from articles where slug = 'taishoku-kenko-hoken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '加入期間について（よくあるご質問）', '全国健康保険協会（協会けんぽ）', 'https://www.kyoukaikenpo.or.jp/faq/voluntary_continuation/004/index.html', '2026-10-07'::date, '任意継続の加入期間が2年間であること', 2 from articles where slug = 'taishoku-kenko-hoken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '保険料について（よくあるご質問）', '全国健康保険協会（協会けんぽ）', 'https://www.kyoukaikenpo.or.jp/faq/voluntary_continuation/005/index.html', '2026-10-07'::date, '任意継続の保険料は退職時の標準報酬月額に都道府県の保険料率をかけて計算し、上限があること、退職後は全額自己負担になること、原則2年間変わらないこと', 3 from articles where slug = 'taishoku-kenko-hoken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '【健康保険】令和8年度の任意継続被保険者の標準報酬月額の上限について', '全国健康保険協会（協会けんぽ）', 'https://www.kyoukaikenpo.or.jp/news/r07_dec/1259.html', '2026-10-07'::date, '任意継続の標準報酬月額は、退職時の標準報酬月額と、協会けんぽ全体の平均をもとにした額のうち低いほうになること', 4 from articles where slug = 'taishoku-kenko-hoken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '資格の喪失について（よくあるご質問）', '全国健康保険協会（協会けんぽ）', 'https://www.kyoukaikenpo.or.jp/faq/voluntary_continuation/009/index.html', '2026-10-07'::date, '任意継続を本人の申出でやめる場合、申出が受け付けられた月の翌月1日に資格を失うこと', 5 from articles where slug = 'taishoku-kenko-hoken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '国民健康保険の加入・脱退について', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_21539.html', '2026-10-07'::date, '国民健康保険に入るときは14日以内に住所地の市町村の窓口へ届け出ること', 6 from articles where slug = 'taishoku-kenko-hoken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '手続きに必要なもの（こんなときは忘れず届出を）', '横浜市', 'https://www.city.yokohama.lg.jp/kurashi/koseki-zei-hoken/kokuho/todokede/process.html', '2026-10-07'::date, '国民健康保険は健康保険の資格喪失日（退職日の翌日）から加入すること、健康保険資格喪失証明書と本人確認書類が必要なこと（横浜市の例）', 7 from articles where slug = 'taishoku-kenko-hoken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '国民健康保険料の算出について、前年の収入状況を基準とするのはなぜですか？', '横浜市港北区', 'https://www.city.yokohama.lg.jp/kohoku/madoguchi-shisetsu/kuyakusho/qa/todokede/kokuho/qa1002015.html', '2026-10-07'::date, '国民健康保険料は前年の収入をもとに計算されること', 8 from articles where slug = 'taishoku-kenko-hoken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '非自発的失業者の軽減について', '世田谷区', 'https://www.city.setagaya.lg.jp/02060/online_tetsuzuki/10679.html', '2026-10-07'::date, '倒産・解雇・雇い止めなどで離職した人（特定受給資格者・特定理由離職者）は、届け出ると前年の給与所得を100分の30とみなして国民健康保険料を計算する軽減があること', 9 from articles where slug = 'taishoku-kenko-hoken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '従業員（健康保険・厚生年金保険の被保険者）が家族を被扶養者にするとき、被扶養者に異動があったときの手続き', '日本年金機構', 'https://www.nenkin.go.jp/service/kounen/tekiyo/hihokensha1/20141202.html', '2026-10-07'::date, '被扶養者の収入要件（年間収入130万円未満、同一世帯なら被保険者の年間収入の2分の1未満など）と、年間収入はこれから先の見込みで判断すること', 10 from articles where slug = 'taishoku-kenko-hoken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '19歳以上23歳未満の方の被扶養者認定における年間収入要件が変わります', '日本年金機構', 'https://www.nenkin.go.jp/oshirase/taisetu/2025/202508/0819.html', '2026-10-07'::date, '2025年10月1日以降、19歳以上23歳未満の人（被保険者の配偶者を除く）は年間収入150万円未満が要件になったこと', 11 from articles where slug = 'taishoku-kenko-hoken';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'taishoku-kenko-hoken' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"ddb2d7dbf4d28ce36eb0f41c8852559e3774f6bdb4fbea5b12a2ed1efff64f17","findings":[]}'::jsonb from articles where slug = 'taishoku-kenko-hoken';
update articles set status = 'published' where slug = 'taishoku-kenko-hoken';

-- article: taishoku-nenkin-tetsuzuki (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('taishoku-nenkin-tetsuzuki', 'article', '転職で働かない期間ができたら、年金はどうする？国民年金への切り替えと免除の相談', '会社を辞めて次の会社に入るまで間が空くときは、厚生年金から国民年金への切り替えが必要です。手続きの期限と窓口、手続きがいらない場合、保険料を払うのが難しいときの免除・納付猶予の相談のしかたを紹介します。', '会社を辞めて、次の会社に入るまで少しでも間が空く。そんなときに忘れやすいのが年金の手続きです。会社員のときは会社が手続きをしてくれていましたが、間が空く期間は自分で手続きします。

**この記事で分かること**

- 会社を辞めて次の会社に入るまで間が空くなら、国民年金への切り替えが必要
- 期限は退職日の翌日から14日以内、窓口は住んでいる市区町村
- 退職日の翌日に次の会社に入るなら、自分での手続きはいらない
- 保険料を払うのが難しいときは、失業による特例を使った免除・納付猶予を相談できる

## 会社を辞めると、年金はどう変わる？

会社員は、厚生年金に入っています。会社を辞めると、退職日の翌日に厚生年金の資格がなくなります。

次の会社にまた厚生年金で入るなら、そのまま厚生年金を続けます。一方、しばらく次の会社に入らない場合は、20歳以上60歳未満の人は**国民年金の「第1号被保険者」に切り替える手続き**をして、自分で保険料を払います。

| 辞めたあとの状況 | 必要な手続き |
| --- | --- |
| 退職日の翌日に次の会社に入る | 自分での手続きはいらない（次の会社が厚生年金の手続きをする） |
| 次の会社に入るまで間が空く | 市区町村で国民年金に切り替える |
| 家族（配偶者）の扶養に入る | 配偶者の勤め先を通して第3号被保険者の手続きをする |

## 次の会社にすぐ入るなら手続きはいらない

退職日の翌日に次の会社に入る場合、たとえば9月30日に退職して10月1日に入社するなら、国民年金に切り替える手続きはいりません。次の会社で厚生年金に入る手続きをしてもらいます。

1日でも間が空く場合は、原則として切り替えの手続きが必要です。ただし、保険料については次のように考えます。

- **退職日の翌日と入社日が同じ月の中**：たとえば9月30日に退職して10月20日に入社する場合、退職日の翌日（10月1日）と入社日がどちらも10月なので、国民年金の保険料は払わなくてよいとされています
- **月をまたぐ**：たとえば9月15日に退職して10月1日に入社する場合、退職日の翌日（9月16日）と入社日の月が違うので、9月分の国民年金の保険料が必要です

自分の場合にどうなるか分からないときは、退職日と入社日を伝えて、市区町村の国民年金の窓口で確認しましょう。

```figure
type: compare
style: vs
title: 次の会社に入る日で手続きが変わる
columns:
  - label: 退職日の翌日に入社
    tone: mint
    items:
      - 自分での手続きはいらない
      - 次の会社で厚生年金に入る
  - label: 間が空く
    tone: sand
    items:
      - 14日以内に国民年金へ切り替える
      - 月をまたぐと保険料が必要
```

## 国民年金への切り替え：期限と窓口

- **期限**：退職日の翌日から14日以内
- **窓口**：住んでいる市区町村の役所（国民年金の担当窓口）。マイナポータルから電子申請もできます
- **手続きする人**：本人か世帯主
- **必要なもの**：基礎年金番号が分かるもの（基礎年金番号通知書や年金手帳など）と、会社の年金の資格がなくなった日が分かる書類（離職票など）が必要になることがあります。何を持っていくかは、事前に市区町村のホームページで確認しましょう

**配偶者を扶養していた人は、配偶者の手続きも**

会社員に扶養されている配偶者は、国民年金の「第3号被保険者」です。扶養していた人が会社を辞めると、配偶者も第3号被保険者ではなくなるため、配偶者も第1号被保険者への届出が必要になります。

## 保険料はいくら？いつ払う？

2026年度（2026年4月〜2027年3月）の国民年金の保険料は、**月額17,920円**です。納付期限は、払う月の翌月末日です。たとえば10月分なら11月末が期限です。

払い方は、納付書のほか、口座振替やクレジットカード、スマートフォンのアプリなどから選べます。

```figure
type: steps
title: 間が空くときの年金の手続き
items:
  - label: 退職日を確かめる
    text: 次の会社の入社日と、月をまたぐかどうかを確認
  - label: 市区町村で切り替える
    text: 退職日の翌日から14日以内に国民年金へ
  - label: 保険料を払う
    text: 2026年度は月額17,920円。払うのが難しければ相談
  - label: 次の会社に入る
    text: 会社が厚生年金の手続きをする
```

## 払うのが難しいときは免除・納付猶予を相談

働かない期間は収入が減るので、保険料を払うのが難しいこともあります。そのまま払わずにいるのではなく、**免除や納付猶予を申請**しましょう。

- **免除**：保険料の全額または一部が免除される
- **納付猶予**：50歳未満の人が対象。保険料の支払いがあとまで待ってもらえる

ふだんの審査では、本人と世帯主・配偶者の前の年の所得を見ます。会社を辞めた人には**失業による特例**があり、辞めた本人の前の年の所得を除いて（ゼロとして）審査されます。世帯主や配偶者の所得が一定以下なら、免除や猶予を受けられます。

**申請のしかた**

- 窓口：住んでいる市区町村の国民年金の担当窓口、または年金事務所（郵送でも出せます）。マイナポータルからの電子申請もできます
- 失業による特例を使うとき：離職票のコピーや、ハローワークで受け取る雇用保険受給資格者証のコピーなど、辞めたことが分かる書類が必要です
- 申請が遅れたとき：保険料の納付期限から2年たっていない期間（申請する時点から2年1か月前まで）なら、さかのぼって申請できます

**免除・猶予を受けた期間はどう扱われる？**

- 年金を受け取るために必要な期間（受給資格期間）に入ります
- 全額免除の期間は、保険料を全額払った場合の2分の1が年金額に反映されます
- 納付猶予の期間は、あとから納めない限り年金額には反映されません
- 免除・猶予を受けた分は、10年以内ならあとから納める（追納する）ことができ、年金額を増やせます

自分の世帯で免除になるかどうかは、所得や家族の人数で変わります。切り替えの手続きのときに、あわせて窓口で相談するとスムーズです。

## 辞める前に確認しておくこと

- 次の会社の入社日（決まっている場合）と、退職日との間が空くか、月をまたぐか
- 基礎年金番号が分かる書類（基礎年金番号通知書や年金手帳）がどこにあるか
- 配偶者を扶養しているかどうか
- 働かない期間の生活費の見通し

辞めたあとは、健康保険の手続きも同じ時期に必要です。辞める前に確認しておきたいことは[今の仕事を辞めたいとき、先に確認しておきたいこと](/articles/yametai-mae-kakunin)、雇用保険の基本手当のことは[自己都合退職の給付制限が原則1か月に](/news/news-koyou-hoken-kyufu-seigen)で紹介しています。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-07'::timestamptz, '退職後の年金手続き｜国民年金への切り替えの期限と免除の相談', '転職で働かない期間ができるときは、退職日の翌日から14日以内に市区町村で国民年金に切り替えます。手続きがいらない場合、2026年度の保険料、払うのが難しいときの免除・納付猶予と失業による特例を、公的な情報をもとに整理しました。', array['yametai-mae-kakunin', 'tedori-20man-hikaku', 'news-koyou-hoken-kyufu-seigen', 'kokumin-nenkin-menjo']::text[], '{}'::text[], array['yametai']::text[], array['hajimete']::text[], array['辞めたあとの', '年金の手続きは？']::text[], null, false, '[{"q":"次の会社が決まっていて、間が数日だけ空きます。それでも手続きは必要ですか？","a":"退職日の翌日に次の会社に入る場合を除き、原則として国民年金に切り替える手続きが必要です。退職日の翌日と次の会社に入る日が同じ月の中なら、その月の国民年金の保険料は払わなくてよいとされています。迷ったら、住んでいる市区町村の国民年金の窓口に確認しましょう。"},{"q":"免除を受けると、将来の年金はどうなりますか？","a":"免除や納付猶予を受けた期間は、年金を受け取るために必要な期間（受給資格期間）に入ります。全額免除の期間は、保険料を全額払った場合の2分の1が年金額に反映されます。納付猶予の期間は、あとから保険料を納めない限り年金額には反映されません。"},{"q":"免除の申請を忘れていました。あとからでも申請できますか？","a":"保険料の納付期限から2年たっていない期間（申請する時点から2年1か月前まで）なら、さかのぼって申請できます。払えないまま放っておかずに、早めに相談しましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「間が空くなら切り替え」「翌日入社なら不要」「払えないなら放置せず免除・猶予を相談」の3つに分けて、期限と窓口を絶対的な日付・日数で示す","quotes":[{"source_url":"https://www.nenkin.go.jp/service/kokunen/kanyu/20140710-03.html","text":"退職日の翌日から14日以内に、住所地の市区役所または町村役場で国民年金第1号被保険者の加入手続きを行う。資格喪失日を証明できるもの（離職票等）が必要になる場合がある。厚生年金保険の適用事業所に再就職する場合は引き続き厚生年金保険に加入する","used_in":"国民年金への切り替え：期限と窓口"},{"source_url":"https://www4.city.kanazawa.lg.jp/soshikikarasagasu/iryohokenka/yokuarushitsumon/kokuminnenkin/2691.html","text":"退職日の翌日に次の勤務先に就職する場合は第1号被保険者への加入手続きは必要ない。資格喪失日と次の勤務先の資格取得日が同月内なら国民年金保険料の納付は必要ないが、月をまたいだ場合は納付が必要","used_in":"次の会社にすぐ入るなら手続きはいらない"},{"source_url":"https://www.nenkin.go.jp/service/kokunen/hokenryo/hokenryo.html","text":"令和8年度の国民年金保険料は月額17,920円。納付期限は納付対象月の翌月末日","used_in":"保険料はいくら？いつ払う？"},{"source_url":"https://www.nenkin.go.jp/service/kokunen/menjo/20150428.html","text":"失業・倒産・事業の廃止などの事実を確認できたときは、前年所得にかかわらず免除・納付猶予を受けられる特例がある。雇用保険被保険者離職票や雇用保険受給資格者証のコピーなどが必要","used_in":"払うのが難しいときは免除・納付猶予を相談"},{"source_url":"https://www.nenkin.go.jp/service/kokunen/menjo/20150402-01.html","text":"保険料の納付期限から2年を経過していない期間（申請時点から2年1か月前までの期間）について、さかのぼって免除等を申請できる","used_in":"払うのが難しいときは免除・納付猶予を相談"}],"not_used":["免除・納付猶予の所得の基準額は、世帯の人数などで変わり計算式が複雑なため書かない（窓口で確認するよう書いた）","免除の承認期間（何月から何月までか）は、今回の検索で一次情報の記述を確かめられなかったため書かない","保険料を払わずにいた場合の障害基礎年金などへの影響は、条件が複雑なため書かない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'taishoku-nenkin-tetsuzuki' and c.slug = 'seido' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'taishoku-nenkin-tetsuzuki' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '会社を退職したときの国民年金の手続き', '日本年金機構', 'https://www.nenkin.go.jp/service/kokunen/kanyu/20140710-03.html', '2026-10-07'::date, '退職してしばらく次の会社に入らない場合は国民年金第1号被保険者の手続きが必要なこと、退職日の翌日から14日以内に住所地の市区町村で手続きすること、資格喪失日を証明できる書類（離職票等）が必要になる場合があること、再就職して厚生年金に入る場合は引き続き厚生年金に加入すること', 0 from articles where slug = 'taishoku-nenkin-tetsuzuki';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'すぐに再就職することが決まっているのですが、国民年金の加入手続きは必要ですか。', '金沢市', 'https://www4.city.kanazawa.lg.jp/soshikikarasagasu/iryohokenka/yokuarushitsumon/kokuminnenkin/2691.html', '2026-10-07'::date, '退職日の翌日に次の勤務先に入る場合は手続きが不要なこと、資格喪失日と次の会社の資格取得日が同じ月なら国民年金保険料の納付は不要で、月をまたぐと納付が必要なこと', 1 from articles where slug = 'taishoku-nenkin-tetsuzuki';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '会社員である夫が退職しましたが、配偶者である私は国民年金の届出が必要ですか。', '日本年金機構', 'https://www.nenkin.go.jp/section/faq/kokunen/seido/kanyu/haigusha/20120306-11.html', '2026-10-07'::date, '退職した人に扶養されていた配偶者（第3号被保険者）も、第1号被保険者への届出が必要なこと', 2 from articles where slug = 'taishoku-nenkin-tetsuzuki';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '国民年金の資格取得（種別変更）届および国民年金付加保険料納付申出書の電子申請', '日本年金機構', 'https://www.nenkin.go.jp/denshibenri_kojin/shinseisho/fukanenkin/shutoku_fukamoushide.html', '2026-10-07'::date, '国民年金への切り替え（種別変更）の届出はマイナポータルから電子申請もできること', 3 from articles where slug = 'taishoku-nenkin-tetsuzuki';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '国民年金保険料', '日本年金機構', 'https://www.nenkin.go.jp/service/kokunen/hokenryo/hokenryo.html', '2026-10-07'::date, '2026年度（令和8年度）の国民年金保険料が月額17,920円で、納付期限は納付対象月の翌月末日であること', 4 from articles where slug = 'taishoku-nenkin-tetsuzuki';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '国民年金保険料の納付方法について', '日本年金機構', 'https://www.nenkin.go.jp/tokusetsu/nofuhoho.html', '2026-10-07'::date, '国民年金保険料は納付書、口座振替、クレジットカード、スマートフォンアプリなどで納付できること', 5 from articles where slug = 'taishoku-nenkin-tetsuzuki';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '国民年金保険料免除・納付猶予申請書の電子申請', '日本年金機構', 'https://www.nenkin.go.jp/denshibenri_kojin/shinseisho/menjo_shinseisho.html', '2026-10-07'::date, '免除・納付猶予の申請はマイナポータルから電子申請もできること', 6 from articles where slug = 'taishoku-nenkin-tetsuzuki';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '国民年金保険料の免除制度・納付猶予制度', '日本年金機構', 'https://www.nenkin.go.jp/service/kokunen/menjo/20150428.html', '2026-10-07'::date, '免除・納付猶予のしくみ、失業等の場合は本人の前年所得にかかわらず審査する特例があること、離職票や雇用保険受給資格者証のコピーなどが必要なこと、全額免除は年金額の2分の1が反映されること、納付猶予は50歳未満が対象なこと、免除・猶予期間が受給資格期間に入ること', 7 from articles where slug = 'taishoku-nenkin-tetsuzuki';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '国民年金保険料の免除等の申請が可能な期間', '日本年金機構', 'https://www.nenkin.go.jp/service/kokunen/menjo/20150402-01.html', '2026-10-07'::date, '納付期限から2年を経過していない期間（申請時点から2年1か月前まで）はさかのぼって申請できること', 8 from articles where slug = 'taishoku-nenkin-tetsuzuki';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '国民年金保険料免除・納付猶予申請書（記入方法の案内）', '日本年金機構', 'https://www.nenkin.go.jp/shinsei/kokunen/menjoyuyo/menjo.files/mennzyo.pdf', '2026-10-07'::date, '免除・納付猶予の申請書の提出先が市区町村の国民年金担当窓口または年金事務所で、郵送でも出せること', 9 from articles where slug = 'taishoku-nenkin-tetsuzuki';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '国民年金保険料の追納制度', '日本年金機構', 'https://www.nenkin.go.jp/service/kokunen/menjo/20150331.html', '2026-10-07'::date, '免除・納付猶予を受けた期間の保険料は10年以内なら追納できること', 10 from articles where slug = 'taishoku-nenkin-tetsuzuki';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'taishoku-nenkin-tetsuzuki' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"8f024b2cd2a02bbd1a1509c0667984f143fb97389b304cea0c9e5e18ba3d1936","findings":[]}'::jsonb from articles where slug = 'taishoku-nenkin-tetsuzuki';
update articles set status = 'published' where slug = 'taishoku-nenkin-tetsuzuki';

-- article: taishoku-riyuu-mensetsu (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('taishoku-riyuu-mensetsu', 'article', '面接で退職理由を聞かれたら？不満を前向きに言い換える答え方と例文', '面接で退職理由（転職理由）を聞かれたときは、不満を隠すのではなく、事実を短く伝えて「次にしたいこと」につなげます。面接官が確かめたいこと、答え方の型、人間関係・残業・ノルマなど本音別の言い換え例、言い換えと嘘の違いを紹介します。', '面接で「前の会社を辞めた理由を教えてください」と聞かれたとき、本当の理由が「人間関係がつらかった」「残業が多すぎた」だと、どこまで話していいのか迷いますよね。

先に結論を言うと、退職理由は**不満を隠すことより、事実を短く伝えて「次にしたいこと」につなげる**ことが大事です。言い方を前向きにすることと、嘘をつくことは違います。**事実は変えずに、話す順番と言葉を整える**と考えましょう。

この記事で分かること：

- 面接官が退職理由で**確かめたいこと**
- 退職理由の**答え方の型**
- 人間関係・残業・ノルマなど**本音別の言い換え例**（仮の例）
- **言い換えと嘘**の違い

## 面接官は何を確かめたい？

退職理由を聞かれると、責められているように感じるかもしれません。でも、面接官が知りたいのは、おもに次のようなことです。

- 同じ理由で、うちの会社もすぐに辞めてしまわないか
- 前の職場のせいにするだけでなく、自分で考えて動いているか
- 次にやりたいことが、うちの会社でかなうことか

大阪のハローワーク布施の面接対策セミナーの資料では、前の職場の批判や不満を全面に出して話すのはすすめず、人間関係や労働条件が理由の場合は客観的に短く伝えるとしています。不満があったこと自体が悪いのではなく、**不満だけで話が終わる**と、面接官の心配に答えられないのです。

## 答え方の型

退職理由は、次の順番で組み立てると、短く、前向きにまとまります。

```figure
type: steps
title: 退職理由の答え方の型
items:
  - label: きっかけ
    text: 何があったかを、事実だけ短く
  - label: 考えたこと
    text: その中で気づいたこと、自分に足りなかったこと
  - label: 次にしたいこと
    text: どんな仕事・環境で働きたいか
  - label: 応募先とのつながり
    text: それが応募先でかなうと考えた理由
```

ポイントは、**「きっかけ」を短く、「次にしたいこと」を厚めに**話すことです。退職理由の質問ですが、話の後半は志望動機につながっていきます。

## 本音別の言い換え例（仮の例）

ここからは、よくある本音ごとの言い換え例です。どれも仮の例なので、自分の事実に合わせて言葉を変えてください。

| 本音 | そのまま話すと | 言い換えると |
| --- | --- | --- |
| 上司と合わなかった | 上司が厳しくて、話を聞いてくれなかった | 相談しながら仕事を進められる環境で働きたい |
| 残業が多すぎた | 毎日遅くまで帰れず、もう限界だった | 時間を区切って集中し、長く働き続けられる働き方をしたい |
| ノルマがきつかった | 売上の目標に追われるのがつらかった | 一人ひとりのお客様に時間をかけて対応する仕事がしたい |
| 頑張っても評価されなかった | 何をしても給料が変わらなかった | 取り組んだことが目に見える形で評価される仕事に挑戦したい |
| 仕事が合わなかった | やりたい仕事ではなかった | 働く中で、〇〇の作業にやりがいを感じると分かった |

言い換えた部分だけを話すと、ふわっとした印象になります。**型にそって、事実と一緒に**話します。

> 「前の職場では、店舗の売上目標を追いかける販売の仕事をしていました。その中で、目標の数字よりも、一人のお客様の相談にじっくり乗れたときにやりがいを感じることに気づきました。御社のカスタマーサポートは、お問い合わせに一件ずつ丁寧に対応する仕事だと伺い、自分の気づいたことを活かせると考えて応募しました。」

> 「前の職場では、少人数の店舗で、仕事のほとんどを一人で判断して進めていました。うまくいかないときに相談できる人がいなかったことから、チームで声をかけ合いながら進める働き方をしたいと考えるようになりました。」

人間関係が理由でも、特定の人の名前や悪口は出しません。**「どんな環境で働きたいか」**だけを取り出して話します。

## 応募先にも当てはまる理由は避ける

大阪のハローワークの資料では、退職理由も、応募中の会社に当てはまる理由は避けなければいけないとしています。

たとえば「残業が多かったので辞めました」と話した応募先が、繁忙期に残業がある会社だったら、面接官は「うちでも同じ理由で辞めるのでは」と考えます。答えを準備したら、**応募先の求人票と見比べて**、同じことが起きそうなら言い方を変えましょう。

- 求人票の残業時間・休日・仕事内容を読み直す
- 言い換えた理由が、応募先の働き方と合っているか確かめる
- 合わないなら、別の事実（やってみたいこと）を中心に話す

そもそも次の職場で何を変えたいのかが整理できていないときは、[今の仕事を辞めたいとき、先に確認しておきたいこと](/articles/yametai-mae-kakunin)で、辞める前に考えておきたいことを紹介しています。

## 言い換えと嘘はちがう

前向きに言い換えることと、事実と違うことを言うことは、まったく別のものです。

```figure
type: compare
title: 言い換えと嘘のちがい
columns:
  - label: 言い換え（OK）
    tone: mint
    items:
      - 事実は変えずに、話す順番と言葉を選ぶ
      - 悪口を省き、次にしたいことを話す
      - 深く聞かれても、同じ話ができる
  - label: 嘘（NG）
    tone: coral
    items:
      - 辞めていないのに辞めたことにする
      - 会社の都合だったことを自分の希望にする
      - 深く聞かれると、話が合わなくなる
```

山形のハローワークの面接対策の資料でも、退職理由をあいまいにごまかすことや、話が長くてポイントがぼやけることは避けるようにとしています。面接では「具体的にはどんなことがあったのですか」と深く聞かれることがあります。作った理由は、ここで答えに詰まりやすくなります。

## 自分で決めたのではない退職のとき

会社の業績が悪くなった、契約期間が終わったなど、自分で決めたのではない退職もあります。その場合は、**事実をそのまま短く**伝えて構いません。

> 「契約期間の満了で退職しました。次は、長く同じ職場で経験を積みたいと考え、正社員の求人に応募しています。」

ハローワーク布施の資料では、介護・育児・病気など個人的な事情で辞めた場合は、今は働ける環境になったことをしっかり伝えるようにとしています。辞めてから働いていない期間がある場合の説明は、[職歴に空白期間があるとき、面接でどう説明する？](/articles/kuhaku-kikan-setsumei)を参考にしてください。

## 短い期間で辞めたとき

入社してすぐ辞めた場合は、「また辞めるのでは」と心配されやすいものです。ここで大事なのは、**次の会社をどう選んだか**を話すことです。

> 「前の会社は、仕事内容をよく確かめないまま入社してしまい、思っていた仕事と違うと感じて退職しました。今回は求人票だけでなく、職場の見学や面接で、一日の仕事の流れを確かめたうえで応募しています。」

自分の選び方に足りなかったことを認め、それを今回どう変えたかを話すと、同じことを繰り返さないと伝わります。何度か転職している場合の説明のしかたは、[転職回数が気になるときに整理したいこと](/articles/tenshoku-kaisu-kininaru)で紹介しています。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '面接の退職理由、どう答える？不満の言い換え例と答え方の型', '面接で退職理由を聞かれたときの答え方を紹介します。面接官が確かめたいこと、事実→考えたこと→次にしたいことの型、人間関係・残業・ノルマなど本音別の言い換え例、応募先に当てはまる理由を避けるコツ、嘘との線引きが分かります。', array['tenshoku-kaisu-kininaru', 'yametai-mae-kakunin', 'kuhaku-kikan-setsumei', 'mensetsu-yokukiku-shitsumon', 'souki-rishoku-tenshoku']::text[], '{}'::text[], array['mensetsu', 'yametai']::text[], array['hajimete', 'dainishinsotsu']::text[], array['辞めた理由、', '正直に言っていい？']::text[], null, false, '[{"q":"本当の退職理由が人間関係です。正直に言わないとだめですか？","a":"嘘をつく必要はありませんが、人の悪口として話す必要もありません。「一人で作業する時間が長く、相談しながら進められる環境で働きたいと考えました」のように、事実の中から「次にどんな環境で働きたいか」を取り出して短く話しましょう。"},{"q":"入社してすぐに辞めてしまいました。どう説明すればいいですか？","a":"短い期間で辞めたことは、ごまかさずに認めます。そのうえで、仕事選びで足りなかったこと（調べ方や確かめ方）と、今回はそれをどう確かめて応募したかを話すと、同じ理由でまた辞めるのではという心配に答えられます。"},{"q":"会社の都合で辞めた場合も、前向きな理由を言う必要がありますか？","a":"会社の都合や契約期間の満了など、自分で決めたのではない退職は、事実をそのまま短く伝えて構いません。そのうえで「この機会に〇〇の仕事に挑戦したいと考えました」と、これからのことを話しましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"退職理由は「不満を隠す」のではなく「事実を短く→考えたこと→次にしたいこと」に組み立て直す。既存記事（mensetsu-junbi-mikeiken）の言い換え表（シフト・給料・立ち仕事）と重ならないよう、人間関係・残業・ノルマ・評価・仕事が合わないなどの本音別に例を出し、「応募先にも当てはまる理由」の落とし穴と、言い換えと嘘の線引きを中心にする","quotes":[{"source_url":"https://jsite.mhlw.go.jp/osaka-hellowork/content/contents/002184437.pdf","text":"基本的に前職の批判・不満を全面に出して話すのはお勧めしない。人間関係や労働条件を理由にする場合は客観的に短く。待遇への不満、会社の経営悪化、介護・育児・病気などの個人的事情に分けて伝え方の例を示し、個人的事情の場合は現在は働ける環境になったことをしっかりと伝える（この環境から jsite.mhlw.go.jp に直接接続できなかったため、検索結果に表示された資料の抜粋で確認）","used_in":"面接官は何を確かめたい？／本音別の言い換え例／自分で決めたのではない退職のとき"},{"source_url":"https://jsite.mhlw.go.jp/osaka-hellowork/var/rev0/0058/1693/fusaiyou.pdf","text":"退職理由も、応募中の会社に当てはまる理由は避けなければいけない（直接開けなかったため、検索結果の抜粋で確認）","used_in":"応募先にも当てはまる理由は避ける"},{"source_url":"https://jsite.mhlw.go.jp/yamagata-hellowork/content/contents/002350381.pdf","text":"退職理由をあいまいにごまかすこと、話が長くポイントがぼやけることは避ける（直接開けなかったため、検索結果の抜粋で確認）","used_in":"言い換えと嘘はちがう"}],"not_used":["山形の資料の「面接時間は15〜30分程度が半数を超える」という調査の数字は、この記事の論点と離れるため使わない","「退職理由は30秒程度で」などの時間の目安は公的な根拠を確認できなかったので書かない","経歴を偽った場合の内定取り消しなど法的な扱いは、事情によって判断が分かれるため断定しない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'taishoku-riyuu-mensetsu' and c.slug = 'shorui-mensetsu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'taishoku-riyuu-mensetsu' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ハローワーク布施 面接対策セミナー', '大阪労働局（ハローワーク布施）', 'https://jsite.mhlw.go.jp/osaka-hellowork/content/contents/002184437.pdf', '2026-10-09'::date, '前職の批判・不満を全面に出して話すのはすすめないこと。人間関係や労働条件を理由にする場合は客観的に短く伝えること。待遇・経営悪化・個人的な事情など理由の種類ごとの伝え方（個人的な事情の場合は、今は働ける環境になったことを伝える）', 0 from articles where slug = 'taishoku-riyuu-mensetsu';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '採否通知のコメント欄に書かれた採用・不採用の理由（ハローワーク資料）', '大阪労働局（ハローワーク）', 'https://jsite.mhlw.go.jp/osaka-hellowork/var/rev0/0058/1693/fusaiyou.pdf', '2026-10-09'::date, '退職理由も、応募中の会社に当てはまる理由は避けなければいけないこと', 1 from articles where slug = 'taishoku-riyuu-mensetsu';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '面接対策', '山形労働局（ハローワーク）', 'https://jsite.mhlw.go.jp/yamagata-hellowork/content/contents/002350381.pdf', '2026-10-09'::date, '退職理由をあいまいにごまかすことや、話が長くてポイントがぼやけることを避けること', 2 from articles where slug = 'taishoku-riyuu-mensetsu';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'taishoku-riyuu-mensetsu' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"a87606c98fc86425689792a5fd99bb2df16235177e1aa35504b8219a7ad4e2e3","findings":[]}'::jsonb from articles where slug = 'taishoku-riyuu-mensetsu';
update articles set status = 'published' where slug = 'taishoku-riyuu-mensetsu';

-- article: taishoku-shorui (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('taishoku-shorui', 'article', '退職するときに受け取る書類・返す書類｜離職票や源泉徴収票は何に使う？', '会社を辞めるときは、離職票・源泉徴収票・雇用保険被保険者証・基礎年金番号が分かる書類・健康保険の資格喪失証明書などを受け取ります。それぞれ何に使うのか、いつごろ届くのか、会社に返すものは何かを一覧で整理します。', '会社を辞めるときは、いくつもの書類を受け取ったり返したりします。どれも次の会社に入るときや、健康保険・年金・税金の手続きで使うものです。名前が似ていて分かりにくいので、何に使うのかを先に整理しておきましょう。

**この記事で分かること**

- 退職するときに受け取る主な書類と、それぞれの使い道
- 書類がいつごろ、どこから届くのか
- 会社に返すもの
- 辞める前に会社に確認しておくこと

## 受け取る書類の一覧

| 書類 | 主な使い道 | いつ・どこから |
| --- | --- | --- |
| 離職票（離職票-1・離職票-2） | 失業手当（雇用保険の基本手当）の手続き | 会社の届出のあと、ハローワークが発行。会社から届くか、マイナポータルで受け取る |
| 源泉徴収票 | 次の会社での年末調整、自分でする確定申告 | 会社から、退職の日から1か月以内 |
| 雇用保険被保険者証 | 次の会社で雇用保険に入る手続き | 入社のときに渡されている。会社が預かっていれば退職時に返してもらう |
| 基礎年金番号通知書・年金手帳 | 国民年金への切り替えや、次の会社での年金の手続き | 自分で保管しているもの。会社が預かっていれば返してもらう |
| 健康保険資格喪失証明書 | 国民健康保険や家族の扶養に入る手続き | 辞めた会社（または加入していた健康保険）に依頼してもらう |
| 退職証明書 | 次の会社や手続きで、退職したことを証明する | 自分が請求したときに、会社が発行する |

## 離職票：失業手当の手続きに使う

離職票は、雇用保険の基本手当（いわゆる失業手当）を受け取る手続きで、ハローワークに出す書類です。離職票-1と離職票-2の2種類があります。

- **届くまでの流れ**：会社は、退職日の翌日（雇用保険の資格がなくなる日）の翌日から10日以内に、ハローワークに届出をします。そのあとハローワークが離職票を発行し、会社を通して届きます
- **マイナポータルでの受け取り**：2025年1月20日からは、会社が電子申請で手続きをしていて、本人がマイナポータルと雇用保険WEBサービスの連携設定をしているなどの条件を満たせば、離職票をマイナポータルで受け取れるようになりました
- **希望を伝えておく**：会社は、本人が希望しない場合は離職票のための書類（離職証明書）を出さなくてもよいとされています。辞めたあとすぐに働かない予定なら、「離職票がほしい」と会社に伝えておきましょう

失業手当を受け取れる条件や、自己都合で辞めた場合の給付制限については[自己都合退職の給付制限が原則1か月に](/news/news-koyou-hoken-kyufu-seigen)で紹介しています。

## 源泉徴収票：年末調整や確定申告に使う

源泉徴収票は、その年に会社が払った給料の合計と、引いた所得税の合計が書かれた書類です。会社は、年の途中で辞めた人に、**退職の日から1か月以内**に渡すことになっています。

- **年内に次の会社に入ったら**：次の会社に出して、前の会社の給料も含めて年末調整をしてもらう
- **年内に再就職しなかったら**：翌年に自分で確定申告（還付申告）をするときに使う

届かないときは、まず前の会社に問い合わせましょう。それでも渡してもらえない場合は、税務署に「源泉徴収票不交付の届出」をする手続きがあります。

## 雇用保険被保険者証：次の会社で雇用保険に入るときに使う

雇用保険被保険者証は、雇用保険の「被保険者番号」が書かれた書類です。被保険者番号は1人に1つで、転職しても同じ番号を引き継ぎます。次の会社から、雇用保険に入る手続きのために出してほしいと言われることがあります。

入社のときに会社から渡されていることが多いので、手元にあるか確認しておきましょう。なくした場合は、ハローワークで再交付を受けられます。

## 基礎年金番号通知書・年金手帳：年金の手続きに使う

基礎年金番号は、年金の記録を管理するための番号です。2022年4月からは、はじめて年金に入る人には、年金手帳の代わりに「基礎年金番号通知書」が発行されています。それより前から年金手帳を持っている人は、年金手帳が引き続き基礎年金番号を確かめる書類として使えます。

辞めたあとに国民年金に切り替える手続きなどで、基礎年金番号を聞かれることがあります。会社に預けている場合は、退職のときに返してもらいましょう。

## 健康保険資格喪失証明書：次の健康保険に入るときに使う

会社の健康保険の資格がなくなった日を証明する書類です。辞めたあとに国民健康保険や家族の扶養に入る手続きで、資格がなくなった日が分かる書類として使います。

- 国民健康保険の手続きは、健康保険の資格がなくなってから14日以内に、住んでいる市区町村で行います
- 証明書は、辞めた会社（または加入していた健康保険）に依頼してもらいます。いつ発行されるかは会社によって違うので、辞める前に確認しておきましょう
- 市区町村によっては、マイナポータルの資格情報の画面で資格がなくなった日を確認できれば、証明書の代わりにできることもあります

どの健康保険を選ぶかは、退職後の健康保険の選び方をまとめた記事で比べられるようにしています（公開準備中）。

## 退職証明書：退職したことを証明する

退職証明書は、働いていた期間、仕事の種類、役職、給料、退職の理由などを証明する書類です。辞めるときに自分が請求すると、会社は遅滞なく発行しなければならないと法律（労働基準法第22条）で決められています。証明してほしい項目だけを書いてもらえます。

次の会社から求められたときや、国民健康保険の手続きで資格喪失証明書がまだ届かないときなどに使えることがあります。必要になりそうなら、辞めるときに請求しておきましょう。

```figure
type: checklist
title: 辞める前に会社に確認すること
items:
  - 離職票がほしいことを伝えたか
  - 源泉徴収票をいつ、どう受け取るか
  - 雇用保険被保険者証が手元にあるか
  - 基礎年金番号が分かる書類が手元にあるか
  - 健康保険資格喪失証明書をいつもらえるか
  - 辞めたあとの連絡先を伝えたか
```

## 会社に返すもの

辞めるときは、会社から受け取っていたものを返します。

- **健康保険の資格確認書**：協会けんぽの場合、有効期限内の資格確認書は、扶養している家族の分も含めて会社に返します。従来の健康保険証や「資格情報のお知らせ」、有効期限が切れた資格確認書は返さなくてよく、自分で処分します
- **会社から借りているもの**：社員証、入館証、制服、パソコンや携帯電話など。何を返すかは会社の案内を確認しましょう

資格確認書は退職日までしか使えません。退職日の翌日以降に病院で使ってしまうと、あとで医療費（健康保険が負担した分）を返すことになります。健康保険組合に入っている場合は、会社や組合の案内に従ってください。

```figure
type: compare
style: vs
title: 受け取るものと返すもの
columns:
  - label: 受け取る
    tone: mint
    items:
      - 離職票（希望を伝えておく）
      - 源泉徴収票（1か月以内）
      - 雇用保険被保険者証・年金の書類
      - 健康保険資格喪失証明書
  - label: 返す
    tone: sand
    items:
      - 有効期限内の資格確認書
      - 社員証・制服・パソコンなど
```

辞める前に確認しておきたいことの全体は、[今の仕事を辞めたいとき、先に確認しておきたいこと](/articles/yametai-mae-kakunin)で紹介しています。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-07'::timestamptz, '退職時に受け取る書類一覧｜離職票・源泉徴収票の使い道と届く時期', '退職するときに受け取る離職票、源泉徴収票、雇用保険被保険者証、基礎年金番号通知書・年金手帳、健康保険資格喪失証明書の使い道と届く時期、会社に返すものを一覧にしました。辞める前に会社に確認しておくことも紹介します。', array['yametai-mae-kakunin', 'news-koyou-hoken-kyufu-seigen', 'tedori-20man-hikaku']::text[], '{}'::text[], array['yametai']::text[], array['hajimete']::text[], array['辞めるときの書類、', '何に使う？']::text[], null, false, '[{"q":"次の会社が決まっていても、離職票はもらっておいたほうがいいですか？","a":"離職票は、雇用保険の基本手当（いわゆる失業手当）を受け取る手続きに使う書類です。会社は、本人が希望しない場合は離職票のための書類（離職証明書）をハローワークに出さなくてもよいとされています。入社の予定が変わる可能性もあるので、迷ったら会社に「離職票がほしい」と伝えておきましょう。"},{"q":"退職したあと、健康保険の資格確認書や保険証はどうすればいいですか？","a":"協会けんぽの場合、有効期限内の資格確認書は、扶養している家族の分も含めて勤め先に返します。従来の健康保険証や「資格情報のお知らせ」、有効期限が切れた資格確認書は返さなくてよく、自分で処分します。退職日の翌日以降は使えないので注意しましょう。健康保険組合の場合は、会社や組合の案内に従ってください。"},{"q":"源泉徴収票が届きません。どうすればいいですか？","a":"会社は、年の途中で辞めた人に、退職の日から1か月以内に源泉徴収票を渡すことになっています。届かないときは、まず前の会社に問い合わせましょう。それでも渡してもらえない場合は、税務署に「源泉徴収票不交付の届出」をする手続きがあります。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"書類ごとに「何に使う」「いつ・どこから届く」「なくしたら」を同じ形で並べ、辞める前に会社に聞くことのチェックリストで終える","quotes":[{"source_url":"https://www.mhlw.go.jp/bunya/koyou/koyouhoken/tetsuduki_ichiran01.html","text":"事業主は、被保険者が離職により被保険者でなくなったときは、被保険者でなくなった日の翌日から起算して10日以内に資格喪失届に離職証明書を添えて提出する。その者が離職票の交付を希望しない場合は離職証明書を添えなくてもよい","used_in":"離職票：失業手当の手続きに使う"},{"source_url":"https://jsite.mhlw.go.jp/gifu-roudoukyoku/hourei_seido_tetsuzuki/koyou_hoken/_120758_00019.html","text":"令和7年1月20日から、希望する離職者のマイナポータルに離職票を直接送付するサービスを開始。マイナンバーと被保険者番号の紐付け、本人のマイナポータルと雇用保険WEBサービスの連携設定、事業主の電子申請が条件","used_in":"離職票：失業手当の手続きに使う"},{"source_url":"https://www.nta.go.jp/taxes/shiraberu/taxanswer/hotei/7411.htm","text":"年の中途で退職した人の場合は、退職の日以後1か月以内に源泉徴収票を交付しなければならない","used_in":"源泉徴収票：年末調整や確定申告に使う"},{"source_url":"https://www.kyoukaikenpo.or.jp/shibu/ishikawa/public_relations/010/index.html","text":"退職される方の健康保険証・資格情報のお知らせ・有効期限が切れた資格確認書は返却不要で自身で破棄。有効期限内の資格確認書は退職日までしか使えず、扶養家族分も含めて勤め先へ返却","used_in":"会社に返すもの"},{"source_url":"https://www.nenkin.go.jp/service/seidozenpan/20131107.html","text":"令和4年4月1日から基礎年金番号通知書を発行。すでに年金手帳を持っている人には発行されず、年金手帳は引き続き基礎年金番号を確認できる書類として使える","used_in":"基礎年金番号通知書・年金手帳：年金の手続きに使う"}],"not_used":["離職票が手元に届くまでの日数の目安は、公的な情報で確認できなかったため書かない（会社の届出期限だけを書いた）","健康保険資格喪失証明書の発行期限を定めた公的な情報は確認できなかったため、会社に時期を確認するよう書いた","健康保険組合ごとの資格確認書・保険証の返却ルールは組合によって違うため、協会けんぽの例だけを書いた","離職票の交付に関する年齢による取扱い（59歳以上など）は、読者にほぼ関係しないため書かない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'taishoku-shorui' and c.slug = 'seido' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'taishoku-shorui' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '手続き一覧表（雇用保険）', '厚生労働省', 'https://www.mhlw.go.jp/bunya/koyou/koyouhoken/tetsuduki_ichiran01.html', '2026-10-07'::date, '会社は被保険者でなくなった日の翌日から10日以内に雇用保険被保険者資格喪失届と離職証明書をハローワークに出すこと、本人が離職票を希望しない場合は離職証明書を出さなくてもよいこと', 0 from articles where slug = 'taishoku-shorui';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '基本手当について', 'ハローワークインターネットサービス（厚生労働省）', 'https://www.hellowork.mhlw.go.jp/insurance/insurance_basicbenefit.html', '2026-10-07'::date, '基本手当の受給手続きに離職票-1・離職票-2が必要なこと', 1 from articles where slug = 'taishoku-shorui';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '令和7年1月から希望する離職者のマイナポータルに「離職票」を直接送付するサービスを開始します！', '岐阜労働局（厚生労働省）', 'https://jsite.mhlw.go.jp/gifu-roudoukyoku/hourei_seido_tetsuzuki/koyou_hoken/_120758_00019.html', '2026-10-07'::date, '2025年1月20日から、条件を満たせば離職票をマイナポータルで受け取れるようになったこと（会社が電子申請で手続きし、本人がマイナポータルと雇用保険WEBサービスの連携設定をしていることなど）', 2 from articles where slug = 'taishoku-shorui';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '雇用保険被保険者証を再発行する方法は？（転職された方向け）', 'ハローワーク名古屋南（厚生労働省）', 'https://jsite.mhlw.go.jp/aichi-hellowork/list/minami/hihokenshashoutowa.html', '2026-10-07'::date, '雇用保険被保険者証は被保険者番号を知らせる書類で、転職先から同じ番号で加入するために提出を求められる場合があること、なくしたらハローワークで再交付を受けられること', 3 from articles where slug = 'taishoku-shorui';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '基礎年金番号・基礎年金番号通知書・年金手帳について', '日本年金機構', 'https://www.nenkin.go.jp/service/seidozenpan/20131107.html', '2026-10-07'::date, '2022年4月から年金手帳に代わって基礎年金番号通知書が発行されていること、すでに年金手帳を持っている人は年金手帳が基礎年金番号を確認できる書類として引き続き使えること', 4 from articles where slug = 'taishoku-shorui';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'No.7411 「給与所得の源泉徴収票」の提出範囲と提出枚数等', '国税庁', 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/hotei/7411.htm', '2026-10-07'::date, '年の途中で退職した人には、退職の日以後1か月以内に源泉徴収票を交付しなければならないこと', 5 from articles where slug = 'taishoku-shorui';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'F5-4 源泉徴収票不交付の届出手続', '国税庁', 'https://www.nta.go.jp/taxes/tetsuzuki/shinsei/annai/hotei/23100017.htm', '2026-10-07'::date, '源泉徴収票が交付されない場合に税務署へ届け出る手続きがあること', 6 from articles where slug = 'taishoku-shorui';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'No.2674 中途就職者の年末調整', '国税庁', 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/gensen/2674.htm', '2026-10-07'::date, '年の途中で就職した人は、前の会社の源泉徴収票などで前の給与を確認して年末調整を行うこと', 7 from articles where slug = 'taishoku-shorui';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '手続きに必要なもの（こんなときは忘れず届出を）', '横浜市', 'https://www.city.yokohama.lg.jp/kurashi/koseki-zei-hoken/kokuho/todokede/process.html', '2026-10-07'::date, '国民健康保険に入るときに健康保険資格喪失証明書が必要で、辞めた職場などでもらうこと、マイナポータルの資格情報の画面でも資格喪失日を確認できるものとして使えること（横浜市の例）', 8 from articles where slug = 'taishoku-shorui';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '健康保険証等の返却について（令和7年12月2日より）', '全国健康保険協会（協会けんぽ）石川支部', 'https://www.kyoukaikenpo.or.jp/shibu/ishikawa/public_relations/010/index.html', '2026-10-07'::date, '退職する人は、健康保険証・資格情報のお知らせ・有効期限切れの資格確認書は返却不要で自分で破棄し、有効期限内の資格確認書は家族の分も含めて勤め先に返すこと、退職日の翌日以降に使うと医療費を返すことになること', 9 from articles where slug = 'taishoku-shorui';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '自己都合の退職の際、退職勤務証明書を請求できますか？方法は？（確かめよう労働条件）', '厚生労働省', 'https://www.check-roudou.mhlw.go.jp/qa/roudousya/kaiko/q9.html', '2026-10-07'::date, '退職するとき、使用期間・業務の種類・地位・賃金・退職の事由について証明書を請求すると、会社は遅滞なく交付しなければならないこと（労働基準法第22条）', 10 from articles where slug = 'taishoku-shorui';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'taishoku-shorui' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"90a96aa63f6d65afdc62d3bb5467b3904bdb8fb2216e56c1df70c9c4c8ba402a","findings":[]}'::jsonb from articles where slug = 'taishoku-shorui';
update articles set status = 'published' where slug = 'taishoku-shorui';

-- article: taishoku-tsutaekata (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('taishoku-tsutaekata', 'article', '退職の伝え方は？誰に・いつ・どう言うか｜引き止めへの答え方と退職届の書き方', '退職の意思は、就業規則を確認したうえで、まず直属の上司に直接伝えるのが基本です。民法の「2週間」のルールと就業規則の関係、伝えるときの言い方の例、引き止められたときの答え方、退職届と退職願の違いを紹介します。', '「辞めることは決めた。でも、どう切り出せばいいか分からない」。はじめての退職では、上司に何と言うか、いつ言うか、書類は何を出すかで手が止まりがちです。

この記事で分かること：

- 退職は**誰に**、どの順番で伝えるか
- **いつ**伝えるか（民法の「2週間」のルールと就業規則の関係）
- **どう**言うか（切り出し方の例）
- **引き止められたとき**の答え方の例
- **退職届と退職願**の違い

## 誰に伝える？まずは直属の上司に、直接

退職の意思は、**直属の上司に最初に、直接**伝えるのが基本です。

- 同僚や先輩に先に話すと、上司が人づてに知ることになり、話がこじれやすくなります
- 上司を飛ばして人事や社長に直接伝えると、上司との関係がぎくしゃくしやすくなります
- メールやチャットだけで済ませるより、「お話ししたいことがあるので、お時間をいただけますか」と時間をとってもらい、対面（難しければオンライン）で伝えるほうが丁寧です

上司に伝えたあと、人事への連絡や同僚への報告をいつ・誰がするかは、上司と相談して決めましょう。

## いつ伝える？「2週間」と就業規則の関係

### 内定を承諾してから

転職先が決まっている場合は、**次の職場の労働条件を確認して、内定を承諾してから**伝えるのが一般的な流れです。先に退職を伝えてしまうと、内定が出なかったときに困ることになります。

### 法律のルール：申し出から2週間

民法第627条では、雇用の期間を定めていない場合（正社員など）、働く人はいつでも辞めることを申し出ることができ、申し出の日から**2週間**がたつと雇用が終わるとされています。会社の同意がないと辞められない、というわけではありません。

### 就業規則のルール：まずはこちらを確認

一方で、会社の**就業規則**には、「退職するときは〇日前までに申し出ること」のような決まりがあることが多いです。就業規則に決まりがある場合は、原則としてそれが適用されます（極端に長い期間を決めている場合などは、無効とされることもあります）。

```figure
type: steps
title: 退職を伝える日の決め方
items:
  - label: 就業規則を確認
    text: 退職の申し出は何日前までか、決まった書式があるか
  - label: 引き継ぎを見積もる
    text: 担当している仕事と、引き継ぎに必要な日数
  - label: 有給休暇を確認
    text: 残りの日数と、いつ使うか
  - label: 日程の案を作る
    text: 最終出勤日・退職日・入社日をそろえる
```

法律上は2週間でも、引き継ぎや有給休暇の消化を考えると、ぎりぎりで伝えると自分も職場も大変になります。就業規則を確認したうえで、余裕をもって伝えましょう。

契約社員など、**契約期間が決まっている**場合は、途中で辞めるときのルールが違います。契約書の期間と、途中で辞めるときの決まりを確認してください。

## どう言う？切り出し方の例

伝えるときは、**結論 → 時期 → 引き継ぎの意思**の順に話すと、短くまとまります。

> 「お忙しいところお時間をいただき、ありがとうございます。一身上の都合で、〇月〇日をもって退職させていただきたいと考えています。引き継ぎはきちんと行いますので、進め方をご相談させてください。」

ポイントは次の3つです。

- **「辞めようか迷っている」ではなく「辞める」と伝える**：相談の形にすると、引き止めの話が長引きやすくなります
- **理由は短く**：細かく話す必要はありません。聞かれたら「やってみたい仕事があり、転職することに決めました」のように前向きに
- **不満を並べない**：職場への不満を理由にすると、「それなら改善するから」と話が続いてしまいます

## 引き止められたら？答え方の例

引き止めは、それだけ頼りにされていたということでもあります。まずはお礼を伝え、そのうえで**結論は変えない**ことが大切です。

| 言われたこと | 答え方の例 |
| --- | --- |
| 給料を上げるから残ってほしい | 「ありがとうございます。ただ、条件ではなく、新しい仕事に挑戦したいという理由で決めました」 |
| 後任が見つかるまで待ってほしい | 「ご迷惑をおかけしてすみません。〇月〇日までに引き継ぎ資料をまとめ、できる限り引き継ぎます」 |
| 今辞めるのは無責任だ | 「ご負担をおかけすることは申し訳なく思っています。そのぶん、引き継ぎはしっかり行います」 |
| 一度考え直してほしい | 「十分に考えたうえで決めたことです。退職の気持ちは変わりません」 |

迷っているように見えると、話し合いが何度も続くことがあります。言い方はやわらかく、でも結論ははっきり、を意識しましょう。

### 話が進まないときの相談先

「退職を認めない」と言われ続けたり、退職届を受け取ってもらえなかったりして話が進まないときは、ひとりで抱え込まずに相談しましょう。都道府県労働局や労働基準監督署などにある**総合労働相談コーナー**では、職場のトラブルについて、予約なし・無料で相談できます。

## 退職届と退職願は何が違う？

退職の意思を書面で出すときによく使われるのが「退職願」と「退職届」です。一般的には次のように使い分けられています。

```figure
type: compare
title: 退職願と退職届の違い
columns:
  - label: 退職願
    tone: sky
    items:
      - 退職を認めてほしいというお願い
      - 合意退職の申込みにあたることが多い
      - 会社が承諾するまでは撤回できる
  - label: 退職届
    tone: sand
    items:
      - 退職するという一方的な意思表示
      - 辞職の意思表示にあたることが多い
      - 会社に届いたあとは原則撤回できない
```

- **退職を承認してほしいという申し込み（合意退職の申込み）**の場合は、会社が承諾するまでは撤回できるとされています
- **会社の承諾がなくても辞めるという意思表示（辞職）**の場合は、会社に届いた時点で効力が生じ、それ以降は原則として撤回できません

ただし、どちらにあたるかは**書類の名前だけで決まるわけではなく、書かれている内容**で判断されます。「やっぱり辞めない」と言うのが難しくなることもあるので、書類を出すのは、気持ちが固まってからにしましょう。

### 書類はいつ・どう出す？

一般的には、上司に口頭で伝えて退職日が決まってから、会社の決まりに沿って書類を出します。会社に決まった書式がある場合は、それを使いましょう。決まった書式がなければ、次のような内容を書きます。

- タイトル（退職願 / 退職届）
- 「一身上の都合により、〇年〇月〇日をもって退職いたします」（退職願なら「退職いたしたく、お願い申し上げます」）
- 提出日、所属、氏名
- 宛名（会社の代表者名）

## 伝えたあとにやること

退職日が決まったら、次の順に進めます。

1. 引き継ぎの資料を作り、担当の仕事を整理する
2. 残っている有給休暇をいつ使うか、上司と相談する
3. 会社から借りているもの（社員証、制服、パソコンなど）を確認する
4. 退職後に受け取る書類（離職票や源泉徴収票など）を確認する

辞める前に確認しておきたいこと全体は、[今の仕事を辞めたいとき、先に確認しておきたいこと](/articles/yametai-mae-kakunin)にまとめています。辞めた理由を次の面接でどう話すか迷ったら、[転職回数が気になるときに整理したいこと](/articles/tenshoku-kaisu-kininaru)の説明の型も参考になります。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-07'::timestamptz, '退職の伝え方｜誰に・いつ・どう言う？引き止めへの答え方', '退職は誰に、いつ、どう伝えればいい？就業規則と民法の「2週間」のルールの関係、上司への切り出し方の例、引き止められたときの答え方、退職届と退職願の違いと撤回できるかどうかを紹介します。', array['yametai-mae-kakunin', 'tenshoku-kaisu-kininaru']::text[], '{}'::text[], array['yametai']::text[], array['hajimete', 'dainishinsotsu']::text[], array['退職、', 'どう切り出せばいい？']::text[], null, false, '[{"q":"退職を伝えたら「認めない」と言われました。辞められないのですか？","a":"期間の定めのない雇用（正社員など）の場合、民法では、退職を申し出てから2週間がたつと雇用が終わるとされていて、会社の同意がないと辞められないわけではありません。就業規則に退職の申し出の決まりがあれば原則としてそれに従います。話し合いが進まないときは、都道府県労働局や労働基準監督署にある総合労働相談コーナーに無料で相談できます。"},{"q":"退職届を出したあとで、気が変わりました。取り消せますか？","a":"会社の承諾を待たずに辞めるという意思表示（辞職）は、会社に届いた時点で効力が生じ、それ以降は原則として撤回できません。退職を承認してほしいという申し込み（合意退職の申込み）であれば、会社が承諾するまでは撤回できるとされています。書類の名前だけで決まるわけではないので、出す前によく考えましょう。"},{"q":"退職理由は正直に言わないといけませんか？","a":"細かい理由をすべて話す必要はありません。「一身上の都合」と伝え、聞かれたら「やってみたい仕事があり、転職することに決めました」のように、前向きな理由を短く伝えるのが一般的です。不満を並べると、引き止めや話し合いが長引きやすくなります。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"退職の伝え方を「誰に・いつ・どう」に分け、法律（民法627条）と就業規則の関係を正確に書く。退職届と退職願は名前より中身（辞職か合意退職の申込みか）で撤回の可否が変わる点を押さえる","quotes":[{"source_url":"https://laws.e-gov.go.jp/law/129AC0000000089","text":"第六百二十七条第一項「当事者が雇用の期間を定めなかったときは、各当事者は、いつでも解約の申入れをすることができる。この場合において、雇用は、解約の申入れの日から二週間を経過することによって終了する。」（e-Gov への直接接続ができなかったため、e-Gov 法令検索の検索結果に表示された条文で確認）","used_in":"いつ伝える？「2週間」と就業規則の関係"},{"source_url":"https://jsite.mhlw.go.jp/kagoshima-roudoukyoku/yokuaru_goshitsumon/qa07/0701.html","text":"期間の定めのない雇用契約は解約の申し入れ後2週間で終了し、会社の同意がなければ退職できないというものではない。就業規則に退職の規定がある場合は原則として就業規則が適用されるが、極端に長い申し入れ期間などは無効とされる場合もある","used_in":"いつ伝える？「2週間」と就業規則の関係"},{"source_url":"https://www.startup-roudou.mhlw.go.jp/qa/zigyonushi/kaiko/q9.html","text":"退職願には、承認を求める合意退職の申込みの場合と、承諾の有無にかかわらず退職する一方的意思表示（辞職）の場合がある。合意退職の申込みは承諾の意思表示が到達するまで撤回可能。辞職は使用者への到達で効力が発生し、撤回できなくなる","used_in":"退職届と退職願は何が違う？"},{"source_url":"https://www.mhlw.go.jp/general/seido/chihou/kaiketu/soudan.html","text":"総合労働相談コーナーは各都道府県労働局、全国の労働基準監督署内などに設置。あらゆる分野の労働問題を対象に、面談または電話で、予約不要・無料で相談できる","used_in":"話が進まないときの相談先"}],"not_used":["「退職は1〜3か月前に伝えるのが一般的」などの目安は公的な根拠を確認できなかったので書かない","有期雇用（契約社員など）の途中退職のルール（民法第628条や労働基準法の規定）は、個別の契約内容で変わるため扱わず、契約書の確認と相談をすすめるにとどめた","退職代行サービスについては、特定のサービスに触れないため扱わない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'taishoku-tsutaekata' and c.slug = 'junbi' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'taishoku-tsutaekata' and c.slug = 'seido' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '民法（明治二十九年法律第八十九号）第六百二十七条', 'e-Gov法令検索（デジタル庁）', 'https://laws.e-gov.go.jp/law/129AC0000000089', '2026-10-07'::date, '期間の定めのない雇用は、各当事者がいつでも解約の申入れができ、申入れの日から2週間を経過すると終了すること', 0 from articles where slug = 'taishoku-tsutaekata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'Q5 このたび、家庭の事情で10年間勤務していた会社を辞めたいと思い退職願を提出しましたが、上司が受け取ってくれません。会社が同意してくれないと私は退職できないのでしょうか。', '鹿児島労働局', 'https://jsite.mhlw.go.jp/kagoshima-roudoukyoku/yokuaru_goshitsumon/qa07/0701.html', '2026-10-07'::date, '会社の同意がなければ退職できないわけではないこと。就業規則に退職の規定がある場合は原則としてそれが適用され、極端に長い期間などは無効とされる場合もあること', 1 from articles where slug = 'taishoku-tsutaekata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '退職願を出した労働者がこれを撤回したいと言ってきた場合、撤回を認めなければならないのですか。（スタートアップ労働条件）', '厚生労働省', 'https://www.startup-roudou.mhlw.go.jp/qa/zigyonushi/kaiko/q9.html', '2026-10-07'::date, '合意退職の申込みは会社が承諾するまで撤回できること、辞職は会社に到達した時点で効力が生じ撤回できなくなること、書類の性質は内容で判断されること', 2 from articles where slug = 'taishoku-tsutaekata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '総合労働相談コーナーのご案内', '厚生労働省', 'https://www.mhlw.go.jp/general/seido/chihou/kaiketu/soudan.html', '2026-10-07'::date, '都道府県労働局・労働基準監督署内などの総合労働相談コーナーで、職場のトラブルを予約不要・無料で相談できること', 3 from articles where slug = 'taishoku-tsutaekata';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'taishoku-tsutaekata' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"713ad0d8dc22f1ea35ce432af17b7efbf5a144955639ee4376437be19853ddb3","findings":[]}'::jsonb from articles where slug = 'taishoku-tsutaekata';
update articles set status = 'published' where slug = 'taishoku-tsutaekata';

-- article: taishokukin-kakunin (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('taishokukin-kakunin', 'article', '退職金はもらえる？会社によって違う理由と確かめ方｜就業規則・勤続年数・中退共・求人票の見方', '退職金は、法律で支払いが義務づけられているものではなく、会社が制度を作っている場合にもらえるものです。就業規則や退職金規程で見るところ、勤続年数や辞め方による違い、中小企業退職金共済（中退共）のしくみ、求人票や面接での確かめ方を紹介します。', '「正社員になれば、退職金ももらえるはず」。そう思っている人は多いかもしれません。でも実は、**退職金は法律で支払いが義務づけられているものではありません**。もらえるかどうか、いくらもらえるかは、会社が作っている制度しだいです。

先に結論を言うと、退職金のことは**就業規則（退職金規程）と求人票**で確かめ、分からないところは**内定後に労働条件を確認する場面で聞く**のが確実です。

この記事で分かること：

- 退職金が**会社によって違う理由**
- 就業規則・退職金規程で**見るところ**
- **勤続年数**や**辞め方**による違い
- **中小企業退職金共済（中退共）**のしくみ
- **求人票**と**面接**での確かめ方

## 退職金は「会社の制度」があればもらえるもの

労働基準法には、「会社は退職金を払わなければならない」という決まりはありません。厚生労働省のモデル就業規則でも、退職金制度は必ず設けなければならないものではない、とされています。

一方で、会社が退職金の制度を作っている場合は、**就業規則にそのルールを書かなければならない**ことになっています。ルールが書かれていれば、その条件を満たした人は、ルールにしたがって退職金を受け取れます。

つまり、確かめるべきことは2つです。

1. その会社に退職金の**制度があるか**
2. 自分がその制度の**対象になるか**、どんな**条件**があるか

## 就業規則・退職金規程で見る4つのところ

退職金の制度がある会社は、就業規則に次の4つを書くことになっています。退職金のルールは、就業規則の中に書かれていることも、「退職金規程」として別の文書になっていることもあります。

```figure
type: checklist
title: 退職金規程で見る4つのところ
items:
  - 誰が対象か（正社員だけか、契約社員なども含むか）
  - 金額をどう決めて、どう計算するか
  - どうやって払うか（会社から直接か、外部の制度からか）
  - いつ払うか（退職後どのくらいで払われるか）
```

### 誰が対象か

「正社員のみ」とされていて、契約社員・パート・アルバイトは対象外、という会社もあります。正社員登用制度がある会社なら、**登用前の期間が勤続年数に数えられるか**も確認しておきましょう。契約社員と正社員の違いは[契約社員と正社員は何が違う？](/articles/muki-tenkan-keiyaku)で紹介しています。

### 勤続年数の条件

厚生労働省のモデル就業規則の退職金の例でも、「勤続〇年以上の労働者が退職したときに支給する」という形になっています。このように、**一定の年数以上働かないと退職金が出ない**決まりにしている会社があります。何年以上かは会社が決めることなので、規程の数字を確認しましょう。

### 計算のしかたと、辞め方による違い

計算のしかたも会社によって違います。たとえば「退職するときの基本給 × 勤続年数に応じた支給率」のような計算式が使われることがあります。この場合、手当が多くて基本給が低い給料の決め方だと、退職金も小さくなります。

また、規程によっては、**自分から辞める（自己都合）か、会社の都合で辞める（会社都合）か**で支給率を分けていたり、懲戒解雇のときは支給しないことがあると決めていたりします。次の点を見ておきましょう。

- 自己都合と会社都合で、計算が変わるか
- 支給しない・減らす場合の決まりがあるか
- 計算に使うのは基本給か、ほかの手当も含むか

### 就業規則はどこで見られる？

会社は、就業規則を職場に掲示したり、書面で渡したり、社内のパソコンで見られるようにしたりして、働く人に知らせることになっています。今の職場の規程を見たいときは、総務・人事の担当者に「退職金規程を確認したいのですが、どこで見られますか」と聞いてみましょう。

## 中小企業退職金共済（中退共）とは

求人票で「**退職金共済**」「中退共」という言葉を見かけることがあります。中小企業退職金共済（中退共）は、**中小企業のための国の退職金制度**です。

- 会社が中退共と契約し、毎月の掛金を納める（掛金は**全額会社が負担**し、給料から引かれることはない）
- 掛金は、従業員1人あたり月額5,000円から30,000円の範囲で会社が決める（短時間で働く人には、さらに低い額の特例もある）
- 辞めたときは、**中退共から本人に直接**退職金が支払われる

会社の外に積み立てるので、退職金のお金が会社の中に残らないしくみです。

ただし、短い期間で辞めると受け取れないことがあります。

- 掛金を納めた月数が**11か月以下**：退職金は支給されない
- **12か月以上23か月以下**：受け取れる退職金は、納めた掛金の総額を下回る

```figure
type: compare
title: 中退共は掛金を納めた月数で変わる
columns:
  - label: 11か月以下
    tone: coral
    items:
      - 退職金は支給されない
  - label: 12か月以上23か月以下
    tone: sand
    items:
      - 支給されるが、掛金の総額を下回る
  - label: それより長い
    tone: mint
    items:
      - 納めた月数に応じて増えていく
```

会社が中退共に入っていると、加入した従業員ごとに手続きが行われます。自分が加入しているかどうか、掛金がいくらかは、会社の総務・人事に聞いて確かめましょう。会社によっては、中退共と会社独自の退職金を組み合わせていることもあります。

## 求人票で見るところ

求人票では、次のような欄を見ます。

- **退職金制度**：「あり」「なし」
- **退職金共済**：中退共などに加入しているか
- **補足事項・特記事項**：「勤続〇年以上」などの条件が書かれていることがある

ハローワークの求人票では、退職金共済や退職金制度の欄は**「あり」「なし」だけ**が書かれます。「あり」と書かれていても、勤続年数の条件や、誰が対象かまでは分かりません。気になる求人なら、内容を応募先に確かめる必要があります。

求人票の見方の全体は、[年収だけで求人を選ばないほうがいい理由](/articles/nenshu-dake-erabanai)でも紹介しています。

## 面接・内定後の確かめ方

退職金のことを、面接の最初からくわしく聞く必要はありません。おすすめは、**内定が出たあと、労働条件を確認する場面で聞く**ことです。

聞き方の例：

> 「求人票で退職金制度ありと拝見しました。入社後、制度の対象になるか、勤続年数の条件があるかを確認させていただけますか。」

> 「退職金は、会社独自の制度でしょうか、それとも中小企業退職金共済に加入されているのでしょうか。」

> 「最初は契約社員としての採用と伺いました。正社員になった場合、契約社員の期間も退職金の勤続年数に数えられますか。」

答えは、口頭だけでなく、労働条件通知書や就業規則で確認しておくと安心です。内定後に何を確認するかは[内定をもらったら、承諾の前に確認すること](/articles/naitei-shodaku-mae)に、入社前に確認したいこと全体は[転職で後悔しないために、入社前に確認したいこと](/articles/tenshoku-koukai-shinai)にまとめています。

## 退職金がない会社は、選ばないほうがいい？

退職金がないからといって、それだけで良くない会社とは言えません。退職金がないぶん、月々の給料や賞与に回している会社もあります。大事なのは、退職金を含めて、**長く働いたときに受け取れるもの全体**を比べることです。

比べるときのチェック：

- 退職金制度はあるか。あるなら、自分は対象か
- 勤続何年から出るか。自分はその年数まで働くつもりか
- 退職金がない場合、月給や賞与はどうか
- 自分で将来に備える方法（貯金など）も考えているか', 'review', false, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '退職金はもらえる？就業規則・中退共・求人票での確かめ方', '退職金は法律上の義務ではなく、会社の制度があるときにもらえるものです。就業規則・退職金規程で見る4つのところ、勤続年数や自己都合・会社都合による違い、中小企業退職金共済（中退共）のしくみ、求人票と面接での確かめ方を紹介します。', array['naitei-shodaku-mae', 'tenshoku-koukai-shinai', 'nenshu-dake-erabanai', 'fukuri-kousei-mikata']::text[], '{}'::text[], array['kyuryo', 'seishain']::text[], array['hajimete']::text[], array['退職金って', 'どこでも出るの？']::text[], null, false, '[{"q":"退職金は、どこの会社でももらえるものですか？","a":"いいえ。退職金の制度は、会社が必ず作らなければならないものではありません。会社が退職金の制度を作っている場合に、そのルールにしたがってもらえます。制度があるかどうか、誰が対象かは、就業規則や退職金規程、求人票で確かめましょう。"},{"q":"入社して1年で辞めても、退職金はもらえますか？","a":"会社のルールによって違います。退職金の規程では「勤続〇年以上の人に支給する」のように、勤続年数の条件を決めていることがあります。中小企業退職金共済（中退共）の場合は、掛金を納めた月数が11か月以下だと退職金は支給されません。自分の会社の条件は、就業規則や退職金規程で確認しましょう。"},{"q":"面接で退職金のことを聞いても大丈夫ですか？","a":"聞き方に気をつければ問題ありません。面接の早い段階でお金のことばかり聞くより、内定が出たあとに労働条件を確認する場面で「退職金制度の対象になるか、勤続年数の条件があるかを確認させてください」と聞くと自然です。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「退職金はもらえて当たり前」という思い込みをほどき、法律上の義務ではないこと、もらえるかは会社のルール次第であることを示したうえで、就業規則・退職金規程・求人票・面接での確かめ方を具体的にする。中退共は「会社の外に積み立てる国の制度」として、短期間だと出ない条件まで書く","quotes":[{"source_url":"https://www.check-roudou.mhlw.go.jp/qa/roudousya/syuugyoukisoku/q4.html","text":"退職手当の定めをする場合においては、適用される労働者の範囲、退職手当の決定、計算及び支払の方法並びに退職手当の支払の時期に関する事項を就業規則に記載しなければならない（労働基準法第89条第3号の2。検索結果に表示された内容で確認）","used_in":"就業規則・退職金規程で見る4つのところ"},{"source_url":"https://www.mhlw.go.jp/content/001620507.pdf","text":"退職金制度は必ず設けなければならないものではない。規程例では「勤続〇年以上の労働者が退職し又は解雇されたときは、この章に定めるところにより退職金を支給する」としている（検索結果で確認。勤続年数の規程例は平成30年版の退職金の章 https://www.mhlw.go.jp/file/06-Seisakujouhou-11200000-Roudoukijunkyoku/0000118971.pdf の検索結果でも確認）","used_in":"退職金は「会社の制度」があればもらえるもの / 勤続年数の条件"},{"source_url":"https://chutaikyo.taisyokukin.go.jp/kentou/seido/seido02.html","text":"中退共は国の退職金制度。事業主が中退共と契約し、掛金は全額事業主負担。掛金月額は従業員ごとに5千円から3万円の範囲（短時間労働者は特例あり）。退職金は従業員の請求により中退共から直接支払われる（検索結果で確認）","used_in":"中小企業退職金共済（中退共）とは"},{"source_url":"https://chutaikyo.taisyokukin.go.jp/taisilyokukin_sisan/sisan03/index.html","text":"掛金納付月数が11か月以下の場合は退職金・解約手当金は支給されない（通算制度などの例外あり）。12か月以上23か月以下では掛金総額を下回る（検索結果で確認）","used_in":"中小企業退職金共済（中退共）とは"},{"source_url":"https://jsite.mhlw.go.jp/okayama-roudoukyoku/content/contents/000526257.pdf","text":"求人票の退職金共済・退職金制度の欄は、有無のみ掲載される（検索結果で確認）","used_in":"求人票で見るところ"}],"not_used":["退職金制度がある企業の割合や、退職金の平均額などの統計は、会社ごとの違いが大きく、読者の判断を誤らせるおそれがあるため書かない","退職金の税金（退職所得控除）は、この記事の主題（もらえるかの確認）から外れるため扱わない","退職金の請求権の時効（5年）は、確認はできたが、記事の主題から外れるため扱わない","確定拠出年金（企業型DC）など、退職金に代わる・加わる制度は種類が多く、会社ごとに違うため「規程で確認」にとどめた","自己都合と会社都合で支給率が違うかどうかは会社の規程によるため、一般的な割合は書かず、規程で確認するポイントとして示した"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'taishokukin-kakunin' and c.slug = 'seido' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'taishokukin-kakunin' and c.slug = 'hatarakikata' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '就業規則で、記載が必須な事項はありますか？（確かめよう労働条件 Q&A）', '厚生労働省', 'https://www.check-roudou.mhlw.go.jp/qa/roudousya/syuugyoukisoku/q4.html', '2026-10-09'::date, '退職手当の定めをする場合は、適用される労働者の範囲、退職手当の決定・計算・支払の方法、支払の時期を就業規則に記載する必要があること', 0 from articles where slug = 'taishokukin-kakunin';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'モデル就業規則（令和7年12月版）', '厚生労働省労働基準局監督課', 'https://www.mhlw.go.jp/content/001620507.pdf', '2026-10-09'::date, '退職金制度は必ず設けなければならないものではないこと、規程例で勤続年数を支給の条件にしていること', 1 from articles where slug = 'taishokukin-kakunin';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '制度の特色（中退共制度について）', '独立行政法人勤労者退職金共済機構 中小企業退職金共済事業本部', 'https://chutaikyo.taisyokukin.go.jp/kentou/seido/seido02.html', '2026-10-09'::date, '中退共は国の退職金制度で、掛金は全額事業主が負担し、退職金は中退共から本人に直接支払われること、掛金月額が5,000円から30,000円の範囲であること', 2 from articles where slug = 'taishokukin-kakunin';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '退職金計算の方法・考え方について', '独立行政法人勤労者退職金共済機構 中小企業退職金共済事業本部', 'https://chutaikyo.taisyokukin.go.jp/taisilyokukin_sisan/sisan03/index.html', '2026-10-09'::date, '掛金の納付月数が11か月以下だと退職金が支給されず、12か月以上23か月以下では掛金の総額を下回ること', 3 from articles where slug = 'taishokukin-kakunin';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '求人票の見方（ハローワークシステム刷新の案内）', '岡山労働局', 'https://jsite.mhlw.go.jp/okayama-roudoukyoku/content/contents/000526257.pdf', '2026-10-09'::date, 'ハローワークの求人票では退職金共済・退職金制度は有無のみが掲載され、内容は別に確認する必要があること', 4 from articles where slug = 'taishokukin-kakunin';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'taishokukin-kakunin' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"c687a43ac7a800de813e74a241492426f4f17fd5ead1725b97a513b32bacbfe1","findings":[]}'::jsonb from articles where slug = 'taishokukin-kakunin';
update articles set status = 'published' where slug = 'taishokukin-kakunin';

-- article: tedori-20man-hikaku (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('tedori-20man-hikaku', 'article', '手取り20万円から転職を考えるとき、何を比べればいい？', '毎月の手取りと求人票の「月給」は、そのまま比べるとずれが出ます。額面と手取りの違い、給料から引かれるもの、自分の給与明細を使った目安の出し方、手当・交通費・賞与の見方、生活費から必要な金額を逆算する方法を紹介します。', '「手取りは毎月20万円くらい。転職するなら、もう少し増やしたい」。そう思って求人を見始めると、「月給22万円」「月給25万円」といった数字が並んでいて、今より増えるのかどうか、意外と分かりにくいものです。

理由はシンプルで、**求人票の月給と、毎月振り込まれる手取りは別のもの**だからです。比べる前に、まず同じものさしにそろえましょう。

## 「額面」と「手取り」は何が違う？

- **額面**：会社が支払う給料の総額。給与明細では「総支給額」などの欄にあります。
- **手取り**：額面から税金や社会保険料が引かれたあと、実際に受け取る金額。給与明細では「差引支給額」などの欄にあります。

求人票に書かれている月給や年収は、多くの場合、額面の金額です。会社員の給料から主に引かれるのは、次の5つです。

| 引かれるもの | どう決まる？ |
| --- | --- |
| 健康保険料 | 標準報酬月額（給料を区切りのいい金額に当てはめたもの）に保険料率をかけて計算。協会けんぽの場合は会社と本人で半分ずつ負担 |
| 厚生年金保険料 | 標準報酬月額に保険料率をかけて計算。会社と本人で半分ずつ負担 |
| 雇用保険料 | 給料に、年度ごとに示される料率をかけて計算（本人が負担する分が引かれる） |
| 所得税 | 給料から社会保険料などを引いた金額を、国税庁の税額表に当てはめて計算 |
| 住民税 | 前の年の所得をもとに計算され、6月から翌年5月まで毎月の給料から引かれる |

健康保険料の率は、協会けんぽでは都道府県ごとに違い、会社によっては健康保険組合に入っていることもあります。ほかにも扶養している家族の有無や前の年の収入などで変わるので、「何割引かれる」とは一概に言えません。そこで、**自分の給与明細から割合を出す**方法を使います。

## 自分の「手取りの割合」を出してみる

今の給与明細を1か月分用意して、次の計算をしてみてください。

```figure
type: equation
title: 手取りの割合の出し方
terms:
  - 差引支給額（手取り）
  - ÷
  - 総支給額（額面）
  - =
  - 手取りの割合
```

たとえば総支給額が25万円、差引支給額が20万円なら、20万円 ÷ 25万円 ＝ 0.8 です（数字は仮の例です）。この割合を使うと、求人の月給から手取りのおおよその目安を出せます。

- 月給25万円の求人：25万円 × 0.8 ＝ 約20万円
- 月給27万円の求人：27万円 × 0.8 ＝ 約21.6万円

ただし、これはあくまで目安です。給料の額が変わると社会保険料や所得税も変わり、住民税は前の年の所得で決まるため、実際の手取りとはぴったり一致しません。

## 月給以外に比べたいもの

手取りが増えるかどうかは、月給だけでは決まりません。求人票では、次の項目もあわせて確認しましょう。

- **交通費（通勤手当）**：月給とは別に出るのか、上限はあるか
- **手当**：住宅手当や資格手当は、誰でももらえるものか、条件つきか
- **賞与**：年に何回か、金額が決まっているのか、前年の実績なのか
- **残業代**：固定残業代が月給に含まれていないか、何時間分か

特に、今の手取りに残業代が多く含まれている人は、残業の少ない職場に移ると、月給が今と同じくらいでも手取りが減ることがあります。今の給与明細で、残業代がいくらあるかも見ておきましょう。固定残業代を含めた年収の内訳の読み方は[「土日休み」と「年収」をどう比較する？](/articles/donichi-yasumi-nenshu-hikaku)で紹介しています。

## 転職した年は「住民税」に気をつける

住民税は、前の年の所得をもとに計算され、6月から翌年5月までの給料から差し引かれます。そのため、転職して月給が下がっても、しばらくは前の年の収入をもとにした住民税を払い続けることになります。

反対に、収入が少なかった年の翌年は住民税も少なくなり、収入が増えた年の翌年6月から住民税が増える、ということも起こります。転職した最初の年に「思ったより手取りが少ない」と感じる原因になりやすいので、生活費の計算には少し余裕を持たせておくと安心です。

## 生活費から「必要な手取り」を逆算する

最後に、毎月いくら手取りがあれば暮らせるかを書き出します（金額は仮の例です）。

| 項目 | 金額の例 |
| --- | --- |
| 家賃 | 6.5万円 |
| 食費 | 4万円 |
| 水道光熱費・通信費 | 2万円 |
| 日用品・交際費など | 3.5万円 |
| 貯金 | 2万円 |
| 合計 | 18万円 |

この例なら、手取り18万円がゆずれない下限です。手取りの割合が0.8なら、18万円 ÷ 0.8 ＝ 22.5万円なので、月給22.5万円以上がひとつの目安になります。

```figure
type: equation
title: 必要な手取りから月給の目安を出す
terms:
  - 必要な手取り 18万円
  - ÷
  - 手取りの割合 0.8
  - =
  - 月給22.5万円以上が目安
```

今の仕事を辞めたい理由が給料だけでないなら、休日や仕事内容など、ほかの条件も一緒に書き出しておくと、求人を比べやすくなります。賞与を含めた年収での考え方は[年収300万円から転職すると、給料は下がる？上げられる？](/articles/nenshu-300man-tenshoku)、年収以外に比べたいことは[年収だけで求人を選ばないほうがいい理由](/articles/nenshu-dake-erabanai)で紹介しています。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['nenshu-300man-tenshoku', 'donichi-yasumi-nenshu-hikaku', 'nenshu-dake-erabanai']::text[], '{}'::text[], array['kyuryo', 'yametai']::text[], array['hajimete']::text[], array['手取り20万円。', '転職で何を比べる？']::text[], null, false, '[{"q":"求人票の「月給」は手取りの金額ですか？","a":"多くの場合、税金や社会保険料が引かれる前の金額（額面）です。手取りは、ここから健康保険料・厚生年金保険料・雇用保険料・所得税・住民税などが引かれた金額になります。はっきりしないときは、面接や面談で確認しましょう。"},{"q":"手取りは額面の何割くらいになりますか？","a":"住んでいる地域や加入している健康保険、扶養している家族の有無、前の年の収入などで変わるため、決まった割合はありません。今の給与明細で「差引支給額 ÷ 総支給額」を計算すると、自分の場合の目安が分かります。"},{"q":"転職した年に、手取りが思ったより少ないのはなぜですか？","a":"理由のひとつが住民税です。住民税は前の年の所得をもとに計算され、6月から翌年5月までの給料から引かれます。そのため、転職して給料が下がっても、しばらくは前の年の収入をもとにした住民税を払い続けることになります。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"手取りと求人票の月給を同じものさしにそろえる。控除率は断定せず、読者自身の給与明細から割合を出してもらう","quotes":[{"source_url":"https://www.nta.go.jp/taxes/shiraberu/taxanswer/gensen/2511.htm","text":"税額表を使うときは、その月の給与等の金額から社会保険料等を控除した金額を当てはめて源泉徴収税額を求める","used_in":"「額面」と「手取り」は何が違う？"},{"source_url":"https://www.nenkin.go.jp/service/kounen/hokenryo/hoshu/20150515-01.html","text":"厚生年金保険料は、標準報酬月額と標準賞与額に共通の保険料率をかけて計算し、事業主と被保険者が折半して負担する","used_in":"「額面」と「手取り」は何が違う？"},{"source_url":"https://www.kyoukaikenpo.or.jp/about/business/insurance_rate/001","text":"協会けんぽの保険料率は都道府県支部ごとの医療費水準等にもとづき都道府県ごとに決められ、保険料は労使で折半負担するのが原則","used_in":"「額面」と「手取り」は何が違う？"},{"source_url":"https://jsite.mhlw.go.jp/tochigi-roudoukyoku/newpage_01657.html","text":"令和8年度（2026年4月1日〜2027年3月31日）の雇用保険料率の案内。料率は年度ごとに定められ、労働者負担と事業主負担に分かれている","used_in":"「額面」と「手取り」は何が違う？"},{"source_url":"https://www.tax.metro.tokyo.lg.jp/kazei/life/kojin_ju/tokubetsu/about","text":"特別徴収は、事業主が従業員に代わり毎月の給与から個人住民税を差し引いて納入する制度で、6月から翌年5月までの12回に分けて差し引く。個人住民税は前年の所得金額に応じて課税される「所得割」と定額の「均等割」からなる","used_in":"転職した年は「住民税」に気をつける"}],"not_used":["「手取りは額面の約8割」などの一般的な割合は根拠が人によって変わるため書かない。0.8 は読者が自分の明細で出す割合の仮の例として使用"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'tedori-20man-hikaku' and c.slug = 'hatarakikata' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'No.2511 税額表の種類と使い方', '国税庁', 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/gensen/2511.htm', '2026-10-06'::date, '所得税は、給与から社会保険料などを差し引いた金額を税額表に当てはめて計算すること', 0 from articles where slug = 'tedori-20man-hikaku';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '厚生年金保険の保険料', '日本年金機構', 'https://www.nenkin.go.jp/service/kounen/hokenryo/hoshu/20150515-01.html', '2026-10-06'::date, '厚生年金保険料は標準報酬月額などに保険料率をかけて計算し、事業主と被保険者が半分ずつ負担すること', 1 from articles where slug = 'tedori-20man-hikaku';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '保険料率（協会けんぽの都道府県ごとの保険料率）', '全国健康保険協会（協会けんぽ）', 'https://www.kyoukaikenpo.or.jp/about/business/insurance_rate/001', '2026-10-06'::date, '協会けんぽの健康保険料率は都道府県ごとに決められていること、保険料は会社と本人で折半が原則であること', 2 from articles where slug = 'tedori-20man-hikaku';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '令和8年度 雇用保険料率のご案内', '栃木労働局（厚生労働省）', 'https://jsite.mhlw.go.jp/tochigi-roudoukyoku/newpage_01657.html', '2026-10-06'::date, '雇用保険料率は年度ごとに決められ、労働者負担分と事業主負担分に分かれていること', 3 from articles where slug = 'tedori-20man-hikaku';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '個人住民税の特別徴収推進ステーション', '東京都主税局', 'https://www.tax.metro.tokyo.lg.jp/kazei/life/kojin_ju/tokubetsu/about', '2026-10-06'::date, '個人住民税の所得割は前年の所得金額に応じて課税されること。特別徴収では6月から翌年5月までの12回に分けて給与から差し引かれること', 4 from articles where slug = 'tedori-20man-hikaku';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'tedori-20man-hikaku' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"c6d10ca075a3edf047ee2998b944e9d2fd658468a26603cf92bb3a54daa28499","findings":[]}'::jsonb from articles where slug = 'tedori-20man-hikaku';
update articles set status = 'published' where slug = 'tedori-20man-hikaku';

-- article: tekisei-kensa-tenshoku (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('tekisei-kensa-tenshoku', 'article', '転職の適性検査とは？能力検査と性格検査の違い・受け方の種類と準備のしかた', '転職の選考で出てくる適性検査は、大きく分けると能力検査と性格検査があります。それぞれ何を聞かれるのか、テストセンター・自宅のWeb・会社でのペーパーといった受け方の違い、案内が届いたら確認すること、準備のしかたを、厚生労働省の資料をもとに紹介します。', '書類選考のあとに「適性検査を受けてください」という案内が届いた。何が出るのか、どう準備すればいいのか分からず、不安になる人も多いと思います。

先に結論を言うと、転職の適性検査は多くの場合、**能力検査と性格検査**の2つに分かれます。

- **能力検査**：問題の形式に慣れておくと、落ち着いて解きやすくなる
- **性格検査**：よく見せようとせず、正直に答える

そして、どこで・どうやって受けるのかは会社によって違うので、**届いた案内をよく読むこと**がいちばんの準備です。

## 適性検査って何を見ている？

厚生労働省は、採用選考は応募者の**適性と能力に基づいて行う**ことを基本としています。適性検査は、そのための材料の一つです。

事業主向けの資料では、適性検査について次のような考え方が示されています。

- 目的に合った検査を選び、専門的な知識のある人が使う
- 検査の結果を絶対視しない
- 検査の結果だけで採否を決めない
- 適性や能力に関係のないこと（思想・信条など）を検査で聞き出さない

また、検査で分かるのは応募者の適性の一面にすぎない、とも説明されています。適性検査は書類や面接とあわせて見られるものなので、「検査で全部決まる」と考えすぎなくて大丈夫です。どのくらい重く見るかは会社によって違います。

## 能力検査と性格検査の違い

```figure
type: compare
title: 能力検査と性格検査
columns:
  - label: 能力検査
    tone: sky
    items:
      - 文章の読み取りや言葉の問題
      - 計算や表・グラフの読み取り
      - 正解がある。時間内に解く
  - label: 性格検査
    tone: mint
    items:
      - 考え方や行動のくせを聞く
      - 「あてはまる」かどうかを選ぶ
      - 正解はない。正直に答える
```

### 能力検査

仕事で使う基本的な力を見るための検査です。文章を読んで内容をつかむ問題や、言葉の意味の問題、計算や割合、表やグラフを読み取る問題などが出ることが多いです。

正解のある問題を、限られた時間の中で解きます。1問に時間をかけすぎると、最後まで進めなくなることがあります。

### 性格検査

「人と話すのが好きだ」「計画を立ててから動くほうだ」のような質問に、自分にどのくらいあてはまるかを選んでいく検査です。正解はありません。会社は、応募した仕事や職場との合い方を見るために使います。

### 職種によっては、別の検査もある

事務の仕事でタイピングや表計算ソフトの操作を確かめる、文章を書いてもらう、といった形で、応募した仕事に合わせた検査が行われることもあります。何が行われるかは、案内や面接の連絡で確かめましょう。

## どこで受ける？受け方の違い

受け方は、主に次の3つです。どれになるかは会社と検査によって違います。

| 受け方 | どんな形か | 気をつけたいこと |
| --- | --- | --- |
| テストセンター | 指定された会場に行き、会場のパソコンで受ける | 予約が必要なことが多い。本人確認の書類など、持ち物を確認する |
| Web（自宅など） | 自分のパソコンなどで、期限までに受ける | 通信が安定した静かな場所で、時間をとって受ける |
| ペーパー | 面接の日などに、会社で紙の問題を解く | 筆記用具や電卓を使えるかを確認する |

案内が届いたら、まず次のことを確認しておきましょう。

```figure
type: checklist
title: 適性検査の案内で確認すること
items:
  - 受け方（会場・自宅のWeb・会社で紙）
  - 受検の期限や日時、予約のしかた
  - だいたいの所要時間
  - 能力検査と性格検査のどちらがあるか
  - 電卓や筆記用具を使えるか
  - 持ち物（本人確認の書類など）
  - 困ったときの問い合わせ先
```

案内に書かれていないことや、期限までに受けるのがむずかしい事情があるときは、早めに採用担当者に問い合わせましょう。問い合わせのメールの書き方は、[転職の応募・面接日程・お礼のメールはどう書く？](/articles/oubo-mail-kakikata)を参考にしてください。

## 能力検査の準備：形式に慣れておく

能力検査は、問題の形式を知っているかどうかで、解くスピードが変わりやすい検査です。準備は次の順で進めます。

1. **どんな問題が出るかを知る**：書店や図書館にある就職・転職向けの問題集で、出題の形式を一通り見る
2. **時間を計って解いてみる**：時間を意識すると、1問にかける時間の感覚がつかめる
3. **苦手な分野をくり返す**：割合や表の読み取りなど、時間がかかった分野にしぼって練習する

案内に検査の名前が書かれていれば、その名前で調べると、形式に合った問題集が見つかりやすくなります。

自分の得意・不得意をつかむ参考として、厚生労働省の職業情報提供サイト（job tag）の「職業適性テスト（Gテスト）」を受けてみる方法もあります。選考の検査とは別のものですが、10分程度で受けられ、途中で計算が必要な問題もあります（計算用のメモを用意し、電卓は使わないよう案内されています）。結果には向いている職業の例も出ますが、職業を探すヒントとして使うものとされています。

## 性格検査の準備：正直に、迷わず答える

性格検査には正解がないので、問題集で「答え方」を覚える必要はありません。ただ、次のことを知っておくと落ち着いて答えられます。

- **よく見せようとしない**：「こう答えたほうが受かりそう」と考えると、似た質問への答えがばらばらになりやすい
- **ふだんの自分で答える**：仕事のときの自分を思い浮かべて、近いほうを選ぶ
- **考えこみすぎない**：質問の数が多いことがあるので、一つひとつで長く迷わない

性格検査の答えと、面接で話す内容が大きく食い違うと、かえって説明に困ります。自分がどんな場面でがんばれるか、何が苦手かを先に整理しておくと、検査にも面接にも答えやすくなります。整理のしかたは[転職のための自己分析のやり方](/articles/jiko-bunseki-yarikata)で紹介しています。

## 自宅のWebで受けるときの注意

自宅で受ける検査は、いつでも受けられる分、つい後回しにしがちです。

- 期限ぎりぎりではなく、余裕のある日に時間をとって受ける
- 通信が安定した、静かな場所で受ける
- 始める前に、パソコンの充電やブラウザの準備を済ませる
- **必ず自分ひとりで受ける**。ほかの人に解いてもらう、答えを相談しながら進める、といったことはしない

本人の力や考え方を見るための検査なので、ほかの人の力を借りた結果では、自分に合わない仕事に進んでしまうおそれもあります。

## 検査のあとは、面接の準備へ

適性検査は、選考の流れの中の一つの段階です。検査が終わったら、次の面接の準備に気持ちを切り替えましょう。面接でよく聞かれる質問と答え方は[転職の面接でよく聞かれる質問と答え方](/articles/mensetsu-yokukiku-shitsumon)、選考全体の流れは[転職活動の流れとスケジュールの立て方](/articles/tenshoku-schedule)で紹介しています。', 'review', false, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '転職の適性検査とは？能力検査・性格検査と準備のしかた', '転職の選考で「適性検査を受けてください」と言われたら？能力検査と性格検査の違い、テストセンター・自宅のWeb・ペーパーといった受け方、案内メールで確認すること、能力検査の練習のしかたと性格検査の答え方の考え方を紹介します。', array['tenshoku-schedule', 'mensetsu-yokukiku-shitsumon', 'jiko-bunseki-yarikata', 'mensetsu-kinchou', 'kigyou-kenkyu-yarikata']::text[], '{}'::text[], array['mensetsu']::text[], array['hajimete', 'dainishinsotsu']::text[], array['適性検査って', '何をすればいい？']::text[], null, false, '[{"q":"性格検査は、よく見えるように答えたほうがいいですか？","a":"正直に答えるのがおすすめです。よく見せようとすると、似た内容の質問への答えがばらばらになったり、面接で話す内容と合わなくなったりしやすくなります。入社後に合わない仕事を選ばないためにも、ふだんの自分に近いほうを選びましょう。"},{"q":"適性検査の結果だけで不採用になりますか？","a":"どう使うかは会社によって違います。厚生労働省は事業主向けの資料で、適性検査の結果を絶対視せず、検査だけで採否を決めないよう求めています。書類や面接とあわせて判断されるものと考え、検査の準備と同じくらい、面接の準備もしておきましょう。"},{"q":"自宅で受けるWebの検査を、だれかに手伝ってもらってもいいですか？","a":"いけません。本人の力や考え方を見るための検査なので、ほかの人に解いてもらったり、答えを相談しながら進めたりするのはやめましょう。分かってしまったときに選考の信頼を失うだけでなく、入社後に合わない仕事を任されるおそれもあります。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"はじめて転職の適性検査の案内を受け取った人が「何が出るのか」「どう受けるのか」「何を準備すればいいか」をつかめるようにする。特定の検査会社の名前・問題は出さず、能力検査と性格検査の違い、受け方の違い、案内で確認することに絞る。結果の扱いは厚生労働省の事業主向け資料を根拠に「検査だけで決めないよう求められている」にとどめる","quotes":[{"source_url":"https://kouseisaiyou.mhlw.go.jp/methods.html","text":"「職業適性検査」「職業興味検査」「性格検査」などは目的に応じて適切な種類を選び、専門的な知識と経験を持つ人が用いるべき。結果を絶対視しない。適性・能力に関係のない事項（思想・信条など）を把握したり、検査結果だけで採否を決めたりしない（官公庁サイトは直接開けなかったため、検索結果の抜粋で確認）","used_in":"適性検査って何を見ている？／FAQ"},{"source_url":"https://kouseisaiyou.mhlw.go.jp/basic.html","text":"採用選考の基本は、応募者に広く門戸を開くことと、本人の適性・能力に基づいた採用基準とすること（直接開けなかったため検索結果で確認）","used_in":"適性検査って何を見ている？"},{"source_url":"https://kouseisaiyou.mhlw.go.jp/assets/pdf/basic/02.pdf","text":"検査は応募者の適性の一面を把握するにすぎず、完全につかむことはできないという限界を認識すべき（直接開けなかったため検索結果の抜粋で確認）","used_in":"適性検査って何を見ている？"},{"source_url":"https://shigoto.mhlw.go.jp/User/GTest/Introduction/Part2","text":"職業適性テスト（Gテスト）は10分程度（アドバンスまで実施すると18〜20分程度）。途中で計算が必要な問題が出題されるので計算用のメモを用意し、電卓は使わない。結果の職業例は職業探索のヒントとして使うもの（直接開けなかったため検索結果で確認）","used_in":"能力検査の準備"}],"not_used":["特定の検査会社・検査名、問題の例、出題数、合格ライン、受検料などは書かない（宣伝・転載を避け、会社ごとに違うため）","テストセンター・Web・ペーパーの受け方の違いについての公的な資料は見つからなかったため、一般的な違いの説明にとどめ、細かい決まりは「案内で確認する」と書いた","適性検査を実施する企業の割合などの統計は、出典を確認できなかったので書かない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'tekisei-kensa-tenshoku' and c.slug = 'shorui-mensetsu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'tekisei-kensa-tenshoku' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '事業主の皆様へ 採用選考の具体的な方法', '公正採用選考特設サイト（厚生労働省）', 'https://kouseisaiyou.mhlw.go.jp/methods.html', '2026-10-09'::date, '適性検査（職業適性検査・職業興味検査・性格検査など）は目的に応じて選び、専門的な知識のある人が用いること、結果を絶対視しないこと、検査だけで採否を決めず、適性・能力に関係のない事項を把握しないこと', 0 from articles where slug = 'tekisei-kensa-tenshoku';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '公正な採用選考の基本', '公正採用選考特設サイト（厚生労働省）', 'https://kouseisaiyou.mhlw.go.jp/basic.html', '2026-10-09'::date, '採用選考は、応募者の適性と能力に基づいた基準で行うことが基本とされていること', 1 from articles where slug = 'tekisei-kensa-tenshoku';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '事業主の皆様へ 採用選考自主点検資料 ～公正な採用選考を行うために～（令和8年度版）', '公正採用選考特設サイト（厚生労働省）', 'https://kouseisaiyou.mhlw.go.jp/assets/pdf/basic/02.pdf', '2026-10-09'::date, '適性検査は応募者の適性の一面を把握するものにすぎず、限界があると説明されていること', 2 from articles where slug = 'tekisei-kensa-tenshoku';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業適性テスト（Gテスト）', 'job tag（職業情報提供サイト、厚生労働省）', 'https://shigoto.mhlw.go.jp/User/GTest/Introduction/Part2', '2026-10-09'::date, 'job tag で職業適性テストを受けられること、途中で計算が必要な問題があり、計算用のメモを用意して電卓は使わないよう案内されていること、所要時間は10分程度であること、結果の職業例は職業を探すヒントとして使うものとされていること', 3 from articles where slug = 'tekisei-kensa-tenshoku';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'tekisei-kensa-tenshoku' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"88669e7acd29bee57c954a441713f30f5d82d06a4d6c1623057d7c8b8fec3204","findings":[]}'::jsonb from articles where slug = 'tekisei-kensa-tenshoku';
update articles set status = 'published' where slug = 'tekisei-kensa-tenshoku';

-- article: tenkin-kinmuchi-kakunin (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('tenkin-kinmuchi-kakunin', 'article', '転勤あり・なしはどこで分かる？求人の「就業場所の変更の範囲」の読み方と確認のしかた', '2024年4月から、求人や労働契約で、入社直後の働く場所に加えて「就業場所の変更の範囲」が示されるようになりました。「転勤なし」の書き方だけで判断せず、変更の範囲の読み方、求人票と労働条件通知書で見るところ、面接での聞き方の例を紹介します。', '「転勤がある会社だったらどうしよう」「求人に『転勤なし』とあったけど、本当に大丈夫？」。家族のことや今の暮らしを考えると、働く場所が変わるかどうかは大事な条件です。

先に結論を言うと、転勤があるかどうかは、**「転勤なし」という言葉だけでなく、「就業場所の変更の範囲」で確かめる**のが確実です。2024年4月から、求人や労働条件通知書に、入社直後の働く場所に加えて、その**変更の範囲**が書かれるようになりました。そのうえで、実際の頻度や地域は面接で聞きます。

この記事で分かること：

- 2024年4月から書かれるようになった**「変更の範囲」**とは
- 求人票・労働条件通知書の**読み方の例**
- 面接で転勤のことを**聞くときの質問例**

## 2024年4月から「変更の範囲」が書かれるようになった

2024年4月から、募集広告や職業紹介の段階で示される労働条件に、**就業場所の変更の範囲**と**業務の変更の範囲**などが加わりました。内定後に受け取る労働条件通知書（雇用契約書）でも、入社直後の働く場所と仕事に加えて、その変更の範囲が書かれます。

「変更の範囲」とは、**将来の異動などで、働く場所や仕事がどこまで変わる可能性があるか**ということです。厚生労働省のQ&Aでは、これは**その労働契約の期間中に想定される変更の範囲**を意味するとされています。

つまり、求人票に書かれている「勤務地」は入社直後の場所で、そのあと変わるかどうかは「変更の範囲」を見ないと分かりません。

## 「変更の範囲」の読み方

書き方は会社によって違いますが、たとえば次のように読めます。

| 書き方の例 | 読み方 |
| --- | --- |
| （雇入れ直後）〇〇営業所（変更の範囲）会社の定める営業所 | 会社のどの営業所にも異動する可能性がある |
| （雇入れ直後）〇〇店（変更の範囲）〇〇県内の店舗 | 県内の店舗には異動の可能性がある。県外への転勤は想定されていない |
| （雇入れ直後）本社（変更の範囲）本社 | 働く場所は変わらない想定 |
| （変更の範囲）雇入れ直後の就業場所と同じ | 働く場所は変わらない想定 |

```figure
type: compare
title: 変更の範囲の広さで読み方が変わる
columns:
  - label: 範囲が広い
    tone: sand
    items:
      - 会社の定める営業所
      - 全国のどこかへ異動の可能性
      - 頻度や地域は面接で確認
  - label: 範囲が限られる
    tone: sky
    items:
      - 〇〇県内の店舗、など
      - 住む場所を変えずに通える範囲か確認
  - label: 変わらない
    tone: mint
    items:
      - 雇入れ直後の場所と同じ
      - 異動しても通える場所だけか確認
```

### 「会社の定める営業所」と書いてあったら

限定がない場合、「会社の定める営業所」のような書き方が使われます。厚生労働省のQ&Aでは、こうした書き方をする場合も、トラブルを防ぐため**できる限り範囲を明確にするのが望ましい**とされています。

この書き方だけでは、実際に転勤がどのくらいあるのかは分かりません。全国に拠点があっても、ほとんど異動がない会社もあれば、数年ごとに異動するのが当たり前の会社もあります。ここは面接で聞いて確かめるところです。

### 出張や研修は別に考える

ハローワークの資料では、求人票に書く就業場所は**入社直後に通常働くことが想定される場所で、臨時的・一時的なものは除く**とされています。研修で一時的に別の場所に行く、繁忙期に応援に行く、といったことは変更の範囲とは別に考えられます。出張が多い仕事かどうかは、仕事内容の欄や面接で確かめましょう。

## 求人票と労働条件通知書で見るところ

見るところは、次の3か所です。

1. **勤務地（就業場所）**：入社直後にどこで働くか
2. **就業場所の変更の範囲**：将来どこまで変わる可能性があるか
3. **転勤の可能性の欄**（ハローワークの求人票など）：「あり」「なし」と、その説明

ハローワークの資料では、総合職など将来の異動が想定される場合に、求人票の「転勤の可能性」欄を「あり」とし、変更範囲を「会社の定める営業所」と書く例が示されています。

「転勤なし」と書いてあっても、変更の範囲が「会社の定める店舗」のように広くなっていれば、住む場所は変わらなくても通う店舗が変わる可能性があります。求人票と労働条件通知書の両方で、同じ内容になっているかを見比べてください。労働条件通知書の見方全体は、[内定をもらったら、承諾の前に確認すること](/articles/naitei-shodaku-mae)で紹介しています。

## 面接で、どう聞く？

変更の範囲は「可能性」なので、実際にどうなっているかは面接で聞くのがいちばん確かです。条件の質問だけを並べるより、働き方を理解したいという姿勢で聞くと自然です。

### 質問の例

- 「就業場所の変更の範囲が『会社の定める営業所』となっていましたが、中途入社の方は、入社後どのくらいで異動することが多いですか」
- 「転勤がある場合、どの地域への異動が多いでしょうか」
- 「異動の前に、本人の希望や事情を聞く機会はありますか」
- 「住む場所が変わる異動の場合、引っ越しの費用や住宅の補助はありますか」
- 「同じ地域で働き続けたい場合、選べるコースや制度はありますか」

```figure
type: checklist
title: 転勤について確かめたいこと
items:
  - 入社直後の勤務地
  - 就業場所の変更の範囲
  - 実際の異動の頻度と地域
  - 異動の前に希望を聞く機会があるか
  - 引っ越しを伴うときの費用や補助
  - 求人票と労働条件通知書が同じ内容か
```

面接の最後に聞くことの選び方は、[面接の逆質問、何を聞けばいい？](/articles/gyaku-shitsumon)も参考になります。

### 伝え方の例：転勤を避けたい事情があるとき

家族の介護や子育てなどで、転勤が難しい事情がある場合は、早めに伝えておくと、入社後の行き違いを防げます。

> 「家族の事情で、当面は〇〇（地域）から通える範囲で働きたいと考えています。御社では、勤務地についてどのような配慮をいただけるか、伺ってもよろしいでしょうか。」

## 家庭の事情があるときは

厚生労働省は2017年3月に「転勤に関する雇用管理のヒントと手法」という資料を公表し、会社が転勤のあり方を見直すときの考え方をまとめています。その中では、育児・介護休業法第26条で、会社が働く人を転勤させるときには、**子育てや介護の状況に配慮すること**が求められている点も整理されています。

ただし、どこまで配慮されるかは会社や状況によって違います。入社前に分かっている事情があれば、面接や内定後の条件確認の場で相談しておきましょう。

## まとめ

- 2024年4月から、求人や労働条件通知書に「就業場所の変更の範囲」が書かれるようになった
- 「転勤なし」の一言ではなく、変更の範囲で確かめる
- 「会社の定める営業所」のように広い書き方なら、頻度や地域を面接で聞く
- 求人票と労働条件通知書の内容が同じかを見比べる

入社後に「聞いていた話と違う」とならないように、入社前に確認しておきたいことは[転職で後悔しないために、入社前に確認したいこと](/articles/tenshoku-koukai-shinai)にもまとめています。販売・接客の正社員で、店舗の異動が気になる場合は、[販売・接客の仕事で正社員を目指すという選択](/articles/hanbai-seishain)も参考になります。', 'review', false, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '転勤あり・なしの確認｜「就業場所の変更の範囲」の読み方', '転勤があるかどうかは、求人のどこを見れば分かる？2024年4月から示されるようになった「就業場所の変更の範囲」の読み方、求人票と労働条件通知書で見るところ、面接で転勤の頻度や範囲を聞くときの質問例を紹介します。', array['naitei-shodaku-mae', 'tenshoku-koukai-shinai', 'hanbai-seishain', 'gentei-seishain', 'remote-work-kyujin']::text[], '{}'::text[], '{}'::text[], array['hajimete', 'seishain-keiken-sukunai']::text[], array['転勤あり・なし、', 'どこで分かる？']::text[], null, false, '[{"q":"求人に「転勤なし」と書いてあれば、ずっと同じ場所で働けますか？","a":"求人の「転勤なし」の一言だけでは分からないこともあります。2024年4月からは、求人や労働条件通知書に「就業場所の変更の範囲」が書かれるようになったので、そこが入社直後の勤務地と同じになっているかを確かめましょう。近くの店舗や事業所への異動があるかどうかも、面接で聞いておくと安心です。"},{"q":"「（変更の範囲）会社の定める営業所」とあるのは、転勤があるということですか？","a":"会社のどの営業所にも異動する可能性がある、という書き方です。実際にどのくらいの頻度で、どの地域に転勤があるかは書かれていないことが多いので、「中途入社の方は、入社後どのくらいで異動することが多いですか」のように面接で聞いて確かめましょう。"},{"q":"出張や研修で別の場所に行くのも「変更の範囲」に入りますか？","a":"求人票で示す就業場所は、入社直後に通常働くことが想定される場所で、臨時的・一時的なものは除くとされています。一時的な出張や研修、応援などは、変更の範囲とは別に考えられます。出張が多い仕事かどうかは、仕事内容の欄や面接で確かめましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「転勤なし」という言葉ではなく、2024年4月から書かれるようになった「就業場所の変更の範囲」で確かめる。変更の範囲は「可能性」なので、頻度・地域・打診のしかたは面接で聞く、という順番で整理する","quotes":[{"source_url":"https://www.mhlw.go.jp/content/001114167.pdf","text":"2024年4月から、募集広告や職業紹介を受ける際に、求人企業などから明示される労働条件が追加される（従事すべき業務の変更の範囲、就業場所の変更の範囲など）（直接接続できなかったため、検索結果に表示された資料の題名と記述で確認）","used_in":"2024年4月から「変更の範囲」が書かれるようになった"},{"source_url":"https://www.mhlw.go.jp/content/11200000/001156119.pdf","text":"就業の場所及び従事すべき業務の変更の範囲とは、当該労働契約の期間中における変更の範囲を意味する。就業場所・業務に限定がない場合は「会社の定める〇〇」と記載するほか、一覧表を別途手交することも考えられるが、トラブル防止のため、できる限り範囲を明確にするのが望ましい（直接接続できなかったため、検索結果に表示された記述で確認）","used_in":"「変更の範囲」の読み方"},{"source_url":"https://jsite.mhlw.go.jp/kanagawa-hellowork/content/contents/001816785.pdf","text":"求人票には、雇い入れ直後に通常従事することが想定される業務及び就業場所（臨時的、一時的なものを除く）を記載。総合職など将来の異動が想定される場合は、求人票の「転勤の可能性の有無」欄をありとし、「変更範囲：会社の定める営業所」と記載する例（直接接続できなかったため、検索結果に表示された資料の題名と記述で確認）","used_in":"求人票で見るところ"},{"source_url":"https://www.mhlw.go.jp/stf/houdou/0000158686.html","text":"2017年3月に「転勤に関する雇用管理のヒントと手法」を公表。転勤に関して踏まえるべき法規範として、育児・介護休業法第26条（労働者の配置に関する配慮）などを整理している（直接接続できなかったため、検索結果に表示された記述で確認）","used_in":"家庭の事情があるときは"}],"not_used":["転勤命令の有効性に関する裁判例（権利の濫用にあたる場合など）は、民間の解説記事でしか確認できなかったため、法律の解釈としては書かない","転勤の頻度や、転勤がある会社の割合などの統計は書かない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'tenkin-kinmuchi-kakunin' and c.slug = 'hatarakikata' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'tenkin-kinmuchi-kakunin' and c.slug = 'seido' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年4月から、募集広告や職業紹介を受ける際に、求人企業などから明示される労働条件が追加されます。企業から受ける労働条件明示のルールが変わります！（求職者向けリーフレット）', '厚生労働省', 'https://www.mhlw.go.jp/content/001114167.pdf', '2026-10-09'::date, '2024年4月から、募集広告や職業紹介の際に明示される労働条件に、就業場所・業務の変更の範囲などが加わったこと', 0 from articles where slug = 'tenkin-kinmuchi-kakunin';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '令和5年改正労働基準法施行規則等に係る労働条件明示等に関するQ&A', '厚生労働省', 'https://www.mhlw.go.jp/content/11200000/001156119.pdf', '2026-10-09'::date, '変更の範囲は労働契約の期間中に想定される変更の範囲であること。限定がない場合に「会社の定める〇〇」と書く場合も、できる限り範囲を明確にするのが望ましいとされていること', 1 from articles where slug = 'tenkin-kinmuchi-kakunin';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '求人票には、雇い入れ直後に、通常従事することが想定される業務及び就業場所（臨時的、一時的なものを除く）を記載（ハローワークの資料）', '神奈川労働局（ハローワーク）', 'https://jsite.mhlw.go.jp/kanagawa-hellowork/content/contents/001816785.pdf', '2026-10-09'::date, '求人票の就業場所は入社直後に通常想定される場所（臨時的・一時的なものを除く）であること。将来の異動が想定される場合、求人票の「転勤の可能性」欄を「あり」とし、変更範囲を「会社の定める営業所」のように書く例', 2 from articles where slug = 'tenkin-kinmuchi-kakunin';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '「転勤に関する雇用管理のヒントと手法」を公表します', '厚生労働省', 'https://www.mhlw.go.jp/stf/houdou/0000158686.html', '2026-10-09'::date, '2017年3月に厚生労働省が転勤の雇用管理の資料を公表したこと。育児・介護休業法第26条で、転勤させるときに子育てや介護の状況への配慮が求められていること', 3 from articles where slug = 'tenkin-kinmuchi-kakunin';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'tenkin-kinmuchi-kakunin' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"f98f9086922c0436fff95e2c917620e546d16988b6929936ddb24c9d81f7082f","findings":[]}'::jsonb from articles where slug = 'tenkin-kinmuchi-kakunin';
update articles set status = 'published' where slug = 'tenkin-kinmuchi-kakunin';

-- article: tenshoku-agent-merit (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('tenshoku-agent-merit', 'article', 'はじめて・未経験の転職こそ、転職エージェントに相談したほうがいい理由｜頼めることと注意点', 'はじめての転職や未経験の仕事への転職は、迷うところが多いぶん、人材紹介会社のキャリアアドバイザー（転職エージェント）に相談しながら進めると、ひとりで抱える負担を減らせます。頼めること、求職者が原則無料のしくみ、ひとりで進める場合との違い、使うときの注意点を紹介します。', 'はじめての転職や、やったことのない仕事への転職は、「何から始めればいいか」「自分の経歴で応募できる仕事はあるのか」と、迷うところがたくさんあります。

先に結論を言うと、**はじめて・未経験の転職ほど、ひとりで進めるより、転職のプロに相談しながら進めたほうが進めやすくなります**。ここでいう転職のプロは、人材紹介会社のキャリアアドバイザー（転職エージェント）のことです。

この記事で分かること：

- はじめて・未経験の転職で、**ひとりだと迷いやすいところ**
- 転職エージェントに**頼めること**
- 求職者は**原則無料**で使えるしくみ
- 使うときの**注意点**と、上手な使い方

転職サイト・転職エージェント・ハローワークのしくみの違いは[転職サイト・転職エージェント・ハローワークの違いは？](/articles/tenshoku-service-chigai)、面談でそのまま使える相談の言い方は[転職エージェントに、何を相談すればいい？](/articles/agent-soudan-nani)にまとめています。この記事では、「なぜ相談したほうがいいのか」に絞って紹介します。

## はじめて・未経験の転職で、ひとりだと迷いやすいところ

転職がはじめてだったり、経験のない仕事を目指していたりすると、次のようなところで手が止まりがちです。

- **どの仕事なら応募できるのか分からない**：求人をいくつ見ても、自分の経験で応募していいのか判断がつかない
- **求人票だけでは会社の様子が分からない**：「未経験歓迎」「研修あり」と書いてあっても、実際にどこまで教えてもらえるのか分からない
- **書類に何を書けばいいか分からない**：接客やアルバイトの経験を、どう書けば伝わるのか迷う
- **面接で何を聞かれるか分からない**：「なぜ未経験の仕事を選んだのか」にうまく答えられるか不安
- **連絡や調整に手が回らない**：働きながらだと、面接の日程調整や条件の確認に時間を取られる

どれも、転職に慣れている人なら経験で乗り越えられることです。でも、はじめての人にとっては、ひとつずつ調べて判断するだけで時間と気力を使います。ここを一緒に考えてくれる相手がいるかどうかで、進めやすさは大きく変わります。

## 転職エージェントに頼めること

人材紹介会社のキャリアアドバイザーには、一般的に次のようなことを頼めます。サポートの範囲は会社によって違うので、最初の面談で「どこまで手伝ってもらえますか？」と聞いておくと安心です。

### 1. 求人の紹介

これまでの経験と希望を伝えると、それに合いそうな求人を紹介してもらえます。「この経歴で応募できる仕事はあるのか」を、ひとりで求人を見比べるより早くつかみやすくなります。

### 2. 企業選びの相談

「事務と営業のどちらが向いているか」「この会社とあの会社、どちらが自分の希望に近いか」といった迷いを相談できます。求人票に書かれていない職場の雰囲気や、未経験で入った人がどんな研修を受けているかなどを、知っている範囲で教えてもらえることもあります。

### 3. 応募書類の添削

履歴書や職務経歴書を見てもらい、伝わりにくいところを指摘してもらえます。たとえば「レジ・接客を担当」とだけ書いていたところを、「1日〇人ほどのお客様の問い合わせに対応」のように、何をどのくらいしていたかが分かる書き方に直す、といった相談ができます。

### 4. 面接の練習

応募先でよく聞かれる質問や、答え方の練習に付き合ってもらえます。自分では気づきにくい「話が長い」「結論が後ろにある」といったクセも、人に聞いてもらうと分かります。

### 5. 日程や条件の調整

面接の日程調整や、給与・入社日などの条件の確認を、間に入って進めてもらえます。給料や残業のことなど、自分からは聞きにくいことを確認してもらえるのも助かるところです。

## ひとりで進める場合と、何が違う？

ひとりで進める場合と、キャリアアドバイザーに相談しながら進める場合を比べると、次のようになります。

```figure
type: compare
title: ひとりで進める・相談しながら進める
columns:
  - label: ひとりで進める
    tone: sand
    items:
      - 求人探しも応募も、すべて自分で判断する
      - 書類や面接の準備は、自分で調べて進める
      - 日程調整や条件の確認も自分で連絡する
      - 自分のペースで進めやすい
  - label: 相談しながら進める
    tone: mint
    items:
      - 経験と希望に合いそうな求人を紹介してもらう
      - 書類の添削や面接の練習を頼める
      - 日程や条件の調整を間に入って進めてもらう
      - 迷ったときに相談できる相手がいる
```

ひとりで進めるほうが合う人もいます。応募したい会社がはっきり決まっている人や、自分のペースで進めたい人です。一方で、**何が自分に合うか分からない、書類や面接に自信がない、働きながらで時間がない**という人は、相談しながら進めたほうが、迷う時間を減らしやすくなります。

## 求職者は原則無料。お金はどこから出ている？

「プロに相談するなら、お金がかかるのでは？」と心配になるかもしれません。

職業安定法では、人材紹介会社（有料職業紹介事業者）は、**求職者から原則として手数料を受け取ってはいけない**とされています。人材紹介会社は、主に、紹介した人を採用した企業から手数料を受け取って運営しています。

例外として、芸能家やモデルなど、法令で決められた一部の職業では求職者から手数料を受け取れることがあります。はじめての転職や未経験の仕事への転職で、こうした例外に当てはまることはあまりありません。登録や相談に料金がかかると言われたら、理由を確認し、納得できなければ利用を見送りましょう。

相談先が、国の許可を受けた職業紹介事業者かどうかは、厚生労働省の「人材サービス総合サイト」で、事業者名や許可番号から調べられます。厚生労働省のリーフレットでは、このサイトで手数料や就職実績などの情報が公開されているかも確認するよう案内されています。

## 未経験の転職で、相談が特に役に立つ場面

未経験の仕事を目指すときは、次のような場面で相談の効果を感じやすいはずです。相談するときの言い方の例もあわせて紹介します。

**接客の経験を、どう伝えればいいか分からないとき**

> 「飲食店で4年接客をしてきました。事務の仕事に応募したいのですが、接客の経験は書類でどう書けば伝わりますか？」

**研修がどのくらいあるか知りたいとき**

> 「未経験で入った人は、入社してからどんな研修を受けていますか？最初の1か月はどんな仕事をすることが多いですか？」

研修のある求人で確認したいことは[未経験求人の「研修あり」で確認すべきこと](/articles/mikeiken-kenshu-kakunin)も参考にしてください。

**聞きにくい条件を確かめたいとき**

> 「この求人の月給には、固定残業代が含まれていますか？残業は月にどのくらいありますか？」

こうしたことを、応募の前に聞いておけると、入社してから「思っていたのと違う」と感じることを減らしやすくなります。

## 使うときに気をつけたいこと

相談しながら進めるのはおすすめですが、気をつけたいこともあります。

- **担当者と合わないことがある**：話がかみ合わない、希望と違う求人ばかり紹介される、と感じることもあります。まずは希望を具体的に伝え直し、それでも合わなければ、担当を変えてもらえるか問い合わせて構いません
- **すすめられた求人を、そのまま受けない**：紹介される求人は、その会社が扱っている求人の中からになります。すすめられた理由を聞き、自分の希望と合っているかを自分の目で確かめましょう
- **応募するかどうかは、自分で決める**：面談を受けたからといって、応募しなければいけないわけではありません。迷うときは「一度考えてから返事をします」と伝えて大丈夫です

だからこそ、転職エージェントは「全部おまかせする相手」ではなく、**迷ったときに一緒に考えてくれる相談相手**として使うのがおすすめです。

```figure
type: checklist
title: 相談相手として上手に使うコツ
items:
  - 希望の条件と、ゆずれない理由を伝える
  - すすめられた理由を聞いてから決める
  - 合わない求人は、理由を添えて断る
  - 気になることは、応募の前に聞いておく
  - 最後に決めるのは自分、と考えておく
```

## まとめ：相談の前に整理しておくこと

はじめて・未経験の転職は、迷うところが多いぶん、ひとりで抱え込むより、人材紹介会社のキャリアアドバイザー（転職エージェント）に相談しながら進めたほうが進めやすくなります。求職者は原則無料で、求人の紹介から書類・面接の準備、日程や条件の調整まで頼めます。

相談を考えているなら、面談の前に次の3つを軽く整理しておくと、話がスムーズに進みます。

- **転職したい時期の目安**（例：「3か月以内に働き始めたい」）
- **ゆずれない条件を1〜2個**（例：「土日休み」「通勤は片道1時間以内」）
- **これまでの経歴の事実**（いつからいつまで、どんな仕事をしていたか）

すべてを決めてから行く必要はありません。面談の前に決めておくこと・決めなくていいことは、[エージェント面談の前に決めておくこと・決めなくていいこと](/articles/agent-mendan-mae)にまとめています。', 'review', true, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-10'::timestamptz, '未経験の転職こそ転職エージェントに相談したほうがいい理由', 'はじめて・未経験の転職は、転職エージェントに相談しながら進めると迷う時間を減らせます。求人紹介・企業選び・書類添削・面接練習・日程や条件の調整など頼めること、求職者が原則無料のしくみ、使うときの注意点を紹介します。', array['tenshoku-service-chigai', 'agent-soudan-nani', 'agent-mendan-mae', 'mensetsu-renshu-pro', 'kigyou-erabi-soudan']::text[], '{}'::text[], array['mikeiken-shokushu']::text[], array['hajimete', 'seishain-keiken-sukunai']::text[], array['はじめての転職、', 'ひとりで進める？']::text[], null, false, '[{"q":"転職エージェントは、本当に無料で使えるのですか？","a":"人材紹介会社（有料職業紹介事業者）は、職業安定法で、求職者から原則として手数料を受け取ってはいけないとされています。主に、人を採用した企業から手数料を受け取るしくみです。芸能家やモデルなど一部の職業には例外がありますが、はじめての転職や未経験の仕事への転職で当てはまることはあまりありません。料金がかかると言われたら、理由を確認しましょう。"},{"q":"紹介された求人には、全部応募しないといけませんか？","a":"応募するかどうかは自分で決めます。紹介された求人でも、条件や仕事内容が希望と合わなければ、理由を添えて断って構いません。「通勤が片道1時間を超えるので見送ります」のように理由を伝えると、次に紹介される求人が希望に近づきやすくなります。"},{"q":"担当のキャリアアドバイザーと合わないと感じたら、どうすればいいですか？","a":"まずは「土日休みを最優先にしたい」など、希望をあらためて具体的に伝えてみましょう。それでも話がかみ合わないときは、担当者を変えてもらえるか問い合わせる方法もあります。ひとつの相談先にこだわらず、ハローワークなど別の窓口とあわせて使うのもひとつの方法です。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"既存の tenshoku-service-chigai（3つのサービスのしくみの違い）と agent-soudan-nani（相談の言い方）と役割を分け、「はじめて・未経験の転職で、なぜ相談しながら進めたほうがいいか」に絞る。ひとりで進める場合との違いを図解で見せ、注意点（合わない担当者・すすめられた求人をそのまま受けない・応募は自分で決める）も短く正直に書いたうえで、前向きな使い方で結ぶ。特定の会社名・サービス名は書かない","quotes":[{"source_url":"https://laws.e-gov.go.jp/law/322AC0000000141","text":"第三十二条の三で、有料職業紹介事業者は求職者から原則として手数料を徴収してはならず、求職者の利益のために必要と認められるときとして厚生労働省令で定めるときに限り例外があるとされている（要約）。e-Gov と mhlw.go.jp に直接接続できなかったため、厚生労働省の資料が「有料職業紹介事業者は、求職者から原則として手数料を徴収してはならない（第32条の3）」と説明している検索結果と、施行規則第20条で芸能家・モデルなどが例外とされているとの検索結果で確認した","used_in":"求職者は原則無料。お金はどこから出ている？"},{"source_url":"https://www.mhlw.go.jp/content/000851397.pdf","text":"求職者向けリーフレット。人材サービス総合サイトに許可事業者として記載があるか、手数料や就職実績が公開されているかを確認するよう案内している（PDF に直接接続できなかったため、検索結果に表示された内容で確認）","used_in":"求職者は原則無料。お金はどこから出ている？"},{"source_url":"https://jinzai.hellowork.mhlw.go.jp/JinzaiWeb/","text":"厚生労働省の人材サービス総合サイト。職業紹介事業・労働者派遣事業などを行う事業者を検索できる（既存の公開記事で使っている URL。今回は検索結果に表示された同サイトの手数料表ページで、許可番号ごとに事業者情報が掲載されていることを確認）","used_in":"求職者は原則無料。お金はどこから出ている？"}],"not_used":["転職エージェントを使った人の内定率・満足度・年収の変化などの数字は、公的な根拠がなく、成果を約束する表現にもなるため書かない","求職者から手数料を受け取れる例外のうち、年収要件のある職業（経営管理者など）の金額は、今回の読者にほぼ関係がなく、施行規則の原文を直接確認できなかったため書かない","紹介手数料の相場（理論年収の〇％など）は事業者ごとに違い、公的な一般値を確認できなかったので書かない","サポートの範囲（面接練習の有無など）は事業者によって違うため、一般的な例として書き、最初に確認するようすすめた","利用者の体験談・口コミは使っていない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'tenshoku-agent-merit' and c.slug = 'junbi' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'tenshoku-agent-merit' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業安定法（昭和二十二年法律第百四十一号）', 'e-Gov法令検索（デジタル庁）', 'https://laws.e-gov.go.jp/law/322AC0000000141', '2026-10-10'::date, '有料職業紹介事業者は、求職者から原則として手数料を徴収してはならないこと（第32条の3）。例外は厚生労働省令で定める場合に限られること', 0 from articles where slug = 'tenshoku-agent-merit';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業紹介事業者を利用するときに知っておきたいこと（求職者の皆さまへ）', '厚生労働省・都道府県労働局', 'https://www.mhlw.go.jp/content/000851397.pdf', '2026-10-10'::date, '人材サービス総合サイトで、許可を受けた事業者として載っているか、手数料や就職実績の情報が公開されているかを確認できること', 1 from articles where slug = 'tenshoku-agent-merit';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '人材サービス総合サイト', '厚生労働省', 'https://jinzai.hellowork.mhlw.go.jp/JinzaiWeb/', '2026-10-10'::date, '職業紹介事業を行う事業者を、事業者名や許可番号から検索できること', 2 from articles where slug = 'tenshoku-agent-merit';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'tenshoku-agent-merit' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"bf744f90e0e8224db4dda13c84b55dd337a74928ddb4e9da051f34c164626d95","findings":[]}'::jsonb from articles where slug = 'tenshoku-agent-merit';
update articles set status = 'published' where slug = 'tenshoku-agent-merit';

-- article: tenshoku-kaisu-kininaru (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('tenshoku-kaisu-kininaru', 'article', '転職回数が気になるときに整理したいこと｜説明のしかたと次の選び方', '短期間での離職や転職回数の多さが気になるときは、隠すよりも事実を整理し、次の職場で何を変えたいのかを説明できるようにしておくことが大切です。経歴の整理のしかたと、伝え方の型を紹介します。', '「転職回数が多いと、書類で落とされるのでは」「短期間で辞めた経歴をどう説明すればいいか分からない」。こうした不安から、転職活動そのものに踏み出せなくなる人は少なくありません。

転職回数の受け止め方は会社によって違いますが、どの会社に対しても共通して大切なのは、**経歴を正直に整理し、次は何を変えたいのかを自分の言葉で説明できること**です。

## まずは経歴を時系列で書き出す

最初に、これまでの職歴を時系列で書き出します。記憶があいまいなまま面接に臨むと、説明が二転三転して不安な印象を与えやすくなります。

| 書き出す項目 | ポイント |
| --- | --- |
| 期間 | 入社と退職の年月。雇用保険の記録や給与明細で確認すると正確 |
| 雇用形態 | 正社員・契約社員・アルバイトなど |
| 仕事内容 | 担当していた作業を具体的に |
| 辞めた理由 | 本音のままでよい（あとで整理する） |
| 得たこと | できるようになったこと、気づいたこと |

アルバイトや短期間の仕事も、いったんすべて書き出してください。書類に載せるかどうかは、そのあとで決めれば大丈夫です。

## 辞めた理由に共通点がないかを見る

書き出した「辞めた理由」を並べてみると、共通点が見つかることがあります。

- 仕事内容が入社前のイメージと違った
- 勤務時間や休日が生活に合わなかった
- 人間関係や相談できる環境がなかった
- 将来のキャリアが見えなかった

共通点が見つかったら、それが**次の仕事選びで確認すべきこと**です。たとえば「仕事内容がイメージと違った」が続いているなら、次は仕事内容を入社前にもっと具体的に確かめる必要があります。

```figure
type: compare
style: before-after
title: 辞めた理由の共通点を、次の確認ポイントに
columns:
  - label: 辞めた理由の共通点
    items:
      - 仕事内容が入社前のイメージと違った
  - label: 次の仕事選びで確認すること
    items:
      - 仕事内容を入社前にもっと具体的に確かめる
```

2024年4月からは、求人や労働契約の際に「業務の変更の範囲」や「就業場所の変更の範囲」も明示されるようになりました。入社後に仕事内容や勤務地が変わる可能性も、事前に確認しやすくなっています。

## 説明は「事実 → 学び → 次の選び方」の順で

面接で転職回数や短期離職について聞かれたときは、次の順で答えると伝わりやすくなります。

1. **事実**: いつ、どんな理由で辞めたのかを簡潔に
2. **学び**: その経験から気づいたこと
3. **次の選び方**: だから今回は何を重視して仕事を選んでいるか

```figure
type: steps
title: 転職回数を聞かれたときの答え方
items:
  - label: 事実
    text: いつ、どんな理由で辞めたのかを簡潔に
  - label: 学び
    text: その経験から気づいたこと
  - label: 次の選び方
    text: 今回は何を重視して仕事を選んでいるか
```

たとえば、次のような伝え方です。

> 前職は半年で退職しました。入社前に営業の訪問件数のイメージを十分に確認しておらず、想定していた働き方と大きく違ったことが理由です。この経験から、仕事内容を具体的に確認してから選ぶことの大切さに気づきました。今回は、1日の業務の流れや評価のされ方を事前に伺ったうえで、長く続けられると考えた御社に応募しています。

ポイントは、前の会社を悪く言うことではなく、**自分の判断のしかたが変わったこと**を伝えることです。

## 次の職場選びで同じことを繰り返さないために

転職回数そのものよりも気にしたいのは、同じ理由で辞めることを繰り返してしまうことです。次の職場を選ぶときは、次の点を意識してみてください。

- 辞めた理由の共通点にあたる条件を、面接や面談で必ず確認する
- 応募前に、職種の仕事内容を記事や職業情報サイトで調べておく
- 迷ったら、第三者に経歴と希望を聞いてもらい、客観的な意見をもらう

経歴の伝え方は一人で考えると堂々巡りになりやすいものです。キャリアアドバイザーとの面談では、こうした経歴の整理や伝え方の相談もできます。志望動機の組み立て方は[未経験職種の志望動機、何を書けばいい？](/articles/shiboudouki-mikeiken)も参考にしてください。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['shiboudouki-mikeiken', 'agent-mendan-mae', 'sekkyaku-keiken-ikasu']::text[], '{}'::text[], array['mensetsu', 'yametai']::text[], array['kaisu', 'dainishinsotsu']::text[], array['転職回数が気になる。', 'どう説明する？']::text[], null, false, '[{"q":"短期間で辞めた職歴は、履歴書に書かなくてもいいですか？","a":"職歴は正確に書くのが基本です。書かなかった職歴があとで分かると、内容そのものより「伝えていなかったこと」が問題になる場合があります。短期間の職歴こそ、理由と学んだことを簡潔に添えて書きましょう。"},{"q":"前の職場の不満を正直に話してもいいのでしょうか？","a":"事実として話すのは構いませんが、不満だけで終わると「次も同じ理由で辞めるのでは」と受け取られやすくなります。「その経験から、次は何を重視して仕事を選んでいるか」までセットで伝えるのがおすすめです。"}]'::jsonb, null, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'tenshoku-kaisu-kininaru' and c.slug = 'shorui-mensetsu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'tenshoku-kaisu-kininaru' and c.slug = 'keiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年4月から労働条件明示のルールが変わります', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_32105.html', '2026-10-06'::date, '入社前に確認できる労働条件（業務・就業場所の変更の範囲など）', 0 from articles where slug = 'tenshoku-kaisu-kininaru';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業情報提供サイト（job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/', '2026-10-06'::date, '次に選ぶ職種の仕事内容を事前に調べる方法', 1 from articles where slug = 'tenshoku-kaisu-kininaru';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'tenshoku-kaisu-kininaru' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"94e1525b8de110f88e1b2f76d93661371f27571058a6814b2a8789154684f726","findings":[]}'::jsonb from articles where slug = 'tenshoku-kaisu-kininaru';
update articles set status = 'published' where slug = 'tenshoku-kaisu-kininaru';

-- article: tenshoku-koukai-shinai (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('tenshoku-koukai-shinai', 'article', '転職で後悔しないために、入社前に確認したいこと｜労働条件通知書・求人票との違い・休日・残業・試用期間・配属', '入社してから「聞いていた話と違う」とならないためには、内定の承諾前に、労働条件を書面で受け取り、求人票や面接で聞いた内容と照らし合わせることが大切です。労働基準法第15条の労働条件の明示のしくみ、休日・残業・試用期間・配属で見るところ、違いがあったときの聞き方を紹介します。', '「休みは土日と聞いていたのに、月に何回か出勤がある」「事務で応募したのに、配属は営業だった」。転職したあとの「こんなはずじゃなかった」は、入社前に確かめられたことが少なくありません。

先に結論を言うと、後悔を減らすいちばんの方法は、**内定を承諾する前に、労働条件を書面で受け取り、求人票と面接で聞いた内容と照らし合わせること**です。

この記事で分かること：

- 会社に**労働条件を示す決まり**があること（労働基準法第15条）
- 求人票・面接・労働条件通知書の**照らし合わせ方**
- **休日・残業・試用期間・配属**で見るところ
- 違いがあったときの**聞き方と相談先**

## 会社には、労働条件を示す決まりがある

労働基準法第15条では、会社は労働契約を結ぶときに、働く人に**賃金、労働時間その他の労働条件を示さなければならない**とされています。そのうち、賃金や労働時間など法律で決められた事項は、原則として**書面で**示すことになっています。この書面は「労働条件通知書」などの名前で渡されることが多いです。

書面で示す主な項目は次のとおりです。

- 契約の期間（期間の定めがあるかどうか）
- 働く場所と、する仕事
- 始業・終業の時刻、残業の有無、休憩、休日、休暇
- 賃金の決め方、計算と支払いの方法、締め日と支払日
- 退職に関すること（解雇の理由を含む）

また、同じ第15条では、示された労働条件が**事実と違う場合、働く人はすぐに労働契約を解除できる**とされています。それだけ、入社前に示される条件は大事なものだということです。

まだ書面を受け取っていないなら、承諾の前にお願いしましょう。

> 「内定のご連絡をいただき、ありがとうございます。お返事の前に、労働条件を書面で確認させていただけますでしょうか。」

条件を確かめたいと言うのは、失礼なことではありません。受け取ったあとの全体の見方は[内定をもらったら、承諾の前に確認すること](/articles/naitei-shodaku-mae)にまとめています。

## 求人票・面接・書面の3つを照らし合わせる

条件は、応募から内定までに3回、形を変えて出てきます。それぞれの内容を並べて、違うところがないかを見ます。

```figure
type: steps
title: 条件は3か所で照らし合わせる
items:
  - label: 求人票
    text: 応募のときに見た条件。保存しておく
  - label: 面接
    text: 説明されたことや聞いた答えをメモする
  - label: 労働条件通知書
    text: 承諾の前に受け取り、前の2つと比べる
```

- **求人票は保存しておく**：求人サイトの掲載は終わると見られなくなることがあります。応募した時点で画面を保存したり、印刷したりしておきましょう
- **面接の内容はメモする**：面接のあとに、説明された仕事の内容、休日、残業などを書き留めておきます
- **書面で最終確認**：労働条件通知書が、求人票や面接の内容と合っているかを確かめます

## 休日：「週休2日制」と「完全週休2日制」は違う

休日は、曜日だけでなく言葉の違いに注意します。

- **完全週休2日制**：毎週2日の休みがある
- **週休2日制**：週2日の休みがある週がある、という意味で使われ、毎週2日休みとは限らない

あわせて、**年間の休日の日数**、祝日や年末年始・夏季の休みの扱い、シフト制かどうかも見ましょう。

> 「求人票に週休2日制とありましたが、月に何回くらい土曜日の出勤がありますか。」

休日と給料をあわせて比べたいときは、[「土日休み」と「年収」をどう比較する？](/articles/donichi-yasumi-nenshu-hikaku)が参考になります。

## 残業：時間の実績と、残業代の払われ方

残業は、求人票の「残業あり」だけでは実際の様子が分かりません。

- **平均の残業時間の実績**：求人票や会社の情報に、月の平均が書かれていないか
- **繁忙期の働き方**：忙しい時期はいつで、どのくらい残業が増えるか
- **固定残業代**：月給に一定時間分の残業代が含まれていないか。含まれている場合は、何時間分でいくらか、超えた分は別に払われるか

> 「1日の流れを教えていただけますか。忙しい時期は、何時ごろまで働くことが多いでしょうか。」

新卒などを対象にした求人では、残業時間の実績などの「職場の情報」を確認できることがあります。見方は[求人で「職場の情報」を確かめるには？](/articles/shokuba-jouhou-wakamono)で紹介しています。

## 試用期間：期間と、そのあいだの条件

試用期間がある会社では、次の点を確かめます。

- **期間の長さ**と、延長されることがあるか
- 試用期間中と本採用後で、**給料や手当などの条件が変わるか**
- 試用期間中も、**社会保険に入るか**

試用期間中だけ給料が低い、契約社員として始まる、といった場合は、求人票と労働条件通知書の両方に書かれているかを見ます。法律上の扱いや確認の言い方は[試用期間って何？](/articles/shiyou-kikan)にまとめています。

## 配属：最初の仕事と「変更の範囲」

「事務で応募したのに別の仕事に」という行き違いを防ぐには、**入社直後の仕事と働く場所**に加えて、**将来どこまで変わる可能性があるか**を見ます。

2024年4月1日から、労働契約を結ぶときに、入社直後の働く場所と仕事に加えて、**その変更の範囲**も示すことになりました。対象は、正社員だけでなく、パート・アルバイトや契約社員なども含むすべての働く人です。2024年4月からは、求人の段階でも、仕事と働く場所の変更の範囲が示されるようになっています。

たとえば、仕事の内容が「（雇入れ直後）一般事務　（変更の範囲）会社の定める業務」となっていれば、事務以外の仕事に変わる可能性があると読めます。働く場所の変更の範囲が広ければ、転勤の可能性もあります。

> 「入社後は、どちらの部署に配属される予定でしょうか。配属はいつごろ、どのように決まりますか。」

配属が入社後の研修のあとに決まる会社もあります。その場合は、これまでどんな部署に配属された人が多いかを聞いてみましょう。

## 求人票と違うところがあったら

照らし合わせて違うところが見つかったら、承諾の前に**理由を確かめる**のが先です。厚生労働省の「確かめよう労働条件」でも、まず違いが生じた理由を確かめることが第一とされています。書きまちがいのこともあれば、条件が変わっていることもあります。

> 「求人票では完全週休2日制と拝見していましたが、通知書では週休2日制となっていました。休日の決まり方を教えていただけますか。」

```figure
type: checklist
title: 承諾の前に見直すこと
items:
  - 労働条件通知書を書面で受け取ったか
  - 仕事の内容と働く場所、その変更の範囲
  - 休日の言葉（完全週休2日制か）と年間の日数
  - 残業時間の実績と、固定残業代の有無
  - 試用期間の長さと、そのあいだの条件
  - 求人票・面接と違うところの理由を聞いたか
```

説明に納得できないときは、返事を急がずに考えましょう。返事の期限を延ばしてほしいときは、早めに相談します。

- **ハローワークの求人**の場合は、求人票と説明が違うことをハローワークの窓口に申し出られます
- 入社前後の条件のことで困ったら、都道府県労働局や労働基準監督署などにある**総合労働相談コーナー**でも相談できます

入社前に少し手間をかけて確かめておけば、入社してからの「こんなはずじゃなかった」を減らせます。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '転職で後悔しないために入社前に確認したいこと｜労働条件', '入社後に「聞いていた話と違う」とならないための確認ポイントを紹介します。労働基準法第15条の労働条件の明示、労働条件通知書と求人票の照らし合わせ方、休日・残業・試用期間・配属で見るところ、違いがあったときの聞き方と相談先が分かります。', array['naitei-shodaku-mae', 'shiyou-kikan', 'nenshu-dake-erabanai', 'koteizangyo-kyujin', 'naitei-jitai-tsutaekata', 'naitei-go-junbi', 'tenkin-kinmuchi-kakunin', 'kigyou-erabi-soudan']::text[], '{}'::text[], array['donichi', 'kyuryo', 'seishain']::text[], array['hajimete', 'dainishinsotsu']::text[], array['入社してから', '「話が違う」を防ぐ']::text[], null, false, '[{"q":"労働条件通知書をもらえないまま入社日が近づいています。どうすればいいですか？","a":"労働基準法第15条では、会社は労働契約を結ぶときに、賃金や労働時間などの労働条件を示さなければならないとされています。「入社前に、労働条件を書面で確認させていただけますか」と採用担当者にお願いしてみましょう。それでも示されないときは、総合労働相談コーナーやハローワークに相談できます。"},{"q":"求人票と労働条件通知書の内容が違います。どちらが正しいのですか？","a":"厚生労働省の「確かめよう労働条件」では、求人票と説明が違う場合は、まずその違いが生じた理由を確かめることが第一とされています。書きまちがいのこともあれば、条件が変わっていることもあります。承諾の前に理由を聞き、納得できる説明がなければ返事を急がないようにしましょう。ハローワークの求人なら、ハローワークの窓口に申し出られます。"},{"q":"入社してから、条件が説明と違うと分かったらどうなりますか？","a":"労働基準法第15条では、示された労働条件が事実と違う場合、働く人はすぐに労働契約を解除できるとされています。ただ、辞める前に、まず会社に確認し、話し合いで解決できないかを考えましょう。どう動けばいいか迷ったら、総合労働相談コーナーで相談できます。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「後悔しない」を気持ちの問題ではなく、入社前に書面で何を確かめるかに落とし込む。労働基準法第15条を軸に、求人票→面接→労働条件通知書の順に照らし合わせる方法と、休日・残業・試用期間・配属の見るところを示す","quotes":[{"source_url":"https://laws.e-gov.go.jp/law/322AC0000000049","text":"第十五条第一項「使用者は、労働契約の締結に際し、労働者に対して賃金、労働時間その他の労働条件を明示しなければならない。この場合において、賃金及び労働時間に関する事項その他の厚生労働省令で定める事項については、厚生労働省令で定める方法により明示しなければならない。」第二項「前項の規定によつて明示された労働条件が事実と相違する場合においては、労働者は、即時に労働契約を解除することができる。」（e-Gov に直接接続できなかったため、WebSearch の検索結果に表示された条文の記述で確認。書面で明示する事項の内容は、検索結果に表示された労働基準法施行規則第5条の記述で確認）","used_in":"会社には、労働条件を示す決まりがある"},{"source_url":"https://www.mhlw.go.jp/content/001114167.pdf","text":"2024年4月から、募集広告や職業紹介を受ける際に、求人企業などから明示される労働条件が追加される（従事すべき業務の変更の範囲、就業場所の変更の範囲など）（直接接続できなかったため、検索結果に表示された資料の題名と記述で確認）","used_in":"配属：最初の仕事と「変更の範囲」"},{"source_url":"https://muki.mhlw.go.jp/rule.html","text":"労働契約の締結時と有期労働契約の更新時に、雇入れ直後の就業場所・業務に加えて、変更の範囲を明示。対象はパート・アルバイト、契約社員、派遣労働者なども含むすべての労働者。臨時の応援業務や出張、研修など一時的な変更先は含まれない（直接接続できなかったため、検索結果に表示された記述で確認）","used_in":"配属：最初の仕事と「変更の範囲」"},{"source_url":"https://www.check-roudou.mhlw.go.jp/qa/roudousya/koyou/q5.html","text":"求人票と面接時の説明が違う場合、まずその違いが生じた理由を確かめることが第一。ハローワークの求人の場合は、ハローワークの窓口に申し出ることができ、ハローワークが事実確認と必要な指導を行う。募集時に示した条件を変更する場合は、変更内容を明示する（直接接続できなかったため、検索結果に表示された記述で確認）","used_in":"求人票と違うところがあったら"}],"not_used":["労働条件の明示義務違反の罰則（罰金の額）は、読者がとる行動に直接関わらないため書かない","求人票の記載が契約内容になるとした裁判例は、個別の事情で判断が分かれるため紹介せず、「まず理由を確かめる」「相談する」にとどめた","「入社後に条件が違ったら即日辞められる」と受け取られないよう、労働基準法第15条第2項はFAQで触れ、まず会社に確認・相談することを先に書いた"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'tenshoku-koukai-shinai' and c.slug = 'junbi' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'tenshoku-koukai-shinai' and c.slug = 'hatarakikata' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '労働基準法（昭和二十二年法律第四十九号）第十五条', 'e-Gov法令検索（デジタル庁）', 'https://laws.e-gov.go.jp/law/322AC0000000049', '2026-10-09'::date, '使用者は労働契約の締結に際し、賃金・労働時間その他の労働条件を明示しなければならないこと。厚生労働省令で定める事項は省令で定める方法（書面の交付が原則）で明示すること。明示された労働条件が事実と相違する場合、労働者は即時に労働契約を解除できること', 0 from articles where slug = 'tenshoku-koukai-shinai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年4月から、募集広告や職業紹介を受ける際に、求人企業などから明示される労働条件が追加されます。（リーフレット）', '厚生労働省', 'https://www.mhlw.go.jp/content/001114167.pdf', '2026-10-09'::date, '2024年4月から、求人の段階で示される労働条件に、業務の変更の範囲と就業場所の変更の範囲などが加わったこと', 1 from articles where slug = 'tenshoku-koukai-shinai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年4月から労働条件明示のルールが変わります（有期契約労働者の無期転換ポータルサイト）', '厚生労働省', 'https://muki.mhlw.go.jp/rule.html', '2026-10-09'::date, '2024年4月1日から、労働契約の締結時に、雇入れ直後の就業場所・業務に加えて、その変更の範囲も明示することになったこと。対象は雇用形態を問わずすべての労働者であること', 2 from articles where slug = 'tenshoku-koukai-shinai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '求人票や求人広告に記載された条件が、実際の条件と違った場合の対処法（確かめよう労働条件）', '厚生労働省', 'https://www.check-roudou.mhlw.go.jp/qa/roudousya/koyou/q5.html', '2026-10-09'::date, '求人票と説明された条件が違う場合は、まず違いが生じた理由を確かめることが第一であること。ハローワークの求人の場合はハローワークの窓口などに申し出られること。募集時の条件を変える場合は、変更の内容を示すことになっていること', 3 from articles where slug = 'tenshoku-koukai-shinai';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'tenshoku-koukai-shinai' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"89824c686dabed409b2c371c21ff5cb8bddc53e2fad3624845b9e34c457c8bd2","findings":[]}'::jsonb from articles where slug = 'tenshoku-koukai-shinai';
update articles set status = 'published' where slug = 'tenshoku-koukai-shinai';

-- article: tenshoku-nenmatsu-chosei (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('tenshoku-nenmatsu-chosei', 'article', '転職した年の年末調整と確定申告｜前の会社の源泉徴収票はどうする？', '年の途中で転職した年は、前の会社の源泉徴収票を新しい会社に出して、前の会社の給料も含めて年末調整をしてもらいます。年内に再就職しなかったときの確定申告（還付申告）のしかたと、源泉徴収票が届かないときの対処もまとめます。', '年の途中で会社を辞めて転職した年は、所得税の精算のしかたがいつもと少し違います。ポイントは、**前の会社からもらう「源泉徴収票」**です。

**この記事で分かること**

- 年内に次の会社に入ったら、前の会社の源泉徴収票を新しい会社に出して、まとめて年末調整してもらう
- 源泉徴収票を出さないと年末調整ができず、自分で確定申告をすることになる
- 年内に再就職しなかったら、翌年に確定申告（還付申告）をすると、納めすぎた所得税が戻ってくる場合がある

## 年末調整ってなに？

会社員の給料からは、毎月、所得税が引かれています。ただ、この金額はあくまで見込みで計算したものなので、1年分を合計すると、本当に払うべき金額とずれが出ます。

このずれを、その年の最後の給料のときに会社が計算し直して精算するのが**年末調整**です。納めすぎていれば戻り、足りなければ追加で引かれます。

年の途中で転職した場合、新しい会社は、**前の会社で払われた給料と引かれた所得税も合わせて**年末調整をします。そのために必要なのが、前の会社の源泉徴収票です。

## 前の会社の源泉徴収票はいつ届く？

源泉徴収票は、その年に会社が払った給料の合計と、引いた所得税の合計が書かれた書類です。会社は、年の途中で辞めた人に、**退職の日から1か月以内**に源泉徴収票を渡すことになっています。

- 辞める前に、源泉徴収票をいつ、どうやって受け取るか（郵送か、手渡しか、電子データか）を確認しておく
- 届いたら、新しい会社に出すまでなくさないように保管する

退職日から1か月たっても届かないときは、まず前の会社に問い合わせましょう。それでも渡してもらえない場合は、税務署に「源泉徴収票不交付の届出」をする手続きがあります。

## 年内に次の会社に入ったら：源泉徴収票を出す

年内に次の会社に入ったら、年末調整の時期までに、前の会社の源泉徴収票を新しい会社に出します。新しい会社は、前の会社の給料と所得税を合わせて年末調整をしてくれます。

```figure
type: steps
title: 転職した年の年末調整の流れ
items:
  - label: 前の会社から受け取る
    text: 退職の日から1か月以内に源泉徴収票が届く
  - label: 新しい会社に出す
    text: 入社の手続きや年末調整の案内にあわせて提出
  - label: まとめて年末調整
    text: 前の会社の給料も含めて、新しい会社が精算する
```

**出さないとどうなる？**

前の会社の給料を確認できないと、新しい会社は年末調整ができません。その場合は、翌年に自分で確定申告をして、所得税を精算します。手間が増えるので、源泉徴収票は早めに出しておきましょう。

**辞めていた間に払った保険料も申告できる**

辞めていた間に、国民年金や国民健康保険の保険料を自分で払った場合は、社会保険料控除の対象になります。年末調整では「保険料控除申告書」に書いて出します。国民年金の保険料は、日本年金機構から届く控除証明書を一緒に出す必要があるので、届いたら保管しておきましょう。

## 年内に再就職しなかったら：翌年に確定申告

年の途中で辞めて、その年のうちに次の会社に入らなかった場合は、どの会社でも年末調整を受けません。毎月引かれていた所得税は見込みで計算されているため、**納めすぎになっている場合があります**。

この納めすぎた所得税は、辞めた年の翌年になってから確定申告をすると、戻ってくる（還付される）場合があります。

- **いつ出せる？**：還付を受けるための申告（還付申告）は、辞めた年の翌年1月1日から5年間出せます。たとえば2026年に辞めて年内に再就職しなかった場合は、2027年1月1日から出せます
- **何が必要？**：前の会社の源泉徴収票。自分で払った国民年金や国民健康保険の保険料があれば、その金額が分かるもの（国民年金は控除証明書）
- **どうやって出す？**：国税庁のホームページの「確定申告書等作成コーナー」で、画面の案内に沿って作成・提出できます。住んでいる地域の税務署に出すこともできます

```figure
type: compare
style: vs
title: 年内に再就職したかで手続きが分かれる
columns:
  - label: 年内に再就職した
    tone: mint
    items:
      - 前の会社の源泉徴収票を新しい会社に出す
      - 新しい会社でまとめて年末調整
  - label: 年内に再就職しなかった
    tone: sky
    items:
      - 翌年1月1日から確定申告（還付申告）
      - 5年以内なら申告できる
```

「戻ってくるかどうか」「いくら戻るか」は、その年の給料の額や払った保険料などで変わります。作成コーナーで入力すると、計算結果が表示されます。分からないところは、税務署の相談窓口で確認しましょう。

## 辞める前・転職したあとに確認すること

辞める前：

- 源泉徴収票をいつ、どうやって受け取れるか
- 辞めたあとの連絡先（住所が変わるなら新しい住所）を前の会社に伝えたか

転職したあと：

- 新しい会社に、前の会社の源泉徴収票をいつまでに出せばいいか
- 辞めていた間に払った国民年金・国民健康保険の保険料の金額と、国民年金の控除証明書

所得税とは別に、住民税も前の年の所得をもとに計算されるため、転職した年は手取りが思ったより少なく感じることがあります。くわしくは[手取り20万円から転職を考えるとき、何を比べればいい？](/articles/tedori-20man-hikaku)で紹介しています。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-07'::timestamptz, '転職した年の年末調整｜前職の源泉徴収票と確定申告のしかた', '年の途中で転職したら、前の会社の源泉徴収票を新しい会社に出して年末調整をしてもらいます。出さないと年末調整ができず、確定申告が必要に。年内に再就職しなかったときの還付申告と、源泉徴収票が届かないときの対処も紹介します。', array['tedori-20man-hikaku', 'yametai-mae-kakunin', 'nenshu-300man-tenshoku', 'taishoku-kakutei-shinkoku']::text[], '{}'::text[], array['yametai']::text[], array['hajimete']::text[], array['転職した年の', '年末調整どうする？']::text[], null, false, '[{"q":"前の会社の源泉徴収票をなくしてしまいました。どうすればいいですか？","a":"前の会社に連絡して、もう一度発行してもらえないか相談しましょう。新しい会社の年末調整に間に合わない場合は、年末調整を受けずに、翌年に自分で確定申告をして精算することになります。"},{"q":"年の途中で辞めて、そのまま年内は働きませんでした。何か手続きは必要ですか？","a":"年末調整を受けていないので、所得税を納めすぎている場合があります。辞めた年の翌年1月1日から5年以内に確定申告（還付申告）をすると、納めすぎた分が戻ってくる場合があります。前の会社の源泉徴収票を使って申告します。"},{"q":"辞めていた間に払った国民年金や国民健康保険の保険料は、年末調整で申告できますか？","a":"自分で払った社会保険料は、社会保険料控除の対象です。年末調整では「保険料控除申告書」に書いて出します。国民年金の保険料は、日本年金機構から届く控除証明書を一緒に出す必要があります。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「年内に次の会社に入ったか」で分け、入ったなら源泉徴収票を出す、入らなかったなら翌年に還付申告、の2本の道を示す","quotes":[{"source_url":"https://www.nta.go.jp/taxes/shiraberu/taxanswer/gensen/2674.htm","text":"年の中途で就職した人については、就職前にその年中にほかの会社などから給与の支払を受けたことがあったかを確認し、それらの給与を含めて年末調整を行う。確認はその人がほかの会社などから交付を受けた給与所得の源泉徴収票などで行い、確認ができないときは年末調整を行うことはできず、確定申告で精算する","used_in":"年内に次の会社に入ったら：源泉徴収票を出す"},{"source_url":"https://www.nta.go.jp/taxes/shiraberu/taxanswer/hotei/7411.htm","text":"給与所得の源泉徴収票は、年の中途で退職した人の場合、退職の日以後1か月以内に交付しなければならない","used_in":"前の会社の源泉徴収票はいつ届く？"},{"source_url":"https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1910.htm","text":"中途退職したまま再就職しない場合は年末調整を受けられないため、所得税が納め過ぎとなっている場合がある。中途退職した年の翌年以降に確定申告をすれば還付を受けられる","used_in":"年内に再就職しなかったら：翌年に確定申告"},{"source_url":"https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2030.htm","text":"還付申告書は、確定申告期間とは関係なく、その年の翌年1月1日から5年間提出することができる","used_in":"年内に再就職しなかったら：翌年に確定申告"}],"not_used":["退職金（退職所得）の課税と申告の要否は、今回の記事の範囲から外した","年末調整の対象外になる人の条件（給与の収入金額が2,000万円を超える人など）は、読者にほぼ関係しないため書かない","2026年分の確定申告期間の具体的な日付は、国税庁の案内をまだ確認できなかったため書かない（還付申告は翌年1月1日から提出できることだけを書いた）","2025年度税制改正による基礎控除などの見直しの内容は、記事の主題から外れるため書かない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'tenshoku-nenmatsu-chosei' and c.slug = 'seido' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'tenshoku-nenmatsu-chosei' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'No.2674 中途就職者の年末調整', '国税庁', 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/gensen/2674.htm', '2026-10-07'::date, '年の途中で就職した人は、就職前の給与も含めて年末調整を行うこと、前の会社の給与は源泉徴収票などで確認し、確認できないときは年末調整ができず確定申告で精算すること', 0 from articles where slug = 'tenshoku-nenmatsu-chosei';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'No.7411 「給与所得の源泉徴収票」の提出範囲と提出枚数等', '国税庁', 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/hotei/7411.htm', '2026-10-07'::date, '年の途中で退職した人には、退職の日以後1か月以内に源泉徴収票を交付しなければならないこと', 1 from articles where slug = 'tenshoku-nenmatsu-chosei';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'F5-4 源泉徴収票不交付の届出手続', '国税庁', 'https://www.nta.go.jp/taxes/tetsuzuki/shinsei/annai/hotei/23100017.htm', '2026-10-07'::date, '源泉徴収票が交付されない場合に、交付期限を過ぎたあと税務署に届け出る手続きがあること', 2 from articles where slug = 'tenshoku-nenmatsu-chosei';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'No.1910 中途退職で年末調整を受けていないとき', '国税庁', 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1910.htm', '2026-10-07'::date, '年の途中で退職したまま再就職しない場合は年末調整を受けられず、所得税を納めすぎている場合があること、翌年以降に確定申告をすれば還付を受けられること、確定申告書等作成コーナーで作成・提出できること', 3 from articles where slug = 'tenshoku-nenmatsu-chosei';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'No.2030 還付申告', '国税庁', 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2030.htm', '2026-10-07'::date, '還付申告書は、その年の翌年1月1日から5年間提出できること', 4 from articles where slug = 'tenshoku-nenmatsu-chosei';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'No.1130 社会保険料控除', '国税庁', 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1130.htm', '2026-10-07'::date, '自分で支払った国民健康保険料や国民年金保険料が社会保険料控除の対象になること、国民年金保険料を年末調整で控除するときは控除証明書の添付または提示が必要なこと', 5 from articles where slug = 'tenshoku-nenmatsu-chosei';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'tenshoku-nenmatsu-chosei' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"f7e8dda73b111c8af7cfcd522a54364dad544eb6e4e524cf5469da880b81f445","findings":[]}'::jsonb from articles where slug = 'tenshoku-nenmatsu-chosei';
update articles set status = 'published' where slug = 'tenshoku-nenmatsu-chosei';

-- article: tenshoku-okane-junbi (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('tenshoku-okane-junbi', 'article', '転職活動にかかるお金と、退職後の生活費の準備｜住民税・保険・年金と失業給付の待期・給付制限', '転職活動では、面接の交通費や身だしなみなどの出費に加えて、仕事をしない期間ができると、住民税・健康保険・年金を自分で払う場面が出てきます。退職後に失業給付を受ける場合も、待期と給付制限があり、すぐには受け取れません。かかるお金の種類と、準備しておきたい生活費の考え方を紹介します。', '「転職したいけど、お金がもつか心配」。転職活動そのものの出費に加えて、仕事を辞めてから次の会社に入るまでのあいだは、給料が入らないのに、税金や保険料の支払いは続きます。

先に結論を言うと、お金の準備は**「転職活動の出費」と「仕事をしない期間の生活費・税金・保険料」に分けて**考えると見通しが立ちます。とくに退職してから活動する人は、失業給付がすぐには受け取れないことを前提にしておきましょう。

この記事で分かること：

- **転職活動**でかかるお金
- 退職後に**自分で払うことになる**住民税・健康保険・年金
- 失業給付の**待期と給付制限**
- 準備したいお金の**見積もり方**

## 転職活動でかかるお金

働きながら活動する人も、辞めてから活動する人も、次のような出費があります。金額は住んでいる場所や応募する会社によって大きく変わるので、自分の場合に当てはめて書き出してみましょう。

| 出費 | 内容と確かめたいこと |
| --- | --- |
| 面接の交通費 | 会社までの往復。遠方の面接では交通費を会社が負担することもあるので、案内を確かめる |
| 身だしなみ | スーツ・かばん・靴など。服装の指定がないかを案内で確かめる |
| 書類 | 証明写真、履歴書の用紙、印刷や郵送の費用 |
| オンライン面接 | カメラ付きのパソコンやスマートフォン、安定した通信環境 |
| 勉強・資格 | 応募する仕事に関係する本や講座、試験の受験料 |

### 出費をおさえるには

- **オンライン面接を使う**：会社が対応していれば、交通費と移動の時間がかかりません
- **持っているものを確かめる**：スーツなどは、まず手持ちで足りるかを見てから買うかを決めます
- **公的な支援を調べる**：講座の費用は、教育訓練給付などの制度が使えることもあります

働きながらの活動なら、給料が入り続けるので、出費の心配は小さくなります。

## 退職後に自分で払うお金

会社員のあいだは、住民税・健康保険料・厚生年金保険料は給料から引かれています。退職して次の会社に入るまでに期間があくと、これらを**自分で払う**ことになります。

```figure
type: compare
title: 会社員のときと退職後の違い
style: before-after
columns:
  - label: 会社員のとき
    tone: sky
    items:
      - 住民税は給料から引かれる
      - 健康保険は会社の保険
      - 年金は厚生年金
  - label: 次の会社に入るまで
    tone: sand
    items:
      - 住民税は納付書で払うことがある
      - 任意継続・国保・家族の扶養から選ぶ
      - 国民年金に切り替えて払う
```

### 住民税：辞めても、前の年の分を払う

個人住民税は、**前年の所得**をもとに課税されます。そのため、退職して収入がなくなっても、前の年に働いていた分の住民税は払うことになります。

会社が給料から引いていた住民税（特別徴収）は、退職すると、残りの払い方が変わります。東京都主税局の案内では、次のように説明されています。

- **6月1日〜12月31日に退職**：残りは自分で納付書で払う方法（普通徴収）に切り替わります。本人が申し出れば、最後の給与などからまとめて引いてもらうこともできます
- **1月1日〜4月30日に退職**：5月31日までに支払われる給与や退職金が残りの税額を超える場合は、申し出がなくても、まとめて引かれます

まとめて引かれると、最後の給料の手取りが少なくなります。普通徴収になると、あとから納付書が届きます。どちらの場合も、退職後のお金の計画に入れておきましょう。くわしくは[退職したあとの住民税はどう払う？](/articles/taishoku-juminzei)で紹介しています。

### 健康保険：保険料は、選び方で変わる

退職後は、前の会社の健康保険を続ける（任意継続）、国民健康保険に入る、家族の健康保険の扶養に入る、のどれかを選びます。保険料は、選ぶものや住んでいる地域、収入によって変わるので、**市区町村の窓口や加入していた健康保険に見積もりを聞いて**比べましょう。選び方は[退職後の健康保険はどうする？](/articles/taishoku-kenko-hoken)にまとめています。

### 年金：国民年金に切り替えて払う

退職してすぐに次の会社の厚生年金に入らない期間は、国民年金に切り替えて保険料を払います。日本年金機構によると、**2026年度（令和8年度）の国民年金保険料は月額17,920円**で、納付期限は納付する月の翌月末日です。

払うのがむずかしいときは、失業を理由にした免除や納付猶予の制度があります。手続きは[転職で働かない期間ができたら、年金はどうする？](/articles/taishoku-nenkin-tetsuzuki)で紹介しています。

## 失業給付は、すぐには受け取れない

雇用保険の失業給付（基本手当）を受けられる場合でも、退職した次の日から受け取れるわけではありません。

```figure
type: steps
title: 自己都合で辞めたときの流れ
items:
  - label: ハローワークで手続き
    text: 求職の申し込みをし、受給資格が決まる
  - label: 待期
    text: 受給資格が決まった日から7日間は支給されない
  - label: 給付制限
    text: 2025年4月1日以降の離職は原則1か月
  - label: 支給の対象に
    text: 失業の認定を受けたあとに振り込まれる
```

- **待期**：受給資格が決まった日から**7日間**は、どの理由で辞めた人も支給されません
- **給付制限**：正当な理由のない自己都合で辞めた場合は、待期のあとに給付制限の期間があります。**2025年4月1日以降**に離職した場合は、原則**1か月**です
- **給付制限の解除**：2025年4月以降に、対象の教育訓練などを受けた（受けている）場合は、給付制限が解除されるしくみがあります

そのうえ、実際に振り込まれるのは、失業の認定を受けたあとです。給付を受けられる条件や、もらえる日数は人によって違います。くわしくは[退職後の失業手当はもらえる？](/articles/shitsugyo-teate-kihon)を読んでみてください。

## 準備したいお金の見積もり方

「何か月分あれば安心」という決まった目安はありません。自分の数字で、次の式に当てはめて見積もります。

```figure
type: equation
title: 準備したいお金の考え方
terms:
  - 毎月の生活費
  - "×"
  - 収入がない月数
  - "+"
  - 退職後に払う税金・保険料
  - "+"
  - 転職活動の出費
```

1. **毎月の生活費**：家賃、食費、通信費、光熱費など、ここ数か月の実際の出費を書き出す
2. **収入がない月数**：辞めてから次の会社の最初の給料日までを見込む。失業給付を受ける場合も、待期と給付制限のあいだは収入がない前提で
3. **退職後に払う税金・保険料**：住民税の残り、健康保険料、国民年金保険料
4. **転職活動の出費**：交通費や身だしなみなど

次の会社の最初の給料は、入社した月の末ではなく、翌月の支払日になることもあります。締め日と支払日は、内定のときに労働条件通知書で確かめましょう。

### お金に不安があるなら、辞める前に確かめる

```figure
type: checklist
title: 辞める前に確かめるお金のこと
items:
  - 毎月の生活費をいくらと見込んでいるか
  - 住民税の残りは、どう払うことになるか
  - 健康保険はどれを選び、保険料はいくらか
  - 失業給付を受けられそうか、いつごろか
  - 次の会社の最初の給料日はいつか
```

見積もってみて足りなさそうなら、**働きながら転職活動をして、次が決まってから辞める**順番にすると、収入がない期間を短くできます。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '転職活動にかかるお金と退職後の生活費｜住民税・保険・年金', '転職活動にかかるお金と、退職後に必要になる生活費の準備を紹介します。面接の交通費や身だしなみの出費、退職後の住民税・健康保険・国民年金の支払い、失業給付の待期7日間と給付制限、準備したいお金の見積もり方が分かります。', array['shitsugyo-teate-kihon', 'taishoku-juminzei', 'zaishoku-tenshoku-susumekata', 'tenshoku-schedule', 'tenshoku-koukai-shinai']::text[], '{}'::text[], array['yametai', 'kyuryo']::text[], array['hajimete']::text[], array['転職と退職後、', 'お金はいくら必要？']::text[], null, false, '[{"q":"自己都合で辞めたら、失業給付はいつからもらえますか？","a":"受給資格が決まった日から7日間の待期があり、正当な理由のない自己都合退職の場合は、そのあとさらに給付制限の期間があります。2025年4月1日以降に離職した場合の給付制限は原則1か月です。振り込まれるまでの生活費は、手元のお金でまかなう前提で準備しておきましょう。"},{"q":"退職したら、住民税は払わなくてよくなりますか？","a":"払わなくてよくなるわけではありません。個人住民税は前年の所得に応じて課税されるので、退職したあとも、前の年に働いていた分の住民税を払います。退職した時期によって、最後の給与からまとめて引かれるか、自分で納付書で払うかが変わります。"},{"q":"退職後の国民年金の保険料はいくらですか？","a":"日本年金機構によると、2026年度（令和8年度）の国民年金保険料は月額17,920円です。退職してすぐに次の会社の厚生年金に入らない期間は、国民年金に切り替えて保険料を払います。払うのがむずかしいときは、免除や納付猶予の制度を相談できます。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「転職活動の出費」と「仕事をしない期間の生活費・社会保険料・税金」を分けて、何にお金がかかるかを先に見せる。金額は出典がある国民年金保険料と、待期・給付制限の期間だけを書き、ほかは自分で見積もる方法を示す","quotes":[{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000160564_00045.html","text":"雇用保険の被保険者が正当な理由がなく自己の都合によって退職した場合には、基本手当の受給資格決定日から7日間の待期期間満了後1〜3か月間は基本手当を支給されない。令和7年4月1日以降の離職は原則1か月。令和7年4月以降に教育訓練等を受けた（受けている）場合、給付制限が解除される（www.mhlw.go.jp に直接接続できなかったため、WebSearch の検索結果に表示された記述で確認）","used_in":"失業給付は、すぐには受け取れない"},{"source_url":"https://www.nenkin.go.jp/service/kokunen/hokenryo/hokenryo.html","text":"国民年金保険料は1か月あたり17,920円（令和8年度）。納付期限は法令で納付対象月の翌月末日と定められている（直接接続できなかったため、検索結果に表示された記述で確認）","used_in":"退職後に自分で払うお金"},{"source_url":"https://www.tax.metro.tokyo.lg.jp/kazei/life/kojin_ju/tokubetsu/tetsuzuki","text":"6月1日から12月31日までに退職した場合、残りの税額は普通徴収に切り替わる（本人の申出があれば一括徴収）。翌年1月1日から4月30日までに退職した場合は、5月31日までに支給される給与・退職金等が残りの税額を超える場合、申出がなくても一括して特別徴収する（直接接続できなかったため、検索結果に表示された記述で確認）","used_in":"退職後に自分で払うお金"},{"source_url":"https://www.tax.metro.tokyo.lg.jp/kazei/life/kojin_ju","text":"個人住民税は前年の所得に応じて課税される（検索結果に表示されたページと、既存記事 taishoku-juminzei の確認記録で照合）","used_in":"退職後に自分で払うお金"}],"not_used":["面接の交通費・スーツ・証明写真などの金額の相場は公的な根拠を確認できなかったので、金額は書かず、項目と確かめ方だけを書く","国民健康保険料・任意継続の保険料の金額は、住んでいる地域や前年の収入、退職時の給与で変わるため書かず、見積もりの取り方と既存記事へのリンクにとどめた","「生活費の3か月分を準備」などの目安は公的な根拠を確認できなかったので書かず、自分の数字で計算する式を示した","給付制限が3か月になる場合（5年間に2回以上の自己都合退職など）は、検索結果で触れられていたが本記事では深追いせず、既存記事 shitsugyo-teate-kihon へのリンクにとどめた"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'tenshoku-okane-junbi' and c.slug = 'junbi' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'tenshoku-okane-junbi' and c.slug = 'hatarakikata' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '令和７年４月以降に教育訓練等を受ける場合、給付制限が解除され、基本手当を受給できます', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000160564_00045.html', '2026-10-09'::date, '正当な理由のない自己都合退職の場合、受給資格決定日から7日間の待期期間満了後、給付制限の期間は基本手当が支給されないこと。2025年4月1日以降の離職は給付制限が原則1か月であること。2025年4月以降に教育訓練等を受けた場合に給付制限が解除されること', 0 from articles where slug = 'tenshoku-okane-junbi';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '国民年金保険料', '日本年金機構', 'https://www.nenkin.go.jp/service/kokunen/hokenryo/hokenryo.html', '2026-10-09'::date, '2026年度（令和8年度）の国民年金保険料が月額17,920円であること、納付期限が納付対象月の翌月末日であること', 1 from articles where slug = 'tenshoku-okane-junbi';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '特別徴収にかかる手続きについて（個人住民税の特別徴収推進ステーション）', '東京都主税局', 'https://www.tax.metro.tokyo.lg.jp/kazei/life/kojin_ju/tokubetsu/tetsuzuki', '2026-10-09'::date, '6月1日から12月31日に退職した場合は残りの税額が普通徴収に切り替わり、本人の申出があれば一括徴収できること。1月1日から4月30日に退職した場合は、5月31日までに支払われる給与・退職金等が残りの税額を超えれば、申出がなくても一括徴収されること', 2 from articles where slug = 'tenshoku-okane-junbi';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '個人住民税（暮らしと税金）', '東京都主税局', 'https://www.tax.metro.tokyo.lg.jp/kazei/life/kojin_ju', '2026-10-09'::date, '個人住民税は前年の所得をもとに課税されること', 3 from articles where slug = 'tenshoku-okane-junbi';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'tenshoku-okane-junbi' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"0d1e8304c19575778354aa21e26af29a8c1af41f9e256d94c991e1d38246cb8c","findings":[]}'::jsonb from articles where slug = 'tenshoku-okane-junbi';
update articles set status = 'published' where slug = 'tenshoku-okane-junbi';

-- article: tenshoku-schedule (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('tenshoku-schedule', 'article', '転職活動の流れとスケジュールの立て方｜自己分析から入社まで、各ステップでやること', '転職活動は「自己分析→情報集め→応募→面接→内定→退職手続き→入社」の順に進みます。働きながら進める場合と辞めてから進める場合の違い、各ステップでやること、入社日から逆算するスケジュールの立て方、退職後に期限がある手続きを紹介します。', '「転職したい」と思っても、何から手をつけて、どの順番で進めればいいのかが分からないと、なかなか動き出せません。

先に結論を言うと、転職活動は次の順番で進みます。

1. 自己分析（経験と希望の整理）
2. 情報集め（職種・求人を調べる）
3. 応募（書類を作って出す）
4. 面接
5. 内定（条件を確かめて承諾する）
6. 退職手続き
7. 入社

この記事で分かること：

- 働きながら進める場合と、辞めてから進める場合の**違い**
- 各ステップで**やること**と、次に進む目安
- 入社日から逆算する**スケジュールの立て方**
- 辞めてから進める場合に**期限がある手続き**

## まず決めること：働きながら進める？辞めてから進める？

最初に考えたいのは、今の仕事を続けながら進めるか、辞めてから進めるかです。どちらが正解というより、自分の状況に合うほうを選びます。

| | 働きながら進める | 辞めてから進める |
| --- | --- | --- |
| 収入 | 途切れない | 収入がない期間ができる |
| 時間 | 平日の夜や休日を使う | 面接の日程を合わせやすい |
| 気持ち | 内定を見てから辞めるか決められる | 早く決めたいと焦りやすい |
| 手続き | 会社を移るときの手続きが中心 | 健康保険・年金の切り替えを自分で行う |

はじめての転職で迷ったら、**収入が途切れない「働きながら」を基本に考え、体調や職場の状況で続けるのが難しいときは「辞めてから」も選ぶ**、と考えると決めやすくなります。辞めてから進める場合は、生活費が何か月分あるかを先に計算しておきましょう。

働きながら進めるときの時間の作り方は、[働きながらの転職活動、何から？](/articles/zaishoku-tenshoku-susumekata)で詳しく紹介しています。

## 転職活動の流れと、各ステップでやること

```figure
type: steps
title: 転職活動の流れ
items:
  - label: 自己分析
    text: 経験・ゆずれない条件・避けたいことを書き出す
  - label: 情報集め
    text: 職種を2〜3つにしぼり、求人を見て比べる
  - label: 応募
    text: 履歴書・職務経歴書を作り、面接に行ける数だけ出す
  - label: 面接
    text: よく聞かれる質問の答えと、逆質問を準備する
  - label: 内定
    text: 労働条件を書面で確かめてから承諾する
  - label: 退職・入社
    text: 退職を伝え、引き継ぎと手続きをして入社する
```

### ステップ1：自己分析

求人を見る前に、自分のことを書き出します。ここを飛ばすと、求人を見るたびに気持ちが揺れて、選べなくなりがちです。

- これまでの仕事やアルバイトで**やってきたこと**（作業・工夫・ほめられたこと）
- **ゆずれない条件**（給料の下限、休み、勤務地など）
- **避けたいこと**（今の仕事で特につらいこと）

次へ進む目安：「どんな仕事なら続けられそうか」を一言で言えるようになったら、情報集めに進みます。

### ステップ2：情報集め

興味のある職種を2〜3つにしぼり、仕事内容と求人を調べます。求人を見るときは、仕事内容・給料の内訳・休日・残業・研修の有無をそろえて比べると、違いが分かりやすくなります。

次へ進む目安：「応募してみたい求人」がいくつか見つかったら、書類づくりに進みます。

### ステップ3：応募

履歴書と職務経歴書を作り、応募します。働きながら進める場合は、**面接に行ける数だけ応募する**のがポイントです。一度にたくさん出すと、面接の日程が重なって調整が大変になります。

次へ進む目安：書類は一度作ったら、応募する求人に合わせて志望動機などを少しずつ書き換えます。

### ステップ4：面接

面接では、自己紹介・転職理由・志望動機などがよく聞かれます。答えを丸暗記するより、話す順番だけ決めておくと落ち着いて話せます。

面接のあとは、聞かれたことと答えにくかったことをメモしておくと、次の面接の準備になります。

### ステップ5：内定

内定が出たら、すぐに返事をする前に、**労働条件を書面で確かめます**。給料の内訳、勤務地、休日、試用期間、入社日などが、求人や面接で聞いた内容と合っているかを見ましょう。条件を確かめてから承諾し、そのあとで今の職場に退職を伝えます。

### ステップ6：退職手続き

退職を伝える時期は、まず**就業規則**で「何日前までに申し出るか」を確かめます。伝える相手は直属の上司が基本です。退職日が決まったら、引き継ぎ、有給休暇の使い方、返すもの・受け取る書類を確認します。

伝え方の例は[退職の伝え方は？誰に・いつ・どう言うか](/articles/taishoku-tsutaekata)で紹介しています。

### ステップ7：入社

入社日までに、転職先から求められる書類（年金や雇用保険の番号が分かるもの、源泉徴収票など）をそろえます。何が必要かは会社によって違うので、内定後の案内で確認しましょう。

## スケジュールは「入社日」から逆算する

転職活動にかかる期間は、応募する数や選考の回数、引き継ぎに必要な日数などで変わるため、一律には言えません。そこでおすすめなのが、**入社したい時期を先に決めて、逆算する**立て方です。

```figure
type: checklist
title: 逆算するときに確かめること
items:
  - 入社したい時期はいつか
  - 就業規則で、退職は何日前までに申し出るか
  - 引き継ぎにどのくらいかかりそうか
  - 残っている有給休暇を使うか
  - 平日の夜・休日に使える時間はどのくらいか
  - 辞めてから進めるなら、生活費は何か月分あるか
```

書き出し方の例（日付は仮の例です）：

> 入社したい時期：20XX年7月1日
> 就業規則：退職は〇か月前までに申し出る → 〇月中には内定を承諾しておきたい
> 引き継ぎ：担当の仕事の整理に時間がかかりそう → 退職の申し出は早めにしたい
> 応募：〇月から始めて、週に〇社のペースで面接を受ける

予定どおりに進まないことも多いので、**最初から余裕をもって組んでおき、月に一度は見直す**くらいがちょうどよいです。応募したい求人が見つからない月があっても、自己分析や書類の見直しに時間を使えば、遅れを取り戻しやすくなります。

## 辞めてから進める場合に、期限がある手続き

仕事を辞めてから転職活動をする場合や、退職日から入社日まで間が空く場合は、自分で行う手続きがあります。期限があるものは先に確認しておきましょう。

| 手続き | 期限・ポイント | 窓口 |
| --- | --- | --- |
| 国民年金への切り替え | 退職日の翌日から14日以内 | 住所地の市区町村 |
| 国民健康保険への加入 | 14日以内に届け出る | 住所地の市町村 |
| 失業手当（基本手当）の手続き | 求職の申込みをした日から通算7日間は待期期間 | 住所を管轄するハローワーク |

- 国民年金の手続きでは、資格喪失日を証明できるもの（離職票など）が必要になる場合があります
- 健康保険は、国民健康保険のほかに、前の会社の健康保険を続ける「任意継続」や、家族の扶養に入る方法もあります
- 失業手当は、2025年4月1日以降に正当な理由のない自己都合で辞めた場合、待期期間のあとに**原則1か月の給付制限**があります

退職日の翌日に次の会社に入る場合は、国民年金や国民健康保険への切り替えは原則として必要ありません。間が空くかどうかで手続きが変わるので、退職日と入社日が決まった時点で確認しましょう。

健康保険の選び方や失業手当の条件と流れは、[退職後の失業手当はもらえる？](/articles/shitsugyo-teate-kihon)などで詳しく紹介しています。

## 進め方に迷ったら

流れが分かっていても、「自己分析がまとまらない」「応募しても先に進まない」と止まってしまうことはあります。そんなときは、ひとつ前のステップに戻ってみましょう。

- 応募する求人が決められない → 自己分析の「ゆずれない条件」を見直す
- 書類で先に進まない → 職務経歴書に、やってきたことを具体的に書けているか見直す
- 面接で話がまとまらない → 転職理由と志望動機がつながっているか見直す

転職活動の最初に整理しておきたいことは、[未経験転職は何から始める？](/articles/mikeiken-tenshoku-hajimekata)にもまとめています。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '転職活動の流れとスケジュール｜何から順番に進める？', '転職活動の流れを、自己分析・応募・面接・内定・退職手続き・入社の順に紹介します。在職中と退職後の進め方の違い、入社日から逆算するスケジュールの立て方、退職後14日以内の健康保険・年金の手続きも分かります。', array['zaishoku-tenshoku-susumekata', 'mikeiken-tenshoku-hajimekata', 'taishoku-tsutaekata', 'jiko-bunseki-yarikata', 'tenshoku-okane-junbi']::text[], '{}'::text[], array['yametai']::text[], array['hajimete', 'dainishinsotsu']::text[], array['転職活動、', 'どんな順番で進める？']::text[], null, false, '[{"q":"転職活動は、仕事を辞める前と辞めた後、どちらに始めるのがいいですか？","a":"どちらにもよい点と気をつける点があります。働きながら進めると収入が途切れず、内定を見てから辞めるかどうかを決められます。辞めてから進めると時間は作りやすい一方で、収入がない期間ができ、健康保険や年金の切り替えなどの手続きも自分で行います。貯金と、今の仕事を続けられる体調かどうかを見て決めましょう。"},{"q":"転職活動にはどのくらいの期間がかかりますか？","a":"応募する数、選考の回数、退職までに必要な引き継ぎの期間などで変わるため、一律には言えません。入社したい時期を決めて、そこから「退職の申し出の時期（就業規則で確認）」「内定の時期」「応募を始める時期」と逆算して、自分の予定を立てるのがおすすめです。"},{"q":"退職してから次の会社に入るまで間が空くとき、何の手続きが必要ですか？","a":"次の会社にすぐ入らない場合は、会社の健康保険から国民健康保険などへの切り替えと、厚生年金から国民年金への切り替えが必要です。国民健康保険は14日以内に住所地の市町村の窓口へ届け出ることになっていて、国民年金も退職日の翌日から14日以内に市区町村で手続きします。失業手当を受ける場合は、住所を管轄するハローワークで手続きします。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"転職活動を「自己分析→情報集め→応募→面接→内定→退職手続き→入社」の順に並べ、各ステップの「やること」と「次へ進む目安」を示す。期間の目安は根拠のある公的情報がないので書かず、入社日から逆算する立て方を示す。辞めてから進める場合に期限がある手続き（国保・国民年金の14日以内、失業手当の待期・給付制限）だけを数字で書く","quotes":[{"source_url":"https://www.nenkin.go.jp/service/kokunen/kanyu/20140710-03.html","text":"退職して第1号被保険者になる場合、提出期限は退職日の翌日から14日以内、提出先は住所地の市区町村役場。資格喪失日を証明できるもの（離職票等）が必要になる場合がある（サイトへ直接接続できなかったため、日本年金機構サイト内の検索結果に表示された内容で確認）","used_in":"辞めてから進める場合に、期限がある手続き"},{"source_url":"https://www.mhlw.go.jp/stf/newpage_21539.html","text":"国民健康保険の被保険者になったときなどは、14日以内に住所地の市町村の国民健康保険の窓口へ届け出る（サイトへ直接接続できなかったため、検索結果に表示された内容で確認）","used_in":"辞めてから進める場合に、期限がある手続き"},{"source_url":"https://www.hellowork.mhlw.go.jp/help/question05.html","text":"雇用保険の基本手当は、離職票の提出と求職の申込みを行った日（受給資格決定日）から通算して7日間を待期期間といい、その期間が満了するまでは支給されない（検索結果に表示された内容で確認）","used_in":"辞めてから進める場合に、期限がある手続き"},{"source_url":"https://jsite.mhlw.go.jp/gunma-roudoukyoku/content/contents/002182062.pdf","text":"令和7年4月1日以降に離職された方は、正当な理由がない自己都合により退職した場合、給付制限期間が原則1か月となる（資料のタイトルと検索結果で確認）","used_in":"辞めてから進める場合に、期限がある手続き"}],"not_used":["「転職活動の期間は3か月が目安」などの一般的な期間は、公的な調査・出典を確認できなかったため書かない。入社日から逆算する方法だけを示した","応募数・書類選考の通過率・面接回数の目安も、出典がないため書かない","民法第627条の「2週間」のルールは、退職の伝え方の記事（taishoku-tsutaekata）にまとめているため、本文では就業規則の確認と内部リンクにとどめた"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'tenshoku-schedule' and c.slug = 'junbi' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'tenshoku-schedule' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '会社を退職したときの国民年金の手続き', '日本年金機構', 'https://www.nenkin.go.jp/service/kokunen/kanyu/20140710-03.html', '2026-10-09'::date, '退職して次の会社の厚生年金に入らない場合、退職日の翌日から14日以内に住所地の市区町村で国民年金の手続きをすること', 0 from articles where slug = 'tenshoku-schedule';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '国民健康保険の加入・脱退について', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_21539.html', '2026-10-09'::date, '国民健康保険に加入するときは、14日以内に住所地の市町村の窓口へ届け出ること', 1 from articles where slug = 'tenshoku-schedule';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'よくあるご質問（雇用保険について）', 'ハローワークインターネットサービス（厚生労働省）', 'https://www.hellowork.mhlw.go.jp/help/question05.html', '2026-10-09'::date, '離職票の提出と求職の申込みを行った日から通算して7日間は待期期間で、基本手当が支給されないこと', 2 from articles where slug = 'tenshoku-schedule';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '令和７年４月１日以降に離職された方は、正当な理由がない自己都合により退職した場合、給付制限期間が原則１か月となります。', '群馬労働局・ハローワーク', 'https://jsite.mhlw.go.jp/gunma-roudoukyoku/content/contents/002182062.pdf', '2026-10-09'::date, '2025年4月1日以降に正当な理由のない自己都合で離職した場合、給付制限期間が原則1か月であること', 3 from articles where slug = 'tenshoku-schedule';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'tenshoku-schedule' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"8d4fd84d91be34e07bf3c7268e2a214e0feb55941d8a09874ed6738b9aaf6e3b","findings":[]}'::jsonb from articles where slug = 'tenshoku-schedule';
update articles set status = 'published' where slug = 'tenshoku-schedule';

-- article: tenshoku-service-chigai (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('tenshoku-service-chigai', 'article', '転職サイト・転職エージェント・ハローワークの違いは？しくみと使い分け', '転職サイト、転職エージェント（人材紹介）、ハローワークは、だれが運営し、どこからお金が出て、どこまで手伝ってくれるかが違います。それぞれのしくみと向いている使い方、人材紹介が求職者から原則として手数料を取らないという職業安定法のルール、許可を受けた事業者かの確かめ方を紹介します。', '転職活動を始めようとすると、「転職サイト」「転職エージェント」「ハローワーク」と、いくつもの入口があって迷います。どれも「仕事を探すためのもの」ですが、**だれが運営していて、どこからお金が出ていて、どこまで手伝ってくれるか**が違います。

この記事で分かること：

- 3つのサービスの**しくみ**の違い
- それぞれが**向いている使い方**
- 人材紹介（転職エージェント）は、**求職者から原則として手数料を取らない**という法律のルール
- **許可を受けた事業者か**を確かめる方法

## 3つのサービスは何が違う？

まずは全体を比べてみます。

```figure
type: compare
title: 3つのサービスのしくみ
columns:
  - label: 転職サイト
    tone: sky
    items:
      - 求人情報を見て自分で応募する
      - 求人情報を集めて求職者に届ける
      - 自分のペースで進められる
  - label: 転職エージェント
    tone: mint
    items:
      - 担当者が求人を紹介し、間に入る
      - 主に企業からの手数料で運営
      - 書類・面接・日程調整を手伝う
  - label: ハローワーク
    tone: sand
    items:
      - 国が運営する公的な窓口
      - 利用は無料
      - 窓口で職業相談ができる
```

どれか一つを選ばなければいけないわけではありません。しくみを知ったうえで、自分の状況に合わせて組み合わせるのが現実的です。

## 転職サイト：自分で探して、自分で応募する

転職サイト（求人サイト）は、企業から依頼を受けて求人情報をのせ、求職者に届けるサービスです。法律上は「募集情報等提供事業」と呼ばれ、求人情報誌なども同じ仲間です。

**しくみ**：求人を探す、応募する、日程を調整する、といったことを基本的に自分で進めます。経歴を登録しておくと、企業から連絡（スカウトなど）が届くサービスもあります。

求職者の情報を集めて使うサービスは「特定募集情報等提供事業者」として、2022年10月1日施行の改正職業安定法により、厚生労働大臣への届出が必要になっています。

**向いている使い方**：

- たくさんの求人を見比べて、相場や職種の違いをつかみたい
- 自分のペースで、空いた時間に進めたい
- 応募したい会社がある程度はっきりしている

**気をつけたいこと**：応募書類の書き方や面接の準備は、自分で進める必要があります。経歴を登録するときは、どこまで公開されるかの設定も確かめておきましょう。

## 転職エージェント：担当者が間に入る「人材紹介」

転職エージェントは、法律上は「職業紹介」、そのうち手数料を受け取って行うものは「有料職業紹介事業」と呼ばれます。職業紹介とは、求人と求職の申込みを受けて、企業と求職者のあいだで雇用関係が成り立つようにあっせんすることです。有料職業紹介事業は、厚生労働大臣の許可を受けて行います。

**しくみ**：担当者（キャリアアドバイザーなど）と面談して、経験や希望を伝えます。担当者がそれに合いそうな求人を紹介し、応募書類の添削、面接の準備、日程や条件の調整などを手伝います。

**向いている使い方**：

- 何が自分に合うか分からず、人と話しながら考えたい
- 働きながら活動していて、日程調整などの手間を減らしたい
- 給料や残業など、自分では聞きにくい条件を確認してほしい

**気をつけたいこと**：紹介される求人は、その会社が扱っている求人の中からになります。すすめられた求人でも、自分の希望と合っているかは自分で判断しましょう。合わないと思ったら、理由を添えて断って構いません。相談のしかたは[転職エージェントに、何を相談すればいい？](/articles/agent-soudan-nani)で紹介しています。

### 人材紹介は、求職者から原則として手数料を取らない

職業安定法では、有料職業紹介事業者は、**求職者から原則として手数料を受け取ってはいけない**とされています。人材紹介会社は、主に求人を出している企業から手数料を受け取って運営しています。

求職者から手数料を受け取れるのは、例外として決められた職業だけです。

- 芸能家、モデル
- 経営管理者、科学技術者、熟練技能者（紹介で就職した仕事の年収が700万円を超える場合などに限る）

はじめての転職や未経験の仕事への転職で、こうした例外にあたることはあまりありません。登録や紹介に料金がかかると言われたら、理由と根拠を確認し、納得できなければ利用を見送りましょう。

## ハローワーク：国が運営する、無料の窓口

ハローワーク（公共職業安定所）は、国（厚生労働省）が運営する機関です。仕事を探す人にも、求人を出す企業にも、サービスを無料で提供しています。職業紹介のほか、雇用保険（失業手当など）の手続きなども行っています。

**しくみ**：窓口で求職の申込みをすると、職業相談や求人の紹介を受けられます。ハローワークインターネットサービスで求職者マイページを作ると、自宅のパソコンなどから求人を探したり、「オンライン自主応募」ができる求人に直接応募したりもできます。

**向いている使い方**：

- 住んでいる地域の求人を探したい
- 窓口で、人と直接話して相談したい
- 雇用保険など、国の制度の手続きもあわせて進めたい

**気をつけたいこと**：求人の内容は企業が書いたものなので、ほかのサービスと同じく、気になる点は応募前や面接で確かめましょう。

## 許可を受けているかの確かめ方

転職エージェントを使うときは、登録する前に、**許可を受けた職業紹介事業者かどうか**を確かめておくと安心です。

```figure
type: steps
title: 許可番号を確かめる手順
items:
  - label: 許可番号を探す
    text: 会社のサイトの会社概要などに書かれた許可番号を見る
  - label: 公的サイトを開く
    text: 厚生労働省の「人材サービス総合サイト」を開く
  - label: 検索する
    text: 職業紹介事業の検索で、許可番号か会社名を入れる
  - label: 情報を見る
    text: 事業所の情報や、手数料・就職者数などを確かめる
```

人材サービス総合サイトでは、職業紹介事業、労働者派遣事業、特定募集情報等提供事業を行う事業者を検索できます。職業紹介事業の許可番号は、「13-ユ-」のように、数字・「ユ」・数字が並ぶ形で表示されます。

職業紹介事業者は、このサイトで、紹介によって就職した人の数、就職後6か月以内に辞めた人の数、手数料に関すること、返戻金制度（紹介した人が早く辞めたときに、企業に手数料の一部を返すしくみ）の有無などを公開することが決められています。登録前にのぞいてみると、その事業者のことを知る手がかりになります。

また、2021年4月1日から、職業紹介事業者が「就職お祝い金」などの名目でお金などを渡して、登録や求職の申込みをすすめることは禁止されています。「登録したらお金がもらえる」といった誘いには注意しましょう。

## どう組み合わせる？状況別の使い方

最後に、状況ごとの組み合わせ方の例です。

| 今の状況 | 組み合わせの例 |
| --- | --- |
| やりたい仕事がまだ分からない | 転職エージェントやハローワークで相談しながら、転職サイトで職種ごとの求人を眺める |
| 働きながら活動していて時間がない | 転職エージェントに日程調整を頼み、すき間時間に転職サイトで求人を保存する |
| 住んでいる地域で働きたい | ハローワークで地域の求人を探し、転職サイトでも同じ地域の求人を見比べる |
| 応募したい会社が決まっている | 転職サイトや企業の採用ページから応募し、書類や面接の準備はハローワークなどで相談する |

複数のサービスを使うときは、**どの求人に、どこから応募したか**を一覧にしておきましょう。同じ求人に別のルートから重ねて応募すると、企業側が混乱することがあります。

面談の前に何を決めておけばいいかは[エージェント面談の前に決めておくこと・決めなくていいこと](/articles/agent-mendan-mae)にまとめています。相談の前に希望条件を整理したいときは、[条件整理チェック](/check)も使ってみてください。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-07'::timestamptz, '転職サイト・転職エージェント・ハローワークの違いと使い分け', '転職サイト、転職エージェント、ハローワークは何が違う？それぞれのしくみと向いている使い方、人材紹介は求職者から原則手数料を取らないという職業安定法のルール、人材サービス総合サイトで許可番号を確かめる方法を紹介します。', array['agent-soudan-nani', 'agent-mendan-mae', 'freeter-seishain-hajimeni', 'hellowork-tsukaikata', 'tenshoku-agent-merit']::text[], '{}'::text[], array['yaritai']::text[], array['hajimete']::text[], array['転職サイト？エージェント？', 'ハローワーク？']::text[], null, false, '[{"q":"転職エージェントは無料と聞きますが、なぜ無料なのですか？","a":"人材紹介会社（有料職業紹介事業者）は、主に求人を出している企業から手数料を受け取っているからです。職業安定法では、有料職業紹介事業者は求職者から原則として手数料を受け取ってはいけないとされています。例外は、芸能家・モデルや、年収700万円を超える経営管理者・科学技術者・熟練技能者などに限られています。"},{"q":"転職サイトと転職エージェントは、両方使ってもいいですか？","a":"使って構いません。ハローワークもあわせて、どれか一つに絞る必要はありません。ただし、同じ求人に別のルートから重ねて応募すると、企業側が混乱することがあります。どの求人に、どこから応募したかを一覧にして管理しましょう。"},{"q":"登録した転職エージェントが、本当に許可を受けているか心配です。","a":"厚生労働省の「人材サービス総合サイト」で、事業者の名前や許可番号を入れて検索できます。許可を受けた職業紹介事業者であれば、許可番号や事業所の情報が表示されます。登録する前に確かめておくと安心です。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"3つのサービスを「だれが運営し、どこからお金が出て、どこまで手伝ってくれるか」で比べる。人材紹介の手数料ルールと許可の確かめ方を、公的な資料にもとづいて書く。特定の企業・サービスはすすめない","quotes":[{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/hellowork.html","text":"ハローワーク（公共職業安定所）は、仕事を探す人や求人事業主に対して、さまざまなサービスを無償で提供する、国（厚生労働省）が運営する総合的雇用サービス機関。職業紹介のほか、雇用保険、雇用対策などの国の制度を組み合わせた支援を行う","used_in":"ハローワーク：国が運営する、無料の窓口"},{"source_url":"https://www.hellowork.mhlw.go.jp/member/mem_possible.html","text":"求職者マイページを開設すると、自宅のパソコン等から求人情報検索、オンライン自主応募、求職活動状況の確認などができる","used_in":"ハローワーク：国が運営する、無料の窓口"},{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/boshuujouhouteikyou.html","text":"募集情報等提供事業には求人サイト・求人情報誌などが該当する。労働者になろうとする者に関する情報を収集する特定募集情報等提供事業者は、厚生労働大臣への届出が必要（2022年10月1日施行の改正職業安定法）","used_in":"転職サイト：自分で探して、自分で応募する"},{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000172497_00003.html","text":"令和4年10月1日施行の改正により、特定募集情報等提供事業を行う者は、職業安定法第43条の2第1項に基づき厚生労働大臣への届出が必要","used_in":"転職サイト：自分で探して、自分で応募する"},{"source_url":"https://jsite.mhlw.go.jp/ishikawa-roudoukyoku/hourei_seido_tetsuzuki/roudousha_haken/syoukai_gaiyou.html","text":"職業紹介とは、求人及び求職の申込みを受け、求人者と求職者との間における雇用関係の成立をあっせんすること（職業安定法第4条第1項）。有料職業紹介事業は、職業安定法第30条第1項の厚生労働大臣の許可を受けて行うことができる","used_in":"転職エージェント：担当者が間に入る「人材紹介」"},{"source_url":"https://jsite.mhlw.go.jp/osaka-roudoukyoku/hourei_seido_tetsuzuki/yuryou_muryou_shokugyou/hourei_seido/gaiyou.html","text":"有料職業紹介事業者が徴収できる手数料は限られている。求職者手数料は「芸能家」「モデル」「経営管理者」「科学技術者」「熟練技能者」の職業に限られ、後の3つは紹介により就職した職業の賃金が年収700万円またはこれに相当する額を超える場合に限る","used_in":"人材紹介は、求職者から原則として手数料を取らない"},{"source_url":"https://jinzai.hellowork.mhlw.go.jp/JinzaiWeb/","text":"厚生労働省の人材サービス総合サイト。労働者派遣事業、職業紹介事業、特定募集情報等提供事業を行う事業者を検索できる。職業紹介事業の詳細ページは「13-ユ-」で始まるような許可番号ごとに表示される","used_in":"許可を受けているかの確かめ方"},{"source_url":"https://www.mhlw.go.jp/file/06-Seisakujouhou-11600000-Shokugyouanteikyoku/0000171018_2.pdf","text":"職業紹介事業者は、人材サービス総合サイトで、就職者数、無期雇用就職者数、そのうち6か月以内に解雇以外の理由で離職した者の数、手数料に関する事項、返戻金制度の有無などの情報提供が義務付けられる","used_in":"許可を受けているかの確かめ方"},{"source_url":"https://jsite.mhlw.go.jp/tokyo-roudoukyoku/news_topics/jyukyuuchousei_030303.html","text":"職業安定法に基づく指針の改正により、2021年4月1日から、「就職お祝い金」などの名目で求職者に金銭等を提供して求職の申込みの勧奨を行うことが禁止された","used_in":"許可を受けているかの確かめ方"}],"not_used":["サービスごとの求人数、利用者数、内定率などの数字は公的な根拠がなく、比較にもなりやすいため書かない","特定の転職サイト・転職エージェントの名前や評判は書かない","紹介手数料の相場（理論年収の〇％など）は、事業者ごとに違い、公的な一般値を確認できなかったので書かない","求職受付手数料の具体的な金額（1件あたりの上限額）は、税率等で変わり、読者に関係が薄いため書かない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'tenshoku-service-chigai' and c.slug = 'junbi' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'tenshoku-service-chigai' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ハローワーク', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/hellowork.html', '2026-10-07'::date, 'ハローワークは国（厚生労働省）が運営し、職業紹介・雇用保険・雇用対策などのサービスを無償で提供していること', 0 from articles where slug = 'tenshoku-service-chigai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '求職者マイページでできること（ハローワークインターネットサービス）', '厚生労働省', 'https://www.hellowork.mhlw.go.jp/member/mem_possible.html', '2026-10-07'::date, '求職者マイページで、自宅のパソコンなどから求人検索やオンライン自主応募ができること', 1 from articles where slug = 'tenshoku-service-chigai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '募集情報等提供事業', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/boshuujouhouteikyou.html', '2026-10-07'::date, '求人サイト・求人情報誌などが募集情報等提供事業にあたること、求職者の情報を集める事業者（特定募集情報等提供事業者）は厚生労働大臣への届出が必要なこと', 2 from articles where slug = 'tenshoku-service-chigai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '令和４年職業安定法の改正について', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000172497_00003.html', '2026-10-07'::date, '2022年10月1日施行の改正で、特定募集情報等提供事業に厚生労働大臣への届出が必要になったこと', 3 from articles where slug = 'tenshoku-service-chigai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業紹介事業とは', '石川労働局', 'https://jsite.mhlw.go.jp/ishikawa-roudoukyoku/hourei_seido_tetsuzuki/roudousha_haken/syoukai_gaiyou.html', '2026-10-07'::date, '職業紹介の定義（職業安定法第4条第1項）と、有料職業紹介事業は厚生労働大臣の許可を受けて行うこと', 4 from articles where slug = 'tenshoku-service-chigai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '有料職業紹介事業の概要', '大阪労働局', 'https://jsite.mhlw.go.jp/osaka-roudoukyoku/hourei_seido_tetsuzuki/yuryou_muryou_shokugyou/hourei_seido/gaiyou.html', '2026-10-07'::date, '有料職業紹介事業者が受け取れる手数料の種類が限られていること、求職者から手数料を受け取れるのは芸能家・モデル・経営管理者・科学技術者・熟練技能者（後の3つは年収700万円超の場合）に限られること', 5 from articles where slug = 'tenshoku-service-chigai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '人材サービス総合サイト', '厚生労働省', 'https://jinzai.hellowork.mhlw.go.jp/JinzaiWeb/', '2026-10-07'::date, '労働者派遣事業・職業紹介事業・特定募集情報等提供事業を行う事業者を検索できること', 6 from articles where slug = 'tenshoku-service-chigai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業紹介事業者は、厚生労働省の運営する人材サービス総合サイトにおいて、職業紹介の実績に関する情報提供を行うことが義務付けられます', '厚生労働省', 'https://www.mhlw.go.jp/file/06-Seisakujouhou-11600000-Shokugyouanteikyoku/0000171018_2.pdf', '2026-10-07'::date, '職業紹介事業者が、就職者数、就職後6か月以内の離職者数、手数料、返戻金制度の有無などを人材サービス総合サイトで公開する義務があること', 7 from articles where slug = 'tenshoku-service-chigai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '「就職お祝い金」などの名目で求職者に金銭等を提供して求職の申し込みの勧奨を行うことを禁止しました', '東京労働局', 'https://jsite.mhlw.go.jp/tokyo-roudoukyoku/news_topics/jyukyuuchousei_030303.html', '2026-10-07'::date, '2021年4月1日から、職業紹介事業者が「就職お祝い金」などの名目で金銭等を提供して求職の申込みをすすめることが禁止されたこと', 8 from articles where slug = 'tenshoku-service-chigai';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'tenshoku-service-chigai' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"4c25e209bcb2c587e9821dcf54d2719dcfbdf6c79a2e0dc8c01398f7d5007fb9","findings":[]}'::jsonb from articles where slug = 'tenshoku-service-chigai';
update articles set status = 'published' where slug = 'tenshoku-service-chigai';

-- article: trial-koyou (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('trial-koyou', 'article', 'トライアル雇用とは？未経験の仕事を原則3か月試しながら働ける制度のしくみと探し方', 'トライアル雇用は、職業経験の不足などで就職に不安のある人が、原則3か月の試しの雇用で仕事を経験し、会社と本人が納得したうえで常用雇用への移行をめざす国の制度です。しくみ、対象になる人、ハローワークでの探し方、注意点を整理します。', '「未経験の仕事に挑戦したいけれど、いきなり正社員で入って続けられるか不安」。そんなときに選択肢のひとつになるのが、国の制度「トライアル雇用」です。

先に結論をまとめます。

- トライアル雇用は、職業経験の不足などで就職に不安のある人が、**原則3か月の試しの雇用**で仕事を経験し、そのあと常用雇用（期間の定めのない雇用）への移行をめざす制度です
- 期間中も労働者として働くので、**給料は支払われます**
- 対象になるには条件があり、**ハローワークなどの紹介**を受けて「トライアル雇用求人」に応募します
- 3か月後に常用雇用へ移るかどうかは、会社と本人の双方が納得したうえで決まります。移行しないこともあります

## トライアル雇用とは？

トライアル雇用は、職業経験や技能、知識の不足などから就職に不安のある人を、会社が原則3か月間試しに雇い、その間に仕事への適性や能力を見極める制度です。期間が終わったあと、会社と本人の双方が納得すれば、常用雇用に移行します。

働く人にとっては、次のような良さがあります。

- 未経験の仕事を、実際に働きながら確かめられる
- 期間中に仕事の指導を受けながら、会社や職場の雰囲気を知ることができる
- 「職歴が少ない」「ブランクがある」ことで書類だけでは選考に進みにくい場合も、働く中で力を見てもらえる

会社側には、条件を満たすと国から助成金（トライアル雇用助成金）が支給されます。支給額は、対象になる人1人につき月額4万円です（母子家庭の母や父子家庭の父などの場合は月額5万円）。会社が未経験の人を受け入れやすくするためのしくみです。

```figure
type: steps
title: トライアル雇用の流れ
items:
  - label: ハローワークに求職申込み
    text: 対象になるかを窓口で確認
  - label: トライアル雇用求人に応募
    text: ハローワークなどの紹介を受ける
  - label: 原則3か月働く
    text: 給料をもらいながら仕事を経験
  - label: 常用雇用へ移行
    text: 会社と本人の双方が納得したら
```

## 対象になるのはどんな人？

トライアル雇用の対象になるのは、紹介を受ける日の時点で安定した職業に就いておらず、次のどれかに当てはまる人です。

- 紹介日の前日までの2年以内に、2回以上離職や転職をしている
- 紹介日の前日の時点で、離職している期間が1年を超えている
- 妊娠・出産・育児を理由に離職し、安定した職業に就いていない期間が1年を超えている
- 安定した職業に就いておらず、ハローワークなどで担当者による個別の支援を受けている（年齢の条件があります）
- 就職するうえで特別な配慮が必要な人（母子家庭の母、父子家庭の父など）

あわせて、週30時間以上の期間の定めのない雇用での就職を希望していることも条件になります。障害のある人向けには、別に「障害者トライアルコース」もあります。

条件の細かい部分は、自分では判断しにくいこともあります。「自分は当てはまるか」は、ハローワークの窓口で求職の申込みをするときに相談するのが確実です。

## ハローワークでの探し方

トライアル雇用で働くには、ハローワークや一定の要件を満たした職業紹介事業者などの紹介を受けて、「トライアル雇用求人」に応募します。

ハローワークインターネットサービスでは、次の方法でトライアル雇用求人を探せます（画面の表示は変わることがあります）。

1. 求人を検索する画面の「詳細検索条件」で「トライアル雇用併用求人」にチェックを入れる
2. または、フリーワードの欄に「トライアル雇用」と入力して検索する

気になる求人が見つかったら、ハローワークの窓口で紹介を受けて応募します。トライアル雇用は求人に応募する前の段階で対象かどうかの確認が必要なので、応募の前に窓口で相談しておきましょう。

## 期間中の給料や働き方

トライアル雇用の期間中も、あなたは「労働者」です。労働基準法などの法律が適用され、給料も支払われます。

ただし、期間中の給料や勤務時間、雇用保険などの扱いは、求人ごとに決まっています。応募前と、働き始める前に次の点を確認しましょう。

- トライアル雇用期間中の給料と、常用雇用に移ったあとの給料
- 契約期間（トライアル雇用の期間）と、常用雇用に移る時期
- 勤務時間、休日、社会保険・雇用保険の加入
- 期間中にどんな仕事を任され、誰が指導してくれるか

これらは労働条件通知書で書面になっているかも確かめておくと安心です。

## 注意したいこと

トライアル雇用は「3か月たてば必ず常用雇用になる」制度ではありません。会社が求める仕事の力に届かない場合などは、常用雇用に移行しないこともあります。

```figure
type: checklist
title: トライアル雇用に応募する前に確認したいこと
items:
  - 自分が対象になるか（ハローワークで確認）
  - 期間中と常用雇用後の給料の違い
  - 常用雇用に移るかを何で判断するのか
  - 期間中の研修や指導の内容
  - 常用雇用後の雇用形態（正社員かどうか）
```

特に確認しておきたいのは、次の2点です。

- **何ができれば常用雇用に移れるのか**：「3か月後にどのくらいの仕事ができていると良いですか」と聞いておくと、期間中の目標がはっきりします
- **常用雇用のあとの雇用形態**：常用雇用は期間の定めのない雇用のことで、「正社員」と呼ぶかどうかや待遇は会社によって違います。求人票と面接で確認しましょう

未経験の仕事では、期間中の研修や指導が大事になります。研修の確かめ方は[未経験求人の「研修あり」で確認すべきこと](/articles/mikeiken-kenshu-kakunin)、正社員をめざすときの進め方は[フリーターから正社員を目指すとき、最初に確認したいこと](/articles/freeter-seishain-hajimeni)でも紹介しています。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-07'::timestamptz, 'トライアル雇用とは？対象者・探し方と注意点を解説', 'トライアル雇用は、未経験の仕事を原則3か月試しながら働き、常用雇用への移行をめざす制度です。対象になる人の条件、ハローワークでのトライアル雇用求人の探し方、期間中の給料や移行しない場合など、応募前に知っておきたい注意点を紹介します。', array['mikeiken-kenshu-kakunin', 'freeter-seishain-hajimeni', '26sai-mikeiken']::text[], '{}'::text[], array['mikeiken-shokushu', 'seishain']::text[], array['freeter', 'seishain-keiken-sukunai', 'kaisu']::text[], array['未経験の仕事を', '3か月試して働く制度']::text[], null, false, '[{"q":"トライアル雇用の期間中も、給料はもらえますか？","a":"もらえます。トライアル雇用の期間中も「労働者」として働くので、労働基準法などの法律が適用され、賃金が支払われます。金額や勤務時間は求人票と労働条件通知書で確認しましょう。"},{"q":"3か月たったら、そのまま正社員になれますか？","a":"決まっているわけではありません。トライアル雇用の期間中に会社が適性や能力を見て、会社と本人の双方が納得したうえで常用雇用に移行します。会社が求める仕事の力に届かない場合などは、移行しないこともあります。移行の判断基準は、応募前や面接で確認しておきましょう。"},{"q":"転職エージェントからの紹介でもトライアル雇用になりますか？","a":"トライアル雇用は、ハローワークや一定の要件を満たした職業紹介事業者などの紹介を受けて、トライアル雇用求人に応募する必要があります。利用している転職エージェントが対象かどうかは、担当者に確認しましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「未経験の仕事を試せる」良さと、「常用雇用への移行は約束ではない」点を両方示す。対象かどうかはハローワークで確認するよう案内する","quotes":[{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/jigyounushi/page06_00002.html","text":"トライアル雇用は、職業経験の不足などから就職が困難な求職者を原則3か月間試行雇用することで、その適性や能力を見極め、期間の定めのない雇用への移行のきっかけとすることを目的とした制度。ハローワークインターネットサービスで「トライアル雇用併用求人」にチェックを入れるか、フリーワードで「トライアル雇用」と入力して探せる","used_in":"トライアル雇用とは？ / ハローワークでの探し方"},{"source_url":"https://www.mhlw.go.jp/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/dl/trial_koyou_leaflet02.pdf","text":"トライアル雇用期間中も「労働者」なので、労働基準法などの法律が適用され、賃金も支払われる。企業は期間中に適性や能力を見極め、双方が納得したうえで常用雇用に移行する。会社が求める業務遂行の能力を満たさない場合などは移行しないことがある","used_in":"期間中の給料や働き方 / 注意したいこと"},{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/trial_koyou.html","text":"対象労働者は、紹介日の前日から過去2年以内に2回以上離職や転職を繰り返している、紹介日の前日時点で離職している期間が1年を超えている、妊娠・出産・育児を理由に離職し安定した職業に就いていない期間が1年を超えている、安定した職業に就いておらずハローワーク等で担当者制による個別支援を受けている（年齢の条件あり）、就職の援助を行うに当たって特別な配慮を要する、のいずれか。支給額は1人につき月額4万円（母子家庭の母等・父子家庭の父は月額5万円）","used_in":"対象になるのはどんな人？"}],"not_used":["「トライアル雇用終了者の約8割が常用雇用へ移行」という割合は、どの年度の実績かを公的な一次情報で確認できなかったので書かない","担当者制の個別支援を受けている人の年齢の条件は、資料によって「55歳未満」「生年月日が1968年4月2日以降」などの書き方があり、2026年度時点の正確な条件を確認できなかったので「年齢の条件がある」とだけ書いた","トライアル雇用期間中の契約の形（有期契約かどうか）は、公的な一次情報で求職者向けの説明を確認できなかったので、労働条件通知書で確認するよう書いた"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'trial-koyou' and c.slug = 'seido' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'trial-koyou' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'トライアル雇用', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/jigyounushi/page06_00002.html', '2026-10-07'::date, '職業経験の不足などから就職が困難な求職者を原則3か月試行雇用し、期間の定めのない雇用への移行のきっかけとする制度であること。ハローワークインターネットサービスでのトライアル雇用求人の探し方', 0 from articles where slug = 'trial-koyou';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業経験、技能、知識の不足などで就職に不安のある皆さん 常用雇用での就職に向けて（求職者向けリーフレット）', '厚生労働省', 'https://www.mhlw.go.jp/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/dl/trial_koyou_leaflet02.pdf', '2026-10-07'::date, '期間中も労働者として労働基準法などが適用され賃金が支払われること、双方が納得したうえで常用雇用に移行すること、会社が求める能力を満たさない場合は移行しないことがあること', 1 from articles where slug = 'trial-koyou';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'トライアル雇用助成金（一般トライアルコース）', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/trial_koyou.html', '2026-10-07'::date, '対象になる人の条件（過去2年以内に2回以上の離職・転職、離職期間が1年超、妊娠・出産・育児で離職し安定した職業に就いていない期間が1年超、担当者制の個別支援を受けている人、特別な配慮が必要な人など）、週30時間以上の無期雇用を希望していること、ハローワーク等の紹介で雇い入れること、会社に支給される助成金の額', 2 from articles where slug = 'trial-koyou';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '障害者トライアルコース・障害者短時間トライアルコース', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/shougai_trial.html', '2026-10-07'::date, '障害のある人向けのトライアル雇用のコースがあること', 3 from articles where slug = 'trial-koyou';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'trial-koyou' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"ee016f046a2f2ed0a8a9fe1ff9f74c1e0f2c6ad4663db3cd7a9801bc9c10dd5a","findings":[]}'::jsonb from articles where slug = 'trial-koyou';
update articles set status = 'published' where slug = 'trial-koyou';

-- article: uketsuke-shigoto (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('uketsuke-shigoto', 'article', '受付の仕事内容は？企業・ホテル・クリニックの違いと接客経験の活かし方', '受付の仕事は、来た人を迎えて用件を聞き、担当者や行き先につなぐことが中心です。企業受付・ホテルのフロント・クリニックの受付で何が違うか、接客経験をどう伝えるか、雇用形態や勤務時間など求人で確認したいことを紹介します。', '「接客の仕事はしてきたけど、次は受付の仕事をしてみたい」。受付は、接客の経験とつながりやすい仕事の一つです。ただ、**どこの受付かによって、することも勤務時間も大きく変わります**。

先に結論を言うと、受付の仕事の中心は、**来た人を迎えて用件を聞き、担当者や行き先につなぐこと**です。応募するときは、企業・ホテル・クリニックのどれかで働き方がどう違うかを知ったうえで、**雇用形態、勤務時間、受付以外に担当する仕事**を求人で確かめましょう。

この記事で分かること：

- 受付の**仕事内容**
- 企業・ホテル・クリニックの**違い**
- 接客経験の**伝え方の例**
- 求人で**確認すること**

## 受付の仕事って、何をする？

厚生労働省の職業情報提供サイト「job tag」では、企業の受付（受付事務）は、**来客を迎えて訪問の目的を確かめ、担当者に連絡し、行き先へ案内する仕事**として紹介されています。たとえば、次のような流れです。

```figure
type: steps
title: 企業受付の来客対応の流れ
items:
  - label: 迎える
    text: あいさつをして、訪問先の部署や担当者を聞く
  - label: 確かめる
    text: 予約表や社員名簿で、約束や担当者を確かめる
  - label: 連絡する
    text: 担当者に内線で来客を伝える
  - label: 案内する
    text: 応接室や会議室へ案内する
```

このほか、電話の取り次ぎや、行き先が分からない来客の用件を聞いて担当の部署を判断すること、不審な来客があれば警備室に連絡することなども、仕事に入ります。

## 企業・ホテル・クリニックで何が違う？

同じ「受付」でも、働く場所によって中身が変わります。

| | 企業受付 | ホテルのフロント | クリニック・病院の受付 |
| --- | --- | --- | --- |
| 主にすること | 来客の案内、担当者への取り次ぎ、電話対応 | チェックイン・チェックアウト、予約の管理、会計 | 来院した人の受付、会計（医療事務として） |
| 相手 | 取引先などの来客 | 宿泊する人 | 体調が悪い患者さん |
| 勤務時間の傾向 | 会社の営業時間に合わせることが多い | 交替制のシフト。早朝・深夜の勤務もある | 診療時間に合わせる。土曜の診療があるところも |

### 企業受付

会社の営業日・営業時間に合わせて働くことが多い仕事です。来客の対応がない時間に、会議室の予約管理や郵便物の受け渡しなど、事務の作業を担当する職場もあります。

### ホテルのフロント

job tagでは、ホテルのフロントは**チェックイン・チェックアウトの受付、予約の管理、会計**などを担当するとされています。ホテルでは、日勤のほかに早朝・深夜の勤務や当直など**交替制のシフト**で働くことが多く、休日も**週末に固定されていないことが多い**とされています。

### クリニック・病院の受付

病院やクリニックの窓口での受付と会計は、job tagでは**医療事務**の仕事として紹介されています。受付だけでなく、パソコンで診療の内容を入力したり、会計をしたりすることが多いので、求人の仕事内容をよく読みましょう。

## 接客の経験は、どう活かせる？

受付は、**相手が誰で、何をしに来たのかを短い時間で聞き取り、迷わせずに案内する仕事**です。接客や販売で身についた次のような経験は、そのまま伝えられます。

- お客さまを迎えるあいさつや、ていねいな言葉づかい
- 混んでいるときに、待っている人へ声をかける気配り
- 用件を聞いて、売り場や担当者に正しくつなぐこと
- お金のやりとりや予約の管理を、ミスなく行うこと

職務経歴書や面接では、「接客をしていました」だけでなく、**何をどのように工夫したか**を書くと伝わりやすくなります。

> 「家電量販店の売り場で、来店されたお客さまの用件をうかがい、担当の売り場や修理受付へご案内していました。混雑時は、お待ちのお客さまに順番と待ち時間の目安をお伝えするよう心がけていました。」

> 「ホテルの宴会場のアルバイトで、受付で招待客のお名前を名簿と照らし合わせ、席へご案内していました。」

### 電話の取り次ぎは、型を覚えれば慣れていける

接客の経験はあっても、会社の電話に出たことがないと不安になるかもしれません。電話の取り次ぎは、**名乗る → 相手と用件を聞く → 担当者につなぐ（不在なら伝言を受ける）**の型を覚えると落ち着いて対応できます。

> 「お電話ありがとうございます。株式会社〇〇、受付の△△でございます。」
>
> 「恐れ入りますが、お名前とご用件をお伺いできますか。」
>
> 「担当の□□は席を外しております。戻りましたら、折り返しお電話するよう申し伝えます。」

社名や言い回しは職場ごとに決まっていることが多いので、入社後に教わったものに合わせましょう。

接客経験の言葉にしかたは[接客経験は転職でどう活かせる？](/articles/sekkyaku-keiken-ikasu)でもくわしく紹介しています。

## 求人で確認すること

受付の求人は、職種名だけでは中身が分かりにくいことがあります。応募する前に、次の点を確かめましょう。

```figure
type: checklist
title: 受付の求人で確認すること
items:
  - 雇用形態（正社員・契約社員・派遣・パート）
  - 勤務時間と、シフトや早朝・深夜の勤務の有無
  - 休日（土日休みか、シフトで決まるか）
  - 受付以外に担当する仕事
  - 制服の有無と、身だしなみの決まり
  - 一人で受付に立つのか、複数人か
```

特に**「受付以外に担当する仕事」**は大切です。来客の対応だけの職場もあれば、電話の取り次ぎや事務作業、会計まで任される職場もあります。経験を広げたい人にとってはよい面もあるので、自分の希望と合っているかで判断しましょう。

面接では、こんな聞き方ができます。

- 来客の対応がない時間は、どのような仕事を担当していますか
- 受付は何名の体制ですか。休憩や休みのときは、どのように交代していますか
- シフトはいつごろ、どのように決まりますか

「土日休みにしたい」「深夜の勤務は避けたい」など、受付を選ぶ理由がはっきりしている人は、その条件に合う働き方かどうかを先に確かめておくと、入ってからのずれが少なくなります。接客からオフィスの仕事に移るときに変わることは[接客からオフィスワークに移るとき、働き方はどう変わる？](/articles/sekkyaku-office)にまとめています。事務の仕事全体に興味がある人は、[未経験で事務職を目指す前に知っておきたいこと](/articles/jimu-mikeiken-mae)もあわせて読んでみてください。', 'review', false, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, '受付の仕事内容｜企業・ホテル・クリニックの違いと求人の見方', '受付の仕事内容を、企業受付・ホテルのフロント・クリニックの受付に分けて紹介します。それぞれの1日の動き方と勤務時間の違い、接客経験を書類や面接でどう伝えるかの例、雇用形態・シフト・受付以外の業務など求人で確認したいことが分かります。', array['sekkyaku-keiken-ikasu', 'sekkyaku-office', 'jimu-mikeiken-mae', 'iryo-jimu-mikeiken']::text[], array['jimu', 'hanbai']::text[], array['office']::text[], array['sekkyaku', 'freeter']::text[], array['接客の経験、', '受付の仕事で活かせる？']::text[], null, false, '[{"q":"受付の仕事は、未経験でも応募できますか？","a":"「未経験可」の求人なら応募できます。来た人を迎えて案内する仕事なので、接客や販売の経験がある人は、あいさつや言葉づかい、待っている人への気配りを経験として伝えられます。電話の取り次ぎやパソコンでの予約管理もあることが多いので、求人の仕事内容の欄を確かめておきましょう。"},{"q":"企業の受付は土日休みですか？","a":"会社の営業日に合わせて働くことが多いので、会社が土日休みなら受付も土日休みのことが多いです。ただ、ホテルは交替制のシフトで休日も週末に固定されていないことが多く、クリニックは診療日に合わせた勤務になるなど、働く場所によって大きく違います。求人の休日欄と勤務時間の欄で確かめましょう。"},{"q":"受付の経験は、次の仕事につながりますか？","a":"電話の取り次ぎ、来客の予約管理、書類の受け渡しなどは、事務の仕事とも重なります。受付をしながら、予約表の管理や資料の準備など担当を広げていく職場もあります。どんな仕事につながるかは職場によって違うので、面接で受付以外の担当があるかを聞いておくとよいでしょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「受付」とひとくくりにされがちな仕事を、企業・ホテル・クリニックの3つに分け、することと勤務時間の違いを並べる。接客経験の伝え方の例と、求人で見落としやすい点（雇用形態・受付以外の業務・シフト）を具体的にする","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/427","text":"企業や団体等の受付で来客を迎えて応対し、訪問目的を把握して担当者への連絡や訪問先への案内を行う。訪問先の社員や部署を尋ね、社員名簿で確認して内線で用件を伝える。予約済みの来客は予約表で確認し応接室や会議室に案内する。不審な来客は必要に応じて警備室に連絡する（job tag に直接接続できなかったため、検索結果に表示されたページ内容で確認）","used_in":"受付の仕事って、何をする？／企業受付"},{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/416","text":"フロントはチェックイン・チェックアウトの受付、予約管理、会計などを担当。ホテルでは日勤や早朝勤務、深夜勤務、当直勤務などの交替制シフトでの勤務となり、休日も週末固定ではないことが多い（job tag に直接接続できなかったため、検索結果に表示されたページ内容で確認）","used_in":"ホテルのフロント"},{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/443","text":"医療事務は医療機関の窓口で外来の受付や医療費の会計、入退院の手続きなどを行う（job tag に直接接続できなかったため、検索結果に表示されたページ内容で確認）","used_in":"クリニック・病院の受付"}],"not_used":["job tag の受付事務のタスク実施率（電話対応などの割合）は検索結果の要約に出ていたが、ページを直接開いて確かめられなかったので書かない","受付の賃金の数字は、時点と値を確かめられなかったので書かない","「受付は派遣が多い」といった傾向は公的な根拠を確認できなかったので、断定せず雇用形態を確かめるよう書いた"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'uketsuke-shigoto' and c.slug = 'shokushu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'uketsuke-shigoto' and c.slug = 'keiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '受付事務 - 職業詳細（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/427', '2026-10-09'::date, '企業受付の仕事内容（来客を迎えて訪問目的を確かめ、担当者に内線で連絡し、応接室・会議室へ案内する。予約表での確認、電話対応、不審な来客の警備室への連絡など）', 0 from articles where slug = 'uketsuke-shigoto';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '接客担当（ホテル・旅館） - 職業詳細（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/416', '2026-10-09'::date, 'ホテルのフロントがチェックイン・チェックアウトの受付、予約管理、会計などを担当すること、ホテルでは日勤・早朝・深夜・当直などの交替制シフトで、休日も週末固定ではないことが多いこと', 1 from articles where slug = 'uketsuke-shigoto';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '医療事務 - 職業詳細（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/443', '2026-10-09'::date, 'クリニックや病院の窓口で、外来の受付や医療費の会計を医療事務が担当すること', 2 from articles where slug = 'uketsuke-shigoto';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'uketsuke-shigoto' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"82dc0b7059762b30c3457488e4c58a798d665bbf9547692214b2aa5c7a265063","findings":[]}'::jsonb from articles where slug = 'uketsuke-shigoto';
update articles set status = 'published' where slug = 'uketsuke-shigoto';

-- article: web-marketing-mikeiken (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('web-marketing-mikeiken', 'article', 'Webマーケティングの仕事内容は？種類と、未経験からの近づき方・求人の見方', 'Webマーケティングは、Webサイトや広告、SNSを使ってお客さまを集め、アクセスの数字を見ながら改善していく仕事です。仕事の種類、使う力、未経験から近づくときの準備、アシスタント求人で確かめたいことを紹介します。', '「Webマーケティングに興味がある。でも、実際に毎日何をしている仕事なのか、よく分からない」。そう感じる人は多いと思います。

先に結論を言うと、Webマーケティングは**Webサイトや広告、SNSを使ってお客さまを集め、その結果を数字で見て、次の打ち手を考える仕事**です。未経験から近づくなら、**アシスタントとして作業を任される求人で、担当する範囲と教わり方を確かめて応募する**のが現実的な入口になります。

この記事で分かること：

- Webマーケティングの**仕事の種類**
- 仕事で**使う力**
- 未経験からの**準備のしかた**
- アシスタント求人で**確かめたいこと**

## Webマーケティングって、どんな仕事？

厚生労働省の職業情報提供サイト「job tag」では、Webマーケティングは、**Webサイトなどを使った集客や市場調査を行う仕事**として紹介されています。検索で上位に表示されるようにする工夫（SEO）や、検索結果に出す広告（リスティング広告）などでお客さまを集め、**アクセス解析**（サイトに来た人がどこから来て、どのページをどのくらい見たかなどを調べること）の結果をもとに改善していきます。

別の名前として、マーケター、Webマーケティング事務員などの呼び方もあります。求人ではいろいろな職種名で出ているので、名前より**仕事内容の欄**を見ることが大切です。

## 仕事の種類は？4つに分けると分かりやすい

会社によって担当の分け方は違いますが、おおまかには次の4つに分けられます。

| 仕事 | 主にすること | 例 |
| --- | --- | --- |
| 集客（SEO・記事） | 検索で見つけてもらえるよう、サイトや記事を整える | 記事の見出しを直す、情報を新しくする |
| Web広告 | 検索広告やSNS広告を出し、結果を見て調整する | 広告の文章や画像を何種類か試す |
| SNS運用 | 会社のアカウントで発信し、反応を見る | 投稿を作る、反応の数をまとめる |
| アクセス解析 | 数字を集めて、どこを直すとよいかを考える | 毎週の数字を表にまとめ、変化を報告する |

```figure
type: steps
title: Webマーケティングの仕事のくり返し
items:
  - label: 考える
    text: 誰に、何を知ってほしいかを決める
  - label: 出す
    text: 記事・広告・SNSの投稿を出す
  - label: 数字を見る
    text: アクセスや反応を集めて比べる
  - label: 直す
    text: 結果をもとに次の打ち手を決める
```

どの仕事でも、**「出して終わり」ではなく、数字を見て直すことをくり返す**のが特徴です。

## どんな力を使う？接客の経験はつながる？

Webマーケティングで使う力は、次のようなものです。

- **お客さまの気持ちを想像する力**：どんな言葉なら興味を持ってもらえるか
- **数字を並べて比べる力**：先週と今週で何が変わったか
- **文章を書く力**：広告や記事、投稿の文章
- **地道な作業を続ける力**：集計や入力、細かい修正

接客や販売の経験がある人は、「お客さまがどんなときに買ってくれたか」「どんな声かけだと話を聞いてもらえたか」を考えてきた経験が、そのまま「誰に、何を伝えるか」につながります。たとえば、次のように言葉にしておくと面接で話しやすくなります。

> 「店頭のPOPの文言を何度か変えて、手に取ってもらえる数が変わるのを見てきました。Webでも、言葉を変えて結果を見ながら改善する仕事がしたいと考えています。」

接客経験の言葉にしかたは[接客経験は転職でどう活かせる？](/articles/sekkyaku-keiken-ikasu)でもくわしく紹介しています。

## 未経験から近づくには？今からできる準備

応募の前に、次のような準備をしておくと、面接で具体的に話せるようになります。

1. **表計算ソフトに慣れる**：数字を表にまとめる、合計や平均を出す、グラフにする
2. **身近なもので試してみる**：自分のSNSやブログで、投稿の時間や内容を変えて反応を比べてみる
3. **試したことを記録する**：「何を変えて、どうなったか」をメモに残す
4. **気になる会社のサイトや広告を見てみる**：誰に向けて、何を伝えているかを考える

大事なのは、フォロワーの数などの結果の大きさより、**「何を試して、どう考えたか」を話せること**です。

## アシスタント求人、何を確かめる？

未経験可の求人は、「Webマーケティングアシスタント」「Web担当（アシスタント）」のような名前で出ていることがあります。最初は、広告の入稿作業、投稿の作成、数字の集計といった作業から任されることが多いため、次の点を確かめておきましょう。

```figure
type: checklist
title: アシスタント求人で確かめたいこと
items:
  - 最初に任される作業は何か
  - 自社の商品の担当か、取引先の担当か
  - 誰が、どのように教えてくれるか
  - 数字の目標を持つのはいつごろからか
  - 先輩はどんな仕事に進んでいるか
  - 使うツールや表計算ソフトの程度
```

「自社の商品の担当か、取引先の担当か」は見落としやすいところです。自社の商品やサービスを売るためにWebマーケティングをする会社と、取引先から依頼を受けて広告などを運用する会社では、仕事の進め方や忙しさが変わります。

面接では、こんな聞き方ができます。

- 未経験で入社した方は、最初の数か月でどんな作業を担当していますか
- 担当するのは自社のサービスですか。それとも、お客さまの会社のサービスですか
- 結果の数字を自分で見て、改善案を出すようになるのはいつごろからですか

研修のある求人の見方は[未経験求人の「研修あり」で確認すべきこと](/articles/mikeiken-kenshu-kakunin)も参考にしてください。

## 知っておきたい広告のルール

Webマーケティングの仕事では、広告のルールも関わってきます。代表的なのが**景品表示法**で、商品やサービスを実際より良く見せる表示などが規制されています。

また、**2023年10月1日から**、広告であることを隠して第三者の感想のように見せる、いわゆる**ステルスマーケティング**も、景品表示法の不当表示として規制されています。消費者庁のQ&Aでは、規制の対象は広告主である事業者とされていて、会社がインフルエンサーなどに投稿を依頼する場合も、内容の決定に関わっていれば対象になることがあります。

入社してすぐに判断を任されることは少ないと思いますが、**「広告だと分かるように書く」「実際より良く見せない」**という考え方は、最初から知っておくと安心です。

## まだ迷っているなら

Webマーケティングは、名前から想像する仕事と実際の作業に差が出やすい仕事です。求人を何件か読んで、「この作業なら続けられそうか」を考えてみてください。ほかの仕事とも比べたいときは、[やりたい仕事が分からないときの探し方](/articles/shigoto-sagashikata)の3ステップで候補を整理してみるのもおすすめです。', 'review', false, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, '2026-10-10'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, 'Webマーケティングの仕事内容と未経験からの近づき方', 'Webマーケティングの仕事内容を、集客・広告・SNS・アクセス解析などの種類に分けて紹介します。使う力、未経験から近づくための準備、アシスタント求人で確かめたいこと、広告のルール（ステマ規制）の基本が分かります。', array['sekkyaku-keiken-ikasu', 'mikeiken-kenshu-kakunin', 'shigoto-sagashikata', 'programmer-mikeiken', 'remote-work-kyujin']::text[], array['sonota']::text[], array['mikeiken-shokushu', 'office']::text[], array['sekkyaku', 'hajimete']::text[], array['Webマーケティング、', '未経験から近づくには？']::text[], null, false, '[{"q":"Webマーケティングは未経験でも応募できますか？","a":"「未経験可」や「アシスタント」の求人なら応募できます。入社後は、広告やSNSの投稿の作業、数字の集計などから任されることが多いので、どこまでを自分が担当するのか、誰が教えてくれるのかを求人や面接で確かめておきましょう。"},{"q":"文系でも、数字が苦手でもできますか？","a":"文章を書く、お客さまの気持ちを考えるといった仕事もあるので、文系かどうかで決まるものではありません。ただ、アクセス数や広告の結果を見て「次に何を変えるか」を考える場面は多いので、表計算ソフトで数字を並べて比べることには慣れておくと安心です。"},{"q":"自分のSNSを運用した経験は、アピールになりますか？","a":"投稿の内容を変えたら反応がどう変わったか、を自分で比べた経験があれば、話の材料になります。フォロワーの数だけを伝えるより、「何を試して、どんな結果になり、次にどうしたか」を話せるようにしておくと、仕事とのつながりが伝わりやすくなります。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「Webマーケティング」という言葉はあいまいなので、job tag の説明をもとに仕事を集客・広告・SNS・解析に分けて見せる。未経験はアシスタント的な作業から入ることが多い前提で、求人で「担当範囲」と「教わり方」を確かめる方法を具体的にする。広告のルール（ステマ規制）にも触れ、働く人が知っておくべき基本として紹介する","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/240","text":"Webサイトや Web技術を活用した集客や市場調査などを行う。インターネットマーケティングとも言う。集客手法としてSEO、リスティング広告、アフィリエイト広告などがあり、アクセス解析（訪問者の経路や滞在時間など）とその結果を踏まえた改善策の実施を行う。別名にWebマーケティング事務員、マーケター、マーケティングリサーチャーなど（job tag に直接接続できなかったため、検索結果に表示されたページ内容で確認）","used_in":"Webマーケティングって、どんな仕事？／仕事の種類は？"},{"source_url":"https://www.caa.go.jp/policies/policy/representation/fair_labeling/faq/stealth_marketing/","text":"事業者の表示であることを一般消費者が判別することが困難な表示（いわゆるステルスマーケティング）を、景品表示法第5条第3号の告示で不当表示として指定し、2023年10月1日から施行。規制対象は内容の決定に関与した事業者（広告主）（消費者庁サイトの検索結果に表示された内容で確認）","used_in":"知っておきたい広告のルール"},{"source_url":"https://www.caa.go.jp/policies/policy/representation/fair_labeling","text":"景品表示法は、商品やサービスの品質、内容、価格等を偽って表示することを規制する法律（消費者庁サイトの検索結果に表示された内容で確認）","used_in":"知っておきたい広告のルール"}],"not_used":["job tag の賃金・就業者数などの数値は、検索結果では確認できなかったので書かない","Web広告の市場規模などの統計は、この記事の目的（仕事内容と近づき方）に必要ないので扱わない","Webマーケティング関連の民間資格や講座は、特定のサービスのすすめになるため扱わない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'web-marketing-mikeiken' and c.slug = 'shokushu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'web-marketing-mikeiken' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'Webマーケティング（ネット広告・販売促進） - 職業詳細（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/240', '2026-10-09'::date, 'Webマーケティングの仕事内容（Webサイトなどを使った集客や市場調査、SEO・リスティング広告などの集客手法、アクセス解析にもとづく改善）、別名にマーケターやWebマーケティング事務員などがあること', 0 from articles where slug = 'web-marketing-mikeiken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ステルスマーケティングに関するQ&A', '消費者庁', 'https://www.caa.go.jp/policies/policy/representation/fair_labeling/faq/stealth_marketing/', '2026-10-09'::date, '広告であることを隠した表示（ステルスマーケティング）が、2023年10月1日から景品表示法の不当表示として規制されていること、規制の対象が広告主（事業者）であること', 1 from articles where slug = 'web-marketing-mikeiken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '景品表示法', '消費者庁', 'https://www.caa.go.jp/policies/policy/representation/fair_labeling', '2026-10-09'::date, '景品表示法が、商品やサービスの品質・価格などについて実際より良く見せる表示を規制していること', 2 from articles where slug = 'web-marketing-mikeiken';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'web-marketing-mikeiken' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"d0b81e20b18b497f90248c6bfd02ad26cca697026c6224b2f1966c3d0a559d19","findings":[]}'::jsonb from articles where slug = 'web-marketing-mikeiken';
update articles set status = 'published' where slug = 'web-marketing-mikeiken';

-- article: web-mensetsu-junbi (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('web-mensetsu-junbi', 'article', 'Web面接（オンライン面接）の準備は？通信・カメラ位置・背景・服装と、つながらないときの連絡', 'Web面接は、会場を自分で用意する面接です。前日までに通信・アプリ・カメラを本番と同じ条件で試し、当日は早めにログインして、つながらないときの連絡先を手元に置いておきます。カメラの高さや明るさ、背景、服装、当日の流れ、トラブル時の連絡の例文を紹介します。', '「Web面接で」と案内が来たけれど、家のどこで受ければいいのか、何を用意すればいいのか分からない。はじめてだと不安になりますよね。

先に結論を言うと、Web面接は**会場を自分で用意する面接**です。準備は次の3つに分けると迷いません。

1. **前日まで**に、通信・アプリ・カメラを本番と同じ条件で試す
2. **当日**は、早めにログインして待つ
3. **つながらないときの連絡先**を、すぐ見られる場所に置いておく

この記事で分かること：

- 前日までに**試しておくこと**
- **カメラの高さと明るさ**、**背景**、**服装**の整え方
- 当日の**流れ**と、話すときのコツ
- **つながらないとき**の連絡のしかたと例文（仮の例）

## 対面の面接と何が違う？

対面の面接では、会社が部屋や机を用意してくれます。Web面接では、**通信、機材、明るさ、静かさ**を自分で用意しなければなりません。逆に言えば、ここを前日までに整えておけば、当日は話すことに集中できます。

面接で話す内容の準備は、対面と変わりません。聞かれやすい質問の準備は[未経験職種の面接、何を準備する？](/articles/mensetsu-junbi-mikeiken)で紹介しています。

## 前日までに試しておくこと

兵庫労働局が公開しているオンライン面接のチェックポイントでは、実際に使うアプリの確認や、接続試験があるかの確認、パソコンを電源コードにつなぐことなどを挙げています。前日までに、**本番と同じ場所・同じ機材**で一度通して試しておきましょう。

```figure
type: checklist
title: 前日までに試しておくこと
items:
  - 案内のURLとアプリで、実際に入れるか試した
  - 会社の接続テストがあれば受けた
  - 受ける場所で、通信が途切れないか確かめた
  - カメラとマイクが映る・聞こえるか確かめた
  - パソコンを電源コードにつないだ
  - 通知が鳴らないよう、ほかのアプリを閉じた
  - つながらないときの連絡先を控えた
```

試すときは、家族や友人とビデオ通話をしてみると、**自分の声が相手にどう聞こえるか**、映り方がどうかを教えてもらえます。カメラやマイクの調子が悪い場合は、兵庫労働局のチェックポイントでも、外付けの機器を検討するようにとしています。

パソコンの操作に自信がないときは、アプリの入り方やマイクの切り替えだけでも前日に何度か練習しておくと安心です。パソコンの基本操作の練習のしかたは[PCが得意じゃなくても、事務職は目指せる？](/articles/pc-nigate-jimu)でも紹介しています。

## カメラの高さと明るさ

神奈川のハローワーク川崎の面接対策の資料では、光は顔の前から受け、パソコンのカメラを目線の高さに合わせるようにとしています。

- **カメラの高さ**：ノートパソコンを机に置いたままだと、カメラが目より下になり、見下ろすような映り方になりがちです。本や箱を下に置いて、カメラを目の高さまで上げます
- **映る範囲**：顔だけでなく、上半身が映るくらいの距離に座ります
- **明るさ**：窓や照明を背にすると、顔が暗く映ります。光が顔の前から当たる向きに座り、顔に影ができていないか、明るすぎて白く飛んでいないかを確かめます

自然光を使う場合は、面接と同じ時間帯に試しておくと、当日の明るさに近い状態で確かめられます。

## 背景

ハローワーク川崎の資料では、背景は無地が好ましく、難しい場合は背後にできるだけものが映らないようにするとしています。兵庫労働局のチェックポイントでは、バーチャル背景を使わないことも確認項目に入っています。

- 無地の壁やカーテンの前に座る
- 洗濯物、ポスター、散らかった棚などが映らない向きにする
- 家族の声や生活音が入らない部屋を選び、受ける時間を家族に伝えておく

## 服装

ハローワーク川崎の資料では、オンライン面接の服装も通常の面接と同じにするとしています。画面に映るのは上半身だけでも、**上下とも対面の面接と同じ服装**にしておきましょう。途中で立ち上がることになっても慌てずにすみますし、気持ちも切り替わります。

会社から「私服で」「服装自由」などの指定がある場合は、それに従います。

## 当日の流れ

```figure
type: steps
title: Web面接の当日の流れ
items:
  - label: 準備
    text: 機材を立ち上げ、カメラとマイクを確かめる
  - label: ログイン
    text: 開始5〜10分前までに入って待つ
  - label: 面接
    text: カメラを見て、少しゆっくり話す
  - label: 退出
    text: お礼を言い、相手が退出してから切る
```

兵庫労働局のチェックポイントでは、開始5〜10分前までにログインを終えることを確認項目にしています。早すぎて相手の準備中に入ってしまわないよう、案内に入室の時刻が書かれていればそれに合わせましょう。

### 話すときのコツ

- **カメラを見て話す**：画面の相手の顔を見ると、相手からは目線が下がって見えます。ハローワーク川崎の資料でも、面接中はカメラを見て話すようにとしています
- **少しゆっくり、はっきり**：音声が少し遅れて届くことがあるので、相手の話が終わってから一呼吸おいて答えます
- **うなずきを大きめに**：小さな相づちは画面では伝わりにくいので、うなずきで聞いていることを示します
- **メモは紙に**：キーボードを打つ音はマイクに入りやすいので、メモを取るときは手元の紙に書きます

働きながら転職活動をしていて、平日の面接の時間をどう作るか迷うときは、[働きながらの転職活動、何から？](/articles/zaishoku-tenshoku-susumekata)も参考にしてください。

## つながらないときの連絡

兵庫労働局のチェックポイントには、通信が途絶えたときの連絡手段を確認しておくことも入っています。面接の案内メールに書かれている**電話番号とメールアドレス**を、紙に書くかスマホにメモして、パソコンとは別に見られるようにしておきましょう。

開始時刻になっても入れないときや、途中で切れて戻れないときは、まず入り直しを試し、それでもだめなら**すぐに連絡**します。黙って待つより、早めに伝えるほうが、会社も次の対応を決めやすくなります。

電話で伝える場合（仮の例）：

> 「本日〇時からWeb面接のお約束をいただいている〇〇と申します。先ほどから案内のURLに接続できず、ご連絡いたしました。入り直しを試しておりますが、どのようにすればよろしいでしょうか。」

メールで伝える場合（仮の例）：

> 件名：Web面接への接続について（〇〇 〇〇）
>
> 本日〇時からWeb面接のお約束をいただいている〇〇です。開始時刻に案内のURLから接続を試みましたが、つながらない状態です。引き続き接続を試しております。お手数をおかけしますが、ご指示をいただけますと幸いです。

途中で音声だけが聞こえなくなったときは、画面のチャット欄に「音声が聞こえなくなりました。入り直します」と書いてから入り直すと、相手にも状況が伝わります。トラブルがあっても、落ち着いて状況を伝えられれば、そのあとの面接に気持ちを切り替えやすくなります。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-09'::timestamptz, 'Web面接の準備と注意点｜カメラ位置・背景・つながらないとき', 'Web面接（オンライン面接）の準備を紹介します。前日までに試す通信・アプリ・電源、カメラの高さと明るさ、背景と服装、当日のログインの目安、話し方のコツ、つながらないときの連絡のしかたと例文が分かります。', array['mensetsu-junbi-mikeiken', 'zaishoku-tenshoku-susumekata', 'pc-nigate-jimu', 'mensetsu-fukusou', 'oubo-mail-kakikata']::text[], '{}'::text[], array['mensetsu']::text[], array['hajimete', 'pc-mikeiken']::text[], array['Web面接、', '何を準備すればいい？']::text[], null, false, '[{"q":"Web面接はスマホで受けても大丈夫ですか？","a":"会社から指定がなければ、スマホで受けられる場合もあります。その場合は、手に持たずにスタンドなどで固定し、充電しながら、通知を切って受けましょう。パソコンかスマホか迷うときは、面接の案内に書かれていないかを確認し、分からなければ事前に問い合わせると安心です。"},{"q":"バーチャル背景を使ってもいいですか？","a":"兵庫労働局のオンライン面接のチェックポイントでは、バーチャル背景を使わないことが確認項目に入っています。会社から指定がなければ、無地の壁やカーテンの前など、実際の背景を整えて受けるのが無難です。"},{"q":"面接の途中で通信が切れてしまったら、不合格になりますか？","a":"通信の不具合だけで結果が決まるとは限りません。慌てずに入り直し、入れないときは事前に控えておいた連絡先に、すぐ電話かメールで状況を伝えましょう。再開のしかたは会社の指示に従います。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"Web面接は「会場を自分で用意する面接」。既存記事（mensetsu-junbi-mikeiken）の5項目のチェックを深掘りし、前日までの試し方、カメラ・明るさ・背景・服装、当日の流れ、つながらないときの連絡の例文まで、手順として示す","quotes":[{"source_url":"https://jsite.mhlw.go.jp/hyogo-roudoukyoku/content/contents/000946458.pdf","text":"ライトの角度が悪く顔に影ができていないか、光量が強く白飛びしていないか。実際に使うアプリケーションを確認し、接続試験があるか確認すること（あれば対応すること）。パソコンはバッテリー駆動させていないか（電源コード接続が望ましい）。カメラやマイクの調子が悪い場合は外付け機器の導入を検討すること。上半身が映るカメラ位置、バーチャル背景を使用しないこと、開始5〜10分前までのログイン、通信が途絶えた際の連絡手段の確認などをチェック項目にしている（この環境から jsite.mhlw.go.jp に直接接続できなかったため、検索結果に表示された資料の抜粋で確認）","used_in":"前日までに試しておくこと／カメラの高さと明るさ／背景／当日の流れ／つながらないときの連絡"},{"source_url":"https://jsite.mhlw.go.jp/kanagawa-hellowork/content/contents/002604524.pdf","text":"オンライン面接の注意点として、背景は無地が好ましく、難しい場合は背後に極力ものが写らないようにする。光は顔の前から受ける、PCのカメラを目線の高さに合わせる、面接中はカメラを見て話す。服装は通常の面接と同じ（直接開けなかったため、検索結果の抜粋で確認）","used_in":"カメラの高さと明るさ／背景／服装／話し方"}],"not_used":["兵庫労働局のチェックポイントにある通信速度の目安の数値は、抜粋だけでは正確な値と条件を確認できなかったため書かない","背景ぼかし機能の可否は、ハローワークの資料によって扱いが分かれていた（使ってよいとする資料と、使わないことをすすめる資料がある）ため断定せず、「実際の背景を整えるのが無難」にとどめた","使うアプリ（Zoom・Teams など）は会社によって違うため、特定のサービスの操作方法は書かない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'web-mensetsu-junbi' and c.slug = 'shorui-mensetsu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'web-mensetsu-junbi' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'オンライン面接（WEB面接）チェックポイント', '兵庫労働局', 'https://jsite.mhlw.go.jp/hyogo-roudoukyoku/content/contents/000946458.pdf', '2026-10-09'::date, '実際に使うアプリの確認と接続試験の有無の確認、パソコンは電源コードに接続すること、カメラやマイクの調子が悪いときは外付け機器を検討すること、顔に影ができていないか・白飛びしていないかの確認、上半身が映るカメラ位置、バーチャル背景を使わないこと、開始5〜10分前までのログイン、通信が途絶えたときの連絡手段の確認', 0 from articles where slug = 'web-mensetsu-junbi';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '面接対策 面接のマナーとよく聞かれる質問', '神奈川労働局（ハローワーク川崎）', 'https://jsite.mhlw.go.jp/kanagawa-hellowork/content/contents/002604524.pdf', '2026-10-09'::date, 'オンライン面接の背景は無地が好ましく、難しい場合は背後にものが映らないようにすること。光は顔の前から受け、カメラを目線の高さに合わせ、カメラを見て話すこと。服装は通常の面接と同じにすること', 1 from articles where slug = 'web-mensetsu-junbi';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'web-mensetsu-junbi' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"203896cf118e3ac2db6c0fbc862b5d20f095091409bdecbb9a82a89fe4608797","findings":[]}'::jsonb from articles where slug = 'web-mensetsu-junbi';
update articles set status = 'published' where slug = 'web-mensetsu-junbi';

-- article: yametai-mae-kakunin (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('yametai-mae-kakunin', 'article', '今の仕事を辞めたいとき、先に確認しておきたいこと', '今の仕事を辞めたいと思ったら、辞める前に、つらい理由の整理、働きながら探すかどうか、退職を伝える時期、有給休暇の残りを確認しておくと、あとで困りにくくなります。心や体がつらいときの相談先もあわせて紹介します。', '「もう今の仕事を辞めたい」。そう思うのは、おかしなことではありません。ただ、勢いで辞めてしまうと、次の仕事が決まるまでの生活費や手続きで困ることがあります。辞めるかどうかを決める前に、確認しておきたいことを順番に整理します。

もし今、眠れない、食べられないなど、心や体がつらい状態が続いているなら、転職のことより先に、休むことや相談することを考えてください。相談先はこの記事の最後で紹介しています。

## まず、何がつらい？

「辞めたい」の理由を分けてみると、今の職場で変えられるかもしれないことと、転職で見直したほうがいいことが見えてきます。

| つらいこと | 今の職場で確かめること | 転職で見直すなら |
| --- | --- | --- |
| 人間関係 | 異動や担当替えを相談できるか | 職場の雰囲気、チームの人数 |
| 仕事内容 | 担当業務を変えられるか | 職種、最初に任される仕事 |
| 休み・時間 | シフトや残業を調整できるか | 年間休日、残業時間 |
| 給料 | 昇給のしくみと時期 | 基本給、賞与、昇給 |

書き出すときは、「毎週土曜の出勤がつらい」「先輩に質問しにくい」のように、**具体的な場面**で書くのがコツです。次の職場で同じことを繰り返さないための、条件選びの材料にもなります。

## 働きながら探す？辞めてから探す？

どちらにも良い点と気をつけたい点があります。

| | 働きながら探す | 辞めてから探す |
| --- | --- | --- |
| 収入 | 途切れない | 途切れる期間がある |
| 時間 | 面接の日程を合わせにくい | 予定を立てやすい |
| 気持ち | 仕事との両立で疲れやすい | 決まるまで焦りが出やすい |

辞めてから探す場合は、雇用保険の基本手当（いわゆる失業手当）を受け取れるかが、生活費の見通しに関わります。2025年4月1日以降に自己都合で退職した場合、給付制限期間は原則1か月になりました。受け取るための条件もあるので、くわしくは[自己都合退職の給付制限が原則1か月に](/news/news-koyou-hoken-kyufu-seigen)を確認してください。

## 退職はいつまでに伝える？

まずは会社の**就業規則**で、退職の申し出について決まりがあるかを確認しましょう。就業規則に決まりがある場合は、原則としてそれが適用されます（極端に長い期間を決めている場合などは、無効とされることもあります）。

法律では、期間の定めのない雇用（正社員など）の場合、退職を申し出てから2週間がたつと雇用が終わるとされています（民法第627条）。会社の同意がないと辞められない、というわけではありません。ただ、引き継ぎの期間も考えて、余裕をもって伝えるほうがお互いに進めやすくなります。

契約社員や派遣など、契約期間が決まっている場合はルールが違うことがあります。契約書の期間と更新の条件を確認してください。

## 有給休暇は残っている？

年次有給休暇は、6か月続けて勤務し、出勤すべき日の8割以上出勤した人に、10日が与えられます（週5日勤務などの場合）。その後も、勤続年数に応じて日数が増えていきます。

残りの日数は、給与明細や勤怠のシステムで確認できることがあります。辞めると決めたら、最終出勤日と退職日、残っている有給休暇の使い方を、引き継ぎの予定とあわせて相談しましょう。

辞める前に確認したいこと：

- 就業規則の、退職の申し出についての決まり
- 有給休暇の残りの日数
- 雇用保険に入っていた期間
- 次の仕事が決まるまでの生活費の見通し

```figure
type: stats
title: 辞める前に知っておきたい数字
items:
  - value: "2"
    unit: 週間
    label: 退職の申し出から
    note: 期間の定めのない雇用の場合（民法第627条）
  - value: "10"
    unit: 日
    label: 最初の有給休暇
    note: 6か月勤務・8割以上出勤（週5日勤務などの場合）
  - value: "1"
    unit: か月
    label: 給付制限期間（原則）
    note: 2025年4月1日以降の自己都合退職
```

## つらさが強いときの相談先

一人で抱え込まずに、外の窓口に相談する方法もあります。どちらも無料で利用できます。

- **総合労働相談コーナー**: 都道府県の労働局や労働基準監督署の中にあり、解雇やいじめ・嫌がらせ、退職をめぐるトラブルなど、職場の問題の相談を面談か電話で受け付けています。予約は不要です
- **こころの耳**: 厚生労働省の、働く人の心の健康のためのサイトです。電話・SNS・メールで相談できます

```figure
type: compare
title: 無料で相談できる窓口
columns:
  - label: 総合労働相談コーナー
    tone: sky
    items:
      - 労働局や労働基準監督署の中にある
      - 退職のトラブルなど職場の問題を相談
      - 面談か電話で。予約は不要
  - label: こころの耳
    tone: mint
    items:
      - 働く人の心の健康のためのサイト
      - 電話・SNS・メールで相談できる
```

辞めると決めたあとの進め方は[未経験転職は何から始める？](/articles/mikeiken-tenshoku-hajimekata)を、転職が何回目かが気になる人は[転職回数が気になるときに整理したいこと](/articles/tenshoku-kaisu-kininaru)を参考にしてください。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['news-koyou-hoken-kyufu-seigen', 'tenshoku-kaisu-kininaru', 'mikeiken-tenshoku-hajimekata', 'tenshoku-okane-junbi', 'roudou-soudan-saki', 'pawahara-soudan']::text[], '{}'::text[], array['yametai']::text[], array['hajimete']::text[], array['辞めたい。', 'その前に確認すること']::text[], null, false, '[{"q":"会社が退職を認めてくれないと、辞められないのですか？","a":"期間の定めのない雇用（正社員など）の場合、民法では、退職を申し出てから2週間がたつと雇用が終わるとされていて、会社の同意がないと辞められないわけではありません。ただし、就業規則に退職の申し出についての決まりがあれば原則としてそれが適用されるので、まず就業規則を確認しましょう。"},{"q":"有給休暇が何日あるか、どう確かめればいいですか？","a":"給与明細や勤怠のシステムに残りの日数が書かれていることがあります。分からなければ、人事の担当者や上司に確認しましょう。法律では、6か月続けて勤務し、出勤すべき日の8割以上出勤した人に、10日の年次有給休暇が与えられます（週5日勤務などの場合）。"},{"q":"辞めてから転職活動をしても大丈夫ですか？","a":"時間を確保しやすい一方で、収入が途切れる期間が出ます。雇用保険の基本手当には受け取るための条件があるので、自分が当てはまるかを確認し、生活費の見通しを立ててから決めましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"辞めるかどうかを決める前に、理由の整理・活動の進め方・退職の手続き・有給・相談先の順に確認する。心身の不調がある場合は転職より休養と相談を先にする","quotes":[{"source_url":"https://jsite.mhlw.go.jp/kagoshima-roudoukyoku/yokuaru_goshitsumon/qa07/0701.html","text":"民法では期間の定めのない雇用契約は解約の申し入れ後2週間で終了することとなっており、会社の同意がなければ退職できないというものではない（民法第627条）。就業規則に退職の規定がある場合は原則として就業規則が適用されるが、極端に長い申し入れ期間などは無効とされる場合もある","used_in":"退職はいつまでに伝える？"},{"source_url":"https://www.check-roudou.mhlw.go.jp/qa/roudousya/yukyu/q1.html","text":"雇い入れから6か月継続勤務し、全労働日の8割以上出勤した労働者に10日の年次有給休暇。その後は勤続年数に応じて増え、最高20日（週5日以上または週30時間以上の場合）","used_in":"有給休暇は残っている？"},{"source_url":"https://www.mhlw.go.jp/general/seido/chihou/kaiketu/soudan.html","text":"総合労働相談コーナーは各都道府県労働局と全国の労働基準監督署内などに設置。解雇、雇止め、いじめなどあらゆる分野の労働問題を対象に、専門の相談員が面談または電話で対応。予約不要・無料","used_in":"つらさが強いときの相談先"},{"source_url":"https://kokoro.mhlw.go.jp/","text":"働く人とその家族などが、電話・SNS・メールで匿名・無料で相談できる窓口がある","used_in":"つらさが強いときの相談先"},{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000160564.html","text":"令和7年4月1日以降に正当な理由なく自己都合で離職した場合、給付制限期間が原則2か月から1か月に短縮","used_in":"働きながら探す？辞めてから探す？"}],"not_used":["退職理由の割合や転職者数などの統計は使っていない","有期雇用の途中退職のルールは、契約書の確認をすすめるにとどめた"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'yametai-mae-kakunin' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'Q5 このたび、家庭の事情で10年間勤務していた会社を辞めたいと思い退職願を提出しましたが、上司が受け取ってくれません。会社が同意してくれないと私は退職できないのでしょうか。', '鹿児島労働局', 'https://jsite.mhlw.go.jp/kagoshima-roudoukyoku/yokuaru_goshitsumon/qa07/0701.html', '2026-10-06'::date, '期間の定めのない雇用は申し入れから2週間で終了し、会社の同意は必要ないこと（民法第627条）、就業規則に規定があれば原則としてそれが適用されること', 0 from articles where slug = 'yametai-mae-kakunin';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '年次有給休暇はどのような場合に与えられるのですか（確かめよう労働条件）', '厚生労働省', 'https://www.check-roudou.mhlw.go.jp/qa/roudousya/yukyu/q1.html', '2026-10-06'::date, '6か月継続勤務・全労働日の8割以上出勤で10日の年次有給休暇が与えられ、勤続年数に応じて日数が増えること', 1 from articles where slug = 'yametai-mae-kakunin';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '総合労働相談コーナーのご案内', '厚生労働省', 'https://www.mhlw.go.jp/general/seido/chihou/kaiketu/soudan.html', '2026-10-06'::date, '都道府県労働局・労働基準監督署内の総合労働相談コーナーで、解雇やいじめなど職場のあらゆる労働問題を、面談または電話で、予約不要・無料で相談できること', 2 from articles where slug = 'yametai-mae-kakunin';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'こころの耳 働く人のメンタルヘルス・ポータルサイト', '厚生労働省', 'https://kokoro.mhlw.go.jp/', '2026-10-06'::date, '働く人向けに電話・SNS・メールで無料の相談窓口があること', 3 from articles where slug = 'yametai-mae-kakunin';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '雇用保険制度の改正内容について', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000160564.html', '2026-10-06'::date, '2025年4月1日以降の自己都合退職で、基本手当の給付制限期間が原則1か月になったこと', 4 from articles where slug = 'yametai-mae-kakunin';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'yametai-mae-kakunin' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"b4acbbf066ab9cab3f91bcc7763c56a7a1116dc03647c02aedfca28d2bb4e5be","findings":[]}'::jsonb from articles where slug = 'yametai-mae-kakunin';
update articles set status = 'published' where slug = 'yametai-mae-kakunin';

-- article: yukyu-tenshoku (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('yukyu-tenshoku', 'article', '転職すると有給休暇はどうなる？もらえる時期と日数、退職前の使い方', '有給休暇は、転職すると新しい会社で入社日から数え直しになります。法律で決まっている付与の時期と日数、前の会社の有休が引き継がれないこと、退職前に残りの有休を使うときの考え方、年5日の取得義務を整理します。', '転職を考え始めると、「今の会社の有給休暇、残っている分はどうなるんだろう」「新しい会社では、いつから休めるの？」と気になる人も多いはずです。

先に結論をまとめます。

- 有給休暇（有休）は、**転職すると新しい会社で入社日から数え直し**です。前の会社の有休は引き継がれません
- 法律の基準では、入社から6か月続けて働き、8割以上出勤すると、10日の有休がもらえます
- 退職前に残っている有休は、退職日までの間なら原則として使えます。引き継ぎも考えて早めに日程を相談しましょう
- 有休が10日以上ある人は、会社が年5日は取らせる義務があります（2019年4月から）

## 有給休暇はいつ・何日もらえる？

有休は、給料をもらいながら休める日のことで、労働基準法で決まっています。もらえる条件は次の2つです。

1. 雇い入れの日（入社日）から6か月続けて働いている
2. その6か月の間、出勤日とされている日の8割以上出勤している

この2つを満たすと、10日の有休が付与されます。その後は1年ごとに、同じように8割以上出勤していれば、働いた年数に応じて日数が増えていきます。

| 入社してからの期間 | 付与される日数 |
| --- | --- |
| 6か月 | 10日 |
| 1年6か月 | 11日 |
| 2年6か月 | 12日 |
| 3年6か月 | 14日 |
| 4年6か月 | 16日 |
| 5年6か月 | 18日 |
| 6年6か月以上 | 20日 |

この表は、週5日勤務など通常の働き方の人の日数です。週4日以下で、週の所定労働時間が30時間未満の人は、働く日数に応じて少ない日数が付与されます（比例付与）。また、有休は付与された日から**2年で時効**になり、使わないと消えてしまいます。

なお、法律で決まっているのは、少なくともこれだけは付与するという基準です。入社日から有休を付与するなど、基準より早く・多く付与している会社もあります。

## 前の会社の有休は引き継がれない

有休の条件になる「継続勤務」は、同じ会社に在籍している期間のことです。同じ会社の中でアルバイトから正社員に切り替わった場合などは、前の期間も通算されます。

一方、転職すると、前の会社との労働契約は退職日で終わります。新しい会社では入社日から数え直しになり、**前の会社で使わなかった有休を新しい会社に持っていくことはできません**。

たとえば、2026年4月1日に新しい会社に入社した場合、法律の基準どおりなら、最初に有休が付与されるのは6か月後の2026年10月1日です（日付は仮の例です）。

```figure
type: steps
title: 転職したあとの有給休暇の流れ（法律の基準）
items:
  - label: 入社日
    text: 有休はまだない（前の会社の分は引き継がれない）
  - label: 入社から6か月
    text: 8割以上出勤していれば10日
  - label: 入社から1年6か月
    text: 8割以上出勤していれば11日
  - label: そのあとも1年ごと
    text: 6年6か月以上で20日まで増える
```

そのため、入社してから最初の6か月ほどは、有休がない期間になることがあります。この間に休むと欠勤になり、給料が減ることもあります。通院や引っ越しなど、休む予定が分かっている場合は、内定後に就業規則で有休の付与時期を確認し、必要なら入社日の調整を相談しておきましょう。

## 退職前に残った有休をどう使う？

今の会社で有休が残っている場合、使えるのは退職日までです。退職日を過ぎると、残った有休は使えなくなります。

会社には、忙しい時期など事業の正常な運営を妨げる場合に、有休を取る時期を変えてもらう権利（時季変更権）があります。ただし、**退職日を超えて時期を変えることはできない**とされています。そのため、退職日までの間で申し出た有休は、原則として取得できます。

とはいえ、引き継ぎをせずに休みに入ると、職場とのやりとりがこじれることもあります。次の順番で考えると、無理のない日程を立てやすくなります。

1. 給与明細や勤怠システムで、残っている有休の日数を確認する
2. 引き継ぎに必要な日数を見積もる
3. 「最終出勤日」と「退職日」を分けて考え、最終出勤日のあとに有休を入れる
4. 退職の意思を伝えるときに、有休を使いたいことも一緒に相談する

たとえば、残っている有休が10日、引き継ぎに2週間かかる場合は、引き継ぎを終えた日を最終出勤日にし、そのあとの出勤日10日分を有休にあてて、その最後の日を退職日にする、という組み立て方になります（日数は仮の例です）。有休を使っている間も在籍は続くので、給料や社会保険もそのまま続きます。

転職先の入社日が決まっている場合は、入社日から逆算して、退職日と退職の意思を伝える時期を決めておきましょう。退職を決める前に確認したいことは[今の仕事を辞めたいとき、先に確認しておきたいこと](/articles/yametai-mae-kakunin)で紹介しています。

## 年5日の取得義務とは

2019年4月から、会社は、有休が10日以上付与される人に、付与日から1年以内に**5日を必ず取得させる**ことが義務になりました。正社員だけでなく、条件を満たすパートタイムの人も対象です。

自分で申し出て取った日数は、この5日に含まれます。自分で5日取れていない場合は、会社が本人の希望を聞いたうえで、取る日を指定します。

転職したばかりの人の場合、入社6か月後に10日が付与されると、その日から1年以内に5日を取ることになります。

```figure
type: checklist
title: 転職するときに確認したい有休のこと
items:
  - 今の会社で残っている有休の日数
  - 有休が時効で消える時期（付与から2年）
  - 最終出勤日と退職日をいつにするか
  - 新しい会社で最初に有休がもらえる時期
  - 入社直後に休む予定があるか
```

## 求人や面接で確認したいこと

有休の日数は法律で最低ラインが決まっていますが、取りやすさや付与の時期は会社によって違います。求人票や面接では、次の点を確認しておくと入社後のずれを減らせます。

- 有休は入社何か月後に、何日付与されるか
- 有休の平均取得日数（公表している会社もあります）
- 夏季休暇や年末年始休暇は、有休とは別の休みか

特に最後の点は、求人票の書き方だけでは分からないことがあります。年間休日の日数とあわせて、面接や内定後の面談で確認しましょう。休日の数え方は[「土日休み」と「年収」をどう比較する？](/articles/donichi-yasumi-nenshu-hikaku)でも紹介しています。

聞き方の例です。

- 「有給休暇は、入社後いつから、何日付与されますか」
- 「みなさん、有給休暇はどのような時期に取っていることが多いですか」

2つめのように聞くと、日数だけでなく、職場で休みを取りやすい雰囲気かどうかも分かりやすくなります。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-07'::timestamptz, '転職後の有給休暇はいつから？日数と退職前の有休消化', '転職すると有給休暇は入社日から数え直しです。入社6か月で10日という法律の基準、前の会社の有休が引き継がれないこと、退職前に残った有休を使うときの考え方、年5日の取得義務を整理します。', array['yametai-mae-kakunin', 'donichi-yasumi-nenshu-hikaku', 'nenshu-dake-erabanai']::text[], '{}'::text[], array['yametai', 'donichi']::text[], array['hajimete', 'dainishinsotsu']::text[], array['転職したら', '有給休暇はどうなる？']::text[], null, false, '[{"q":"前の会社で使わなかった有給休暇は、転職先で使えますか？","a":"使えません。有給休暇の条件になる「継続勤務」は、同じ会社に在籍している期間のことです。転職すると前の会社との労働契約は終わるので、新しい会社では入社日から数え直しになります。前の会社の有休は、退職日までに使うかどうかを考えておきましょう。"},{"q":"退職前に有給休暇をまとめて使いたいと言ったら、断られることはありますか？","a":"会社には、事業の正常な運営を妨げる場合に有休の時期を変えてもらう権利（時季変更権）がありますが、退職日を超えて時期を変えることはできないとされています。そのため、退職日までの間で申し出た有休は、原則として取得できます。引き継ぎの時間も考えて、退職日と有休の日程を早めに相談するとスムーズです。"},{"q":"入社してすぐ休みたい日があります。有給休暇がまだない場合はどうなりますか？","a":"法律の基準では、有休が付与されるのは入社から6か月後です。それより前に休むと欠勤扱いになり、給料が減ることがあります。会社によっては入社日から有休を付与しているところもあるので、内定後に就業規則や労働条件通知書で確認し、必要なら入社日の調整も相談しましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「転職したら有休はリセット」「退職前の有休は使える」という2点を、法律の基準と会社ごとに違う部分に分けて示す。入社直後に有休がない期間への備えも書く","quotes":[{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/faq/kijyunhou_6_00001.html","text":"年次有給休暇は、雇い入れの日から6か月経過していること、その期間の全労働日の8割以上出勤したことの2つを満たした労働者に付与される。付与日数は継続勤務0.5年で10日、1.5年で11日、2.5年で12日、3.5年で14日、4.5年で16日、5.5年で18日、6.5年以上で20日","used_in":"有給休暇はいつ・何日もらえる？"},{"source_url":"https://www.check-roudou.mhlw.go.jp/study/roudousya_yukyu.html","text":"年次有給休暇は発生日から起算して2年間で時効により消滅する。週所定労働日数が4日以下かつ週所定労働時間が30時間未満の人は、所定労働日数に応じて比例付与","used_in":"有給休暇はいつ・何日もらえる？"},{"source_url":"https://www.startup-roudou.mhlw.go.jp/qa/zigyonushi/yukyu/q1.html","text":"継続勤務とは在籍期間のことで、勤務の実態に即し、実質的に労働関係が継続しているかどうかで判断する。臨時工・パート等を正社員に切り替えた場合などは勤続年数を通算する","used_in":"前の会社の有休は引き継がれない"},{"source_url":"https://www.mhlw.go.jp/content/000463186.pdf","text":"2019年4月から、全ての使用者に、年10日以上の年次有給休暇が付与される労働者に対し、そのうち年5日について時季を指定して取得させることが義務付けられた。労働者が自ら請求・取得した日数は5日から控除できる","used_in":"年5日の取得義務とは"},{"source_url":"https://jsite.mhlw.go.jp/okinawa-roudoukyoku/yokuaru_goshitsumon/jigyounushi/question_1_nenkyu.html","text":"退職予定の労働者が残りの年休を一括して請求した場合、退職日を超えて時季変更権を行使することはできず、請求どおり与えることになる。引き継ぎが必要なら退職日について労働者と話し合うことが望ましい","used_in":"退職前に残った有休をどう使う？"}],"not_used":["退職時に使い切れなかった有休の「買い取り」の扱いは、公的な一次情報で該当箇所を確認できなかったので書かない","年5日の取得義務に違反した会社への罰則の金額は、読者の行動に直接関係しないうえ、本文で扱う範囲を広げないため書かない","転職先で入社日から有休を付与している会社の割合などの数字は、公的な一次情報で確認できなかったので書かない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'yukyu-tenshoku' and c.slug = 'seido' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'yukyu-tenshoku' and c.slug = 'hatarakikata' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '年次有給休暇とはどのような制度ですか。パートタイム労働者でも有休があると聞きましたが、本当ですか。', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/faq/kijyunhou_6_00001.html', '2026-10-07'::date, '有休が付与される2つの条件（雇い入れから6か月・全労働日の8割以上出勤）と、継続勤務年数ごとの付与日数', 0 from articles where slug = 'yukyu-tenshoku';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '年次有給休暇｜しっかり学ぼう！働くときの基礎知識｜確かめよう労働条件', '厚生労働省', 'https://www.check-roudou.mhlw.go.jp/study/roudousya_yukyu.html', '2026-10-07'::date, '付与日数の表、有休は発生日から2年で時効になること、パートタイムの人の比例付与', 1 from articles where slug = 'yukyu-tenshoku';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '年次有給休暇はどのような場合に、何日与えなければならないのでしょうか？｜スタートアップ労働条件', '厚生労働省', 'https://www.startup-roudou.mhlw.go.jp/qa/zigyonushi/yukyu/q1.html', '2026-10-07'::date, '継続勤務は在籍期間のことで、実質的に労働関係が続いているかで判断されること（パートから正社員への切り替えなどは通算）', 2 from articles where slug = 'yukyu-tenshoku';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '年5日の年次有給休暇の確実な取得 わかりやすい解説（2019年4月施行）', '厚生労働省', 'https://www.mhlw.go.jp/content/000463186.pdf', '2026-10-07'::date, '2019年4月から、有休が10日以上付与される人に、付与日から1年以内に5日を取得させることが会社の義務になったこと。自分で取った日数は5日に含まれること', 3 from articles where slug = 'yukyu-tenshoku';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '労働相談事例 年休Q1', '沖縄労働局（厚生労働省）', 'https://jsite.mhlw.go.jp/okinawa-roudoukyoku/yokuaru_goshitsumon/jigyounushi/question_1_nenkyu.html', '2026-10-07'::date, '退職を予定している人が残りの有休をまとめて申し出た場合、会社は退職日を超えて時季変更権を行使できないこと', 4 from articles where slug = 'yukyu-tenshoku';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '年次有給休暇のポイント', '愛知労働局（厚生労働省）', 'https://jsite.mhlw.go.jp/aichi-roudoukyoku/library/aichi-roudoukyoku/images/2014121215452.pdf', '2026-10-07'::date, '時季変更権は事業の正常な運営を妨げる場合に限られ、退職予定日を超えては行使できないこと', 5 from articles where slug = 'yukyu-tenshoku';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'yukyu-tenshoku' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"03368451f93513c30c0f8bfd9abdda756b41d5830898c0ea4c61db69b0d79a77","findings":[]}'::jsonb from articles where slug = 'yukyu-tenshoku';
update articles set status = 'published' where slug = 'yukyu-tenshoku';

-- article: zaishoku-tenshoku-susumekata (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('zaishoku-tenshoku-susumekata', 'article', '働きながらの転職活動、何から？進める順番と時間の作り方・退職を伝える時期', '今の仕事を続けながら転職活動をするときの進め方を、整理から退職までの順番に沿って紹介します。平日の時間の作り方、面接の日程の合わせ方、今の職場に知られないための注意、退職を伝えるタイミングと就業規則の確かめ方も分かります。', '今の仕事を続けながら転職活動をするとき、迷いやすいのは「何から手をつけるか」と「いつ時間を作るか」です。収入が途切れない安心がある一方で、平日は仕事で埋まり、面接の日程も合わせにくくなります。

この記事で分かること：

- 在職中の転職活動を進める**順番**（整理 → 情報集め → 応募 → 面接 → 内定の確認 → 退職）
- 平日の**時間の作り方**と、面接の日程の合わせ方
- 今の職場に**知られないため**に気をつけること
- 退職を**伝えるタイミング**と、就業規則の確かめ方

## 在職中の転職活動は、この順番で進める

働きながらの活動は、使える時間が限られています。順番を決めておくと、「求人を眺めているだけで1か月たっていた」ということが起こりにくくなります。

```figure
type: steps
title: 働きながらの転職活動の流れ
items:
  - label: 整理する
    text: 転職したい理由、経験、ゆずれない条件を書き出す
  - label: 情報を集める
    text: 職種を調べ、求人の探し方を決める
  - label: 応募する
    text: 書類を用意して、少しずつ応募する
  - label: 面接を受ける
    text: 日程は早めに候補を出す
  - label: 内定を確認する
    text: 労働条件を書面で確かめてから承諾する
  - label: 退職を伝える
    text: 就業規則を確認して、上司に直接伝える
```

### ステップ1・2：整理と情報集めは、すき間時間でできる

最初の「整理」は、通勤中や寝る前の15分でも進められます。転職したい理由、これまでの経験、ゆずれない条件をメモに書き出しておくと、求人を見たときに「自分に合うか」を判断しやすくなります。整理のしかたは[未経験転職は何から始める？最初に整理したい5つのこと](/articles/mikeiken-tenshoku-hajimekata)で詳しく紹介しています。

### ステップ3・4：応募は「面接に行ける数」だけにする

在職中は、面接の日程を合わせるのがいちばん大変です。応募を一度に増やしすぎると、面接の日程が重なって調整しきれなくなります。まずは、今の働き方で面接に行けそうな数だけ応募し、結果を見ながら次の応募を考えるほうが進めやすくなります。

### ステップ5・6：内定のあとに、退職の話をする

退職の話を上司にするのは、内定が出て、労働条件を確認し、承諾してからが一般的な流れです。この順番が逆になると、「辞めると言ったのに次が決まらない」という状態になりかねません。

## 平日の時間はどう作る？

働きながら活動するときは、「いつ・何をするか」を決めておくと続けやすくなります。

| 時間帯 | できること |
| --- | --- |
| 通勤中・昼休み | 求人を見る、気になる求人を保存する、メッセージを返す |
| 平日の夜 | 書類を書く、オンラインの面談・面接を受ける |
| 休みの日 | 書類をまとめて仕上げる、職種を調べる |

ハローワークインターネットサービスでは、求職者マイページを開くと、自宅のパソコンなどから求人を探したり、「オンライン自主応募」ができる求人に応募したりできます。窓口に行く時間がとりにくい人は、こうした方法も組み合わせてみてください。

### 面接の時間をどう作るか

面接は平日の日中に行われることも多いので、次の方法を組み合わせて時間を作ります。

- **候補日を多めに出す**：「〇日と〇日の18時以降、または〇日の午前」のように、行ける枠をまとめて伝える
- **オンライン面接ができるか聞く**：移動の時間がいらなくなる
- **年次有給休暇を使う**

年次有給休暇の使い道は、原則として働く人の自由です。会社は、休む目的を理由に取得を断ることはできません。ただし、指定した日に休むと事業の正常な運営が妨げられる場合には、会社が別の日に変えるよう求めること（時季変更権）があります。面接が決まったら、早めに申請しておきましょう。

また、会社が労使協定を結んでいる場合は、年5日までの範囲で、時間単位で有給休暇をとれることがあります。午前中だけ休む、といった使い方ができるかは、就業規則や人事の担当者に確認してください。

## 今の職場に知られないために気をつけること

転職活動をしていること自体は悪いことではありませんが、内定前に職場に知られると、気まずくなったり、引き止めの話が長引いたりすることがあります。次の点に気をつけましょう。

```figure
type: checklist
title: 職場に知られないための注意
items:
  - 会社のパソコン・メール・電話を使わない
  - 勤務時間中に応募や連絡をしない
  - 同僚に転職活動の話をしない
  - SNSに転職活動のことを書かない
  - 応募書類を職場に置きっぱなしにしない
  - 転職サイトの公開設定を確かめる
```

特に、会社のパソコンやメールは、会社が管理しているものです。応募や連絡には、自分のスマートフォンや個人のメールアドレスを使いましょう。

転職サイトに経歴を登録すると、企業から見られる設定になっていることがあります。サービスによっては、特定の会社に自分の情報を見られないようにする設定があるので、登録したら公開範囲を確かめておくと安心です。

## 退職はいつ・どう伝える？

内定を承諾したら、今の職場に退職の意思を伝えます。

### まず就業規則を確認する

最初に、会社の**就業規則**で退職の申し出についての決まりを確認しましょう。就業規則に「退職の〇日前までに申し出ること」といった決まりがあれば、原則としてそれが適用されます。

法律では、期間の定めのない雇用（正社員など）の場合、退職を申し出てから2週間がたつと雇用が終わるとされています（民法第627条）。会社の同意がないと辞められない、というわけではありません。ただ、引き継ぎや有給休暇の消化も考えると、2週間ぎりぎりで伝えるより、余裕をもって伝えたほうがお互いに進めやすくなります。

契約社員など、契約期間が決まっている場合はルールが違うことがあります。契約書の期間と、途中で辞めるときの決まりを確認してください。

### 入社日は「逆算」して決める

退職を伝える時期は、次の職場の入社日から逆算して考えます。

1. 就業規則で、退職を何日前までに申し出るかを確認する
2. 引き継ぎにどのくらいかかりそうかを考える
3. 残っている有給休暇の日数を確認する
4. 1〜3をもとに、最終出勤日・退職日・入社日の案を作る

入社日の相談は、内定を承諾するときに転職先とも話しておきましょう。「現職の就業規則で、退職の申し出は〇日前までと決まっているため、入社日は〇月〇日以降でご相談させてください」のように、理由を添えると伝わりやすくなります。

### 伝える相手と伝え方

退職の意思は、まず**直属の上司に直接**伝えるのが一般的です。同僚や先輩に先に話すと、上司が人づてに知ることになり、話がこじれやすくなります。

> 「お時間をいただきありがとうございます。一身上の都合により、〇月〇日をもって退職したいと考えています。引き継ぎはしっかり行いますので、進め方をご相談させてください。」

引き止められたときは、感謝を伝えたうえで「次の職場で働くことを決めた」という結論をくり返すのが基本です。有給休暇の残りの確かめ方など、辞める前に確認しておきたいことは[今の仕事を辞めたいとき、先に確認しておきたいこと](/articles/yametai-mae-kakunin)にまとめています。

## 疲れてしまったら、ペースを落としていい

働きながらの転職活動は、思った以上に体力を使います。応募がうまくいかない時期が続くと、仕事にも影響が出てしまうことがあります。

疲れを感じたら、1週間だけ応募を止めて整理に戻る、相談相手を作る、など、ペースを落としても構いません。何を相談すればいいか分からないときは、[転職エージェントに、何を相談すればいい？](/articles/agent-soudan-nani)も参考にしてください。条件を整理し直したいときは、[条件整理チェック](/check)も使えます。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-07'::timestamptz, '働きながら転職活動を進める順番｜時間の作り方と退職を伝える時期', '在職中の転職活動は、整理→情報集め→応募→面接→内定の確認→退職の順に進めると迷いにくくなります。時間の作り方、面接日程の合わせ方、職場に知られないための注意、退職を伝える時期と就業規則の確かめ方を紹介します。', array['yametai-mae-kakunin', 'mikeiken-tenshoku-hajimekata', 'agent-soudan-nani']::text[], '{}'::text[], array['yametai']::text[], array['hajimete']::text[], array['働きながらの転職、', '何から始める？']::text[], null, false, '[{"q":"面接のために有給休暇を使ってもいいですか？","a":"年次有給休暇をどう使うかは原則として働く人の自由で、会社は使い道を理由に取得を断ることはできません。休む理由を細かく伝える必要もありません。ただし、指定した日に休むと事業の正常な運営が妨げられる場合には、会社が別の日に変えるよう求めることがあるので、早めに申請しておくと安心です。"},{"q":"転職活動をしていることは、上司に先に伝えたほうがいいですか？","a":"伝える決まりはありません。内定が出る前に話すと、気まずくなったり、引き止めの話が長引いたりすることがあります。退職の意思を伝えるのは、次の職場の労働条件を確認して内定を承諾してから、が一般的な流れです。"},{"q":"退職は何日前までに伝えればいいですか？","a":"まず就業規則の退職の項目を確認してください。決まりがあれば原則としてそれに従います。法律（民法第627条）では、期間の定めのない雇用は、退職を申し出てから2週間がたつと終了するとされていますが、引き継ぎの期間も考えて、余裕をもって伝えるほうがお互いに進めやすくなります。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"在職中の活動は「順番」と「時間の作り方」で迷いが減る。退職を伝えるのは内定・条件確認・承諾のあと。期間は断定せず、就業規則と民法の関係で確かめ方を示す","quotes":[{"source_url":"https://laws.e-gov.go.jp/law/129AC0000000089","text":"第六百二十七条第一項「当事者が雇用の期間を定めなかったときは、各当事者は、いつでも解約の申入れをすることができる。この場合において、雇用は、解約の申入れの日から二週間を経過することによって終了する。」（e-Gov への直接接続ができなかったため、e-Gov 法令検索の検索結果に表示された条文で確認）","used_in":"ステップ6 退職はいつ・どう伝える？"},{"source_url":"https://jsite.mhlw.go.jp/kagoshima-roudoukyoku/yokuaru_goshitsumon/qa07/0701.html","text":"期間の定めのない雇用契約は解約の申し入れ後2週間で終了し、会社の同意がなければ退職できないものではない。就業規則に退職の規定がある場合は原則として就業規則が適用される","used_in":"ステップ6 退職はいつ・どう伝える？"},{"source_url":"https://www.check-roudou.mhlw.go.jp/study/roudousya_yukyu.html","text":"年休の使用目的は労働者の自由であり、使用者はその目的いかんによって取得を拒むことはできない。指定された時季に与えることが事業の正常な運営を妨げる場合は、使用者は時季変更権を行使できる","used_in":"平日の時間はどう作る？"},{"source_url":"https://www.check-roudou.mhlw.go.jp/qa/roudousya/yukyu/q3.html","text":"事業場で労使協定を結べば、年5日までの範囲で時間単位の年次有給休暇をとることができる","used_in":"平日の時間はどう作る？"},{"source_url":"https://www.hellowork.mhlw.go.jp/member/mem_possible.html","text":"求職者マイページを開設すると、自宅のパソコン等から求人情報検索、オンライン自主応募、求職活動状況の確認などが利用できる","used_in":"平日の時間はどう作る？"}],"not_used":["転職活動にかかる期間の目安（「3か月」など）は公的な根拠を確認できなかったので書かない","退職を伝える時期の「1〜2か月前が一般的」といった目安は根拠を確認できなかったので書かない。就業規則と民法の関係だけを書いた","転職サイトの「企業ブロック」機能の有無はサービスごとに違い、特定のサービス名をすすめないため、一般的な確認のすすめにとどめた","有期契約（契約社員など）の途中退職のルールは扱わず、契約書の確認をすすめるにとどめた"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'zaishoku-tenshoku-susumekata' and c.slug = 'junbi' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'zaishoku-tenshoku-susumekata' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '民法（明治二十九年法律第八十九号）第六百二十七条', 'e-Gov法令検索（デジタル庁）', 'https://laws.e-gov.go.jp/law/129AC0000000089', '2026-10-07'::date, '期間の定めのない雇用は、解約の申入れの日から2週間を経過すると終了すること', 0 from articles where slug = 'zaishoku-tenshoku-susumekata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'Q5 このたび、家庭の事情で10年間勤務していた会社を辞めたいと思い退職願を提出しましたが、上司が受け取ってくれません。会社が同意してくれないと私は退職できないのでしょうか。', '鹿児島労働局', 'https://jsite.mhlw.go.jp/kagoshima-roudoukyoku/yokuaru_goshitsumon/qa07/0701.html', '2026-10-07'::date, '就業規則に退職の申し出の規定があれば原則としてそれが適用されること、会社の同意がなければ退職できないわけではないこと', 1 from articles where slug = 'zaishoku-tenshoku-susumekata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '年次有給休暇｜しっかり学ぼう！働くときの基礎知識（確かめよう労働条件）', '厚生労働省', 'https://www.check-roudou.mhlw.go.jp/study/roudousya_yukyu.html', '2026-10-07'::date, '年次有給休暇の使い道は労働者の自由で、目的を理由に取得を拒めないこと。事業の正常な運営を妨げる場合は時季変更権があること', 2 from articles where slug = 'zaishoku-tenshoku-susumekata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '年次有給休暇を時間単位でとるには、どうすればよいのでしょうか？（確かめよう労働条件）', '厚生労働省', 'https://www.check-roudou.mhlw.go.jp/qa/roudousya/yukyu/q3.html', '2026-10-07'::date, '労使協定があれば、年5日までの範囲で時間単位の年次有給休暇をとれること', 3 from articles where slug = 'zaishoku-tenshoku-susumekata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '求職者マイページでできること（ハローワークインターネットサービス）', '厚生労働省', 'https://www.hellowork.mhlw.go.jp/member/mem_possible.html', '2026-10-07'::date, '求職者マイページを使うと、自宅のパソコンなどから求人検索やオンラインでの応募ができること', 4 from articles where slug = 'zaishoku-tenshoku-susumekata';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'zaishoku-tenshoku-susumekata' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'プロジェクトオーナー（チャットで承認）', 'approved', '{"content_hash":"3372a3b2dc64f4c38473d6e5278cfdcdeafd3f4d91660da16668e890f058273c","findings":[]}'::jsonb from articles where slug = 'zaishoku-tenshoku-susumekata';
update articles set status = 'published' where slug = 'zaishoku-tenshoku-susumekata';

-- news: news-ikuji-kaigo-2025-10 (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('news-ikuji-kaigo-2025-10', 'news', '子育てと仕事の両立の制度が変わった（2025年10月施行）｜求人を見るときの確認ポイント', '改正育児・介護休業法により、2025年10月1日から、3歳から小学校入学前の子を育てる人のための「柔軟な働き方を実現するための措置」が会社の義務になりました。いま子どもがいない人にとっても、転職先の働き方を見るヒントになります。何が変わったのか、求人や面接でどう確かめるかを整理します。', '「まだ子どもはいないし、自分には関係ない」と思うかもしれません。ただ、転職先は何年か働く場所です。2025年10月1日から、子育てしながら働く人のための制度が、会社の義務として加わりました。求人を比べるときの確認ポイントとして知っておくと、将来の働き方を考えるヒントになります。

## 2025年10月に何が変わった？

いちばん大きいのは、3歳から小学校に入る前までの子を育てる人のための「柔軟な働き方を実現するための措置」です。会社は次の5つの中から2つ以上を選んで用意し、働く人はその中から1つを選んで使えます。

```figure
type: steps
title: 柔軟な働き方の措置のしくみ
items:
  - label: 会社が用意する
    text: 5つの中から2つ以上を選ぶ
  - label: 個別に知らせる
    text: 子が3歳になる前に内容を知らせ、意向を確認
  - label: 働く人が選ぶ
    text: 用意された中から1つを選んで使う
```

| 会社が選ぶ措置 | 内容 |
| --- | --- |
| 始業時刻の変更 | 働き始める時刻などを変えられる |
| テレワーク等 | 月10日以上 |
| 保育施設の設置運営等 | 会社が保育施設を用意するなど |
| 養育両立支援休暇 | 年10日以上の休暇 |
| 短時間勤務制度 | 1日の勤務時間を短くできる |

このほか、次のことも会社の義務になりました。

- 子が3歳になる前に、会社が選んだ措置の内容を個別に知らせ、使うかどうかの意向を確認する
- 妊娠・出産を申し出たときや、子が3歳になる前に、働き方の希望を個別に聞いて配慮する

## 2025年4月に変わったことも

同じ改正で、2025年4月1日から始まったものもあります。

- 残業免除（所定外労働の制限）を求められる対象が、3歳までの子から小学校入学前の子に広がった
- 子の看護等休暇の対象が小学校3年生修了までになり、学級閉鎖や入園式・卒園式なども理由に加わった
- 従業員300人を超える会社に、男性の育児休業等の取得状況を公表することが義務になった（それまでは1,000人を超える会社が対象）

## 子どもがいなくても関係ある？

いま子どもがいなくても、数年後に生活が変わることはあります。そのとき「今の会社では続けられない」と転職を考えるのは負担が大きいものです。

会社がどの措置を選んだか、実際にどれくらい使われているかを見ると、テレワークや時差出勤などの働き方がその会社でどこまで根づいているかが見えてきます。土日休みや残業の少なさを重視したい人にとっても、働き方を考えるヒントになります。休みを優先した仕事選びは[「土日休み」を優先すると、どんな仕事がある？](/articles/donichi-yasumi-shigoto)で、今の仕事を辞めたいときに先に確認しておくことは[今の仕事を辞めたいとき、先に確認しておきたいこと](/articles/yametai-mae-kakunin)で紹介しています。

## 求人や面接でどう確かめる？

制度の中身は、求人票だけでは分からないことがあります。面接や、人材紹介会社の担当者との面談で、たとえば次のように聞いてみましょう。

- 「子育て中の方は、どんな働き方の制度を使っていますか？」
- 「テレワークや時差出勤は、この部署でも使われていますか？」
- 「育児休業から戻った方は、どんな働き方をしていますか？」

従業員300人を超える会社は、男性の育児休業等の取得状況を公表することが義務になっています。応募前に会社のサイトなどで探してみると、質問も具体的にしやすくなります。面談で何を聞くか迷うときは、[エージェント面談の前に決めておくこと・決めなくていいこと](/articles/agent-mendan-mae)も参考にしてください。

制度があること自体は安心材料ですが、それだけで会社を決める必要はありません。仕事内容や給料、通勤のしやすさとあわせて、自分が長く働けそうかどうかで考えてみてください。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['yametai-mae-kakunin', 'agent-mendan-mae', 'news-roudou-jouken-meiji']::text[], '{}'::text[], array['yametai']::text[], array['hajimete']::text[], array['子育てと仕事、', '会社の制度どう見る？']::text[], 'people', false, '[]'::jsonb, '{"announced_by":"厚生労働省","announced_at":"2025-10-01","what_happened":"令和6年（2024年）に改正された育児・介護休業法のうち、2025年10月1日から「柔軟な働き方を実現するための措置」などが会社の義務になりました。会社は、3歳から小学校入学前の子を育てる人のために、始業時刻の変更、テレワーク等（月10日以上）、保育施設の設置運営等、養育両立支援休暇（年10日以上）、短時間勤務制度の5つの中から2つ以上を選んで用意し、働く人はその中から1つを選んで使えます。あわせて、子が3歳になる前に制度を個別に知らせて利用の意向を確認することや、妊娠・出産の申出時などに働き方の希望を個別に聞いて配慮することも義務になりました。","who_is_affected":"3歳から小学校入学前の子を育てながら働く人と、3歳未満の子を育てている人、妊娠・出産を会社に申し出た人が直接の対象です。いま子どもがいない人も、転職先で長く働くことを考えるなら、会社がどの制度を用意しているかは確認材料になります。","impact_for_career_changers":"求人や面接で「子育て中の人はどんな働き方の制度を使っているか」を確かめる手がかりが増えました。会社がどの措置を選んでいるかを見ると、テレワークや時差出勤などの働き方が、その会社でどこまで使われているかを考えるヒントになります。","unknowns":["会社が5つのうちどの措置を選んだかは会社ごとに違い、求人票だけでは分からないことがあります。","制度があっても、自分が希望する職種や部署で実際に使われているか、使いやすい雰囲気かは、制度の有無だけでは分かりません。","入社してすぐの時期にどの制度が使えるかは、会社の規則によって確認が必要です。"],"what_to_check":["会社が選んでいる措置（始業時刻の変更・テレワーク等・短時間勤務など）","子育て中の社員が、実際にどの制度を使っているか","従業員300人を超える会社なら、公表されている男性の育児休業等の取得状況","残業の多さや休日の取りやすさなど、制度以外の働き方"]}'::jsonb, '{"schema_version":2,"writer_agent":"career-writer","angle":"子どもがいない20代にも関係する話として、「会社がどの措置を選んだか」を働き方の確認ポイントに置き換える。面接で聞ける質問例を入れ、制度の有無だけで判断しないことも書く","quotes":[{"source_url":"https://www.mhlw.go.jp/seisakunitsuite/bunya/koyou_roudou/koyoukintou/ryouritsu/ikuji/flexiblework/","text":"事業主は、3歳から小学校就学の始期に達するまでの子を養育する労働者に対して、職場のニーズを把握した上で、始業時刻等の変更、テレワーク等（10日以上/月）、保育施設の設置運営等、養育両立支援休暇の付与（10日以上/年）、短時間勤務制度の5つの中から2つ以上を選択して講じる。労働者は講じられた措置の中から1つを選択して利用できる。子が3歳になるまでの適切な時期に個別の周知・意向確認を行う","used_in":"2025年10月に何が変わった？"},{"source_url":"https://www.mhlw.go.jp/seisakunitsuite/bunya/koyou_roudou/koyoukintou/ryouritsu/ikuji/law-amendment/","text":"妊娠・出産等の申出時と子が3歳になる前に、仕事と育児の両立に関する個別の意向聴取・配慮が事業主の義務に（2025年10月1日施行）。所定外労働の制限（残業免除）の対象が3歳になるまでの子から小学校就学前の子に拡大（2025年4月1日施行）。育児休業取得状況の公表義務が従業員1,000人超から300人超の企業に拡大（2025年4月1日施行）","used_in":"2025年10月に何が変わった？／2025年4月に変わったことも"},{"source_url":"https://www.mhlw.go.jp/seisakunitsuite/bunya/koyou_roudou/koyoukintou/ryouritsu/ikuji/nursing/","text":"子の看護等休暇は小学3年生修了までの子について取得できる。2025年4月1日から、感染症に伴う学級閉鎖等や入園（入学）式・卒園式への参列が取得事由に追加","used_in":"2025年4月に変わったことも"}],"not_used":["制度を使っている人の割合や取得率の平均などの統計は使っていない","介護に関する改正（介護離職防止のための個別周知など）は、20代の転職者に関係が薄いため扱っていない","面接での質問例は編集部で作った例"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'news-ikuji-kaigo-2025-10' and c.slug = 'news' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'news-ikuji-kaigo-2025-10' and c.slug = 'hatarakikata' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '柔軟な働き方を実現するための措置｜育児休業制度特設サイト', '厚生労働省', 'https://www.mhlw.go.jp/seisakunitsuite/bunya/koyou_roudou/koyoukintou/ryouritsu/ikuji/flexiblework/', '2026-10-06'::date, '3歳から小学校就学前の子を養育する労働者に対し、事業主が5つの措置から2つ以上を選んで講じ、労働者が1つを選んで利用できること、テレワーク等（月10日以上）・養育両立支援休暇（年10日以上）、子が3歳になる前の個別の周知・意向確認', 0 from articles where slug = 'news-ikuji-kaigo-2025-10';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '法改正のポイント｜育児休業制度特設サイト', '厚生労働省', 'https://www.mhlw.go.jp/seisakunitsuite/bunya/koyou_roudou/koyoukintou/ryouritsu/ikuji/law-amendment/', '2026-10-06'::date, '2025年10月1日施行の柔軟な働き方を実現するための措置と、妊娠・出産等の申出時と子が3歳になる前の個別の意向聴取・配慮、2025年4月1日施行の所定外労働の制限（残業免除）の対象拡大、従業員300人超の企業への男性の育児休業等取得状況の公表義務の拡大', 1 from articles where slug = 'news-ikuji-kaigo-2025-10';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '改正育児・介護休業法が令和7年10月1日から全面施行されました', '福井労働局', 'https://jsite.mhlw.go.jp/fukui-roudoukyoku/hourei_seido_tetsuzuki/koyou_kintou/hourei_seido/newpage_00587.html', '2026-10-06'::date, '改正法が2025年10月1日に全面施行されたこと', 2 from articles where slug = 'news-ikuji-kaigo-2025-10';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '子の看護等休暇｜育児休業制度特設サイト', '厚生労働省', 'https://www.mhlw.go.jp/seisakunitsuite/bunya/koyou_roudou/koyoukintou/ryouritsu/ikuji/nursing/', '2026-10-06'::date, '2025年4月1日から、子の看護等休暇の対象が小学校3年生修了までに広がり、学級閉鎖や入園式・卒園式なども取得の理由に加わったこと', 3 from articles where slug = 'news-ikuji-kaigo-2025-10';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'news-ikuji-kaigo-2025-10' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"a91a367299989c377fcdc37f0824e625877ad031395d707eb08f9b1b4c100e40","findings":[]}'::jsonb from articles where slug = 'news-ikuji-kaigo-2025-10';
update articles set status = 'published' where slug = 'news-ikuji-kaigo-2025-10';

-- news: news-koyou-hoken-kyufu-seigen (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('news-koyou-hoken-kyufu-seigen', 'news', '自己都合退職の給付制限が原則1か月に｜退職してから転職活動する人が確認したいこと', '2025年4月1日以降に自己都合で退職した場合、雇用保険の基本手当（いわゆる失業手当）の給付制限期間が原則2か月から1か月に短縮されました。退職してから転職活動を考えている人が、何を確認すべきかを整理します。', '「仕事を辞めてから、じっくり転職活動をしたい」と考えている人にとって、生活費の見通しは大きな判断材料です。今回の改正で、自己都合退職のあとに基本手当を受け取れるまでの期間は短くなりました。

```figure
type: compare
style: before-after
title: 自己都合退職の給付制限期間
columns:
  - label: これまで
    items:
      - 原則2か月
  - label: 2025年4月1日以降の退職
    items:
      - 原則1か月
      - 一定の教育訓練を受けた場合は解除されるしくみも
```

ただし、この変更は「辞めても大丈夫」という意味ではありません。基本手当を受け取るには雇用保険の加入期間などの条件があり、受け取れる金額や日数も人によって違います。また、在職中に転職活動をすれば、収入を途切れさせずに次の職場を探せるという利点は変わりません。

退職のタイミングに迷っている場合は、まず自分の雇用保険の加入状況を確認し、在職中に活動する場合と退職してから活動する場合のそれぞれで、スケジュールとお金の見通しを書き出してみてください。転職活動全体の進め方は[未経験転職は何から始める？](/articles/mikeiken-tenshoku-hajimekata)で紹介しています。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['agent-mendan-mae', 'mikeiken-tenshoku-hajimekata', 'news-kyouiku-kunren-kyufu']::text[], '{}'::text[], array['yametai']::text[], array['hajimete']::text[], array['辞めてから転職活動、', '手当はいつから？']::text[], null, false, '[]'::jsonb, '{"announced_by":"厚生労働省","announced_at":"2025-04-01","what_happened":"令和6年の雇用保険法改正により、2025年4月1日以降に正当な理由なく自己都合で退職した人の基本手当の給付制限期間が、原則2か月から1か月に短縮されました。あわせて、離職期間中や離職日前1年以内に一定の教育訓練を受けた場合には、給付制限が解除されるしくみも設けられています。","who_is_affected":"今の仕事を自己都合で辞めてから転職活動をしようと考えている人が主な対象です。在職中に転職先を決めてから退職する人には、直接の影響はほとんどありません。","impact_for_career_changers":"退職してから転職活動に集中する場合、収入が途切れる期間の見通しが立てやすくなりました。ただし、手当を受け取るには条件があり、退職すれば誰でもすぐに受け取れるわけではありません。","unknowns":["自分が基本手当の受給資格を満たしているかどうかは、雇用保険の加入期間などによって変わります。","過去5年以内に自己都合退職による給付制限を繰り返し受けている場合は給付制限期間が3か月になるなど、例外があります。","給付制限の解除の対象になる教育訓練の範囲は、個別に確認が必要です。"],"what_to_check":["雇用保険の加入期間（原則として離職日以前2年間に通算12か月以上の被保険者期間が必要です）","退職理由が自己都合として扱われるのか、それ以外なのか","手続きの窓口となるハローワークでの具体的な手続きと必要書類","在職中に活動するか、退職してから活動するかの比較"]}'::jsonb, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'news-koyou-hoken-kyufu-seigen' and c.slug = 'news' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'news-koyou-hoken-kyufu-seigen' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '雇用保険制度の改正内容について', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000160564.html', '2026-10-06'::date, '給付制限期間の見直し内容と施行日', 0 from articles where slug = 'news-koyou-hoken-kyufu-seigen';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '雇用保険法等の一部を改正する法律の概要', '厚生労働省', 'https://www.mhlw.go.jp/content/11600000/001255172.pdf', '2026-10-06'::date, '改正の全体像と施行期日', 1 from articles where slug = 'news-koyou-hoken-kyufu-seigen';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'news-koyou-hoken-kyufu-seigen' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"3e8241701acb85c291273d171b2e0cb5f7031f87f804e84e357ecfe95afc95de","findings":[]}'::jsonb from articles where slug = 'news-koyou-hoken-kyufu-seigen';
update articles set status = 'published' where slug = 'news-koyou-hoken-kyufu-seigen';

-- news: news-koyou-hoken-tekiyou-kakudai (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('news-koyou-hoken-tekiyou-kakudai', 'news', '雇用保険の対象が週10時間以上に広がる予定（2028年10月）｜短時間で働く人に関係すること', '2024年の雇用保険法改正で、雇用保険に入る条件のうち週の所定労働時間が「20時間以上」から「10時間以上」に変わることが決まりました。施行は2028年10月1日の予定です。アルバイト・パートなど短時間で働く人に何が変わるのか、いまのうちに確認しておきたいことを整理します。', 'アルバイトやパートで「週に何日か、数時間ずつ」働いている人は、いまは雇用保険に入っていないことがあります。2028年10月1日からは、加入の条件になる週の労働時間が「20時間以上」から「10時間以上」に変わる予定です。少し先の話ですが、短時間で働きながら次の仕事を考えている人には関係があるので、何が変わるのかを整理しておきます。

## 自分は対象になる？

いまの雇用保険は、正社員・アルバイト・パート・派遣といった呼び方に関係なく、次の2つを満たす人が原則として加入します。

- 1週間の所定労働時間が20時間以上
- 31日以上続けて働く見込みがある

2028年10月1日からは、このうち時間の条件が「10時間以上」になります。31日以上働く見込みという条件はそのままです。

```figure
type: compare
style: before-after
title: 雇用保険に入る条件（変更の予定）
columns:
  - label: 2028年9月まで
    items:
      - 週の所定労働時間が20時間以上
      - 31日以上続けて働く見込み
  - label: 2028年10月1日から
    items:
      - 週の所定労働時間が10時間以上
      - 31日以上続けて働く見込み（変わらない）
```

所定労働時間は、契約で決まっている1週間の働く時間のことです。たまたまシフトが多かった週の時間ではありません。契約上の働き方の例で比べてみます（どれも31日以上働く見込みがある場合です）。

| 契約上の働き方 | 週の所定労働時間 | 2028年9月まで | 2028年10月から |
| --- | --- | --- | --- |
| 1日4時間×週3日 | 12時間 | 対象外 | 対象 |
| 1日5時間×週2日 | 10時間 | 対象外 | 対象 |
| 1日3時間×週3日 | 9時間 | 対象外 | 対象外 |
| 1日5時間×週4日 | 20時間 | 対象 | 対象 |

## 加入すると何が変わる？

新しく対象になる人も、いま加入している人と同じ給付の対象になります。たとえば次のようなものです。

- 仕事を辞めたあとの基本手当（いわゆる失業手当）
- スキルを身につける講座を受けたときの教育訓練給付
- 育児休業給付

基本手当を受け取るには、辞める前の一定期間に「被保険者期間」が必要です。この期間の数え方も見直され、いまは賃金が支払われた日数が11日以上（または労働時間が80時間以上）ある月を1か月と数えますが、2028年10月からは6日以上（または40時間以上）になる予定です。

一方で、加入すると給料から雇用保険料が差し引かれます。2026年度の料率は、一般の事業で働く人の負担が1,000分の5です。たとえば月の給料が8万円なら、8万円×5/1,000＝400円です。料率は年度ごとに決まるので、2028年10月時点の金額は、そのときの発表で確認してください。

## 正社員を目指す人には、どう関係する？

アルバイトを続けながら転職活動をする人にとっては、短い時間で働いていても雇用保険に入り、加入期間を積み上げやすくなります。正社員を目指す前に講座でスキルを身につけたい人は、教育訓練給付の対象になるかもしれません。制度の中身は[学び直しの支援が拡充｜教育訓練給付の引き上げと教育訓練休暇給付金](/news/news-kyouiku-kunren-kyufu)で紹介しています。

辞めてから転職活動をする場合の基本手当については、[自己都合退職の給付制限が原則1か月に](/news/news-koyou-hoken-kyufu-seigen)もあわせて読んでおくと、お金の見通しを立てやすくなります。

なお、フルタイムで働く正社員は週の所定労働時間が20時間以上になることが多いので、いまの基準でも加入の対象になります。フリーターから正社員を目指すときの全体の進め方は、[フリーターから正社員を目指すとき、最初に確認したいこと](/articles/freeter-seishain-hajimeni)にまとめています。

## いまのうちに確認しておきたいこと

2028年10月までは、いまの「週20時間以上」の条件のままです。今の自分の状況を知っておくために、次の点を見ておきましょう。

- 雇用契約書や労働条件通知書に書かれた「1週間の所定労働時間」
- 契約期間と、更新があるかどうか
- 給与明細に雇用保険料の欄があるか（いま加入しているかの目安）
- 掛け持ちしている場合は、それぞれの勤め先との契約時間

加入するかどうかは、本人が損か得かで選ぶものではなく、条件を満たせば対象になるしくみです。分からないことは、勤め先の担当者やハローワークに確認してみてください。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['news-kyouiku-kunren-kyufu', 'news-koyou-hoken-kyufu-seigen', 'freeter-seishain-hajimeni']::text[], '{}'::text[], array['seishain']::text[], array['freeter', 'haken']::text[], array['週10時間のバイトも', '雇用保険の対象に？']::text[], null, false, '[]'::jsonb, '{"announced_by":"厚生労働省","announced_at":"2028-10-01","what_happened":"令和6年（2024年）の雇用保険法改正により、雇用保険に加入する条件のうち「1週間の所定労働時間が20時間以上」が「10時間以上」に変わることが決まりました。施行は2028年10月1日の予定です。新しく対象になる人も、いま加入している人と同じように、基本手当（いわゆる失業手当）や教育訓練給付、育児休業給付などの対象になります。","who_is_affected":"契約で決まった1週間の労働時間が10時間以上20時間未満で、31日以上働く見込みがあるアルバイト・パート・派遣などの人が、新しく加入の対象になります。週20時間以上で働いている人は、いまと同じく対象です。","impact_for_career_changers":"短時間のアルバイトを続けながら正社員を目指す人も、雇用保険に入って加入期間を積み上げやすくなります。学び直しの講座を受けるときの教育訓練給付なども、条件を満たせば使える可能性があります。ただし施行は2028年10月なので、それまではいまの「週20時間以上」の条件のままです。","unknowns":["勤め先が、2028年10月に向けて加入の手続きや案内をどう進めるかは、会社ごとに違います。","雇用保険料の料率は年度ごとに決まるため、2028年10月時点で給料から差し引かれる金額は、まだ分かりません。","複数のアルバイトを掛け持ちしている場合に、どの勤め先で加入するかなどの扱いは、個別に確認が必要です。"],"what_to_check":["雇用契約書や労働条件通知書に書かれた、1週間の所定労働時間","契約期間と更新の有無（31日以上働く見込みがあるか）","給与明細に雇用保険料の欄があるか（いま加入しているかの目安）","2028年10月に向けた勤め先からの案内"]}'::jsonb, '{"schema_version":2,"writer_agent":"career-writer","angle":"2028年10月施行の予定を「自分は対象になる？」から入り、週の所定労働時間の例で対象かどうかを判断できるようにする。給付と保険料の両面を書き、損得ではなく確認のしかたで締める","quotes":[{"source_url":"https://www.mhlw.go.jp/content/11600000/001255172.pdf","text":"雇用保険の被保険者の要件のうち、週所定労働時間を「20時間以上」から「10時間以上」に変更し、適用対象を拡大する。施行期日は令和10年10月1日","used_in":"自分は対象になる？"},{"source_url":"https://www.mhlw.go.jp/content/11601000/001542937.pdf","text":"新たに被保険者となる者も、現行の被保険者と同様に基本手当、教育訓練給付、育児休業給付等を支給（別基準は設けない）。31日以上の雇用見込みの要件は維持。被保険者期間は賃金支払基礎日数6日以上または労働時間40時間以上の月を1か月として計算（現行は11日以上または80時間以上）","used_in":"加入すると何が変わる？"},{"source_url":"https://www.mhlw.go.jp/new-info/kobetu/roudou/gyousei/hoken/kakikata/dl/koyou-06.pdf","text":"雇用される労働者は、常用・パート・アルバイト・派遣等、名称や雇用形態にかかわらず、1週間の所定労働時間が20時間以上であり、31日以上の雇用見込みがある場合には、原則として被保険者となる","used_in":"自分は対象になる？"},{"source_url":"https://jsite.mhlw.go.jp/aichi-hellowork/list/okazaki/news/koyouhokennryouR08.html","text":"令和8年度の雇用保険料率は、一般の事業で労働者負担5/1,000、事業主負担8.5/1,000","used_in":"加入すると何が変わる？"}],"not_used":["新たに対象となる人数の見込みは、今回のセッションで公式資料の数字を確認できなかったため書いていない","失業認定の基準（1日の労働時間4時間未満→2時間未満）の見直しは、読者の判断に直接かかわりにくいため本文から外した","表の働き方と保険料の計算（月8万円×5/1,000＝400円）は説明のための仮の例"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'news-koyou-hoken-tekiyou-kakudai' and c.slug = 'news' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'news-koyou-hoken-tekiyou-kakudai' and c.slug = 'hatarakikata' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '雇用保険法等の一部を改正する法律の概要', '厚生労働省', 'https://www.mhlw.go.jp/content/11600000/001255172.pdf', '2026-10-06'::date, '被保険者の要件のうち週所定労働時間を20時間以上から10時間以上に変更すること、施行期日が2028年（令和10年）10月1日であること', 0 from articles where slug = 'news-koyou-hoken-tekiyou-kakudai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '令和６年雇用保険制度改正（令和10年10月１日施行分）について（職業安定分科会雇用保険部会 第205回 資料）', '厚生労働省', 'https://www.mhlw.go.jp/content/11601000/001542937.pdf', '2026-10-06'::date, '新たに対象になる人にも基本手当・教育訓練給付・育児休業給付等を同じ基準で支給すること、31日以上の雇用見込みの要件は維持されること、被保険者期間の数え方（11日以上→6日以上、80時間以上→40時間以上）の見直し', 1 from articles where slug = 'news-koyou-hoken-tekiyou-kakudai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '雇用保険の被保険者について', '厚生労働省', 'https://www.mhlw.go.jp/new-info/kobetu/roudou/gyousei/hoken/kakikata/dl/koyou-06.pdf', '2026-10-06'::date, 'いまの加入条件（雇用形態や呼び方にかかわらず、週の所定労働時間20時間以上かつ31日以上の雇用見込み）', 2 from articles where slug = 'news-koyou-hoken-tekiyou-kakudai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '令和8年度の雇用保険料率について', 'ハローワーク岡崎（愛知労働局）', 'https://jsite.mhlw.go.jp/aichi-hellowork/list/okazaki/news/koyouhokennryouR08.html', '2026-10-06'::date, '2026年度の雇用保険料率（一般の事業の労働者負担は1,000分の5）', 3 from articles where slug = 'news-koyou-hoken-tekiyou-kakudai';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'news-koyou-hoken-tekiyou-kakudai' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"5b829a45c8c1058fbeae4e73ef03d8a1a5a636de36ee3a2172cb2afc4596adaa","findings":[]}'::jsonb from articles where slug = 'news-koyou-hoken-tekiyou-kakudai';
update articles set status = 'published' where slug = 'news-koyou-hoken-tekiyou-kakudai';

-- news: news-kyouiku-kunren-kyufu (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('news-kyouiku-kunren-kyufu', 'news', '学び直しの支援が拡充｜教育訓練給付の引き上げと教育訓練休暇給付金', '雇用保険の教育訓練給付は、2024年10月から給付率の上限が引き上げられ、2025年10月には教育訓練休暇給付金が新設されました。未経験の職種に挑戦するためにスキルを身につけたい人に関係する制度変更を解説します。', '未経験の職種に挑戦するとき、「入社前に少しでもスキルを身につけておきたい」と考える人は多いと思います。今回の制度変更は、そうした学び直しの費用や時間の負担を軽くする方向のものです。

```figure
type: steps
title: 学び直しの支援が変わった時期
items:
  - label: 2024年10月1日から
    text: 教育訓練給付金の給付率の上限を引き上げ（最大80%）
  - label: 2025年10月1日から
    text: 教育訓練休暇給付金が設けられた
```

一方で、注意したいのは「資格を取れば転職できる」とは限らない点です。未経験者を採用する会社の多くは、資格そのものよりも、仕事への理解や学び続ける姿勢を見ています。講座を選ぶ前に、志望する職種で何が求められているかを調べ、必要なら人材紹介会社のキャリアアドバイザーなどに「その資格が実際の求人でどう評価されるか」を確認してから決めると、時間とお金を無駄にしにくくなります。

AIの普及で仕事の中身がどう変わるかについては、[AIで変わる仕事を、未経験転職者はどう見るべきか](/articles/ai-shigoto-mikeiken)でも解説しています。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['ai-shigoto-mikeiken', 'news-koyou-hoken-kyufu-seigen', 'eigyo-cs-it-support-chigai']::text[], '{}'::text[], array['mikeiken-shokushu']::text[], array['pc-mikeiken']::text[], array['転職前に学びたい。', '講座の費用、補助ある？']::text[], 'graduation', false, '[]'::jsonb, '{"announced_by":"厚生労働省","announced_at":"2025-10-01","what_happened":"令和6年の雇用保険法改正により、2024年10月1日から教育訓練給付金の給付率の上限が引き上げられました（専門実践教育訓練では、受講後に賃金が上昇した場合などの条件を満たすと、受講費用の最大80%）。さらに2025年10月1日からは、雇用保険の被保険者が教育訓練のために休暇を取った場合に、賃金の一定割合を支給する「教育訓練休暇給付金」が設けられました。","who_is_affected":"雇用保険に加入して働いている人や、一定期間内に離職した人で、資格取得やスキルアップのための講座を受けようとしている人が主な対象です。","impact_for_career_changers":"ITや事務などの職種に挑戦する前に、指定された講座でスキルを身につける場合の費用負担を軽くできる可能性があります。在職中に学んでから転職するという進め方も検討しやすくなりました。","unknowns":["給付の対象になるのは、厚生労働大臣の指定を受けた講座だけです。受けたい講座が対象かどうかは個別に確認が必要です。","受給には一定期間以上の雇用保険の加入期間などの条件があり、給付率は講座の種類や受講後の状況によって変わります。","講座を修了したことが、そのまま希望する職種への採用につながるとは限りません。"],"what_to_check":["受けたい講座が教育訓練給付の指定講座かどうか","自分の雇用保険の加入期間が、支給の条件を満たしているか","受講前に必要な手続き（講座によっては受講開始前の手続きが必要です）","志望する職種で、その資格やスキルが実際にどう評価されるか"]}'::jsonb, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'news-kyouiku-kunren-kyufu' and c.slug = 'news' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'news-kyouiku-kunren-kyufu' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '雇用保険制度の改正内容について', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000160564.html', '2026-10-06'::date, '教育訓練給付の拡充と教育訓練休暇給付金の概要', 0 from articles where slug = 'news-kyouiku-kunren-kyufu';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '雇用保険法等の一部を改正する法律の概要', '厚生労働省', 'https://www.mhlw.go.jp/content/11600000/001255172.pdf', '2026-10-06'::date, '各改正の施行期日', 1 from articles where slug = 'news-kyouiku-kunren-kyufu';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'news-kyouiku-kunren-kyufu' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"26d187ea819faa766aca9d91881727909572bd2e923358975aac129dc11998ec","findings":[]}'::jsonb from articles where slug = 'news-kyouiku-kunren-kyufu';
update articles set status = 'published' where slug = 'news-kyouiku-kunren-kyufu';

-- news: news-roudou-jouken-meiji (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('news-roudou-jouken-meiji', 'news', '求人で明示される労働条件が増えた｜「業務・就業場所の変更の範囲」とは', '2024年4月から、求人の募集時や労働契約を結ぶときに明示される労働条件に「業務の変更の範囲」「就業場所の変更の範囲」などが加わりました。未経験転職で求人を比べるときに、どこを見ればいいかを解説します。', '求人票や労働条件通知書には、これまでも仕事内容や勤務地が書かれていました。今回のルール変更で大きいのは、**「入社直後」だけでなく「将来の変更の範囲」も書かれるようになった**点です。

たとえば、仕事内容の欄に「（雇入れ直後）カスタマーサポート業務　（変更の範囲）会社の定める業務」と書かれている場合、入社後にほかの部署の業務へ変わる可能性があることを意味します。反対に、変更の範囲が「変更なし」や特定の業務に限られていれば、担当が大きく変わる可能性は低いと読み取れます。

```figure
type: compare
title: 仕事内容の欄の読み方（例）
columns:
  - label: 雇入れ直後
    tone: sky
    items:
      - カスタマーサポート業務
  - label: 変更の範囲
    tone: sand
    items:
      - 会社の定める業務
      - 入社後にほかの部署の業務へ変わる可能性がある
```

未経験転職では、仕事内容がイメージと違うことが早期離職のきっかけになりがちです。求人を比べるときは、給与や休日と同じように、この「変更の範囲」の欄も見比べてみてください。年収や休日の比べ方は[「土日休み」と「年収」をどう比較する？](/articles/donichi-yasumi-nenshu-hikaku)で紹介しています。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['donichi-yasumi-nenshu-hikaku', 'tenshoku-kaisu-kininaru', 'freeter-seishain-hajimeni']::text[], '{}'::text[], array['mikeiken-shokushu']::text[], array['hajimete']::text[], array['入社後の仕事や勤務地、', 'どこまで変わる？']::text[], 'search', false, '[]'::jsonb, '{"announced_by":"厚生労働省","announced_at":"2024-04-01","what_happened":"労働基準法施行規則などの改正により、2024年4月1日から、労働契約を結ぶときに「就業場所・業務の変更の範囲」を明示することになりました。有期契約の場合は、更新上限の有無と内容なども明示の対象です。求人の募集時や職業紹介の際に明示される事項にも、業務・就業場所の変更の範囲や、有期契約の更新の基準が加わっています。","who_is_affected":"これから求人に応募する人、内定を受けて労働契約を結ぶ人のすべてが関係します。契約社員など期間の定めがある働き方を検討している人は、更新上限に関する項目も確認の対象になります。","impact_for_career_changers":"入社直後の仕事内容や勤務地だけでなく、「将来どこまで変わる可能性があるか」を入社前に確認しやすくなりました。未経験で入社して「聞いていた仕事と違う」と感じるリスクを減らす材料として使えます。","unknowns":["変更の範囲が明示されていても、実際にどのくらいの頻度で異動や担当変更があるかまでは分かりません。","「会社の定める業務」のように広く書かれている場合、具体的に何が含まれるかは求人票だけでは判断しにくいことがあります。"],"what_to_check":["求人票や労働条件通知書の「業務の変更の範囲」「就業場所の変更の範囲」の欄","変更の範囲が広い場合、未経験で入社した人が実際にどんな異動・担当変更を経験しているか","契約社員の場合は、更新上限の有無と、正社員登用の実績"]}'::jsonb, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'news-roudou-jouken-meiji' and c.slug = 'news' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'news-roudou-jouken-meiji' and c.slug = 'hatarakikata' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年4月から労働条件明示のルールが変わります', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_32105.html', '2026-10-06'::date, '改正の概要と施行日', 0 from articles where slug = 'news-roudou-jouken-meiji';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '企業から受ける労働条件明示のルールが変わります（求職者向けリーフレット）', '厚生労働省', 'https://www.mhlw.go.jp/content/001114112.pdf', '2026-10-06'::date, '募集時・職業紹介時に追加された明示事項', 1 from articles where slug = 'news-roudou-jouken-meiji';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'news-roudou-jouken-meiji' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"2c15c8a5269751c5f84dd2ee0c0f004194da21cf0bf8124a946ef53704fa12a1","findings":[]}'::jsonb from articles where slug = 'news-roudou-jouken-meiji';
update articles set status = 'published' where slug = 'news-roudou-jouken-meiji';

-- news: news-saitei-chingin-2026 (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('news-saitei-chingin-2026', 'news', '2026年度の最低賃金改定｜全国加重平均は1,177円に。時給で働く人が確認したいこと', '2026年度（令和8年度）の地域別最低賃金の改定額が全ての都道府県で答申され、全国加重平均額は1,177円になりました。新しい額は2026年10月1日から12月2日までの間に順次発効します。自分の地域の額の調べ方と、月給を時給に直して確かめる方法を整理します。', '最低賃金は年度ごとに見直されていて、2026年度（令和8年度）は全ての都道府県で改定額が答申されました。全国加重平均額は1,177円です。時給で働いている人はもちろん、月給の求人と今のアルバイトの時給を比べたい人にも関係があるので、確認のしかたを整理します。

```figure
type: stats
title: 2026年度の最低賃金（答申）
items:
  - value: "1,177"
    unit: 円
    label: 全国加重平均額
    note: 2025年度から56円の引上げ
  - value: "54〜65"
    unit: 円
    label: 引上げ額
    note: 47都道府県で
  - value: "1,280"
    unit: 円
    label: 最高額（東京都）
  - value: "1,085"
    unit: 円
    label: 最低額
```

## 2026年度はいくらになった？

厚生労働省の発表によると、2026年度の改定のポイントは次のとおりです。

- 47都道府県で、54円〜65円の引上げ
- 全国加重平均額は1,177円（2025年度の1,121円から56円の引上げ）
- 最高額は東京都の1,280円、最低額は1,085円
- 新しい額は、2026年10月1日から12月2日までの間に、都道府県ごとに順次発効

発効日は都道府県によって違い、発効日の前までは2025年度の額のままです。自分の地域の額と発効日は、厚生労働省の「地域別最低賃金の全国一覧」で確認できます。

## アルバイトや派遣の場合はどの額？

最低賃金は、パート・アルバイトなどの雇用形態や呼び方に関係なく、原則として事業場で働くすべての人に適用されます。会社は、最低賃金額以上の賃金を支払わなければなりません。

基準になるのは、働いている事業場がある都道府県の額です。派遣で働く人には、派遣会社のある場所ではなく、派遣先の事業場に適用される最低賃金が当てはまります。また、特定の産業には、地域別とは別に「特定（産業別）最低賃金」が決められていることもあります。

## 月給の人はどう確かめる？

月給の人は、時間あたりの額に直して比べます。

> 月給 ÷ 1か月平均の所定労働時間 ≧ 最低賃金（時間額）

1か月平均の所定労働時間は「（365日 − 年間休日）× 1日の所定労働時間 ÷ 12」で求めます。このとき、次の賃金は月給から除いて計算します。

- 残業代（時間外・休日・深夜の割増賃金）
- 通勤手当、家族手当、精皆勤手当
- 賞与など、1か月を超える期間ごとに払われるもの
- 結婚手当など、臨時に払われるもの

たとえば、次のような条件の場合で計算してみます（仮の例です）。

| 項目 | 例 |
| --- | --- |
| 月給（基本給＋職務手当。通勤手当・残業代は除く） | 22万円 |
| 年間休日 | 120日 |
| 1日の所定労働時間 | 8時間 |
| 1か月平均の所定労働時間 | （365−120）×8÷12 ≒ 163.3時間 |
| 時間あたりの額 | 22万円÷163.3時間 ≒ 1,347円 |

## 転職を考えている人はどう使う？

時間あたりの額に直すと、時給の仕事と月給の仕事を同じものさしで比べられます。たとえば、時給1,300円のアルバイトと、上の例の月給22万円（時間あたり約1,347円）の正社員の求人では、時間あたりの差は約47円です。

ただ、正社員の求人では賞与や昇給、社会保険、休日の数なども変わるので、時間あたりの額だけで決めないほうが安心です。休日と年収をそろえて比べる方法は[「土日休み」と「年収」をどう比較する？](/articles/donichi-yasumi-nenshu-hikaku)、額以外に見ておきたい点は[年収だけで求人を選ばないほうがいい理由](/articles/nenshu-dake-erabanai)で紹介しています。

なお、最低賃金が上がっても、すでに最低賃金より高い時給で働いている人の時給が上がるかどうかは、会社ごとの判断です。

## 確認しておきたいこと

- 働いている事業場がある都道府県と、その新しい額・発効日
- 自分の時給（月給の人は換算した額）が、新しい額以上になっているか
- 換算するときに、残業代や通勤手当などを除いているか
- 計算が合わないと感じたら、まず勤め先に給料の内訳と計算のしかたを確認する

給料の上げ方や比べ方をもっと知りたいときは、[給料を上げたいときの記事一覧](/concerns/kyuryo)も見てみてください。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['donichi-yasumi-nenshu-hikaku', 'tedori-20man-hikaku', 'nenshu-dake-erabanai']::text[], '{}'::text[], array['kyuryo']::text[], array['freeter', 'haken']::text[], array['最低賃金、', '自分の地域はいくら？']::text[], null, false, '[]'::jsonb, '{"announced_by":"厚生労働省","announced_at":"2026-10-01","what_happened":"2026年度（令和8年度）の地域別最低賃金の改定額が、全ての都道府県で答申されました。47都道府県で54円〜65円の引上げとなり、全国加重平均額は2025年度の1,121円から56円上がって1,177円です。最高額は東京都の1,280円、最低額は1,085円です。新しい額は、2026年10月1日から12月2日までの間に、都道府県ごとに順次発効する予定です。","who_is_affected":"最低賃金は、パート・アルバイトなどの雇用形態や呼び方にかかわらず、原則として事業場で働くすべての人に適用されます。時給で働く人だけでなく、月給・日給の人も、時間あたりに換算した額が対象です。派遣で働く人には、派遣先の事業場に適用される最低賃金が当てはまります。","impact_for_career_changers":"時給の仕事と月給の仕事を比べるときの「下限」の目安が変わります。月給の求人を時間あたりの額に直して、最低賃金や今のアルバイトの時給と並べると、条件の違いが見えやすくなります。","unknowns":["自分の都道府県の発効日は、2026年10月1日から12月2日までの間で都道府県ごとに違います。","最低賃金より高い時給で働いている人の時給が見直されるかどうかは、会社ごとの判断です。","特定の産業には、地域別とは別に「特定（産業別）最低賃金」が決められている場合があります。"],"what_to_check":["働いている事業場がある都道府県の、新しい最低賃金額と発効日","自分の時給（月給・日給の人は時間あたりに換算した額）が、新しい額を下回っていないか","換算するときに、残業代・通勤手当・家族手当・精皆勤手当・賞与など、最低賃金の計算に入れない賃金を除いているか","派遣で働く場合は、派遣先の事業場に適用される額"]}'::jsonb, '{"schema_version":2,"writer_agent":"career-writer","angle":"公式の答申結果の数字だけを使い、「自分の地域の額を調べる」「月給を時給に直して確かめる」の2つの手順を中心にする。転職を考える人には、時給と月給を同じものさしで比べる道具として紹介する","quotes":[{"source_url":"https://www.mhlw.go.jp/stf/newpage_75950.html","text":"47都道府県で54円～65円の引上げ。改定額の全国加重平均額は1,177円（昨年度1,121円）。最高額（1,280円）に対する最低額（1,085円）の比率は84.8％。令和8年10月1日から令和8年12月2日までの間に順次発効される予定","used_in":"2026年度はいくらになった？"},{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/chingin/newpage_43875.html","text":"最低賃金が適用されるのは、原則として事業場で働くすべての労働者で、パート・アルバイトといった雇用形態や呼称にはよらない。地域別最低賃金は各都道府県内の事業場で働くすべての労働者とその使用者に適用。地域別と特定（産業別）の2種類","used_in":"アルバイトや派遣の場合はどの額？"},{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/chingin/newpage_43898.html","text":"最低賃金の対象とならない賃金は、臨時に支払われる賃金、1か月を超える期間ごとに支払われる賃金（賞与など）、時間外・休日・深夜の割増賃金、精皆勤手当・通勤手当・家族手当","used_in":"月給の人はどう確かめる？"},{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/chingin/newpage_43899.html","text":"月給の場合は、月給÷1か月平均所定労働時間≧最低賃金額（時間額）で確認する。1か月平均所定労働時間＝（365日−年間所定休日数）×1日の所定労働時間÷12","used_in":"月給の人はどう確かめる？"},{"source_url":"https://saiteichingin.mhlw.go.jp/point/page_point_haken.html","text":"派遣労働者には、派遣元の事業場の所在地にかかわらず、派遣先の最低賃金が適用される","used_in":"アルバイトや派遣の場合はどの額？"}],"not_used":["東京都以外の都道府県別の額は、本文では一覧への案内にとどめ、個別には書いていない","最低額の都道府県名は、公式ページの要約で確認できなかったため書いていない","月給22万円・年間休日120日・時給1,300円の例は、計算方法を説明するための仮の数字"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'news-saitei-chingin-2026' and c.slug = 'news' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'news-saitei-chingin-2026' and c.slug = 'hatarakikata' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '全ての都道府県で地域別最低賃金の改定額が答申されました', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_75950.html', '2026-10-06'::date, '2026年度の改定額（47都道府県で54円〜65円の引上げ、全国加重平均1,177円、2025年度は1,121円、最高額1,280円・最低額1,085円）と、2026年10月1日〜12月2日の間に順次発効する予定であること', 0 from articles where slug = 'news-saitei-chingin-2026';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '地域別最低賃金の全国一覧', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/minimumichiran/index.html', '2026-10-06'::date, '都道府県ごとの最低賃金額と発効日の確認先、東京都の額（1,280円）', 1 from articles where slug = 'news-saitei-chingin-2026';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '最低賃金制度の概要', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/chingin/newpage_43875.html', '2026-10-06'::date, '使用者は最低賃金額以上の賃金を支払う必要があること、パート・アルバイトなど雇用形態にかかわらず適用されること、地域別最低賃金と特定（産業別）最低賃金の2種類があること', 2 from articles where slug = 'news-saitei-chingin-2026';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '最低賃金の対象となる賃金', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/chingin/newpage_43898.html', '2026-10-06'::date, '最低賃金の計算に入れない賃金（臨時の賃金、賞与、時間外・休日・深夜の割増賃金、精皆勤手当・通勤手当・家族手当）', 3 from articles where slug = 'news-saitei-chingin-2026';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '最低賃金額以上かどうかを確認する方法', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/chingin/newpage_43899.html', '2026-10-06'::date, '月給の場合は「月給÷1か月平均所定労働時間」で比べること、1か月平均所定労働時間の求め方', 4 from articles where slug = 'news-saitei-chingin-2026';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '派遣先の事業場に適用される最低賃金を把握しておく必要があります', '厚生労働省（最低賃金制度 特設サイト）', 'https://saiteichingin.mhlw.go.jp/point/page_point_haken.html', '2026-10-06'::date, '派遣で働く人には、派遣元ではなく派遣先の事業場の最低賃金が適用されること', 5 from articles where slug = 'news-saitei-chingin-2026';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'news-saitei-chingin-2026' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"2eeab1557bf24b086fbf0701b43a9fb96df41487cbda5f8e38c8b32e038c6d15","findings":[]}'::jsonb from articles where slug = 'news-saitei-chingin-2026';
update articles set status = 'published' where slug = 'news-saitei-chingin-2026';

-- news: news-shakai-hoken-tekiyou-kakudai (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('news-shakai-hoken-tekiyou-kakudai', 'news', '社会保険の加入対象が広がる（2026年10月〜）｜アルバイト・パートの人が知っておきたいこと', '2025年の年金制度改正法で、パート・アルバイトの人が社会保険（健康保険・厚生年金保険）に入る条件が見直されました。2026年10月1日に「月額8.8万円以上」という賃金の条件が撤廃され、勤め先の従業員数の条件も2027年10月から段階的に縮小されます。何が変わるのか、手取りはどうなるのかを整理します。', 'パートやアルバイトで働いていると、「社会保険に入るかどうか」で手取りが変わるので、気になっている人も多いと思います。2025年の年金制度改正法で、短時間で働く人が健康保険・厚生年金保険（まとめて社会保険と呼ばれます）に入る条件が見直されました。大きな変更は2つで、2026年10月1日の賃金の条件の撤廃と、2027年10月から始まる会社の規模の条件の段階的な縮小です。

## 何が変わる？

短時間で働く人が社会保険に入る条件を、2026年10月1日の前後で比べると次のようになります。

| 条件 | 2026年9月まで | 2026年10月から |
| --- | --- | --- |
| 週の所定労働時間 | 20時間以上 | 20時間以上（変わらない） |
| 月の賃金（所定内賃金） | 8.8万円以上 | 条件なし |
| 勤め先の従業員数 | 51人以上 | 51人以上（2027年10月から縮小） |
| 学生かどうか | 学生は対象外 | 学生は対象外 |

このほか、2か月を超えて働く見込みがあることも必要です。

月8.8万円×12か月＝105.6万円なので、この賃金の条件は「106万円の壁」と呼ばれてきました。年収をこの額より少なく抑えるために、シフトを調整していた人もいるかもしれません。2026年10月1日からは賃金の条件がないため、週20時間以上などの条件を満たせば、給料の額にかかわらず加入の対象になります。

```figure
type: compare
style: before-after
title: 社会保険の賃金の条件がなくなる
columns:
  - label: 2026年9月まで
    items:
      - 月の賃金8.8万円以上
      - いわゆる「106万円の壁」
  - label: 2026年10月1日から
    items:
      - 賃金の条件なし
      - 週20時間以上などの条件は変わらない
```

## 会社の規模の条件はいつ変わる？

いまは、勤め先の従業員数が51人以上であることが条件です。この条件は、次のように段階的に縮小されます。

- 2027年10月から：従業員36人以上の会社
- 2029年10月から：従業員21人以上の会社
- 2032年10月から：従業員11人以上の会社
- 2035年10月から：会社の規模の条件なし

小さな会社やお店で週20時間以上働いている人は、勤め先の従業員数によって、対象になる時期が違います。従業員数の数え方も含めて、勤め先に聞いてみましょう。

## 入ると手取りは減る？

社会保険に入ると、健康保険料と厚生年金保険料が給料から差し引かれるので、同じ給料でも手取りが減ることがあります。そのかわり、次のような保障が受けられます。

- 基礎年金に加えて厚生年金を受け取れるので、将来の年金が増える
- 病気やけがで休んだときの傷病手当金、出産で休んだときの出産手当金
- 障害がある状態になったときの障害厚生年金

また、会社が保険料の一部を追加で負担して、標準報酬月額12.6万円以下の短時間で働く人の保険料負担を通算3年間軽くできる「保険料調整制度」もあります。対象になる会社には条件があり、使うかどうかは会社が決めます。この制度で負担が軽くなっても、将来受け取る年金額は減りません。

## 正社員を目指す人はどう考える？

社会保険は、正社員だけのものではなくなってきています。「アルバイトを続ける」「正社員を目指す」のどちらにするか迷ったときは、時給や月給の額だけでなく、社会保険料が引かれたあとの手取りと、受けられる保障をそろえて比べると判断しやすくなります。手取りの比べ方は[手取り20万円から転職を考えるとき、何を比べればいい？](/articles/tedori-20man-hikaku)で紹介しています。

フリーターから正社員を目指すときの進め方は[フリーターから正社員を目指すとき、最初に確認したいこと](/articles/freeter-seishain-hajimeni)、派遣で働いている人は[派遣から正社員を考えるとき、最初に確認したいこと](/articles/haken-seishain)もあわせて読んでみてください。

## 求人を見るときに確認したいこと

求人票に「社会保険完備」と書かれていても、自分の働き方で加入できるかは、契約の中身によって変わります。

- 契約上の週の所定労働時間は20時間以上か
- 契約期間は2か月を超える見込みか
- 会社の従業員数と、規模の条件の対象になる時期
- 加入した場合の手取りの目安（厚生労働省の特設サイトの試算ツールも使えます）

分からないことは、応募前や面接のときに質問して確かめておきましょう。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['freeter-seishain-hajimeni', 'tedori-20man-hikaku', 'haken-seishain']::text[], '{}'::text[], array['kyuryo', 'seishain']::text[], array['freeter', 'haken']::text[], array['社会保険の加入条件、', '何が変わる？']::text[], null, false, '[]'::jsonb, '{"announced_by":"厚生労働省・日本年金機構","announced_at":"2026-10-01","what_happened":"令和7年（2025年）の年金制度改正法により、短時間で働く人が健康保険・厚生年金保険に加入する条件のうち、「所定内賃金が月額8.8万円以上」という賃金の条件が2026年10月1日に撤廃されました。勤め先の従業員数の条件（いまは51人以上）も、2027年10月から2035年10月にかけて段階的に縮小され、最終的になくなる予定です。","who_is_affected":"週の所定労働時間が20時間以上で、月の賃金が8.8万円に届かないために社会保険に入っていなかったパート・アルバイトなどの人が主な対象です。従業員50人以下の会社で働く人も、勤め先の規模に応じて2027年10月以降に順に対象になります。学生は引き続き対象外です。","impact_for_career_changers":"週20時間以上働くなら、給料の額にかかわらず社会保険に入る働き方が増えます。保険料が差し引かれるぶん手取りが減ることはありますが、将来の厚生年金や、病気・出産で休んだときの手当などの保障が受けられます。アルバイトを続けるか正社員を目指すかを比べるときは、社会保険を含めた手取りで考えるのがおすすめです。","unknowns":["自分の勤め先がいつから会社の規模の条件の対象になるかは、従業員数の数え方を含めて勤め先に確認が必要です。","加入した場合の保険料や手取りの金額は、給料や加入する健康保険によって違います。","保険料の負担を一時的に軽くする「保険料調整制度」は、対象になる会社に条件があり、使うかどうかも会社が決めます。"],"what_to_check":["雇用契約書や労働条件通知書に書かれた、1週間の所定労働時間（20時間以上か）","2か月を超えて働く見込みがあるか","勤め先の従業員数と、規模の条件の対象になる時期","加入した場合の手取りの変化（厚生労働省の特設サイトの試算ツールなど）"]}'::jsonb, '{"schema_version":2,"writer_agent":"career-writer","angle":"「106万円の壁」という言葉で知っている人が多いので、賃金の条件がなくなったことを表で示し、手取りが減る面と保障が増える面を両方書く。正社員を目指す人には、社会保険込みの手取りで比べる視点を渡す","quotes":[{"source_url":"https://www.nenkin.go.jp/oshirase/taisetu/jigyosho/2026/202610/100104.html","text":"令和7年年金制度改正法に基づき、短時間労働者が社会保険に加入する要件のうち、賃金要件（所定内賃金が月額8.8万円以上）が2026（令和8）年10月1日に撤廃された。労働時間要件（週20時間以上）、企業規模要件（51人以上）、学生でないことの要件は残る","used_in":"何が変わる？"},{"source_url":"https://www.mhlw.go.jp/tekiyoukakudai/jugyouin/taisho/","text":"従業員数36～50人の企業は2027年10月から、21～35人の企業は2029年10月から、11～20人の企業は2032年10月から、10人以下の企業は2035年10月から適用拡大の対象。フルタイムの従業員と同じく2か月を超えて雇用される見込みが必要","used_in":"会社の規模の条件はいつ変わる？"},{"source_url":"https://www.mhlw.go.jp/tekiyoukakudai/jugyouin/merit/","text":"厚生年金保険に加入すると基礎年金に加えて厚生年金を受け取れる。休業時の傷病手当金・出産手当金、障害がある状態になった場合の障害厚生年金","used_in":"入ると手取りは減る？"},{"source_url":"https://www.nenkin.go.jp/service/kounen/hokenryo/hokenryochosei/gaiyo.html","text":"2026年10月以降に任意特定適用事業所となった事業所や、2027年10月以降の適用拡大で特定適用事業所となった事業所等の事業主が、保険料を一時的に追加負担することで、通算3年間、標準報酬月額12.6万円以下の短時間労働者の保険料負担を軽減できる。軽減されても将来の年金額は減らない","used_in":"入ると手取りは減る？"}],"not_used":["保険料の具体的な金額や手取りの計算例は、料率が加入する健康保険や地域で違うため書いていない","「130万円」の扶養の基準は今回の改正とは別の話で、公式情報で確認していないため扱っていない","「8.8万円×12か月＝105.6万円」は本文中の計算で、「106万円の壁」という呼び方の説明に使った"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'news-shakai-hoken-tekiyou-kakudai' and c.slug = 'news' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'news-shakai-hoken-tekiyou-kakudai' and c.slug = 'hatarakikata' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2026（令和8）年10月に社会保険の短時間労働者に係る賃金要件が撤廃されました', '日本年金機構', 'https://www.nenkin.go.jp/oshirase/taisetu/jigyosho/2026/202610/100104.html', '2026-10-06'::date, '令和7年年金制度改正法により、所定内賃金が月額8.8万円以上という賃金要件が2026年10月1日に撤廃されたこと、残る要件（週20時間以上・従業員51人以上・学生でないこと）', 0 from articles where slug = 'news-shakai-hoken-tekiyou-kakudai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '社会保険加入の要件｜社会保険適用拡大特設サイト', '厚生労働省', 'https://www.mhlw.go.jp/tekiyoukakudai/jugyouin/taisho/', '2026-10-06'::date, '企業規模の条件の段階的な縮小（2027年10月36人以上、2029年10月21人以上、2032年10月11人以上、2035年10月に撤廃）と、2か月を超える雇用見込みの要件', 1 from articles where slug = 'news-shakai-hoken-tekiyou-kakudai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '社会保険加入のメリット｜社会保険適用拡大特設サイト', '厚生労働省', 'https://www.mhlw.go.jp/tekiyoukakudai/jugyouin/merit/', '2026-10-06'::date, '加入すると基礎年金に加えて厚生年金を受け取れること、傷病手当金・出産手当金、障害厚生年金', 2 from articles where slug = 'news-shakai-hoken-tekiyou-kakudai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '社会保険適用拡大特設サイト', '厚生労働省', 'https://www.mhlw.go.jp/tekiyoukakudai/', '2026-10-06'::date, '従業員向けの試算ツールで、加入後の手取り額や将来の年金額を試算できること', 3 from articles where slug = 'news-shakai-hoken-tekiyou-kakudai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '保険料調整制度とは', '日本年金機構', 'https://www.nenkin.go.jp/service/kounen/hokenryo/hokenryochosei/gaiyo.html', '2026-10-06'::date, '事業主の追加負担で、標準報酬月額12.6万円以下の短時間労働者の保険料負担を通算3年間軽減できること、対象になる事業所の条件、軽減されても将来の年金額は減らないこと', 4 from articles where slug = 'news-shakai-hoken-tekiyou-kakudai';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'news-shakai-hoken-tekiyou-kakudai' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"323c7bda3ef78e6f63641e13f7b9002e100fe82ef6650b17358d18a13e4610ba","findings":[]}'::jsonb from articles where slug = 'news-shakai-hoken-tekiyou-kakudai';
update articles set status = 'published' where slug = 'news-shakai-hoken-tekiyou-kakudai';

commit;
