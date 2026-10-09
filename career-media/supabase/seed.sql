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

## 相談先が許可を受けた事業者か確認するには

人材紹介を行う事業者は、厚生労働大臣の許可を受けて事業を行っています。許可番号は「13-ユ-000000」のような形式で、事業者のサイトなどに記載されています。

厚生労働省の「人材サービス総合サイト」では、許可番号や事業者名から職業紹介事業者を検索できます。初めて利用する相談先なら、一度確認しておくと安心です。

面談の前に、自分の希望や経験をざっくり整理しておきたい場合は、[条件整理チェック](/check)を使ってみてください。整理した結果は、そのまま面談で話す材料になります。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['mikeiken-tenshoku-hajimekata', 'donichi-yasumi-nenshu-hikaku', 'mikeiken-kenshu-kakunin']::text[], '{}'::text[], array['yaritai']::text[], array['hajimete']::text[], array['エージェント面談の前、', '何を決めておく？']::text[], null, true, '[{"q":"人材紹介会社に相談すると、お金はかかりますか？","a":"職業安定法にもとづく有料職業紹介事業では、原則として求職者から手数料を受け取ることはできず、紹介手数料は採用した企業が支払うしくみです。一部の職業では例外もあるため、気になる場合は相談先に確認しましょう。"},{"q":"面談を受けたら、必ず応募しないといけませんか？","a":"面談を受けることと応募することは別です。紹介された求人に応募するかどうかは自分で決められます。合わないと感じた求人は、理由を添えて断って構いません。"},{"q":"相談先が許可を受けた事業者かどうかは、どうやって確かめられますか？","a":"厚生労働省の「人材サービス総合サイト」で、職業紹介事業の許可番号や事業者名から検索できます。"}]'::jsonb, null, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'agent-mendan-mae' and c.slug = 'junbi' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'agent-mendan-mae' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業安定法', 'e-Gov法令検索（デジタル庁）', 'https://laws.e-gov.go.jp/law/322AC0000000141', '2026-10-06'::date, '有料職業紹介事業の手数料に関する規定', 0 from articles where slug = 'agent-mendan-mae';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '人材サービス総合サイト（職業紹介事業所検索）', '厚生労働省', 'https://jinzai.hellowork.mhlw.go.jp/JinzaiWeb/GICB101010.do?action=transition&screenId=GICB101010&params=1', '2026-10-06'::date, '職業紹介事業者の許可番号の確認方法', 1 from articles where slug = 'agent-mendan-mae';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'agent-mendan-mae' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"49e4af0f089afa580210b57076381d1fbeb3b1b58d0d730dd6ea40b52c3ebf6e","findings":[]}'::jsonb from articles where slug = 'agent-mendan-mae';
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

利用規約の確認は、厚生労働省の求職者向けリーフレットでもすすめられています。分からない言葉があれば、登録前にそのまま質問して大丈夫です。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['agent-mendan-mae', 'shigoto-sagashikata', 'mensetsu-junbi-mikeiken']::text[], '{}'::text[], array['yaritai', 'seishain']::text[], array['hajimete', 'freeter']::text[], array['エージェントに', '何を相談する？']::text[], null, false, '[{"q":"やりたい仕事が決まっていなくても、相談していいですか？","a":"大丈夫です。これまでの経験と、今の働き方で変えたいことを伝えると、考えられる職種や求人を一緒に整理しやすくなります。"},{"q":"紹介された求人を断るときは、どう伝えればいいですか？","a":"「通勤に1時間半かかるので見送ります。片道1時間以内だとありがたいです」のように、断る理由と、次に希望する条件をセットで伝えると、次に紹介される求人が希望に近づきやすくなります。"},{"q":"登録する前に、確認しておくことはありますか？","a":"厚生労働省のリーフレットでは、登録するときに利用規約をよく読み、違約金の有無や、自分の個人情報が誰に・いつまで提供されるかを確認するよう案内されています。許可を受けた事業者かどうかは、厚生労働省の「人材サービス総合サイト」で調べられます。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"既存の agent-mendan-mae（面談前に決めること）と重ならないよう、面談の場で「何を・どう頼むか」に絞り、場面ごとの相談内容と、そのまま使える相談の言い方の例を中心にする。実在の事業者名は出さない","quotes":[{"source_url":"https://jsite.mhlw.go.jp/ishikawa-roudoukyoku/hourei_seido_tetsuzuki/roudousha_haken/syoukai_gaiyou.html","text":"有料職業紹介事業は手数料または報酬を受けて行う職業紹介事業で、厚生労働大臣の許可が必要。求職者からの手数料徴収は原則禁止で、芸能家・モデル、年収700万円超の経営管理者・科学技術者・熟練技能者などに例外がある","used_in":"登録・相談の前に、ここだけ確認"},{"source_url":"https://www.mhlw.go.jp/content/000851397.pdf","text":"求職者向けリーフレット。人材サービス総合サイト（厚生労働省運営）で、許可を受けた職業紹介事業者かどうか、手数料や就職実績などの情報を確認できると案内。求職登録時には利用規約をよく確認し、特に違約金や自分の個人情報の取り扱い（誰に提供されるか、いつまで提供されるかなど）を確認する","used_in":"登録・相談の前に、ここだけ確認／FAQ"},{"source_url":"https://jinzai.hellowork.mhlw.go.jp/JinzaiWeb","text":"労働者派遣事業・職業紹介事業の許可・届出事業所を検索できる厚生労働省のサイト","used_in":"登録・相談の前に、ここだけ確認"},{"source_url":"https://www.mhlw.go.jp/content/001114167.pdf","text":"2024年4月から、募集広告や職業紹介を受ける際に明示される労働条件に、従事すべき業務の変更の範囲、就業場所の変更の範囲、有期労働契約を更新する場合の基準が追加","used_in":"聞きにくい条件ほど、先に聞く"}],"not_used":["転職エージェントの利用者数や、利用した場合の内定率などの統計は使っていない","サポートの範囲は事業者によって違うため、一般的な例として書き、最初に確認するようすすめた"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'agent-soudan-nani' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業紹介事業とは', '石川労働局', 'https://jsite.mhlw.go.jp/ishikawa-roudoukyoku/hourei_seido_tetsuzuki/roudousha_haken/syoukai_gaiyou.html', '2026-10-06'::date, '有料職業紹介事業には厚生労働大臣の許可が必要なこと、求職者からの手数料の徴収は原則禁止で、芸能家・モデルなど一部の職業に例外があること', 0 from articles where slug = 'agent-soudan-nani';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業紹介事業者を利用するときに知っておきたいこと（求職者の皆さまへ）', '厚生労働省・都道府県労働局', 'https://www.mhlw.go.jp/content/000851397.pdf', '2026-10-06'::date, '人材サービス総合サイトで許可を受けた職業紹介事業者かどうかや、手数料・就職実績などの情報を確認できること、登録時に利用規約で違約金や個人情報の取り扱いを確認すること', 1 from articles where slug = 'agent-soudan-nani';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '人材サービス総合サイト', '厚生労働省', 'https://jinzai.hellowork.mhlw.go.jp/JinzaiWeb', '2026-10-06'::date, '許可を受けた職業紹介事業者を検索できるサイトであること', 2 from articles where slug = 'agent-soudan-nani';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '企業から受ける労働条件明示のルールが変わります！（求職者向けリーフレット）', '厚生労働省', 'https://www.mhlw.go.jp/content/001114167.pdf', '2026-10-06'::date, '2024年4月から、募集広告や職業紹介の際に明示される労働条件に、業務・就業場所の変更の範囲などが追加されたこと', 3 from articles where slug = 'agent-soudan-nani';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'agent-soudan-nani' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"2ec607fbc5047bca2a9a3ff7afd991656c42768974f1965e9e7b795ce02a2272","findings":[]}'::jsonb from articles where slug = 'agent-soudan-nani';
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
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"7187eb930615001345edb40a897c6c9cc489626b34ec2a878fb52bef84738f5e","findings":[]}'::jsonb from articles where slug = 'ai-shigoto-mikeiken';
update articles set status = 'published' where slug = 'ai-shigoto-mikeiken';

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

## 早く辞めることが気になったら

第二新卒の転職では、「すぐ辞めたと思われないか」が気になる人も多いと思います。面接では、辞める理由を前の会社への不満だけで終わらせず、**次の仕事で何をしたいか**につなげて話すのがポイントです。

> 話し方の例：入社して2年、店舗で接客を担当しました。お客さまの問い合わせに対応するうちに、一人ひとりの困りごとにじっくり向き合う仕事がしたいと考えるようになり、カスタマーサポートを志望しています。

経歴の整理のしかたは[転職回数が気になるときに整理したいこと](/articles/tenshoku-kaisu-kininaru)も参考にしてください。卒業から3年以上たっていても、未経験から応募できる中途採用の求人はあります。年齢で迷ったときは[26歳で未経験の職種に転職するのは遅い？](/articles/26sai-mikeiken)も読んでみてください。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['26sai-mikeiken', 'agent-mendan-mae', 'tenshoku-kaisu-kininaru']::text[], '{}'::text[], array['mikeiken-shokushu']::text[], array['dainishinsotsu', 'hajimete']::text[], array['第二新卒って', '何歳まで？']::text[], null, false, '[{"q":"第二新卒は何歳までですか？","a":"何歳までと一律には決まっていません。学校を卒業しておおむね3年以内の人を指すことが多く、年齢より卒業からの年数で考えると分かりやすくなります。たとえば22歳で大学を卒業した場合、25歳前後までが目安です。応募できるかどうかは、求人ごとの応募条件で確認しましょう。"},{"q":"一度就職していても、新卒の枠に応募できますか？","a":"厚生労働省の指針では、卒業後少なくとも3年間は新卒の採用枠に応募できるよう、会社に努めることを求めています。ただし、すべての会社が受け付けているわけではなく、職歴のある人も応募できるかどうかは求人ごとに確かめる必要があります。募集要項の「既卒可」などの記載を確認してください。"},{"q":"卒業して3年以上たっていたら、もう応募できる求人はありませんか？","a":"そんなことはありません。「第二新卒歓迎」と書かれていなくても、未経験から応募できる中途採用の求人はあります。言葉の区切りにしばられず、仕事内容と応募条件で探してみてください。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「何歳まで」の答えを年齢で出さず、卒業からの年数と応募条件で考える。既存の review 記事 dainishinsotsu-tenshoku-timing（動くタイミング）とは別に、言葉の意味と使える場面・探し方に絞る","quotes":[{"source_url":"https://www.mhlw.go.jp/stf/houdou/2r9852000000wgq1.html","text":"青少年雇用機会確保指針を改正し、事業主は学校等の卒業者が新卒の採用枠に応募できるよう応募条件を設定し、少なくとも卒業後3年間は応募できるようにすることとした","used_in":"新卒の枠に、まだ応募できる？"},{"source_url":"https://jsite.mhlw.go.jp/tottori-roudoukyoku/hourei_seido_tetsuzuki/shokugyou_shoukai/22seishonen_shishin.html","text":"青少年の雇用の促進等に関する法律に基づく指針で、学校卒業見込者の採用枠について、既卒者が卒業後少なくとも3年間は応募できるように努めることとされている","used_in":"新卒の枠に、まだ応募できる？"},{"source_url":"https://jsite.mhlw.go.jp/tokyo-hellowork/kyushokusha/tokyo_shinsotsu/jobseeker.html","text":"大学・大学院・短大・高専・専修学校（専門課程）の学生と、卒業後おおむね3年以内の人が利用できる。卒業後3年以内であれば、在職中や就職後に離職した人も利用できる。卒業後3年を超える人などには、最寄りのハローワークやわかものハローワークの利用を案内している","used_in":"第二新卒の求人、どう探す？"}],"not_used":["第二新卒の採用数や求人倍率などの統計は使っていない","「第二新卒」の意味は公的な出典で確認できなかったため、一般的な使われ方として説明し、応募条件で確かめるよう書いた。「法律で年齢が決められた区分ではない」という記述は出典がないため削除","年齢の目安は卒業年齢からの計算例として示した"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'dainishinsotsu-nansai' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'dainishinsotsu-nansai' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '青少年雇用機会確保指針の改正について（報道発表）', '厚生労働省', 'https://www.mhlw.go.jp/stf/houdou/2r9852000000wgq1.html', '2026-10-06'::date, '卒業後少なくとも3年間は新卒の採用枠に応募できるようにすることを、事業主に求める指針の内容', 0 from articles where slug = 'dainishinsotsu-nansai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '青少年雇用機会確保指針について', '鳥取労働局', 'https://jsite.mhlw.go.jp/tottori-roudoukyoku/hourei_seido_tetsuzuki/shokugyou_shoukai/22seishonen_shishin.html', '2026-10-06'::date, '若者雇用促進法に基づく指針で、既卒者が卒業後少なくとも3年間は新卒の採用枠に応募できるよう努めることとされていること', 1 from articles where slug = 'dainishinsotsu-nansai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '東京新卒応援ハローワーク（求職者の方へ）', '東京労働局', 'https://jsite.mhlw.go.jp/tokyo-hellowork/kyushokusha/tokyo_shinsotsu/jobseeker.html', '2026-10-06'::date, '東京新卒応援ハローワークは大学・短大・高専・専修学校などの学生と卒業後おおむね3年以内の人が利用でき、在職中や一度就職して離職した人も利用できること。卒業後3年を超える人には近くのハローワークやわかものハローワークを案内していること', 2 from articles where slug = 'dainishinsotsu-nansai';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'dainishinsotsu-nansai' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"3ef2a847c66d793c606d41dd0e217abd2b868e00777e47640ee497cee1699f68","findings":[]}'::jsonb from articles where slug = 'dainishinsotsu-nansai';
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
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"9cf4553b404f41d04db48b99279731cf715b31580a9b495504b8a3623c2ff80f","findings":[]}'::jsonb from articles where slug = 'donichi-yasumi-shigoto';
update articles set status = 'published' where slug = 'donichi-yasumi-shigoto';

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
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"0942639fae6aeeb8cc6272ea8133f3ade7e1faa9f3a40605770906a8712ef0ec","findings":[]}'::jsonb from articles where slug = 'eigyo-cs-it-support-chigai';
update articles set status = 'published' where slug = 'eigyo-cs-it-support-chigai';

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

営業の仕事内容や入社前に確認したいことは、[職種比較ページの営業](/jobs#hojin-eigyo)でもまとめています。経験の伝え方は[接客経験は転職でどう活かせる？](/articles/sekkyaku-keiken-ikasu)を参考にしてください。

確かめたうえで「やっぱり営業は合わない」と思ったら、それも大事な判断です。人と話す経験を活かせるほかの仕事は、[営業・カスタマーサポート・ITサポートの違い](/articles/eigyo-cs-it-support-chigai)で比べられます。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['eigyo-cs-it-support-chigai', 'sekkyaku-keiken-ikasu', 'mikeiken-kenshu-kakunin']::text[], array['eigyo']::text[], array['mikeiken-shokushu', 'kyuryo']::text[], array['sekkyaku', 'hajimete']::text[], array['営業って怖い？', '中身を分けて考える。']::text[], null, false, '[{"q":"ノルマがない営業の仕事はありますか？","a":"営業は、売上や契約件数などの目標が置かれていることが多い仕事です。目標があるかどうかより、個人の目標かチームの目標か、未経験で入った人の最初の目標はどう決めるか、届かなかったときにどんなフォローがあるかを確認しておくことが大切です。"},{"q":"インセンティブの割合が高い求人は避けたほうがいいですか？","a":"一概には言えません。労働基準法第27条では、歩合給（出来高払制）で働く人についても、会社は働いた時間に応じた一定額の賃金を保障しなければならないと定められていますが、条文に具体的な金額は書かれていません。成果がなかった月でも固定給だけで生活できるかを、求人票で確認しましょう。"},{"q":"人見知りでも営業の仕事はできますか？","a":"話し上手かどうかより、相手の話を聞いて困りごとを整理する場面も多い仕事です。すでに取引のある相手をくり返し訪ねるルート営業や、問い合わせをくれた相手に案内する反響営業など、営業のやり方ごとに自分に合いそうかを考えてみましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「営業が怖い」を、ノルマ・飛び込み・電話・断られる・給料の振れ幅に分け、営業のやり方の違いと、不安ごとの確認のしかた・質問例を示す。eigyo-cs-it-support-chigai（3職種の比較）とは重ならないよう、営業の中の違いと不安の分解に絞る","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/User/SaleOccupations","text":"新規開拓営業は商品やサービスを知らない相手にも販売するため断られることが多い。ルート営業はすでに取引がある顧客を回り、信頼関係を築いて困りごとを聞き出す。反響営業は問い合わせや資料請求をくれた顧客に対する営業活動。","used_in":"営業の種類で、中身はかなり違う"},{"source_url":"https://laws.e-gov.go.jp/law/322AC0000000049","text":"第27条 出来高払制その他の請負制で使用する労働者については、使用者は、労働時間に応じ一定額の賃金の保障をしなければならない。","used_in":"不安ごとに、何を確認する？"}]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'eigyo-kowai' and c.slug = 'shokushu' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '営業の仕事', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/SaleOccupations', '2026-10-06'::date, '新規開拓営業・ルート営業・反響営業の違い（相手、断られることの多さ、信頼関係づくり）', 0 from articles where slug = 'eigyo-kowai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '労働基準法', 'e-Gov法令検索（デジタル庁）', 'https://laws.e-gov.go.jp/law/322AC0000000049', '2026-10-06'::date, '出来高払制の保障給（第27条）。条文に保障額の具体的な数字がないこと', 1 from articles where slug = 'eigyo-kowai';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'eigyo-kowai' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"1e5338758379edceb1aaaed428eb5dcc16c2903ef2c59018079d978d9c50228c","findings":[]}'::jsonb from articles where slug = 'eigyo-kowai';
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

整理したことをもとに、自分の場合はどんな選択肢がありそうかを人に相談してみるのも、遠回りに見えて近道になることがあります。', 'review', true, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['mikeiken-tenshoku-hajimekata', 'sekkyaku-keiken-ikasu', 'agent-mendan-mae']::text[], '{}'::text[], array['seishain', 'mensetsu']::text[], array['freeter', 'seishain-keiken-sukunai']::text[], array['フリーターから正社員、', '最初に何を確認する？']::text[], null, false, '[{"q":"アルバイト経験しかないと、正社員の書類選考に通らないのでしょうか？","a":"アルバイト経験しかないことだけで判断されるわけではありません。未経験者を対象にした求人では、これまでの経験の中身や、働くことへの姿勢、入社後に学ぶ意欲などもあわせて見られます。担当していた業務を具体的に書くことが大切です。"},{"q":"空白期間があるのですが、どう説明すればいいですか？","a":"空白期間に何をしていたのかを、事実として簡潔に伝えましょう。資格の勉強や家庭の事情など理由はさまざまです。そのうえで「今は働く準備ができていること」「これから何をしたいか」を添えると、前向きに伝わりやすくなります。"}]'::jsonb, null, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'freeter-seishain-hajimeni' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'freeter-seishain-hajimeni' and c.slug = 'keiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年4月から労働条件明示のルールが変わります', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_32105.html', '2026-10-06'::date, '契約期間・更新上限など、雇用形態にかかわる労働条件の明示', 0 from articles where slug = 'freeter-seishain-hajimeni';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ハローワークインターネットサービス', '厚生労働省', 'https://www.hellowork.mhlw.go.jp/', '2026-10-06'::date, '公的な求人検索・職業相談の窓口の紹介', 1 from articles where slug = 'freeter-seishain-hajimeni';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '人材サービス総合サイト（職業紹介事業所検索）', '厚生労働省', 'https://jinzai.hellowork.mhlw.go.jp/JinzaiWeb/GICB101010.do?action=transition&screenId=GICB101010&params=1', '2026-10-06'::date, '民間の職業紹介事業者の許可の確認方法', 2 from articles where slug = 'freeter-seishain-hajimeni';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'freeter-seishain-hajimeni' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"50395607671c017630fb4e19aa0ca7d5bf5770d3a10212ecdc044fc7c2662627","findings":[]}'::jsonb from articles where slug = 'freeter-seishain-hajimeni';
update articles set status = 'published' where slug = 'freeter-seishain-hajimeni';

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

アルバイトから正社員を目指すときの考え方は[フリーターから正社員を目指すとき、最初に確認したいこと](/articles/freeter-seishain-hajimeni)も参考になります。正社員を目指す人向けの記事は[正社員になりたい](/concerns/seishain)にまとめています。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['freeter-seishain-hajimeni', 'donichi-yasumi-nenshu-hikaku', 'mikeiken-tenshoku-hajimekata']::text[], '{}'::text[], array['seishain', 'kyuryo']::text[], array['haken']::text[], array['派遣から正社員、', '何から考える？']::text[], null, false, '[{"q":"紹介予定派遣とは何ですか？","a":"派遣先の会社に直接雇われることを前提に、まず派遣社員として働く方法です。派遣で働く期間は6か月までで、その間に会社と本人の双方が、仕事や職場が合うかを確かめます。双方が合意すれば直接雇用になります。直接雇用後が正社員か契約社員かは求人によって違うので、始める前に確認しましょう。"},{"q":"同じ派遣先で3年働くとどうなりますか？","a":"同じ派遣先の同じ部署（組織単位）で、同じ人が派遣として働ける期間は、原則として3年までです。3年続けて働く見込みがある人には、派遣会社が、派遣先への直接雇用の依頼、新しい派遣先の紹介、派遣会社での期間の定めのない雇用などの措置をとることになっています。"},{"q":"派遣の経験は、職務経歴書にどう書けばいいですか？","a":"派遣元（派遣会社）と派遣先、働いた期間、担当した仕事を分けて書くと伝わりやすくなります。派遣先の会社名を書いてよいか迷うときは、「食品メーカーの営業部」のように業種と部署で書く方法もあります。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"派遣から正社員への道を3つに分け、期間のルールと雇用安定措置を「自分から相談できる節目」として示す。給料は時給と月給を年額にそろえて比べる","quotes":[{"source_url":"https://www.mhlw.go.jp/file/06-Seisakujouhou-11650000-Shokugyouanteikyokuhakenyukiroudoutaisakubu/0000097169.pdf","text":"同一の派遣労働者を派遣先の事業所における同一の組織単位に対し派遣できる期間は3年が限度。同一の組織単位に継続して3年間派遣される見込みがある人には、派遣元から派遣先への直接雇用の依頼、新たな派遣先の提供、派遣元での無期雇用、その他安定した雇用の継続を図るための措置が講じられる","used_in":"同じ職場で3年たつとどうなる？"},{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000077386.html","text":"平成27年労働者派遣法改正法は2015年9月11日成立、9月30日施行。派遣労働者の雇用の安定とキャリアアップを図る改正で、派遣労働者向けのQ&Aなどを掲載","used_in":"同じ職場で3年たつとどうなる？"},{"source_url":"https://www.mhlw.go.jp/content/001370982.pdf","text":"紹介予定派遣は、派遣元が派遣の開始前または開始後に派遣労働者と派遣先に職業紹介を行う（予定する）もの。同一の派遣労働者について派遣期間は6か月以内。派遣先は面接・履歴書の受付など派遣労働者を特定する行為を行える","used_in":"派遣から正社員になる道は？"},{"source_url":"https://www.mhlw.go.jp/mobile/m/job/040104.html","text":"紹介予定派遣以外の派遣では、派遣先が派遣労働者を特定することを目的とする事前面接などは原則禁止","used_in":"派遣から正社員になる道は？"},{"source_url":"https://www.rodo.co.jp/faq/193836/","text":"派遣先は、同一の事業所等で1年以上継続して受け入れている派遣労働者がいる場合、その事業所等で通常の労働者（正社員）を募集するときは、募集情報をその派遣労働者に周知しなければならない（派遣法40条の5）","used_in":"派遣から正社員になる道は？"}],"not_used":["派遣社員の平均時給や正社員の平均年収などの統計は使っていない。給料の比較表は仮の数字","職務経歴書の書き出し例の派遣元は「〇〇株式会社」とし、実在の会社名は使っていない","content/001370982.pdf は紹介予定派遣の検索で繰り返し結果に出たが、正式な題名は確認できていないため、題名は内容を表す仮のものにした"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'haken-seishain' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '派遣で働く皆さまへ～平成27年労働者派遣法改正法が成立しました～', '厚生労働省', 'https://www.mhlw.go.jp/file/06-Seisakujouhou-11650000-Shokugyouanteikyokuhakenyukiroudoutaisakubu/0000097169.pdf', '2026-10-06'::date, '同じ組織単位で派遣として働ける期間は原則3年までであること、3年見込みの人への雇用安定措置（直接雇用の依頼・新たな派遣先の提供・派遣元での無期雇用など）', 0 from articles where slug = 'haken-seishain';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '平成27年労働者派遣法改正法の概要', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000077386.html', '2026-10-06'::date, '派遣で働ける期間のルールが、2015年9月30日施行の改正労働者派遣法で決められたこと', 1 from articles where slug = 'haken-seishain';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '紹介予定派遣に関する資料（PDF）', '厚生労働省', 'https://www.mhlw.go.jp/content/001370982.pdf', '2026-10-06'::date, '紹介予定派遣の派遣期間は同じ派遣労働者について6か月以内であること、派遣先による面接・履歴書の受付などが認められていること', 2 from articles where slug = 'haken-seishain';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '事前面接などは原則禁止されています', '厚生労働省', 'https://www.mhlw.go.jp/mobile/m/job/040104.html', '2026-10-06'::date, '通常の派遣では、派遣先が派遣労働者を特定する目的の事前面接などは原則禁止であること', 3 from articles where slug = 'haken-seishain';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '募集情報提供とは？ 派遣先へ求められる措置', '労働新聞社', 'https://www.rodo.co.jp/faq/193836/', '2026-10-06'::date, '派遣先は、同じ事業所で1年以上続けて働いている派遣労働者に、正社員の募集情報を知らせる義務があること（労働者派遣法第40条の5）', 4 from articles where slug = 'haken-seishain';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'haken-seishain' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"c2f3e6d092372e9a3afa93bf9ee1f59d4066f8c92b46d636b323fe9c9a4a8ce4","findings":[]}'::jsonb from articles where slug = 'haken-seishain';
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
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"b49ea41b837338837ac66d2334df4d624e5a45f03be8e3ac7b729ada44337a9b","findings":[]}'::jsonb from articles where slug = 'hanbai-seishain';
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

最後の質問は、未経験の人にとって特に大事です。研修の確認のしかたは[未経験求人の「研修あり」で確認すべきこと](/articles/mikeiken-kenshu-kakunin)にまとめています。どの事務が自分に合いそうかを決めてから求人を見ると、比べやすくなります。', 'review', true, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['pc-nigate-jimu', 'sekkyaku-keiken-ikasu', 'mikeiken-kenshu-kakunin']::text[], array['jimu']::text[], array['office', 'mikeiken-shokushu']::text[], array['sekkyaku', 'pc-mikeiken']::text[], array['未経験から事務職へ。', '最初に知っておきたいこと']::text[], null, false, '[{"q":"事務職は、資格がないと応募できませんか？","a":"求人によって違います。応募条件の欄に資格が書かれていなければ、資格がなくても応募できます。資格の有無よりも、「表計算ソフトで入力と合計の計算ができる」のように、できる操作を具体的に伝えられるほうが判断材料になりやすいです。"},{"q":"一般事務と営業事務、未経験ならどちらがいいですか？","a":"どちらが向いているかは人によります。一般事務は書類やデータの管理、電話の取り次ぎなど社内の仕事を支えることが中心です。営業事務は営業担当の依頼で見積書を作ったり、取引先からの電話やメールに応えたりと、社外とのやりとりも入ってきます。人と話すのが苦にならないなら、営業事務も候補に入れてみてください。"},{"q":"事務職は、あまり人と話さない仕事ですか？","a":"パソコン作業が中心ですが、電話の取り次ぎや来客への対応、社内からの依頼の受け付けなど、人とのやりとりもあります。どのくらいの割合かは職場によって違うので、面接で「1日のうち電話や来客対応はどのくらいありますか」と聞いてみましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「事務＝座ってPC作業」というイメージを、種類ごとの中身と電話・来客対応の実際に分けて整理する","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/428","text":"一般事務は特定の分野に限らず定型的な事務を行う。書類の作成・整理、メール対応、伝票の作成・管理、各種台帳の管理、データ入力、郵便物の発送・仕分け、電話の取り次ぎ、来客の対応やお茶出しの補助など。書類作成や集計にはパソコンを使い、コピー機・FAXなどの事務機器もよく使う。","used_in":"事務職って、どんな仕事？ / パソコンはどのくらい使える必要がある？ / 電話や来客の対応もある？"},{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/431","text":"営業事務は営業担当者の指示で資料や見積書を作成し、契約・売上・入金の管理、顧客からの電話・メールでの問い合わせ対応、見積書・納品書の作成などを行う。別名に営業アシスタント、受発注管理事務員。","used_in":"事務職って、どんな仕事？"},{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/430?media=4876","text":"経理事務は会計・財務管理のソフトやシステムを使い、入出金伝票や振替伝票の作成、現金出納帳・総勘定元帳への記録を行う。月末には勘定科目を集計して残高を確定し、実際の預金残高と照合する。","used_in":"事務職って、どんな仕事？"},{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/427","text":"受付事務（別名 案内係・会社受付係）は来訪者の用件を確認して担当部署に取り次ぎ、会議室などへ案内する。来訪者の記録や電話の取り次ぎの補助も行う。","used_in":"事務職って、どんな仕事？"},{"source_url":"https://shigoto.mhlw.go.jp/","text":"job tag は厚生労働省の職業情報提供サイトで、500以上の職業について仕事内容や必要なスキルなどを調べられる。","used_in":"未経験でも応募できる？"}]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'jimu-mikeiken-mae' and c.slug = 'shokushu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'jimu-mikeiken-mae' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '一般事務 - 職業詳細（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/428', '2026-10-06'::date, '一般事務の仕事内容（書類の作成・整理、伝票、データ入力、郵便物の仕分け、電話の取り次ぎ、来客対応やお茶出しの補助など）と使う機器（パソコン・コピー機・FAXなど）', 0 from articles where slug = 'jimu-mikeiken-mae';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '営業事務 - 職業詳細（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/431', '2026-10-06'::date, '営業事務の仕事内容（見積書・納品書の作成、契約・売上・入金の管理、取引先からの電話・メールでの問い合わせ対応）', 1 from articles where slug = 'jimu-mikeiken-mae';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '経理事務 - 職業詳細（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/430?media=4876', '2026-10-06'::date, '経理事務の仕事内容（入出金の伝票づくり、帳簿への記録、月末の集計、会計ソフトやシステムの利用）', 2 from articles where slug = 'jimu-mikeiken-mae';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '受付事務 - 職業詳細（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/427', '2026-10-06'::date, '受付事務の仕事内容（来訪者の用件を確認して担当者に取り次ぐ、案内する）', 3 from articles where slug = 'jimu-mikeiken-mae';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業情報提供サイト（job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/', '2026-10-06'::date, 'job tag で500以上の職業の仕事内容を調べられることの紹介', 4 from articles where slug = 'jimu-mikeiken-mae';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'jimu-mikeiken-mae' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"a5d1f2c3feb21e3a2f28b31f7e81c71339d54bde02099f88b8ef2d5e2ff84766","findings":[]}'::jsonb from articles where slug = 'jimu-mikeiken-mae';
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
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"3356cd6762455237137b256895b5356ca22040f3d76f06f1c089b74ad0924ef6","findings":[]}'::jsonb from articles where slug = 'jinji-saiyo-mikeiken';
update articles set status = 'published' where slug = 'jinji-saiyo-mikeiken';

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

「未経験歓迎」は、その職種の経験がない人の応募を受け付けているという意味で使われることが多い表現です。ただし、入社後の研修の内容や、求められる基本的なスキルは求人ごとに違います。', 'draft', false, null, '2026-10-06'::timestamptz, null, null, null, null, null, '{}'::text[], '{}'::text[], '{}'::text[], '{}'::text[], '{}'::text[], null, false, '[]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","brief":"求人票の定型表現の読み方。出典候補を調査中。"}'::jsonb) on conflict (slug) do nothing;
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

## 答えなくていい質問もある

厚生労働省は、採用選考は応募者の適性・能力だけを基準に行うべきだとしています。そのため、**本籍・出生地、家族の職業や収入、住まいの状況、宗教、支持政党**など、適性や能力に関係のないことを面接で尋ねるのは、就職差別につながるおそれがあるとして、企業に配慮を求めています。

こうした質問に、無理に答える必要はありません。気になる質問をされたときは、ハローワーク（公共職業安定所）や都道府県労働局に相談できます。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['shiboudouki-mikeiken', 'mikeiken-kenshu-kakunin', 'shokumu-keirekisho-arubaito']::text[], '{}'::text[], array['mensetsu', 'mikeiken-shokushu']::text[], array['hajimete', 'seishain-keiken-sukunai']::text[], array['面接が不安。', '何を準備する？']::text[], null, false, '[{"q":"面接で家族のことを聞かれたら、答えないといけませんか？","a":"厚生労働省は、家族の職業や収入など、本人の適性・能力と関係のない事項を面接で尋ねることは就職差別につながるおそれがあるとして、企業に配慮を求めています。答えにくい質問に無理に答える必要はありません。気になる質問をされたときは、ハローワークや都道府県労働局に相談できます。"},{"q":"逆質問で「特にありません」と答えるのはだめですか？","a":"だめというわけではありませんが、入社後の働き方を知るよい機会です。研修のあとの流れや、未経験で入社した人が最初に任される仕事など、自分が判断するために知りたいことを1〜2個用意しておくと安心です。"},{"q":"未経験であることは、どう伝えればいいですか？","a":"隠す必要はありません。聞かれたら未経験であることを認めたうえで、近い経験、今準備していること、入社後に取り組みたいことの順につなげて話すと伝わりやすくなります。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"未経験職種の面接で聞かれやすい4つの質問ごとに準備のしかたと答え方の例を示し、逆質問・オンライン面接・答えなくていい質問（公正な採用選考）までを一つの準備リストとしてまとめる","quotes":[{"source_url":"https://kouseisaiyou.mhlw.go.jp/basic.html","text":"公正な採用選考の基本は、応募者の基本的人権を尊重すること、応募者の適性・能力のみを基準として行うこと","used_in":"答えなくていい質問もある"},{"source_url":"https://kouseisaiyou.mhlw.go.jp/consider.html","text":"就職差別につながるおそれがある14事項。本人に責任のない事項（本籍・出生地、家族、住宅状況、生活環境・家庭環境）と、本来自由であるべき事項（宗教、支持政党、人生観・生活信条、思想、労働組合・学生運動など）を応募書類や面接で把握しない","used_in":"答えなくていい質問もある／FAQ"},{"source_url":"https://kouseisaiyou.mhlw.go.jp/jobseekers.html","text":"面接などで本人の適性・能力以外の事項を把握された事例を紹介し、不適切な質問があった場合は最寄りのハローワークや都道府県労働局に相談できると案内","used_in":"答えなくていい質問もある／FAQ"},{"source_url":"https://www.hellowork.mhlw.go.jp/doc/oubosyorui_pamphlet_202406.pdf","text":"面接では提出した履歴書（職務経歴書を含む）の記載内容に基づいて質問されることが多いので、完成した書類をコピーしておき、面接前に確認する","used_in":"何を聞かれる？まずは4つを準備"}],"not_used":["面接でよく聞かれる質問のランキングや、面接の通過率などの統計は使っていない","オンライン面接の確認事項は一般的な準備として書き、公的な基準としては扱っていない"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'mensetsu-junbi-mikeiken' and c.slug = 'shorui-mensetsu' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '公正な採用選考の基本', '厚生労働省', 'https://kouseisaiyou.mhlw.go.jp/basic.html', '2026-10-06'::date, '採用選考は応募者の適性・能力のみを基準として行うという考え方', 0 from articles where slug = 'mensetsu-junbi-mikeiken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '採用選考時に配慮すべき事項', '厚生労働省', 'https://kouseisaiyou.mhlw.go.jp/consider.html', '2026-10-06'::date, '本籍・出生地、家族、住宅状況、宗教、支持政党などを面接で尋ねることが就職差別につながるおそれがあること', 1 from articles where slug = 'mensetsu-junbi-mikeiken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '求職者の皆様へ', '厚生労働省', 'https://kouseisaiyou.mhlw.go.jp/jobseekers.html', '2026-10-06'::date, '不適切な質問をされたときに、ハローワークや都道府県労働局に相談できること', 2 from articles where slug = 'mensetsu-junbi-mikeiken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '応募書類（パンフレット）', 'ハローワークインターネットサービス（厚生労働省）', 'https://www.hellowork.mhlw.go.jp/doc/oubosyorui_pamphlet_202406.pdf', '2026-10-06'::date, '面接では提出した履歴書・職務経歴書の内容をもとに質問されることが多いので、コピーを取って面接前に確認すること', 3 from articles where slug = 'mensetsu-junbi-mikeiken';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'mensetsu-junbi-mikeiken' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"b0bb1c5946484238e6098e22740a437a99cfc137b169ec3c711e3f9c97ec4997","findings":[]}'::jsonb from articles where slug = 'mensetsu-junbi-mikeiken';
update articles set status = 'published' where slug = 'mensetsu-junbi-mikeiken';

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

自分に合うかを考えるときは、スマホやパソコンで困ったときに自分で調べて直した経験を思い出してみてください。調べることが苦にならないかどうかは、ITの仕事との相性を考えるヒントになります。ほかの職種との違いは[営業・カスタマーサポート・ITサポートの違い](/articles/eigyo-cs-it-support-chigai)で比べられます。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['eigyo-cs-it-support-chigai', 'mikeiken-kenshu-kakunin', 'pc-nigate-jimu']::text[], array['it-support']::text[], array['mikeiken-shokushu']::text[], array['pc-mikeiken', 'hajimete']::text[], array['未経験のIT、', '最初はどんな仕事？']::text[], null, false, '[{"q":"ITパスポートを持っていないと、ITの仕事に応募できませんか？","a":"応募条件に書かれていなければ、資格がなくても応募できます。ITパスポート試験は受験資格のない国家試験なので、ITの基礎を学ぶときの目標として使うのは一つの方法です。"},{"q":"夜勤がある仕事は避けたほうがいいですか？","a":"一概には言えません。システムを夜も止められない職場では、交替制のシフトや夜勤がある場合があります。夜勤の回数、手当、休みの取り方を確認して、自分の生活に合うかどうかで判断しましょう。"},{"q":"パソコンが得意じゃなくても、ITの仕事を目指せますか？","a":"入社後に覚えることは多いので、研修の内容や、一人で対応するようになるまでの期間を確認しておくことが大切です。スマホやパソコンで困ったときに自分で調べる習慣をつけておくと、入社後の負担が軽くなります。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「IT＝プログラミング」の思い込みをほどき、未経験の入口になりやすい支える仕事と、入社前の確認点（研修・勤務時間・働く場所・その後）を示す。資格は必須扱いしない","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/User/ITRelatedWorkByProcess","text":"IT関連の仕事を工程別（企画・営業・設計や構築・運用や保守など）に分けて紹介。運用・保守には「運用・管理（IT）」（サーバーや情報システムがトラブルや不具合で止まらず安定して動き続けるよう運用・管理する）と「ヘルプデスク（IT）」が含まれる。","used_in":"「IT＝プログラミング」だけじゃない？／入口になりやすいのは、どんな仕事？"},{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/540","text":"ソフトウェアの誤り（バグ）を見つける仕事。見つかったバグを一覧表にまとめて開発担当者に連絡する。QAテスターなどの名称もある。","used_in":"入口になりやすいのは、どんな仕事？"},{"source_url":"https://www.ipa.go.jp/shiken/kubun/ip.html","text":"ITパスポート試験はIPAが実施する国家試験で、職業人が共通に備えておくべきITに関する基礎的な知識を対象とする。CBT方式で随時実施。受験資格の制限はない。","used_in":"ITパスポートは取ったほうがいい？"},{"source_url":"https://www.mhlw.go.jp/stf/newpage_32105.html","text":"2024年4月1日から職業安定法施行規則の改正により、求職者に明示する労働条件に就業場所・業務の変更の範囲などが追加された。","used_in":"入社前に確認したいことは？"}]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'mikeiken-it-hajimari' and c.slug = 'shokushu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'mikeiken-it-hajimari' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'IT関連の仕事（工程別）－知らない職業を探してみよう－', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/ITRelatedWorkByProcess', '2026-10-06'::date, 'ITの仕事を工程別に分けていること、運用・保守の工程にヘルプデスク（IT）と運用・管理（IT）があること、運用・管理（IT）とヘルプデスク（IT）の仕事内容（問い合わせに電話・メール・訪問で対応する等）', 0 from articles where slug = 'mikeiken-it-hajimari';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'デバッグ作業 - 職業詳細（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/540', '2026-10-06'::date, 'テスト（デバッグ）の仕事内容（不具合を見つけて一覧にし、開発担当者に伝える）', 1 from articles where slug = 'mikeiken-it-hajimari';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ITパスポート試験', '独立行政法人情報処理推進機構（IPA）', 'https://www.ipa.go.jp/shiken/kubun/ip.html', '2026-10-06'::date, 'ITパスポート試験がIPAの実施する国家試験であること、ITの基礎知識を問うこと、CBT方式で随時実施されること', 2 from articles where slug = 'mikeiken-it-hajimari';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年4月から労働条件明示のルールが変わります', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_32105.html', '2026-10-06'::date, '2024年4月から、募集時などに就業場所・業務の変更の範囲が明示されるようになったこと', 3 from articles where slug = 'mikeiken-it-hajimari';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'mikeiken-it-hajimari' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"227d29816189c2def2614ecd764bb9008c64363220101e943b499c52514ae7c5","findings":[]}'::jsonb from articles where slug = 'mikeiken-it-hajimari';
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

整理したメモは完成品である必要はありません。調べたり人と話したりする中で、何度書き直しても大丈夫です。大切なのは、求人を見る前に「自分にとって何が大事か」の手がかりを持っておくことです。', 'review', true, '2026-10-06'::timestamptz, '2026-10-07'::timestamptz, '2026-10-07'::timestamptz, null, '2026-10-06'::timestamptz, '未経験転職は何から始める？最初に整理したい5つのこと', '未経験転職の最初の一歩は、求人探しより「整理」です。転職理由・経験・希望条件・比べる職種・スケジュールの5つを、書き出し例つきで解説します。', array['agent-mendan-mae', 'donichi-yasumi-nenshu-hikaku', 'eigyo-cs-it-support-chigai']::text[], '{}'::text[], array['mikeiken-shokushu', 'yaritai']::text[], array['hajimete']::text[], array['未経験の転職、', '何から始める？']::text[], null, false, '[{"q":"自分には強みと言えるような経験がありません。それでも整理する意味はありますか？","a":"あります。整理の目的は「すごい経験」を探すことではなく、どんな作業をどのくらい続けてきたかを事実として並べることです。アルバイトのシフト管理や新人への説明なども、書き出してみると仕事選びの材料になります。"},{"q":"転職したい理由が不満ばかりです。ネガティブでも大丈夫でしょうか？","a":"最初は不満のままで構いません。そのうえで「その不満がなくなったら、次はどうなっていたいか」に言い換えると、求人を比べるときの基準として使えるようになります。"},{"q":"整理にはどれくらい時間をかければいいですか？","a":"目安は1〜2週間です。完璧に仕上げる必要はなく、5つの項目に一度メモを書けたら、職種を調べたり相談したりしながら書き直していくほうが進めやすくなります。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"求人探しの前に、比較の基準を作る"}'::jsonb) on conflict (slug) do nothing;
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

とはいえ、承諾後の辞退は、相手の会社に大きな迷惑がかかります。そうならないためにも、**承諾の前に条件を確かめ、迷いがあれば返事の期限を相談する**ことが大切です。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-07'::timestamptz, '内定承諾の前に確認すること｜労働条件通知書の見方と返事の期限', '内定をもらったら、承諾の前に労働条件を書面で確認しましょう。労働条件通知書で見る項目、2024年4月からの明示ルール（変更の範囲・更新上限）、返事の期限の相談のしかた、複数内定の考え方、承諾後の辞退について紹介します。', array['nenshu-dake-erabanai', 'donichi-yasumi-nenshu-hikaku', 'tedori-20man-hikaku']::text[], '{}'::text[], array['kyuryo']::text[], array['hajimete']::text[], array['内定が出た！', '承諾の前に見ること']::text[], null, false, '[{"q":"労働条件通知書をもらえないまま、承諾を求められています。どうすればいいですか？","a":"労働契約を結ぶときには、会社は契約期間、就業の場所と業務、労働時間、賃金、退職に関することなどを、原則として書面で明示しなければならないとされています。「承諾の前に、労働条件を書面で確認させてください」とお願いしてみましょう。ハローワークの求人で応募した場合は、ハローワークの窓口にも相談できます。"},{"q":"内定の返事は、いつまでに必要ですか？","a":"決まった期限があるわけではなく、会社ごとに違います。内定の連絡のときに期限を確認し、間に合いそうにないときは、理由と希望の日付を添えて早めに相談しましょう。延ばせるかどうかは会社の判断なので、希望どおりにならないこともあります。"},{"q":"内定を承諾したあとに辞退すると、違法になりますか？","a":"内定を承諾したあとでも、辞退すること自体は可能だと考えられています。厚生労働省の新卒応援ハローワークのページでも、内定承諾書を出したあとでも、民法第627条に準じて2週間以上前に申し入れることは法的に問題がないと考えられる、と説明されています。ただし、会社に迷惑がかかるので、決めたらすぐに電話で連絡しましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"内定の喜びで勢いのまま承諾せず、労働条件を書面で確かめてから返事をする。2024年4月の明示ルールの追加点を、読者が通知書のどこを見ればいいかに置き換える。返事の期限・複数内定・承諾後の辞退は、断定せず相談のしかたを書く","quotes":[{"source_url":"https://www.mhlw.go.jp/bunya/roudoukijun/faq_kijyunhou_4.html","text":"労働基準法第15条第1項、施行規則第5条第1項。(1)労働契約の期間、(2)有期契約を更新する場合の基準、(3)就業の場所及び従事すべき業務、(4)始業・終業の時刻、所定労働時間を超える労働の有無、休憩時間、休日、休暇など、(5)賃金の決定・計算・支払いの方法、締切り・支払の時期（昇給を除く）、(6)退職に関する事項（解雇の事由を含む）は書面の交付により明示。労働者が希望した場合は、FAXやWebメールサービス等で、出力して書面を作成できるものに限り明示できる","used_in":"労働条件通知書で見るところ"},{"source_url":"https://www.mhlw.go.jp/stf/newpage_32105.html","text":"2024年4月1日から、労働契約の締結・更新時に明示すべき労働条件に、就業場所・業務の変更の範囲などが加わった","used_in":"2024年4月から加わった項目"},{"source_url":"https://muki.mhlw.go.jp/rule.html","text":"全ての労働契約の締結と有期労働契約の更新のタイミングごとに、雇い入れ直後の就業場所・業務の内容に加え、変更の範囲の明示が必要。有期労働契約では更新上限の有無と内容、無期転換申込権が発生する更新ごとに無期転換申込機会と無期転換後の労働条件の明示が必要","used_in":"2024年4月から加わった項目"},{"source_url":"https://www.check-roudou.mhlw.go.jp/qa/roudousya/koyou/q5.html","text":"求人票や求人広告の条件が面接で説明された条件と異なる場合、まず異なる理由を確認する。ハローワークの求人票の場合は、ハローワークの窓口またはハローワーク求人ホットラインに申し出ると、ハローワークが事実確認と必要な指導などを行う","used_in":"求人票と違うところがあったら"},{"source_url":"https://jsite.mhlw.go.jp/nisizinkarasumaoike-kyoto-plaza/home/shinsotsu/kyu-shoku/kosokoso_00003.html","text":"内定承諾書を提出した後でも、憲法22条の職業選択の自由と民法第627条に準じて2週間以上前に解約（内定辞退）の申し入れをすることは法的に問題がないと考えられる。ただし特殊な備品を購入していた場合などは損害賠償を請求される可能性がある。辞退する場合は早急に連絡を入れることが重要","used_in":"承諾したあとに辞退したくなったら"},{"source_url":"https://laws.e-gov.go.jp/law/129AC0000000089","text":"第六百二十七条第一項「当事者が雇用の期間を定めなかったときは、各当事者は、いつでも解約の申入れをすることができる。この場合において、雇用は、解約の申入れの日から二週間を経過することによって終了する。」（e-Gov への直接接続ができなかったため、e-Gov 法令検索の検索結果に表示された条文で確認）","used_in":"承諾したあとに辞退したくなったら"}],"not_used":["内定の返事の期限の「一般的な日数（1週間程度など）」は公的な根拠を確認できなかったので書かない","求人の虚偽表示に対する罰則の内容は、2025年6月の刑法改正（拘禁刑）による表記の変化を一次情報で確認しきれなかったので書かない","内定の法的な性質（始期付解約権留保付労働契約）の詳しい説明は、読者に必要な範囲を超えるため扱わない","京都新卒応援ハローワークのページは新卒者向けの説明だが、内定辞退と民法第627条の関係の説明として引用した"]}'::jsonb) on conflict (slug) do nothing;
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
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"1adc9fad3c687351837b4a1c7e44cc52399c7acd32850f4494085268ee2c8cd1","findings":[]}'::jsonb from articles where slug = 'nenshu-dake-erabanai';
update articles set status = 'published' where slug = 'nenshu-dake-erabanai';

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
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"ec899da2f3423c0aaa7a483813a574d75e2a8d10b1fb6b282136cacaac94a534","findings":[]}'::jsonb from articles where slug = 'pc-nigate-jimu';
update articles set status = 'published' where slug = 'pc-nigate-jimu';

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

書いた内容は面接でくわしく聞かれることがあるので、自分の言葉で説明できることだけを書きましょう。アルバイトの経験をもっとくわしく伝えたいときは[アルバイト経験だけの職務経歴書、何を書けばいい？](/articles/shokumu-keirekisho-arubaito)を、志望動機の組み立て方は[未経験職種の志望動機、何を書けばいい？](/articles/shiboudouki-mikeiken)も参考にしてください。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['shokumu-keirekisho-arubaito', 'shiboudouki-mikeiken', 'freeter-seishain-hajimeni']::text[], '{}'::text[], array['mensetsu', 'seishain']::text[], array['seishain-keiken-sukunai', 'freeter']::text[], array['履歴書に', '書くことがない…？']::text[], null, false, '[{"q":"アルバイトの経歴は、全部書かないといけませんか？","a":"ハローワークの資料では、学生時代のアルバイトは通常は書かず、卒業後のアルバイトや、応募する仕事に関係するアルバイトなどは「アルバイト」と明記して書くよう案内されています。履歴書に書ききれない仕事の中身は、職務経歴書でくわしく補いましょう。"},{"q":"免許・資格の欄に書けるものがないときは、どうすればいいですか？","a":"「特になし」と書けば十分です。取得に向けて勉強中のものがあれば、「〇〇の取得に向けて勉強中」のように、勉強中であることが分かる形で書くこともできます。"},{"q":"履歴書の性別欄は、書かないといけませんか？","a":"厚生労働省の履歴書様式例では、性別欄は任意記載で、書かないこともできるとされています。応募先から様式の指定がある場合は、その様式に沿って書きましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「書くことがない」を欄ごとに分けて、職歴（アルバイト）・資格・空白期間・自己PRの順に、何をどう書けばいいかを具体例で示す。年月をずらすなど事実と違う書き方はしないよう明記する","quotes":[{"source_url":"https://www.mhlw.go.jp/content/11601000/000769679.pdf","text":"JIS規格の解説から履歴書の様式例が削除されたことを受け、厚生労働省が新たに履歴書の様式例を作成（2021年4月）。性別欄は〔男・女〕の選択ではなく任意記載欄で、未記載も可能。「通勤時間」「扶養家族数（配偶者を除く）」「配偶者」「配偶者の扶養義務」の欄は設けていない","used_in":"どの欄で手が止まっている？／FAQ"},{"source_url":"https://www.hellowork.mhlw.go.jp/doc/kouroushourirekisho.pdf","text":"ハローワークインターネットサービスで公開されている厚生労働省履歴書様式例（性別欄に※印で任意記載の注記）","used_in":"どの欄で手が止まっている？"},{"source_url":"https://www.hellowork.mhlw.go.jp/doc/oubosyorui_pamphlet_01_070531.pdf","text":"学業期間中のアルバイトは通常記載しないが、卒業後のアルバイトや、応募先の職務に関係する場合、責任を与えられた仕事だった場合などは、アルバイト就業であることを明記の上で記載する。免許・資格は、勉強中のものなども、その旨を明示の上で記載するとアピールになる","used_in":"アルバイトしかしてない。職歴に書いていい？／資格がない。空欄でいい？"}],"not_used":["書類選考の通過率や、資格の有無による採否の差などの統計は使っていない","空白期間の書き方について公的な決まりは確認できなかったため、事実をそのまま書くこと・面接での説明の準備をすすめるにとどめた"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'rirekisho-kakukoto-nai' and c.slug = 'shorui-mensetsu' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '履歴書の様式例の作成について', '厚生労働省', 'https://www.mhlw.go.jp/content/11601000/000769679.pdf', '2026-10-06'::date, '厚生労働省が2021年4月に履歴書の様式例を作成したこと、性別欄が任意記載（未記載も可）であること、通勤時間・扶養家族数・配偶者などの欄を設けていないこと', 0 from articles where slug = 'rirekisho-kakukoto-nai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '厚生労働省履歴書様式例', 'ハローワークインターネットサービス（厚生労働省）', 'https://www.hellowork.mhlw.go.jp/doc/kouroushourirekisho.pdf', '2026-10-06'::date, '様式例がハローワークインターネットサービスで公開されていること', 1 from articles where slug = 'rirekisho-kakukoto-nai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '応募書類の作り方「1 履歴書」', 'ハローワークインターネットサービス（厚生労働省）', 'https://www.hellowork.mhlw.go.jp/doc/oubosyorui_pamphlet_01_070531.pdf', '2026-10-06'::date, '卒業後や応募先に関係するアルバイトは「アルバイト」と明記して職歴に書くこと、勉強中の資格も勉強中であることを明示して書けること', 2 from articles where slug = 'rirekisho-kakukoto-nai';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'rirekisho-kakukoto-nai' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"86a11112bcd0f8814e065751b792dc39c120576c5e798bb4bb6295636586cb50","findings":[]}'::jsonb from articles where slug = 'rirekisho-kakukoto-nai';
update articles set status = 'published' where slug = 'rirekisho-kakukoto-nai';

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

数字は正確なものだけを書きましょう。覚えていない数字を盛る必要はありません。「約」「〜くらい」で正直に書くほうが、面接で深掘りされたときにも答えやすくなります。

## 伝えるときに気をつけたいこと

接客経験を伝えるときは、次の2点を意識すると印象が変わります。

- **「好き」だけで終わらせない**: 「人と話すのが好き」に加えて、どんな場面でどう対応していたかを添える
- **応募する仕事との接点を一言入れる**: 「問い合わせ対応の経験を、カスタマーサポートでの電話対応に活かしたい」のように、つながりを自分の言葉で示す

志望動機での伝え方は、[未経験職種の志望動機、何を書けばいい？](/articles/shiboudouki-mikeiken)で例文つきで紹介しています。

接客の経験は、どの職種でも「人を相手にする仕事」の基礎になります。自分では当たり前だと思っていた工夫こそ、書き出してみる価値があります。', 'review', true, '2026-10-06'::timestamptz, '2026-10-07'::timestamptz, '2026-10-07'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['shiboudouki-mikeiken', 'eigyo-cs-it-support-chigai', 'mikeiken-tenshoku-hajimekata']::text[], array['hanbai', 'customer-support', 'eigyo']::text[], array['mikeiken-shokushu', 'mensetsu']::text[], array['sekkyaku']::text[], array['接客の経験、', 'ほかの仕事で活かせる？']::text[], null, false, '[{"q":"アルバイトの接客経験でも、職務経歴書に書いていいのでしょうか？","a":"書いて構いません。雇用形態よりも、どんな業務をどのくらいの期間担当し、何を工夫したかが判断材料になります。正社員経験と区別がつくよう、雇用形態と期間は正確に書きましょう。"},{"q":"「コミュニケーション力があります」とだけ書くのはダメですか？","a":"ダメではありませんが、読み手に伝わりにくくなります。「1日に何人くらいのお客さまに対応していたか」「どんな問い合わせが多かったか」など、場面が浮かぶ事実を添えると説得力が増します。"}]'::jsonb, null, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'sekkyaku-keiken-ikasu' and c.slug = 'keiken' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'sekkyaku-keiken-ikasu' and c.slug = 'shorui-mensetsu' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業情報提供サイト（job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/', '2026-10-06'::date, '各職種の仕事内容・求められるスキルの確認', 0 from articles where slug = 'sekkyaku-keiken-ikasu';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'sekkyaku-keiken-ikasu' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"11bceab82ebf9a079ffb4318832b5944bb4037e903fde8e1afb3a9803b62cffa","findings":[{"code":"C03","severity":"warning","message":"出典が1件のみ。可能なら2件以上で裏付ける"}]}'::jsonb from articles where slug = 'sekkyaku-keiken-ikasu';
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

接客からオフィスワークへの移り方に、決まった正解はありません。「何がつらくて、何を続けたいか」を書き出してから求人を見ると、自分に合う仕事を選びやすくなります。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['sekkyaku-keiken-ikasu', 'eigyo-cs-it-support-chigai', 'donichi-yasumi-nenshu-hikaku']::text[], array['customer-support', 'jimu', 'jinji']::text[], array['office', 'donichi']::text[], array['sekkyaku']::text[], array['接客からオフィスへ。', '働き方はどう変わる？']::text[], null, false, '[{"q":"オフィスワークに移れば、土日休みになりますか？","a":"そうとは限りません。会社の休日に合わせて働く事務などは土日休みの職場もありますが、カスタマーサポートのように問い合わせ窓口を開けている時間に合わせてシフトで働く仕事もあります。求人票の休日欄と年間休日の日数で確かめましょう。"},{"q":"ずっと座っている仕事に慣れられるか不安です。","a":"立ち仕事とは別の疲れ方をするので、不安に思うのは自然なことです。厚生労働省のガイドラインでは、会社が取り組むこととして、パソコンなどを使う作業の連続作業が1時間を超えないようにし、次の作業までに10〜15分の作業休止を設けることなどが示されています。面接で休憩の取り方や、席を離れる作業があるかを聞いておくと安心です。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"接客経験の言語化（sekkyaku-keiken-ikasu）ではなく、働き方・1日の過ごし方の変化に焦点をあてる","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/64","text":"コールセンターオペレーターは主に電話で顧客とやりとりする。顧客からの電話を受けるインバウンド（商品の注文受付、予約、資料請求、問い合わせ対応など）と、顧客に電話をかけるアウトバウンドに分かれる。","used_in":"移りやすいのは、どんな仕事？"},{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/428","text":"一般事務は書類の作成・整理、データ入力、電話の取り次ぎ、来客への対応などを行う。","used_in":"移りやすいのは、どんな仕事？"},{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/427","text":"受付事務は来訪者の用件を確認し、担当者や部署に取り次ぎ、案内する。","used_in":"移りやすいのは、どんな仕事？"},{"source_url":"https://www.mhlw.go.jp/content/000539603.pdf","text":"事業者が講ずべき措置として、一連続作業時間が1時間を超えないようにし、次の連続作業までの間に10〜15分の作業休止時間を設け、かつ一連続作業時間内に1〜2回程度の小休止を設けるよう指導することとされている。令和元年7月12日付け基発0712第3号で策定（旧VDTガイドラインを改めたもの）。","used_in":"座り仕事って、楽じゃないの？"}]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'sekkyaku-office' and c.slug = 'keiken' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'sekkyaku-office' and c.slug = 'shokushu' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'コールセンターオペレーター - 職業詳細（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/64', '2026-10-06'::date, '電話で問い合わせに応える仕事の内容（注文・予約・問い合わせを受ける受信業務と、こちらから電話をかける発信業務）', 0 from articles where slug = 'sekkyaku-office';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '一般事務 - 職業詳細（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/428', '2026-10-06'::date, '一般事務の仕事内容（書類・データ入力、電話の取り次ぎ、来客対応など）', 1 from articles where slug = 'sekkyaku-office';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '受付事務 - 職業詳細（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/427', '2026-10-06'::date, '受付事務の仕事内容（来訪者の用件を確認して取り次ぎ、案内する）', 2 from articles where slug = 'sekkyaku-office';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '情報機器作業における労働衛生管理のためのガイドラインと解説（令和元年7月12日策定）', '厚生労働省', 'https://www.mhlw.go.jp/content/000539603.pdf', '2026-10-06'::date, 'パソコンなどを使う作業での連続作業時間と作業休止時間の目安', 3 from articles where slug = 'sekkyaku-office';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'sekkyaku-office' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"e20c3ce1c0de26716b43aa3e18b18bae5360eeb7a567e11913346e41a32d3987","findings":[]}'::jsonb from articles where slug = 'sekkyaku-office';
update articles set status = 'published' where slug = 'sekkyaku-office';

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

経験の言葉にしかたで迷ったら[接客経験は転職でどう活かせる？](/articles/sekkyaku-keiken-ikasu)を、経歴の説明に不安があれば[転職回数が気になるときに整理したいこと](/articles/tenshoku-kaisu-kininaru)も参考にしてください。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['sekkyaku-keiken-ikasu', 'tenshoku-kaisu-kininaru', 'eigyo-cs-it-support-chigai']::text[], '{}'::text[], array['mensetsu', 'mikeiken-shokushu']::text[], array['sekkyaku']::text[], array['未経験の志望動機、', '何を書けばいい？']::text[], null, false, '[{"q":"「未経験ですが頑張ります」だけでは伝わりませんか？","a":"意欲は伝わりますが、それだけだとほかの応募者との違いが見えにくくなります。なぜその仕事に興味を持ったのか、これまでの経験のどこが活かせそうかを添えると、同じ意欲でも説得力が変わります。"},{"q":"志望動機はどれくらいの長さで書けばいいですか？","a":"履歴書の志望動機欄なら、200〜300文字程度にまとめると読みやすくなります。面接では、その内容を1分前後で話せるように準備しておくと安心です。"}]'::jsonb, null, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'shiboudouki-mikeiken' and c.slug = 'shorui-mensetsu' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業情報提供サイト（job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/', '2026-10-06'::date, '応募する職種の仕事内容を調べる方法', 0 from articles where slug = 'shiboudouki-mikeiken';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'shiboudouki-mikeiken' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"a648df0020721fd0c0b8220debe7a2412fa186835a81f8fa8c12386f94642794","findings":[{"code":"C03","severity":"warning","message":"出典が1件のみ。可能なら2件以上で裏付ける"}]}'::jsonb from articles where slug = 'shiboudouki-mikeiken';
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

職種ごとの仕事内容や、人と話す量・パソコン作業の多さは、[職種比較ページ](/jobs)で並べて見られます。

## 調べてもしぼれないときは？

job tag には、職業興味検査や仕事価値観検査など、興味や大事にしたいことから職業を探すツールもあります。ただし、job tag のよくある質問では、検査で出てくる職業は学歴・職務経験・資格などを考えずに挙げたものなので、参考として使うよう案内されています。結果は候補を広げるヒントにして、ステップ1〜3で確かめましょう。

ひとりで決めきれないときは、書き出したメモを持って相談するのも一つの方法です。正社員を目指すおおむね35歳未満の人は、わかものハローワークで担当者に無料で相談できます。キャリアアドバイザーへの相談については[キャリア相談について](/consultation)で紹介しています。

候補が決まったあとの準備の流れは、[未経験転職は何から始める？](/articles/mikeiken-tenshoku-hajimekata)にまとめています。', 'review', true, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['mikeiken-tenshoku-hajimekata', 'eigyo-cs-it-support-chigai', 'sekkyaku-keiken-ikasu']::text[], array['sonota']::text[], array['yaritai', 'mikeiken-shokushu']::text[], array['hajimete', 'seishain-keiken-sukunai']::text[], array['やりたい仕事が', '分からないときは。']::text[], null, false, '[{"q":"やりたいことが決まっていないまま、転職活動を始めてもいいですか？","a":"始めて大丈夫です。やりたいことがはっきりしていなくても、避けたいこと・続けられた作業・ゆずれない条件の3つを書き出せば、候補をしぼって比べることはできます。働きながら、やりたいことが見えてくる人もいます。"},{"q":"適職診断の結果は、どこまで参考にしていいですか？","a":"結果は候補を広げるヒントとして使うのがおすすめです。job tag のよくある質問でも、職業興味検査や仕事価値観検査で出てくる職業は、学歴・職務経験・資格などを考えずに挙げたものなので、参考として使うよう案内されています。出てきた職業は、この記事の3ステップで確かめてみてください。"},{"q":"候補の職種はいくつくらいにしぼればいいですか？","a":"2〜3職種がおすすめです。1つだけだと比べる相手がなく、多すぎると一つひとつを調べきれなくなります。比べてみて合わないと分かった職種は、外して入れ替えて構いません。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"ホームのメイン導線の着地先。「やりたいこと」から探さず、避けたいこと・続けられた作業・ゆずれない条件の3ステップで候補を2〜3職種にしぼり、比べて確かめる。mikeiken-tenshoku-hajimekata（転職準備の5項目）とは重ならないよう、職種の候補を見つける手順に絞る","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/Search/WorkActivity","text":"job tag では、仕事の内容（具体的な作業）から職業を検索できる。","used_in":"ステップ2：続けられた作業は？"},{"source_url":"https://shigoto.mhlw.go.jp/User/faq","text":"職業興味検査や仕事価値観検査で表示される職業リストは、回答者の学歴・職務経験・取得資格・専門性などを考慮しておらず、興味や価値観の特徴と職業との類似度から作成されているので、参考として利用すること。","used_in":"調べてもしぼれないときは？"},{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000181329.html","text":"わかものハローワークは、正社員を目指す若者（おおむね35歳未満）を対象に、担当者制による職業相談や自己理解・職務理解のサポートなどを無料で行っている。","used_in":"調べてもしぼれないときは？"}]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'shigoto-sagashikata' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'shigoto-sagashikata' and c.slug = 'shokushu' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '仕事の内容で検索（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/Search/WorkActivity', '2026-10-06'::date, '仕事の内容から職業を探せる検索があること', 0 from articles where slug = 'shigoto-sagashikata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'よくあるお問い合わせ（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/faq', '2026-10-06'::date, '職業興味検査・仕事価値観検査があること、結果の職業リストは学歴・職務経験・資格などを考慮していないため参考として使うこと', 1 from articles where slug = 'shigoto-sagashikata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'わかものハローワーク', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000181329.html', '2026-10-06'::date, '正社員を目指すおおむね35歳未満の若者を対象に、担当者制の職業相談などを無料で行っていること', 2 from articles where slug = 'shigoto-sagashikata';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'shigoto-sagashikata' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"7fc9ad33fe211ba9cfc6381d7787ae9c70368d72ffc29fe8166c3874d8282676","findings":[]}'::jsonb from articles where slug = 'shigoto-sagashikata';
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

履歴書の欄の埋め方は[履歴書に書くことがないと思ったとき](/articles/rirekisho-kakukoto-nai)、書いた内容を面接でどう話すかは[未経験職種の面接、何を準備する？](/articles/mensetsu-junbi-mikeiken)もあわせて確認してみてください。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['rirekisho-kakukoto-nai', 'sekkyaku-keiken-ikasu', 'shiboudouki-mikeiken']::text[], '{}'::text[], array['mensetsu']::text[], array['freeter', 'seishain-keiken-sukunai', 'sekkyaku']::text[], array['職務経歴書、', 'アルバイトだけでも？']::text[], null, false, '[{"q":"アルバイトをいくつもしてきた場合、全部くわしく書くべきですか？","a":"職務経歴書は自由な様式なので、期間が長いものや応募する仕事に近いものをくわしく書き、ほかは短くまとめる方法があります。履歴書の職歴欄と、勤務先や期間がずれないようにしておきましょう。"},{"q":"職務経歴書は手書きとパソコン、どちらで作ればいいですか？","a":"ハローワークの資料では、A4の用紙1〜2枚程度にパソコンで横書きで作るのが一般的で、黒のボールペンなどによる手書きでも差し支えないとされています。応募先から指定があれば、それに従いましょう。"},{"q":"売上や人数など、正確な数字を覚えていません。","a":"覚えていない数字を作る必要はありません。「約3年」「週4日」のように確かなものだけを書き、あいまいなものは「約」「〜程度」をつけるか、数字を使わずに具体的な作業で伝えましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"アルバイトしか経験がない人向けに、職務経歴書の全体の構成（5ブロック）と、そのまま置き換えて使える書き出し例を示す。既存の sekkyaku-keiken-ikasu（経験の分解）とは、書類全体の組み立てに焦点を置くことで分ける","quotes":[{"source_url":"https://www.hellowork.mhlw.go.jp/doc/oubosyorui_pamphlet_02_070531.pdf","text":"職務経歴書はA4縦1〜2枚程度に、これまでの職務の内容を自由様式で詳しく記載する書類。冒頭の「標題」「氏名」「日付」と「職務経歴」は必須で、「取得資格」「パソコンスキル」「活かせる能力」「自己PR」「志望動機」などを選んで追加するのが一般的。パソコンで横書きが一般的だが手書きでも差し支えない","used_in":"職務経歴書って、履歴書と何が違う？／FAQ"},{"source_url":"https://www.hellowork.mhlw.go.jp/doc/oubosyorui_pamphlet_02_070531.pdf","text":"職務経歴や資格がなく実務能力に自信がない場合でも、①応募職種と関連するアルバイト経験、②訓練・研修の経験、③現在勉強中の分野、④性格・行動特性、⑤仕事への姿勢・意欲、⑥将来目標などの面からアピールできる","used_in":"職務経歴書って、履歴書と何が違う？"},{"source_url":"https://www.hellowork.mhlw.go.jp/doc/syokurekisyo_pamphlet_070531.pdf","text":"職務経歴の記載スタイルには編年体式・逆編年体式・キャリア式があり、わからないときは編年体式（古い職務経歴から記載する方法）とする。アルバイト・パートの仕事の内容をよく分析し、応募先企業で活かせそうな要素を探してアピールする","used_in":"何を、どの順で書く？／書き出し例"}],"not_used":["書類選考の通過率や、職務経歴書の有無による差などの統計は使っていない","書き出し例の店舗・期間・人数は架空の例として明記した"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'shokumu-keirekisho-arubaito' and c.slug = 'shorui-mensetsu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'shokumu-keirekisho-arubaito' and c.slug = 'keiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '応募書類の作り方「2 職務経歴書」', 'ハローワークインターネットサービス（厚生労働省）', 'https://www.hellowork.mhlw.go.jp/doc/oubosyorui_pamphlet_02_070531.pdf', '2026-10-06'::date, '職務経歴書はA4で1〜2枚程度・自由様式で、標題・氏名・日付・職務経歴を入れ、資格や自己PRなどを加えるのが一般的なこと、パソコン作成が一般的だが手書きでも差し支えないこと、実務能力に自信がない場合にアピールできる6つの面', 0 from articles where slug = 'shokumu-keirekisho-arubaito';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職務経歴書（パンフレット）', 'ハローワークインターネットサービス（厚生労働省）', 'https://www.hellowork.mhlw.go.jp/doc/syokurekisyo_pamphlet_070531.pdf', '2026-10-06'::date, '職務経歴は古い順（編年体）が一般的で、迷ったときは編年体で書くこと、アルバイト・パートの仕事の内容を見直して応募先で活かせる要素を探すこと', 1 from articles where slug = 'shokumu-keirekisho-arubaito';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'shokumu-keirekisho-arubaito' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"5bf7f1c7f810faa6457ca7c631860e1431ae24c50ab6b7f0b5a4e88154772569","findings":[]}'::jsonb from articles where slug = 'shokumu-keirekisho-arubaito';
update articles set status = 'published' where slug = 'shokumu-keirekisho-arubaito';

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

辞めたあとは、健康保険の手続きも同じ時期に必要です。辞める前に確認しておきたいことは[今の仕事を辞めたいとき、先に確認しておきたいこと](/articles/yametai-mae-kakunin)、雇用保険の基本手当のことは[自己都合退職の給付制限が原則1か月に](/news/news-koyou-hoken-kyufu-seigen)で紹介しています。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-07'::timestamptz, '退職後の年金手続き｜国民年金への切り替えの期限と免除の相談', '転職で働かない期間ができるときは、退職日の翌日から14日以内に市区町村で国民年金に切り替えます。手続きがいらない場合、2026年度の保険料、払うのが難しいときの免除・納付猶予と失業による特例を、公的な情報をもとに整理しました。', array['yametai-mae-kakunin', 'tedori-20man-hikaku', 'news-koyou-hoken-kyufu-seigen']::text[], '{}'::text[], array['yametai']::text[], array['hajimete']::text[], array['辞めたあとの', '年金の手続きは？']::text[], null, false, '[{"q":"次の会社が決まっていて、間が数日だけ空きます。それでも手続きは必要ですか？","a":"退職日の翌日に次の会社に入る場合を除き、原則として国民年金に切り替える手続きが必要です。退職日の翌日と次の会社に入る日が同じ月の中なら、その月の国民年金の保険料は払わなくてよいとされています。迷ったら、住んでいる市区町村の国民年金の窓口に確認しましょう。"},{"q":"免除を受けると、将来の年金はどうなりますか？","a":"免除や納付猶予を受けた期間は、年金を受け取るために必要な期間（受給資格期間）に入ります。全額免除の期間は、保険料を全額払った場合の2分の1が年金額に反映されます。納付猶予の期間は、あとから保険料を納めない限り年金額には反映されません。"},{"q":"免除の申請を忘れていました。あとからでも申請できますか？","a":"保険料の納付期限から2年たっていない期間（申請する時点から2年1か月前まで）なら、さかのぼって申請できます。払えないまま放っておかずに、早めに相談しましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「間が空くなら切り替え」「翌日入社なら不要」「払えないなら放置せず免除・猶予を相談」の3つに分けて、期限と窓口を絶対的な日付・日数で示す","quotes":[{"source_url":"https://www.nenkin.go.jp/service/kokunen/kanyu/20140710-03.html","text":"退職日の翌日から14日以内に、住所地の市区役所または町村役場で国民年金第1号被保険者の加入手続きを行う。資格喪失日を証明できるもの（離職票等）が必要になる場合がある。厚生年金保険の適用事業所に再就職する場合は引き続き厚生年金保険に加入する","used_in":"国民年金への切り替え：期限と窓口"},{"source_url":"https://www4.city.kanazawa.lg.jp/soshikikarasagasu/iryohokenka/yokuarushitsumon/kokuminnenkin/2691.html","text":"退職日の翌日に次の勤務先に就職する場合は第1号被保険者への加入手続きは必要ない。資格喪失日と次の勤務先の資格取得日が同月内なら国民年金保険料の納付は必要ないが、月をまたいだ場合は納付が必要","used_in":"次の会社にすぐ入るなら手続きはいらない"},{"source_url":"https://www.nenkin.go.jp/service/kokunen/hokenryo/hokenryo.html","text":"令和8年度の国民年金保険料は月額17,920円。納付期限は納付対象月の翌月末日","used_in":"保険料はいくら？いつ払う？"},{"source_url":"https://www.nenkin.go.jp/service/kokunen/menjo/20150428.html","text":"失業・倒産・事業の廃止などの事実を確認できたときは、前年所得にかかわらず免除・納付猶予を受けられる特例がある。雇用保険被保険者離職票や雇用保険受給資格者証のコピーなどが必要","used_in":"払うのが難しいときは免除・納付猶予を相談"},{"source_url":"https://www.nenkin.go.jp/service/kokunen/menjo/20150402-01.html","text":"保険料の納付期限から2年を経過していない期間（申請時点から2年1か月前までの期間）について、さかのぼって免除等を申請できる","used_in":"払うのが難しいときは免除・納付猶予を相談"}],"not_used":["免除・納付猶予の所得の基準額は、世帯の人数などで変わり計算式が複雑なため書かない（窓口で確認するよう書いた）","免除の承認期間（何月から何月までか）は、今回の検索で一次情報の記述を確かめられなかったため書かない","保険料を払わずにいた場合の障害基礎年金などへの影響は、条件が複雑なため書かない"]}'::jsonb) on conflict (slug) do nothing;
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
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"a748c34d897ba3f5dae2c0798f1e435d4dd4e8841c532d7170edc20b231a7cf7","findings":[]}'::jsonb from articles where slug = 'tenshoku-kaisu-kininaru';
update articles set status = 'published' where slug = 'tenshoku-kaisu-kininaru';

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

所得税とは別に、住民税も前の年の所得をもとに計算されるため、転職した年は手取りが思ったより少なく感じることがあります。くわしくは[手取り20万円から転職を考えるとき、何を比べればいい？](/articles/tedori-20man-hikaku)で紹介しています。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-07'::timestamptz, '転職した年の年末調整｜前職の源泉徴収票と確定申告のしかた', '年の途中で転職したら、前の会社の源泉徴収票を新しい会社に出して年末調整をしてもらいます。出さないと年末調整ができず、確定申告が必要に。年内に再就職しなかったときの還付申告と、源泉徴収票が届かないときの対処も紹介します。', array['tedori-20man-hikaku', 'yametai-mae-kakunin', 'nenshu-300man-tenshoku']::text[], '{}'::text[], array['yametai']::text[], array['hajimete']::text[], array['転職した年の', '年末調整どうする？']::text[], null, false, '[{"q":"前の会社の源泉徴収票をなくしてしまいました。どうすればいいですか？","a":"前の会社に連絡して、もう一度発行してもらえないか相談しましょう。新しい会社の年末調整に間に合わない場合は、年末調整を受けずに、翌年に自分で確定申告をして精算することになります。"},{"q":"年の途中で辞めて、そのまま年内は働きませんでした。何か手続きは必要ですか？","a":"年末調整を受けていないので、所得税を納めすぎている場合があります。辞めた年の翌年1月1日から5年以内に確定申告（還付申告）をすると、納めすぎた分が戻ってくる場合があります。前の会社の源泉徴収票を使って申告します。"},{"q":"辞めていた間に払った国民年金や国民健康保険の保険料は、年末調整で申告できますか？","a":"自分で払った社会保険料は、社会保険料控除の対象です。年末調整では「保険料控除申告書」に書いて出します。国民年金の保険料は、日本年金機構から届く控除証明書を一緒に出す必要があります。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「年内に次の会社に入ったか」で分け、入ったなら源泉徴収票を出す、入らなかったなら翌年に還付申告、の2本の道を示す","quotes":[{"source_url":"https://www.nta.go.jp/taxes/shiraberu/taxanswer/gensen/2674.htm","text":"年の中途で就職した人については、就職前にその年中にほかの会社などから給与の支払を受けたことがあったかを確認し、それらの給与を含めて年末調整を行う。確認はその人がほかの会社などから交付を受けた給与所得の源泉徴収票などで行い、確認ができないときは年末調整を行うことはできず、確定申告で精算する","used_in":"年内に次の会社に入ったら：源泉徴収票を出す"},{"source_url":"https://www.nta.go.jp/taxes/shiraberu/taxanswer/hotei/7411.htm","text":"給与所得の源泉徴収票は、年の中途で退職した人の場合、退職の日以後1か月以内に交付しなければならない","used_in":"前の会社の源泉徴収票はいつ届く？"},{"source_url":"https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1910.htm","text":"中途退職したまま再就職しない場合は年末調整を受けられないため、所得税が納め過ぎとなっている場合がある。中途退職した年の翌年以降に確定申告をすれば還付を受けられる","used_in":"年内に再就職しなかったら：翌年に確定申告"},{"source_url":"https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2030.htm","text":"還付申告書は、確定申告期間とは関係なく、その年の翌年1月1日から5年間提出することができる","used_in":"年内に再就職しなかったら：翌年に確定申告"}],"not_used":["退職金（退職所得）の課税と申告の要否は、今回の記事の範囲から外した","年末調整の対象外になる人の条件（給与の収入金額が2,000万円を超える人など）は、読者にほぼ関係しないため書かない","2026年分の確定申告期間の具体的な日付は、国税庁の案内をまだ確認できなかったため書かない（還付申告は翌年1月1日から提出できることだけを書いた）","2025年度税制改正による基礎控除などの見直しの内容は、記事の主題から外れるため書かない"]}'::jsonb) on conflict (slug) do nothing;
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

面談の前に何を決めておけばいいかは[エージェント面談の前に決めておくこと・決めなくていいこと](/articles/agent-mendan-mae)にまとめています。相談の前に希望条件を整理したいときは、[条件整理チェック](/check)も使ってみてください。', 'review', false, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, '2026-10-09'::timestamptz, 'プロジェクトオーナー（チャットで承認）', '2026-10-07'::timestamptz, '転職サイト・転職エージェント・ハローワークの違いと使い分け', '転職サイト、転職エージェント、ハローワークは何が違う？それぞれのしくみと向いている使い方、人材紹介は求職者から原則手数料を取らないという職業安定法のルール、人材サービス総合サイトで許可番号を確かめる方法を紹介します。', array['agent-soudan-nani', 'agent-mendan-mae', 'freeter-seishain-hajimeni']::text[], '{}'::text[], array['yaritai']::text[], array['hajimete']::text[], array['転職サイト？エージェント？', 'ハローワーク？']::text[], null, false, '[{"q":"転職エージェントは無料と聞きますが、なぜ無料なのですか？","a":"人材紹介会社（有料職業紹介事業者）は、主に求人を出している企業から手数料を受け取っているからです。職業安定法では、有料職業紹介事業者は求職者から原則として手数料を受け取ってはいけないとされています。例外は、芸能家・モデルや、年収700万円を超える経営管理者・科学技術者・熟練技能者などに限られています。"},{"q":"転職サイトと転職エージェントは、両方使ってもいいですか？","a":"使って構いません。ハローワークもあわせて、どれか一つに絞る必要はありません。ただし、同じ求人に別のルートから重ねて応募すると、企業側が混乱することがあります。どの求人に、どこから応募したかを一覧にして管理しましょう。"},{"q":"登録した転職エージェントが、本当に許可を受けているか心配です。","a":"厚生労働省の「人材サービス総合サイト」で、事業者の名前や許可番号を入れて検索できます。許可を受けた職業紹介事業者であれば、許可番号や事業所の情報が表示されます。登録する前に確かめておくと安心です。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"3つのサービスを「だれが運営し、どこからお金が出て、どこまで手伝ってくれるか」で比べる。人材紹介の手数料ルールと許可の確かめ方を、公的な資料にもとづいて書く。特定の企業・サービスはすすめない","quotes":[{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/hellowork.html","text":"ハローワーク（公共職業安定所）は、仕事を探す人や求人事業主に対して、さまざまなサービスを無償で提供する、国（厚生労働省）が運営する総合的雇用サービス機関。職業紹介のほか、雇用保険、雇用対策などの国の制度を組み合わせた支援を行う","used_in":"ハローワーク：国が運営する、無料の窓口"},{"source_url":"https://www.hellowork.mhlw.go.jp/member/mem_possible.html","text":"求職者マイページを開設すると、自宅のパソコン等から求人情報検索、オンライン自主応募、求職活動状況の確認などができる","used_in":"ハローワーク：国が運営する、無料の窓口"},{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/boshuujouhouteikyou.html","text":"募集情報等提供事業には求人サイト・求人情報誌などが該当する。労働者になろうとする者に関する情報を収集する特定募集情報等提供事業者は、厚生労働大臣への届出が必要（2022年10月1日施行の改正職業安定法）","used_in":"転職サイト：自分で探して、自分で応募する"},{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000172497_00003.html","text":"令和4年10月1日施行の改正により、特定募集情報等提供事業を行う者は、職業安定法第43条の2第1項に基づき厚生労働大臣への届出が必要","used_in":"転職サイト：自分で探して、自分で応募する"},{"source_url":"https://jsite.mhlw.go.jp/ishikawa-roudoukyoku/hourei_seido_tetsuzuki/roudousha_haken/syoukai_gaiyou.html","text":"職業紹介とは、求人及び求職の申込みを受け、求人者と求職者との間における雇用関係の成立をあっせんすること（職業安定法第4条第1項）。有料職業紹介事業は、職業安定法第30条第1項の厚生労働大臣の許可を受けて行うことができる","used_in":"転職エージェント：担当者が間に入る「人材紹介」"},{"source_url":"https://jsite.mhlw.go.jp/osaka-roudoukyoku/hourei_seido_tetsuzuki/yuryou_muryou_shokugyou/hourei_seido/gaiyou.html","text":"有料職業紹介事業者が徴収できる手数料は限られている。求職者手数料は「芸能家」「モデル」「経営管理者」「科学技術者」「熟練技能者」の職業に限られ、後の3つは紹介により就職した職業の賃金が年収700万円またはこれに相当する額を超える場合に限る","used_in":"人材紹介は、求職者から原則として手数料を取らない"},{"source_url":"https://jinzai.hellowork.mhlw.go.jp/JinzaiWeb/","text":"厚生労働省の人材サービス総合サイト。労働者派遣事業、職業紹介事業、特定募集情報等提供事業を行う事業者を検索できる。職業紹介事業の詳細ページは「13-ユ-」で始まるような許可番号ごとに表示される","used_in":"許可を受けているかの確かめ方"},{"source_url":"https://www.mhlw.go.jp/file/06-Seisakujouhou-11600000-Shokugyouanteikyoku/0000171018_2.pdf","text":"職業紹介事業者は、人材サービス総合サイトで、就職者数、無期雇用就職者数、そのうち6か月以内に解雇以外の理由で離職した者の数、手数料に関する事項、返戻金制度の有無などの情報提供が義務付けられる","used_in":"許可を受けているかの確かめ方"},{"source_url":"https://jsite.mhlw.go.jp/tokyo-roudoukyoku/news_topics/jyukyuuchousei_030303.html","text":"職業安定法に基づく指針の改正により、2021年4月1日から、「就職お祝い金」などの名目で求職者に金銭等を提供して求職の申込みの勧奨を行うことが禁止された","used_in":"許可を受けているかの確かめ方"}],"not_used":["サービスごとの求人数、利用者数、内定率などの数字は公的な根拠がなく、比較にもなりやすいため書かない","特定の転職サイト・転職エージェントの名前や評判は書かない","紹介手数料の相場（理論年収の〇％など）は、事業者ごとに違い、公的な一般値を確認できなかったので書かない","求職受付手数料の具体的な金額（1件あたりの上限額）は、税率等で変わり、読者に関係が薄いため書かない"]}'::jsonb) on conflict (slug) do nothing;
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

辞めると決めたあとの進め方は[未経験転職は何から始める？](/articles/mikeiken-tenshoku-hajimekata)を、転職が何回目かが気になる人は[転職回数が気になるときに整理したいこと](/articles/tenshoku-kaisu-kininaru)を参考にしてください。', 'review', false, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['news-koyou-hoken-kyufu-seigen', 'tenshoku-kaisu-kininaru', 'mikeiken-tenshoku-hajimekata']::text[], '{}'::text[], array['yametai']::text[], array['hajimete']::text[], array['辞めたい。', 'その前に確認すること']::text[], null, false, '[{"q":"会社が退職を認めてくれないと、辞められないのですか？","a":"期間の定めのない雇用（正社員など）の場合、民法では、退職を申し出てから2週間がたつと雇用が終わるとされていて、会社の同意がないと辞められないわけではありません。ただし、就業規則に退職の申し出についての決まりがあれば原則としてそれが適用されるので、まず就業規則を確認しましょう。"},{"q":"有給休暇が何日あるか、どう確かめればいいですか？","a":"給与明細や勤怠のシステムに残りの日数が書かれていることがあります。分からなければ、人事の担当者や上司に確認しましょう。法律では、6か月続けて勤務し、出勤すべき日の8割以上出勤した人に、10日の年次有給休暇が与えられます（週5日勤務などの場合）。"},{"q":"辞めてから転職活動をしても大丈夫ですか？","a":"時間を確保しやすい一方で、収入が途切れる期間が出ます。雇用保険の基本手当には受け取るための条件があるので、自分が当てはまるかを確認し、生活費の見通しを立ててから決めましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"辞めるかどうかを決める前に、理由の整理・活動の進め方・退職の手続き・有給・相談先の順に確認する。心身の不調がある場合は転職より休養と相談を先にする","quotes":[{"source_url":"https://jsite.mhlw.go.jp/kagoshima-roudoukyoku/yokuaru_goshitsumon/qa07/0701.html","text":"民法では期間の定めのない雇用契約は解約の申し入れ後2週間で終了することとなっており、会社の同意がなければ退職できないというものではない（民法第627条）。就業規則に退職の規定がある場合は原則として就業規則が適用されるが、極端に長い申し入れ期間などは無効とされる場合もある","used_in":"退職はいつまでに伝える？"},{"source_url":"https://www.check-roudou.mhlw.go.jp/qa/roudousya/yukyu/q1.html","text":"雇い入れから6か月継続勤務し、全労働日の8割以上出勤した労働者に10日の年次有給休暇。その後は勤続年数に応じて増え、最高20日（週5日以上または週30時間以上の場合）","used_in":"有給休暇は残っている？"},{"source_url":"https://www.mhlw.go.jp/general/seido/chihou/kaiketu/soudan.html","text":"総合労働相談コーナーは各都道府県労働局と全国の労働基準監督署内などに設置。解雇、雇止め、いじめなどあらゆる分野の労働問題を対象に、専門の相談員が面談または電話で対応。予約不要・無料","used_in":"つらさが強いときの相談先"},{"source_url":"https://kokoro.mhlw.go.jp/","text":"働く人とその家族などが、電話・SNS・メールで匿名・無料で相談できる窓口がある","used_in":"つらさが強いときの相談先"},{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000160564.html","text":"令和7年4月1日以降に正当な理由なく自己都合で離職した場合、給付制限期間が原則2か月から1か月に短縮","used_in":"働きながら探す？辞めてから探す？"}],"not_used":["退職理由の割合や転職者数などの統計は使っていない","有期雇用の途中退職のルールは、契約書の確認をすすめるにとどめた"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'yametai-mae-kakunin' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'Q5 このたび、家庭の事情で10年間勤務していた会社を辞めたいと思い退職願を提出しましたが、上司が受け取ってくれません。会社が同意してくれないと私は退職できないのでしょうか。', '鹿児島労働局', 'https://jsite.mhlw.go.jp/kagoshima-roudoukyoku/yokuaru_goshitsumon/qa07/0701.html', '2026-10-06'::date, '期間の定めのない雇用は申し入れから2週間で終了し、会社の同意は必要ないこと（民法第627条）、就業規則に規定があれば原則としてそれが適用されること', 0 from articles where slug = 'yametai-mae-kakunin';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '年次有給休暇はどのような場合に与えられるのですか（確かめよう労働条件）', '厚生労働省', 'https://www.check-roudou.mhlw.go.jp/qa/roudousya/yukyu/q1.html', '2026-10-06'::date, '6か月継続勤務・全労働日の8割以上出勤で10日の年次有給休暇が与えられ、勤続年数に応じて日数が増えること', 1 from articles where slug = 'yametai-mae-kakunin';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '総合労働相談コーナーのご案内', '厚生労働省', 'https://www.mhlw.go.jp/general/seido/chihou/kaiketu/soudan.html', '2026-10-06'::date, '都道府県労働局・労働基準監督署内の総合労働相談コーナーで、解雇やいじめなど職場のあらゆる労働問題を、面談または電話で、予約不要・無料で相談できること', 2 from articles where slug = 'yametai-mae-kakunin';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'こころの耳 働く人のメンタルヘルス・ポータルサイト', '厚生労働省', 'https://kokoro.mhlw.go.jp/', '2026-10-06'::date, '働く人向けに電話・SNS・メールで無料の相談窓口があること', 3 from articles where slug = 'yametai-mae-kakunin';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '雇用保険制度の改正内容について', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000160564.html', '2026-10-06'::date, '2025年4月1日以降の自己都合退職で、基本手当の給付制限期間が原則1か月になったこと', 4 from articles where slug = 'yametai-mae-kakunin';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'yametai-mae-kakunin' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"8f7a9d86c2b634d657f6ce3d1bf2d69b14d35abcb8b737784cee580b69731796","findings":[]}'::jsonb from articles where slug = 'yametai-mae-kakunin';
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
