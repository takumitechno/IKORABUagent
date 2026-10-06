-- このファイルは `npm run db:seed-sql` で content/ から生成されます。手で編集しないでください。
begin;

-- categories
insert into categories (slug, name, description, icon, sort_order) values ('mikeiken', '未経験転職', '未経験から正社員・新しい職種に挑戦するときの、最初の一歩と全体像。', 'compass', 1) on conflict (slug) do update set name = excluded.name, description = excluded.description, icon = excluded.icon, sort_order = excluded.sort_order;
insert into categories (slug, name, description, icon, sort_order) values ('shokushu', '職種を知る', '仕事内容・向き不向き・入社後の働き方など、職種ごとの違いを知る。', 'briefcase', 2) on conflict (slug) do update set name = excluded.name, description = excluded.description, icon = excluded.icon, sort_order = excluded.sort_order;
insert into categories (slug, name, description, icon, sort_order) values ('keiken', '経験の活かし方', 'アルバイト・接客・前職など、これまでの経験を転職で言葉にする。', 'sparkles', 3) on conflict (slug) do update set name = excluded.name, description = excluded.description, icon = excluded.icon, sort_order = excluded.sort_order;
insert into categories (slug, name, description, icon, sort_order) values ('shorui-mensetsu', '面接・書類', '履歴書・職務経歴書・面接で、伝え方に迷ったときに。', 'file-text', 4) on conflict (slug) do update set name = excluded.name, description = excluded.description, icon = excluded.icon, sort_order = excluded.sort_order;
insert into categories (slug, name, description, icon, sort_order) values ('hatarakikata', '年収・働き方', '給与・休日・勤務時間など、条件の見方と比べ方。', 'wallet', 5) on conflict (slug) do update set name = excluded.name, description = excluded.description, icon = excluded.icon, sort_order = excluded.sort_order;
insert into categories (slug, name, description, icon, sort_order) values ('junbi', '転職準備', '面談・応募の前に整理しておくこと、確認しておくこと。', 'list-checks', 6) on conflict (slug) do update set name = excluded.name, description = excluded.description, icon = excluded.icon, sort_order = excluded.sort_order;
insert into categories (slug, name, description, icon, sort_order) values ('news', '転職ニュース・市場情報', '制度変更や市場の動きを、未経験転職者の目線で読み解く。', 'newspaper', 7) on conflict (slug) do update set name = excluded.name, description = excluded.description, icon = excluded.icon, sort_order = excluded.sort_order;

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

何から始めるか迷ったら、[未経験転職は何から始める？](/articles/mikeiken-tenshoku-hajimekata)で全体の流れを確認できます。焦って決めるより、準備を一つずつ進めるほうが、自分に合う仕事を選びやすくなります。', 'review', false, '2026-10-02'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['mikeiken-tenshoku-hajimekata', 'shiboudouki-mikeiken', 'mikeiken-kenshu-kakunin']::text[], '{}'::text[], array['mikeiken-shokushu', 'yaritai']::text[], array['seishain-keiken-sukunai', 'hajimete']::text[], array['26歳。', '今から別の職種って遅い？']::text[], null, true, '[{"q":"26歳で未経験の職種に応募すると、年齢だけで落とされませんか？","a":"求人の募集・採用では、原則として年齢を制限できないことになっています。選考で自分から伝えられるのは、これまでの仕事で任されていたこと、その仕事を選んだ理由、入社後に学ぶ姿勢などです。どこを重く見るかは求人ごとに違うので、準備できることから整えておきましょう。"},{"q":"求人票に「○歳以下」と書かれているのはなぜですか？","a":"年齢制限が例外として認められる場合があるためです。そのひとつが、長く働いてもらうことを前提に、若い人を職務経験を問わず正社員として募集するケースです。上限の年齢は求人ごとに違うので、応募条件の欄を確認してください。"},{"q":"正社員の経験が少なくても、未経験の職種に応募できますか？","a":"正社員の経験が少ないことだけで決まるわけではありません。アルバイトや派遣での経験も、担当した仕事や工夫したことを具体的に書けば、伝える材料になります。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「26歳は遅いか」を年齢の問題として答えず、法律上は年齢で一律に区切れないことを示したうえで、不安の中身を分けて準備に落とし込む","quotes":[{"source_url":"https://www.mhlw.go.jp/qa/koyou/kinshi/qa.html","text":"雇用対策法の改正により2007年10月から、事業主は労働者の募集・採用について年齢にかかわりなく均等な機会を与えなければならず、年齢制限の禁止が義務化された。合理的な理由がある場合は例外的に年齢制限が認められ、その場合を省令で定めている","used_in":"26歳って、もう遅い？"},{"source_url":"https://jsite.mhlw.go.jp/niigata-hellowork/jigyounushi/jigyounushi/nenrei.html","text":"例外事由3号のイは、長期勤続によるキャリア形成を図る観点から、若年者等を期間の定めのない労働契約の対象として募集・採用する場合で、職務経験は問えない","used_in":"26歳って、もう遅い？"}],"not_used":["年齢別の転職者数や未経験転職の成功率などの統計は使っていない","面接の話し方の例は仮の経歴をもとにした例文","年齢制限禁止のパンフレット（index03_0001.pdf）は正式な題名を確認できなかったため出典から外した"]}'::jsonb) on conflict (slug) do nothing;
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

面談の前に、自分の希望や経験をざっくり整理しておきたい場合は、[条件整理チェック](/check)を使ってみてください。整理した結果は、そのまま面談で話す材料になります。', 'review', false, '2026-09-20'::timestamptz, '2026-10-04'::timestamptz, '2026-10-04'::timestamptz, null, '2026-10-04'::timestamptz, null, null, array['mikeiken-tenshoku-hajimekata', 'donichi-yasumi-nenshu-hikaku', 'mikeiken-kenshu-kakunin']::text[], '{}'::text[], array['yaritai']::text[], array['hajimete']::text[], array['エージェント面談の前、', '何を決めておく？']::text[], null, true, '[{"q":"人材紹介会社に相談すると、お金はかかりますか？","a":"職業安定法にもとづく有料職業紹介事業では、原則として求職者から手数料を受け取ることはできず、紹介手数料は採用した企業が支払うしくみです。一部の職業では例外もあるため、気になる場合は相談先に確認しましょう。"},{"q":"面談を受けたら、必ず応募しないといけませんか？","a":"面談を受けることと応募することは別です。紹介された求人に応募するかどうかは自分で決められます。合わないと感じた求人は、理由を添えて断って構いません。"},{"q":"相談先が許可を受けた事業者かどうかは、どうやって確かめられますか？","a":"厚生労働省の「人材サービス総合サイト」で、職業紹介事業の許可番号や事業者名から検索できます。"}]'::jsonb, null, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'agent-mendan-mae' and c.slug = 'junbi' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'agent-mendan-mae' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業安定法', 'e-Gov法令検索（デジタル庁）', 'https://laws.e-gov.go.jp/law/322AC0000000141', '2026-10-04'::date, '有料職業紹介事業の手数料に関する規定', 0 from articles where slug = 'agent-mendan-mae';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '人材サービス総合サイト（職業紹介事業所検索）', '厚生労働省', 'https://jinzai.hellowork.mhlw.go.jp/JinzaiWeb/GICB101010.do?action=transition&screenId=GICB101010&params=1', '2026-10-04'::date, '職業紹介事業者の許可番号の確認方法', 1 from articles where slug = 'agent-mendan-mae';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'agent-mendan-mae' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"eb7b96169b03d9fb32d37d2f66a07d4393f1b312650b8253b06c3daf7d234336","findings":[]}'::jsonb from articles where slug = 'agent-mendan-mae';
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

利用規約の確認は、厚生労働省の求職者向けリーフレットでもすすめられています。分からない言葉があれば、登録前にそのまま質問して大丈夫です。', 'review', false, '2026-09-16'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['agent-mendan-mae', 'shigoto-sagashikata', 'mensetsu-junbi-mikeiken']::text[], '{}'::text[], array['yaritai', 'seishain']::text[], array['hajimete', 'freeter']::text[], array['エージェントに', '何を相談する？']::text[], null, false, '[{"q":"やりたい仕事が決まっていなくても、相談していいですか？","a":"大丈夫です。これまでの経験と、今の働き方で変えたいことを伝えると、考えられる職種や求人を一緒に整理しやすくなります。"},{"q":"紹介された求人を断るときは、どう伝えればいいですか？","a":"「通勤に1時間半かかるので見送ります。片道1時間以内だとありがたいです」のように、断る理由と、次に希望する条件をセットで伝えると、次に紹介される求人が希望に近づきやすくなります。"},{"q":"登録する前に、確認しておくことはありますか？","a":"厚生労働省のリーフレットでは、登録するときに利用規約をよく読み、違約金の有無や、自分の個人情報が誰に・いつまで提供されるかを確認するよう案内されています。許可を受けた事業者かどうかは、厚生労働省の「人材サービス総合サイト」で調べられます。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"既存の agent-mendan-mae（面談前に決めること）と重ならないよう、面談の場で「何を・どう頼むか」に絞り、場面ごとの相談内容と、そのまま使える相談の言い方の例を中心にする。実在の事業者名は出さない","quotes":[{"source_url":"https://jsite.mhlw.go.jp/ishikawa-roudoukyoku/hourei_seido_tetsuzuki/roudousha_haken/syoukai_gaiyou.html","text":"有料職業紹介事業は手数料または報酬を受けて行う職業紹介事業で、厚生労働大臣の許可が必要。求職者からの手数料徴収は原則禁止で、芸能家・モデル、年収700万円超の経営管理者・科学技術者・熟練技能者などに例外がある","used_in":"登録・相談の前に、ここだけ確認"},{"source_url":"https://www.mhlw.go.jp/content/000851397.pdf","text":"求職者向けリーフレット。人材サービス総合サイト（厚生労働省運営）で、許可を受けた職業紹介事業者かどうか、手数料や就職実績などの情報を確認できると案内。求職登録時には利用規約をよく確認し、特に違約金や自分の個人情報の取り扱い（誰に提供されるか、いつまで提供されるかなど）を確認する","used_in":"登録・相談の前に、ここだけ確認／FAQ"},{"source_url":"https://jinzai.hellowork.mhlw.go.jp/JinzaiWeb","text":"労働者派遣事業・職業紹介事業の許可・届出事業所を検索できる厚生労働省のサイト","used_in":"登録・相談の前に、ここだけ確認"},{"source_url":"https://www.mhlw.go.jp/content/001114167.pdf","text":"2024年4月から、募集広告や職業紹介を受ける際に明示される労働条件に、従事すべき業務の変更の範囲、就業場所の変更の範囲、有期労働契約を更新する場合の基準が追加","used_in":"聞きにくい条件ほど、先に聞く"}],"not_used":["転職エージェントの利用者数や、利用した場合の内定率などの統計は使っていない","サポートの範囲は事業者によって違うため、一般的な例として書き、最初に確認するようすすめた"]}'::jsonb) on conflict (slug) do nothing;
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

AIの影響は、職種によっても会社によっても違います。漠然とした不安で選択肢を狭めるより、作業に分けて考え、確認すべきことを確認する。それが、変化の大きい時代に仕事を選ぶうえでの現実的な向き合い方です。', 'review', false, '2026-09-26'::timestamptz, '2026-10-05'::timestamptz, '2026-10-05'::timestamptz, null, '2026-10-05'::timestamptz, null, null, array['eigyo-cs-it-support-chigai', 'mikeiken-tenshoku-hajimekata', 'news-kyouiku-kunren-kyufu']::text[], array['sonota']::text[], array['mikeiken-shokushu', 'yaritai']::text[], '{}'::text[], array['AIで変わる仕事、', '今から選んで大丈夫？']::text[], null, false, '[{"q":"AIが普及すると、未経験で入れる仕事はなくなりますか？","a":"仕事の中の一部の作業はAIなどの道具に置き換わっていく可能性がありますが、職種そのものがすぐになくなるとは限りません。どの作業が変わりやすく、どの作業が人に残りやすいかを分けて考えることが大切です。"},{"q":"転職前にAIツールを勉強しておいたほうがいいですか？","a":"専門的な勉強は必須ではありませんが、文章の下書きや調べものにAIツールを使ってみる経験は、どの職種でも役に立ちやすいです。使ってみて気づいた便利な点や注意点は、面接で話せる材料にもなります。"}]'::jsonb, null, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'ai-shigoto-mikeiken' and c.slug = 'shokushu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'ai-shigoto-mikeiken' and c.slug = 'news' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '情報通信白書', '総務省', 'https://www.soumu.go.jp/johotsusintokei/whitepaper/', '2026-10-05'::date, 'AIなどデジタル技術の利用状況に関する公的な情報源の紹介', 0 from articles where slug = 'ai-shigoto-mikeiken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業情報提供サイト（job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/', '2026-10-05'::date, '職業を作業（タスク）やスキルの単位で調べる方法', 1 from articles where slug = 'ai-shigoto-mikeiken';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'ai-shigoto-mikeiken' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"400424f0b34bb6eeb40c40e963a003b48c8c3c3577c1e9a904b7750094b2e190","findings":[]}'::jsonb from articles where slug = 'ai-shigoto-mikeiken';
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

経歴の整理のしかたは[転職回数が気になるときに整理したいこと](/articles/tenshoku-kaisu-kininaru)も参考にしてください。卒業から3年以上たっていても、未経験から応募できる中途採用の求人はあります。年齢で迷ったときは[26歳で未経験の職種に転職するのは遅い？](/articles/26sai-mikeiken)も読んでみてください。', 'review', false, '2026-09-14'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['26sai-mikeiken', 'agent-mendan-mae', 'tenshoku-kaisu-kininaru']::text[], '{}'::text[], array['mikeiken-shokushu']::text[], array['dainishinsotsu', 'hajimete']::text[], array['第二新卒って', '何歳まで？']::text[], null, false, '[{"q":"第二新卒は何歳までですか？","a":"何歳までと一律には決まっていません。学校を卒業しておおむね3年以内の人を指すことが多く、年齢より卒業からの年数で考えると分かりやすくなります。たとえば22歳で大学を卒業した場合、25歳前後までが目安です。応募できるかどうかは、求人ごとの応募条件で確認しましょう。"},{"q":"一度就職していても、新卒の枠に応募できますか？","a":"厚生労働省の指針では、卒業後少なくとも3年間は新卒の採用枠に応募できるよう、会社に努めることを求めています。ただし、すべての会社が受け付けているわけではなく、職歴のある人も応募できるかどうかは求人ごとに確かめる必要があります。募集要項の「既卒可」などの記載を確認してください。"},{"q":"卒業して3年以上たっていたら、もう応募できる求人はありませんか？","a":"そんなことはありません。「第二新卒歓迎」と書かれていなくても、未経験から応募できる中途採用の求人はあります。言葉の区切りにしばられず、仕事内容と応募条件で探してみてください。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「何歳まで」の答えを年齢で出さず、卒業からの年数と応募条件で考える。既存の review 記事 dainishinsotsu-tenshoku-timing（動くタイミング）とは別に、言葉の意味と使える場面・探し方に絞る","quotes":[{"source_url":"https://www.mhlw.go.jp/stf/houdou/2r9852000000wgq1.html","text":"青少年雇用機会確保指針を改正し、事業主は学校等の卒業者が新卒の採用枠に応募できるよう応募条件を設定し、少なくとも卒業後3年間は応募できるようにすることとした","used_in":"新卒の枠に、まだ応募できる？"},{"source_url":"https://jsite.mhlw.go.jp/tottori-roudoukyoku/hourei_seido_tetsuzuki/shokugyou_shoukai/22seishonen_shishin.html","text":"青少年の雇用の促進等に関する法律に基づく指針で、学校卒業見込者の採用枠について、既卒者が卒業後少なくとも3年間は応募できるように努めることとされている","used_in":"新卒の枠に、まだ応募できる？"},{"source_url":"https://jsite.mhlw.go.jp/tokyo-hellowork/kyushokusha/tokyo_shinsotsu/jobseeker.html","text":"大学・大学院・短大・高専・専修学校（専門課程）の学生と、卒業後おおむね3年以内の人が利用できる。卒業後3年以内であれば、在職中や就職後に離職した人も利用できる。卒業後3年を超える人などには、最寄りのハローワークやわかものハローワークの利用を案内している","used_in":"第二新卒の求人、どう探す？"}],"not_used":["第二新卒の採用数や求人倍率などの統計は使っていない","「第二新卒」の意味は公的な出典で確認できなかったため、一般的な使われ方として説明し、応募条件で確かめるよう書いた。「法律で年齢が決められた区分ではない」という記述は出典がないため削除","年齢の目安は卒業年齢からの計算例として示した"]}'::jsonb) on conflict (slug) do nothing;
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

2025年4月以降に自己都合で退職した場合、雇用保険の基本手当の給付制限期間は原則1か月になりました。ただし、受給には条件があるため、自分が対象になるかは事前に確認しましょう。', 'review', false, null, '2026-10-05'::timestamptz, null, null, null, null, null, array['mikeiken-tenshoku-hajimekata', 'agent-mendan-mae']::text[], '{}'::text[], array['yametai']::text[], array['dainishinsotsu']::text[], array['第二新卒の転職、', 'いつ動き始める？']::text[], null, false, '[]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","reviewer_todo":"退職後に活動する場合の生活費の目安について、出典付きの記述を追加するか検討"}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'dainishinsotsu-tenshoku-timing' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'dainishinsotsu-tenshoku-timing' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '雇用保険制度の改正内容について', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000160564.html', '2026-10-05'::date, '自己都合退職時の給付制限期間', 0 from articles where slug = 'dainishinsotsu-tenshoku-timing';
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

「休み」と「年収」のどちらを優先するかに正解はありません。数字の条件をそろえて比べたうえで、自分の生活に合うほうを選ぶことが、入社後の「こんなはずじゃなかった」を減らす近道です。', 'review', false, '2026-09-08'::timestamptz, '2026-10-03'::timestamptz, '2026-10-03'::timestamptz, null, '2026-10-03'::timestamptz, null, null, array['mikeiken-tenshoku-hajimekata', 'agent-mendan-mae', 'news-roudou-jouken-meiji']::text[], '{}'::text[], array['donichi', 'kyuryo']::text[], '{}'::text[], array['土日休みと年収、', 'どう比べればいい？']::text[], null, true, '[{"q":"「週休2日制」と「完全週休2日制」は何が違いますか？","a":"一般的に、完全週休2日制は毎週2日の休みがあることを指します。週休2日制は、月に1回以上は週2日の休みがある週があるという意味で使われ、毎週2日休めるとは限りません。休日の欄は、年間休日数とあわせて確認しましょう。"},{"q":"固定残業代が含まれている求人は避けたほうがいいですか？","a":"固定残業代そのものが問題というわけではありません。基本給と固定残業代がそれぞれいくらか、何時間分の残業が含まれているか、それを超えた分が追加で支払われるかを確認し、ほかの求人とそろえて比べることが大切です。"}]'::jsonb, null, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'donichi-yasumi-nenshu-hikaku' and c.slug = 'hatarakikata' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'donichi-yasumi-nenshu-hikaku' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '労働基準法', 'e-Gov法令検索（デジタル庁）', 'https://laws.e-gov.go.jp/law/322AC0000000049', '2026-10-03'::date, '法定労働時間（第32条）と法定休日（第35条）', 0 from articles where slug = 'donichi-yasumi-nenshu-hikaku';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年4月から労働条件明示のルールが変わります', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_32105.html', '2026-10-03'::date, '労働条件の明示事項', 1 from articles where slug = 'donichi-yasumi-nenshu-hikaku';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'donichi-yasumi-nenshu-hikaku' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"f7fa21047215282b511882fd42cf5021c12fa7070e50fe4dbdcddcfb9d0fa722","findings":[]}'::jsonb from articles where slug = 'donichi-yasumi-nenshu-hikaku';
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

土日休みを優先すると決めたら、まずは興味のある職種を2〜3つに絞り、求人票の休日欄を同じ見方で比べてみてください。', 'review', false, '2026-09-24'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['donichi-yasumi-nenshu-hikaku', 'eigyo-cs-it-support-chigai', 'sekkyaku-keiken-ikasu']::text[], array['jimu', 'customer-support', 'it-support']::text[], array['donichi', 'office']::text[], array['sekkyaku']::text[], array['土日休みにしたい。', 'どんな仕事がある？']::text[], null, false, '[{"q":"「完全週休2日制」なら土日休みですか？","a":"そうとは限りません。完全週休2日制は毎週2日の休みがあることを指しますが、休みの曜日は会社によって違います。「完全週休2日制（土・日）」のように曜日が書かれているか、シフト制ではないかを確認しましょう。"},{"q":"事務職なら土日休みですか？","a":"平日が中心の会社もありますが、店舗や施設の事務、土日も営業しているサービスの事務などでは、土日の勤務やシフトがあることもあります。求人票の休日欄と、面接での確認をあわせて判断しましょう。"},{"q":"年間休日が何日あれば、毎週土日休みといえますか？","a":"毎週土日が休みなら、土日だけで1年に約104日になります。これより少ない場合は、土曜日に出勤する週があるなど、毎週土日休みではない可能性があります。祝日や長期休暇が休みかどうかも、休日欄で確かめてください。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"職種名で決めつけず、「誰に合わせて働く仕事か」という見方と、求人票・面接での確かめ方を示す","quotes":[{"source_url":"https://jsite.mhlw.go.jp/chiba-roudoukyoku/content/contents/K_ex_mikata_R020106.pdf","text":"「週休二日制」欄は、完全週休二日制なら「毎週」、それ以外の形の週休二日制なら「その他」、週休二日制でなければ「なし」。「毎週」は曜日に関わらず毎週必ず2日休み、「その他」は毎週必ず2日休みとは限らない。年末年始や夏季休暇などを合わせたものが年間休日数で、週休二日制と年間休日の2つはセットで見る","used_in":"求人票の休日欄はどう読む？"},{"source_url":"https://laws.e-gov.go.jp/law/322AC0000000049","text":"第35条 使用者は、労働者に対して、毎週少くとも1回の休日を与えなければならない。4週間を通じ4日以上の休日を与える使用者には適用しない","used_in":"求人票の休日欄はどう読む？"},{"source_url":"https://www.mhlw.go.jp/stf/newpage_32105.html","text":"2024年4月1日から、労働条件の明示事項に就業場所・業務の変更の範囲が追加された。変更の範囲は将来の配置転換などの見込みも含む","used_in":"面接で確認したいこと"}],"not_used":["職種別の土日休みの割合や年間休日の平均などの統計値は使っていない。職種ごとの表は一般的な考え方として「会社によって違う」と明記"]}'::jsonb) on conflict (slug) do nothing;
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

ほかの職種も含めた比較は[職種比較ページ](/jobs)で、これまでの経験との相性は[条件整理チェック](/check)で整理できます。', 'review', false, '2026-09-02'::timestamptz, '2026-10-02'::timestamptz, '2026-10-02'::timestamptz, null, '2026-10-02'::timestamptz, null, null, array['sekkyaku-keiken-ikasu', 'ai-shigoto-mikeiken', 'mikeiken-kenshu-kakunin']::text[], array['eigyo', 'customer-support', 'it-support']::text[], array['mikeiken-shokushu', 'yaritai']::text[], '{}'::text[], array['営業・サポート・IT、', 'どこが違う？']::text[], null, true, '[{"q":"人と話すのが苦手でも、営業はできますか？","a":"営業にもいろいろなスタイルがあり、初対面の人に次々と電話をかける仕事もあれば、決まった取引先と長く付き合う仕事もあります。「話すのが苦手」の中身が、初対面が苦手なのか、断られるのがつらいのかによって、向き不向きは変わります。求人では営業先が新規か既存かを確認しましょう。"},{"q":"ITサポートは、パソコンに詳しくないと応募できませんか？","a":"未経験可の求人では、入社後の研修や先輩の同行で知識を身につける前提のものもあります。ただし、パソコンの基本操作に抵抗がないことや、新しい知識を自分で調べる習慣は求められることが多いです。研修の内容は応募前に確認しておきましょう。"},{"q":"カスタマーサポートとコールセンターは同じ仕事ですか？","a":"重なる部分は多いですが、同じとは限りません。電話の受付が中心の仕事もあれば、メールやチャットでの対応、マニュアル作成、ほかの部署への改善提案まで担当する仕事もあります。求人の仕事内容欄で、対応する手段と範囲を確認しましょう。"}]'::jsonb, null, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'eigyo-cs-it-support-chigai' and c.slug = 'shokushu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'eigyo-cs-it-support-chigai' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業情報提供サイト（job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/', '2026-10-02'::date, '各職種の仕事内容・求められるスキルの確認', 0 from articles where slug = 'eigyo-cs-it-support-chigai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年4月から労働条件明示のルールが変わります', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_32105.html', '2026-10-02'::date, '業務の変更の範囲が明示されるようになった点', 1 from articles where slug = 'eigyo-cs-it-support-chigai';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'eigyo-cs-it-support-chigai' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"194590824a5c386c135220c16cf2e5a2fa0f458d6434471300e75d7ff0819f77","findings":[]}'::jsonb from articles where slug = 'eigyo-cs-it-support-chigai';
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

確かめたうえで「やっぱり営業は合わない」と思ったら、それも大事な判断です。人と話す経験を活かせるほかの仕事は、[営業・カスタマーサポート・ITサポートの違い](/articles/eigyo-cs-it-support-chigai)で比べられます。', 'review', false, '2026-09-26'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['eigyo-cs-it-support-chigai', 'sekkyaku-keiken-ikasu', 'mikeiken-kenshu-kakunin']::text[], array['eigyo']::text[], array['mikeiken-shokushu', 'kyuryo']::text[], array['sekkyaku', 'hajimete']::text[], array['営業って怖い？', '中身を分けて考える。']::text[], null, false, '[{"q":"ノルマがない営業の仕事はありますか？","a":"営業は、売上や契約件数などの目標が置かれていることが多い仕事です。目標があるかどうかより、個人の目標かチームの目標か、未経験で入った人の最初の目標はどう決めるか、届かなかったときにどんなフォローがあるかを確認しておくことが大切です。"},{"q":"インセンティブの割合が高い求人は避けたほうがいいですか？","a":"一概には言えません。労働基準法第27条では、歩合給（出来高払制）で働く人についても、会社は働いた時間に応じた一定額の賃金を保障しなければならないと定められていますが、条文に具体的な金額は書かれていません。成果がなかった月でも固定給だけで生活できるかを、求人票で確認しましょう。"},{"q":"人見知りでも営業の仕事はできますか？","a":"話し上手かどうかより、相手の話を聞いて困りごとを整理する場面も多い仕事です。すでに取引のある相手をくり返し訪ねるルート営業や、問い合わせをくれた相手に案内する反響営業など、営業のやり方ごとに自分に合いそうかを考えてみましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「営業が怖い」を、ノルマ・飛び込み・電話・断られる・給料の振れ幅に分け、営業のやり方の違いと、不安ごとの確認のしかた・質問例を示す。eigyo-cs-it-support-chigai（3職種の比較）とは重ならないよう、営業の中の違いと不安の分解に絞る","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/User/SaleOccupations","text":"新規開拓営業は商品やサービスを知らない相手にも販売するため断られることが多い。ルート営業はすでに取引がある顧客を回り、信頼関係を築いて困りごとを聞き出す。反響営業は問い合わせや資料請求をくれた顧客に対する営業活動。","used_in":"営業の種類で、中身はかなり違う"},{"source_url":"https://laws.e-gov.go.jp/law/322AC0000000049","text":"第27条 出来高払制その他の請負制で使用する労働者については、使用者は、労働時間に応じ一定額の賃金の保障をしなければならない。","used_in":"不安ごとに、何を確認する？"}]}'::jsonb) on conflict (slug) do nothing;
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

整理したことをもとに、自分の場合はどんな選択肢がありそうかを人に相談してみるのも、遠回りに見えて近道になることがあります。', 'review', true, '2026-09-30'::timestamptz, '2026-10-05'::timestamptz, '2026-10-05'::timestamptz, null, '2026-10-05'::timestamptz, null, null, array['mikeiken-tenshoku-hajimekata', 'sekkyaku-keiken-ikasu', 'agent-mendan-mae']::text[], '{}'::text[], array['seishain', 'mensetsu']::text[], array['freeter', 'seishain-keiken-sukunai']::text[], array['フリーターから正社員、', '最初に何を確認する？']::text[], null, false, '[{"q":"アルバイト経験しかないと、正社員の書類選考に通らないのでしょうか？","a":"アルバイト経験しかないことだけで判断されるわけではありません。未経験者を対象にした求人では、これまでの経験の中身や、働くことへの姿勢、入社後に学ぶ意欲などもあわせて見られます。担当していた業務を具体的に書くことが大切です。"},{"q":"空白期間があるのですが、どう説明すればいいですか？","a":"空白期間に何をしていたのかを、事実として簡潔に伝えましょう。資格の勉強や家庭の事情など理由はさまざまです。そのうえで「今は働く準備ができていること」「これから何をしたいか」を添えると、前向きに伝わりやすくなります。"}]'::jsonb, null, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'freeter-seishain-hajimeni' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'freeter-seishain-hajimeni' and c.slug = 'keiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年4月から労働条件明示のルールが変わります', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_32105.html', '2026-10-05'::date, '契約期間・更新上限など、雇用形態にかかわる労働条件の明示', 0 from articles where slug = 'freeter-seishain-hajimeni';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ハローワークインターネットサービス', '厚生労働省', 'https://www.hellowork.mhlw.go.jp/', '2026-10-05'::date, '公的な求人検索・職業相談の窓口の紹介', 1 from articles where slug = 'freeter-seishain-hajimeni';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '人材サービス総合サイト（職業紹介事業所検索）', '厚生労働省', 'https://jinzai.hellowork.mhlw.go.jp/JinzaiWeb/GICB101010.do?action=transition&screenId=GICB101010&params=1', '2026-10-05'::date, '民間の職業紹介事業者の許可の確認方法', 2 from articles where slug = 'freeter-seishain-hajimeni';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'freeter-seishain-hajimeni' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"bd84dba48a6b066bd69aa9e70fb97b228391a37c40c819a59e98bbe17f40b5a3","findings":[]}'::jsonb from articles where slug = 'freeter-seishain-hajimeni';
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

アルバイトから正社員を目指すときの考え方は[フリーターから正社員を目指すとき、最初に確認したいこと](/articles/freeter-seishain-hajimeni)も参考になります。正社員を目指す人向けの記事は[正社員になりたい](/concerns/seishain)にまとめています。', 'review', false, '2026-09-11'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['freeter-seishain-hajimeni', 'donichi-yasumi-nenshu-hikaku', 'mikeiken-tenshoku-hajimekata']::text[], '{}'::text[], array['seishain', 'kyuryo']::text[], array['haken']::text[], array['派遣から正社員、', '何から考える？']::text[], null, false, '[{"q":"紹介予定派遣とは何ですか？","a":"派遣先の会社に直接雇われることを前提に、まず派遣社員として働く方法です。派遣で働く期間は6か月までで、その間に会社と本人の双方が、仕事や職場が合うかを確かめます。双方が合意すれば直接雇用になります。直接雇用後が正社員か契約社員かは求人によって違うので、始める前に確認しましょう。"},{"q":"同じ派遣先で3年働くとどうなりますか？","a":"同じ派遣先の同じ部署（組織単位）で、同じ人が派遣として働ける期間は、原則として3年までです。3年続けて働く見込みがある人には、派遣会社が、派遣先への直接雇用の依頼、新しい派遣先の紹介、派遣会社での期間の定めのない雇用などの措置をとることになっています。"},{"q":"派遣の経験は、職務経歴書にどう書けばいいですか？","a":"派遣元（派遣会社）と派遣先、働いた期間、担当した仕事を分けて書くと伝わりやすくなります。派遣先の会社名を書いてよいか迷うときは、「食品メーカーの営業部」のように業種と部署で書く方法もあります。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"派遣から正社員への道を3つに分け、期間のルールと雇用安定措置を「自分から相談できる節目」として示す。給料は時給と月給を年額にそろえて比べる","quotes":[{"source_url":"https://www.mhlw.go.jp/file/06-Seisakujouhou-11650000-Shokugyouanteikyokuhakenyukiroudoutaisakubu/0000097169.pdf","text":"同一の派遣労働者を派遣先の事業所における同一の組織単位に対し派遣できる期間は3年が限度。同一の組織単位に継続して3年間派遣される見込みがある人には、派遣元から派遣先への直接雇用の依頼、新たな派遣先の提供、派遣元での無期雇用、その他安定した雇用の継続を図るための措置が講じられる","used_in":"同じ職場で3年たつとどうなる？"},{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000077386.html","text":"平成27年労働者派遣法改正法は2015年9月11日成立、9月30日施行。派遣労働者の雇用の安定とキャリアアップを図る改正で、派遣労働者向けのQ&Aなどを掲載","used_in":"同じ職場で3年たつとどうなる？"},{"source_url":"https://www.mhlw.go.jp/content/001370982.pdf","text":"紹介予定派遣は、派遣元が派遣の開始前または開始後に派遣労働者と派遣先に職業紹介を行う（予定する）もの。同一の派遣労働者について派遣期間は6か月以内。派遣先は面接・履歴書の受付など派遣労働者を特定する行為を行える","used_in":"派遣から正社員になる道は？"},{"source_url":"https://www.mhlw.go.jp/mobile/m/job/040104.html","text":"紹介予定派遣以外の派遣では、派遣先が派遣労働者を特定することを目的とする事前面接などは原則禁止","used_in":"派遣から正社員になる道は？"},{"source_url":"https://www.rodo.co.jp/faq/193836/","text":"派遣先は、同一の事業所等で1年以上継続して受け入れている派遣労働者がいる場合、その事業所等で通常の労働者（正社員）を募集するときは、募集情報をその派遣労働者に周知しなければならない（派遣法40条の5）","used_in":"派遣から正社員になる道は？"}],"not_used":["派遣社員の平均時給や正社員の平均年収などの統計は使っていない。給料の比較表は仮の数字","職務経歴書の書き出し例の派遣元は「〇〇株式会社」とし、実在の会社名は使っていない","content/001370982.pdf は紹介予定派遣の検索で繰り返し結果に出たが、正式な題名は確認できていないため、題名は内容を表す仮のものにした"]}'::jsonb) on conflict (slug) do nothing;
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

「今の仕事を続ける」か「まったく別の仕事に移る」かの二択ではなく、慣れた仕事で正社員になるという選択肢も入れて、比べてみてください。', 'review', false, '2026-09-03'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['freeter-seishain-hajimeni', 'sekkyaku-keiken-ikasu', 'donichi-yasumi-nenshu-hikaku']::text[], array['hanbai']::text[], array['seishain', 'kyuryo']::text[], array['freeter', 'sekkyaku']::text[], array['販売・接客のまま、', '正社員になる道。']::text[], null, false, '[{"q":"アルバイトの経験は、正社員の応募で経験として見てもらえますか？","a":"会社によって扱いが違います。同じ業界の経験として見てくれる会社もあれば、正社員としての経験とは分けて考える会社もあります。どちらの場合も、何年、どんな仕事を任されていたかを具体的に書くと伝わりやすくなります。"},{"q":"店長になると、残業代は出なくなるのですか？","a":"店長という役職名だけで決まるわけではありません。厚生労働省は、労働基準法の「管理監督者」に当たるかどうかは、役職名ではなく、仕事の内容や責任と権限、働き方、待遇などの実態で判断されるとしています。店長になったあとの給与のしくみは、入社前に確認しておきましょう。"},{"q":"正社員になると、転勤や異動はありますか？","a":"会社によって違います。2024年4月から、求人の募集時などに「就業場所の変更の範囲」が示されるようになったので、どの地域の店舗に異動する可能性があるかを求人票や面接で確認しましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"別職種への転職だけでなく、慣れた販売・接客で正社員を目指す選択肢を示す。アルバイトと正社員の違い、時給と月給のそろえ方、店長候補求人の確認点（休日・シフト・異動の範囲・店長後の給与）、アルバイト経験の伝え方。評価は会社によると明記する","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/73","text":"勤務時間は店舗の営業時間に合わせ、正社員は早番・遅番の2交替制が一般的。土日祝日も営業している店が多く、交代で休みを取って週休2日を確保する。経験を積むと商品の仕入れや在庫管理を任されることもある。","used_in":"アルバイトと正社員、何が変わる？"},{"source_url":"https://www.mhlw.go.jp/stf/newpage_32105.html","text":"2024年4月1日から職業安定法施行規則の改正により、求職者に明示する労働条件に就業場所・業務の変更の範囲などが追加された。","used_in":"店長候補などの求人で、確認したいことは？"},{"source_url":"https://www.mhlw.go.jp/bunya/roudoukijun/dl/kanri.pdf","text":"管理監督者に当てはまるかどうかは、役職名ではなく、その職務内容、責任と権限、勤務態様等の実態によって判断する。店長を管理職と位置づけていても、十分な権限や相応の待遇がなければ管理監督者には当たらず、残業手当を支払わなくてよいことにはならない。","used_in":"店長候補などの求人で、確認したいことは？"},{"source_url":"https://www.mhlw.go.jp/houdou/2008/09/h0909-2.html","text":"2008年9月9日、多店舗展開する小売業・飲食業等の店舗の店長等について、管理監督者に当たるかどうかの具体的な判断要素を整理した通達を発出。","used_in":"店長候補などの求人で、確認したいことは？"},{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000181329.html","text":"わかものハローワークは、正社員を目指す若者（おおむね35歳未満）を対象に、担当者制による職業相談などを無料で行っている。","used_in":"その先の選択肢は？"}]}'::jsonb) on conflict (slug) do nothing;
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

最後の質問は、未経験の人にとって特に大事です。研修の確認のしかたは[未経験求人の「研修あり」で確認すべきこと](/articles/mikeiken-kenshu-kakunin)にまとめています。どの事務が自分に合いそうかを決めてから求人を見ると、比べやすくなります。', 'review', true, '2026-10-05'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['pc-nigate-jimu', 'sekkyaku-keiken-ikasu', 'mikeiken-kenshu-kakunin']::text[], array['jimu']::text[], array['office', 'mikeiken-shokushu']::text[], array['sekkyaku', 'pc-mikeiken']::text[], array['未経験から事務職へ。', '最初に知っておきたいこと']::text[], null, false, '[{"q":"事務職は、資格がないと応募できませんか？","a":"求人によって違います。応募条件の欄に資格が書かれていなければ、資格がなくても応募できます。資格の有無よりも、「表計算ソフトで入力と合計の計算ができる」のように、できる操作を具体的に伝えられるほうが判断材料になりやすいです。"},{"q":"一般事務と営業事務、未経験ならどちらがいいですか？","a":"どちらが向いているかは人によります。一般事務は書類やデータの管理、電話の取り次ぎなど社内の仕事を支えることが中心です。営業事務は営業担当の依頼で見積書を作ったり、取引先からの電話やメールに応えたりと、社外とのやりとりも入ってきます。人と話すのが苦にならないなら、営業事務も候補に入れてみてください。"},{"q":"事務職は、あまり人と話さない仕事ですか？","a":"パソコン作業が中心ですが、電話の取り次ぎや来客への対応、社内からの依頼の受け付けなど、人とのやりとりもあります。どのくらいの割合かは職場によって違うので、面接で「1日のうち電話や来客対応はどのくらいありますか」と聞いてみましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「事務＝座ってPC作業」というイメージを、種類ごとの中身と電話・来客対応の実際に分けて整理する","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/428","text":"一般事務は特定の分野に限らず定型的な事務を行う。書類の作成・整理、メール対応、伝票の作成・管理、各種台帳の管理、データ入力、郵便物の発送・仕分け、電話の取り次ぎ、来客の対応やお茶出しの補助など。書類作成や集計にはパソコンを使い、コピー機・FAXなどの事務機器もよく使う。","used_in":"事務職って、どんな仕事？ / パソコンはどのくらい使える必要がある？ / 電話や来客の対応もある？"},{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/431","text":"営業事務は営業担当者の指示で資料や見積書を作成し、契約・売上・入金の管理、顧客からの電話・メールでの問い合わせ対応、見積書・納品書の作成などを行う。別名に営業アシスタント、受発注管理事務員。","used_in":"事務職って、どんな仕事？"},{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/430?media=4876","text":"経理事務は会計・財務管理のソフトやシステムを使い、入出金伝票や振替伝票の作成、現金出納帳・総勘定元帳への記録を行う。月末には勘定科目を集計して残高を確定し、実際の預金残高と照合する。","used_in":"事務職って、どんな仕事？"},{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/427","text":"受付事務（別名 案内係・会社受付係）は来訪者の用件を確認して担当部署に取り次ぎ、会議室などへ案内する。来訪者の記録や電話の取り次ぎの補助も行う。","used_in":"事務職って、どんな仕事？"},{"source_url":"https://shigoto.mhlw.go.jp/","text":"job tag は厚生労働省の職業情報提供サイトで、500以上の職業について仕事内容や必要なスキルなどを調べられる。","used_in":"未経験でも応募できる？"}]}'::jsonb) on conflict (slug) do nothing;
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
```', 'review', false, '2026-09-09'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['sekkyaku-keiken-ikasu', 'mikeiken-tenshoku-hajimekata']::text[], array['jinji']::text[], array['office', 'mikeiken-shokushu']::text[], array['sekkyaku']::text[], array['人事・採用の仕事、', '未経験からどう近づく？']::text[], null, false, '[{"q":"人事の仕事は、未経験でも応募できますか？","a":"求人によります。人事の経験を応募条件にしている求人もあれば、採用アシスタントや人事事務のように、事務の基本ができれば応募できる求人もあります。まずは応募条件の欄で「経験」が必須かどうかを確かめましょう。"},{"q":"資格がないと、人事の仕事はできませんか？","a":"応募条件に資格が書かれていなければ、資格がなくても応募できます。勤怠や給与、社会保険の手続きなどは、担当する仕事に合わせて入社後に学んでいく方法もあります。面接で、入社後にどう教わるかを確かめておくと安心です。"},{"q":"「人と話すのが好き」だけでは、志望動機として弱いですか？","a":"それだけだと伝わりにくくなります。人事の仕事は、応募者や社員とのやりとりに加えて、書類やデータを正確に扱う場面も多いからです。「話す」経験と「正確に進める」経験の両方を、具体的な場面で伝えるのがおすすめです。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"人事の仕事を分解し、未経験の入口（採用アシスタント・人事事務）と、接客・アルバイトリーダー経験の結びつけ方を示す","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/432","text":"人事事務は、社員の採用から退職までの人事管理に関する事務を行う（job tag の事務系の職業の一つ）。","used_in":"人事の仕事って、何をしている？"},{"source_url":"https://kouseisaiyou.mhlw.go.jp/","text":"公正な採用選考では、応募者の適性と能力で判断することが求められる。就職差別につながるおそれがある14事項を示している。","used_in":"知っておきたい「公正な採用選考」"},{"source_url":"https://jsite.mhlw.go.jp/shiga-roudoukyoku/hourei_seido_tetsuzuki/shokugyou_shoukai/kouseinasaiyousennkou_00142.html","text":"採用選考の基本は、応募者の基本的人権を尊重すること、応募者の適性と能力に基づいた基準により行うこと。","used_in":"知っておきたい「公正な採用選考」"},{"source_url":"https://kouseisaiyou.mhlw.go.jp/question.html","text":"本籍・出生地、家族構成や家族の職業など本人の適性・能力と関係のない事項や、思想・信条・宗教など憲法で保障された自由にかかわる事項を採用選考で尋ねることは、就職差別につながるおそれがある。","used_in":"知っておきたい「公正な採用選考」"}]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'jinji-saiyo-mikeiken' and c.slug = 'shokushu' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '人事事務 - 職業詳細（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/Occupation/Detail/432', '2026-10-06'::date, '人事事務が、社員の採用から退職までの人事管理に関する事務を行う仕事であること', 0 from articles where slug = 'jinji-saiyo-mikeiken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '公正採用選考特設サイト', '厚生労働省', 'https://kouseisaiyou.mhlw.go.jp/', '2026-10-06'::date, '公正な採用選考は応募者の適性と能力で判断すること', 1 from articles where slug = 'jinji-saiyo-mikeiken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '公正な採用選考について', '滋賀労働局', 'https://jsite.mhlw.go.jp/shiga-roudoukyoku/hourei_seido_tetsuzuki/shokugyou_shoukai/kouseinasaiyousennkou_00142.html', '2026-10-06'::date, '公正な採用選考の基本（応募者の基本的人権の尊重、適性と能力に基づいた基準）', 2 from articles where slug = 'jinji-saiyo-mikeiken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '就職差別につながるおそれがある質問（公正採用選考特設サイト）', '厚生労働省', 'https://kouseisaiyou.mhlw.go.jp/question.html', '2026-10-06'::date, '本籍・出生地や家族のこと、思想・宗教など、就職差別につながるおそれがあり採用選考で聞かないよう求められている事項', 3 from articles where slug = 'jinji-saiyo-mikeiken';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'jinji-saiyo-mikeiken' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"3356cd6762455237137b256895b5356ca22040f3d76f06f1c089b74ad0924ef6","findings":[]}'::jsonb from articles where slug = 'jinji-saiyo-mikeiken';
update articles set status = 'published' where slug = 'jinji-saiyo-mikeiken';

-- article: kyujin-hyo-yomikata (draft)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('kyujin-hyo-yomikata', 'article', '求人票の「未経験歓迎」「学歴不問」はどう読む？', '求人票によく出てくる言葉の意味と、その言葉だけでは分からないことを整理する記事（執筆中）。', '（執筆中のドラフトです。status が draft のため、公開ページには表示されません。本文が存在しても、査読と公開承認を経るまでは公開されません。）

## 「未経験歓迎」が意味すること

「未経験歓迎」は、その職種の経験がない人の応募を受け付けているという意味で使われることが多い表現です。ただし、入社後の研修の内容や、求められる基本的なスキルは求人ごとに違います。', 'draft', false, null, '2026-10-06'::timestamptz, null, null, null, null, null, '{}'::text[], '{}'::text[], '{}'::text[], '{}'::text[], '{}'::text[], null, false, '[]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","brief":"求人票の定型表現の読み方。出典候補を調査中。"}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'kyujin-hyo-yomikata' and c.slug = 'junbi' on conflict do nothing;
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'kyujin-hyo-yomikata' on conflict do nothing;

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

こうした質問に、無理に答える必要はありません。気になる質問をされたときは、ハローワーク（公共職業安定所）や都道府県労働局に相談できます。', 'review', false, '2026-09-25'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['shiboudouki-mikeiken', 'mikeiken-kenshu-kakunin', 'shokumu-keirekisho-arubaito']::text[], '{}'::text[], array['mensetsu', 'mikeiken-shokushu']::text[], array['hajimete', 'seishain-keiken-sukunai']::text[], array['面接が不安。', '何を準備する？']::text[], null, false, '[{"q":"面接で家族のことを聞かれたら、答えないといけませんか？","a":"厚生労働省は、家族の職業や収入など、本人の適性・能力と関係のない事項を面接で尋ねることは就職差別につながるおそれがあるとして、企業に配慮を求めています。答えにくい質問に無理に答える必要はありません。気になる質問をされたときは、ハローワークや都道府県労働局に相談できます。"},{"q":"逆質問で「特にありません」と答えるのはだめですか？","a":"だめというわけではありませんが、入社後の働き方を知るよい機会です。研修のあとの流れや、未経験で入社した人が最初に任される仕事など、自分が判断するために知りたいことを1〜2個用意しておくと安心です。"},{"q":"未経験であることは、どう伝えればいいですか？","a":"隠す必要はありません。聞かれたら未経験であることを認めたうえで、近い経験、今準備していること、入社後に取り組みたいことの順につなげて話すと伝わりやすくなります。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"未経験職種の面接で聞かれやすい4つの質問ごとに準備のしかたと答え方の例を示し、逆質問・オンライン面接・答えなくていい質問（公正な採用選考）までを一つの準備リストとしてまとめる","quotes":[{"source_url":"https://kouseisaiyou.mhlw.go.jp/basic.html","text":"公正な採用選考の基本は、応募者の基本的人権を尊重すること、応募者の適性・能力のみを基準として行うこと","used_in":"答えなくていい質問もある"},{"source_url":"https://kouseisaiyou.mhlw.go.jp/consider.html","text":"就職差別につながるおそれがある14事項。本人に責任のない事項（本籍・出生地、家族、住宅状況、生活環境・家庭環境）と、本来自由であるべき事項（宗教、支持政党、人生観・生活信条、思想、労働組合・学生運動など）を応募書類や面接で把握しない","used_in":"答えなくていい質問もある／FAQ"},{"source_url":"https://kouseisaiyou.mhlw.go.jp/jobseekers.html","text":"面接などで本人の適性・能力以外の事項を把握された事例を紹介し、不適切な質問があった場合は最寄りのハローワークや都道府県労働局に相談できると案内","used_in":"答えなくていい質問もある／FAQ"},{"source_url":"https://www.hellowork.mhlw.go.jp/doc/oubosyorui_pamphlet_202406.pdf","text":"面接では提出した履歴書（職務経歴書を含む）の記載内容に基づいて質問されることが多いので、完成した書類をコピーしておき、面接前に確認する","used_in":"何を聞かれる？まずは4つを準備"}],"not_used":["面接でよく聞かれる質問のランキングや、面接の通過率などの統計は使っていない","オンライン面接の確認事項は一般的な準備として書き、公的な基準としては扱っていない"]}'::jsonb) on conflict (slug) do nothing;
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

自分に合うかを考えるときは、スマホやパソコンで困ったときに自分で調べて直した経験を思い出してみてください。調べることが苦にならないかどうかは、ITの仕事との相性を考えるヒントになります。ほかの職種との違いは[営業・カスタマーサポート・ITサポートの違い](/articles/eigyo-cs-it-support-chigai)で比べられます。', 'review', false, '2026-10-03'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['eigyo-cs-it-support-chigai', 'mikeiken-kenshu-kakunin', 'pc-nigate-jimu']::text[], array['it-support']::text[], array['mikeiken-shokushu']::text[], array['pc-mikeiken', 'hajimete']::text[], array['未経験のIT、', '最初はどんな仕事？']::text[], null, false, '[{"q":"ITパスポートを持っていないと、ITの仕事に応募できませんか？","a":"応募条件に書かれていなければ、資格がなくても応募できます。ITパスポート試験は受験資格のない国家試験なので、ITの基礎を学ぶときの目標として使うのは一つの方法です。"},{"q":"夜勤がある仕事は避けたほうがいいですか？","a":"一概には言えません。システムを夜も止められない職場では、交替制のシフトや夜勤がある場合があります。夜勤の回数、手当、休みの取り方を確認して、自分の生活に合うかどうかで判断しましょう。"},{"q":"パソコンが得意じゃなくても、ITの仕事を目指せますか？","a":"入社後に覚えることは多いので、研修の内容や、一人で対応するようになるまでの期間を確認しておくことが大切です。スマホやパソコンで困ったときに自分で調べる習慣をつけておくと、入社後の負担が軽くなります。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「IT＝プログラミング」の思い込みをほどき、未経験の入口になりやすい支える仕事と、入社前の確認点（研修・勤務時間・働く場所・その後）を示す。資格は必須扱いしない","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/User/ITRelatedWorkByProcess","text":"IT関連の仕事を工程別（企画・営業・設計や構築・運用や保守など）に分けて紹介。運用・保守には「運用・管理（IT）」（サーバーや情報システムがトラブルや不具合で止まらず安定して動き続けるよう運用・管理する）と「ヘルプデスク（IT）」が含まれる。","used_in":"「IT＝プログラミング」だけじゃない？／入口になりやすいのは、どんな仕事？"},{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/540","text":"ソフトウェアの誤り（バグ）を見つける仕事。見つかったバグを一覧表にまとめて開発担当者に連絡する。QAテスターなどの名称もある。","used_in":"入口になりやすいのは、どんな仕事？"},{"source_url":"https://www.ipa.go.jp/shiken/kubun/ip.html","text":"ITパスポート試験はIPAが実施する国家試験で、職業人が共通に備えておくべきITに関する基礎的な知識を対象とする。CBT方式で随時実施。受験資格の制限はない。","used_in":"ITパスポートは取ったほうがいい？"},{"source_url":"https://www.mhlw.go.jp/stf/newpage_32105.html","text":"2024年4月1日から職業安定法施行規則の改正により、求職者に明示する労働条件に就業場所・業務の変更の範囲などが追加された。","used_in":"入社前に確認したいことは？"}]}'::jsonb) on conflict (slug) do nothing;
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

研修以外に面談で確認したいことは、[エージェント面談前に決めておくこと・決めなくていいこと](/articles/agent-mendan-mae)にまとめています。', 'review', false, '2026-09-12'::timestamptz, '2026-09-30'::timestamptz, '2026-09-30'::timestamptz, null, '2026-09-30'::timestamptz, null, null, array['eigyo-cs-it-support-chigai', 'agent-mendan-mae', 'mikeiken-tenshoku-hajimekata']::text[], '{}'::text[], array['mikeiken-shokushu', 'mensetsu']::text[], array['dainishinsotsu', 'hajimete']::text[], array['「研修あり」の求人、', '何を確かめる？']::text[], null, true, '[{"q":"研修について質問すると、やる気がないと思われませんか？","a":"聞き方次第です。「早く一人前になりたいので、最初の数か月でどんなことを学ぶのか知りたい」のように、前向きな理由を添えて聞けば、意欲の表れとして受け取られることが多いです。"},{"q":"研修期間中の給与は、通常と違うことがありますか？","a":"会社によっては、研修期間や試用期間中の給与や待遇が本採用後と異なる場合があります。求人票や労働条件の説明で、期間と条件を確認しておきましょう。"}]'::jsonb, null, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'mikeiken-kenshu-kakunin' and c.slug = 'junbi' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'mikeiken-kenshu-kakunin' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職場情報の提供制度', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000122234.html', '2026-09-30'::date, '若者雇用促進法にもとづく職場情報（研修の有無及び内容など）の提供', 0 from articles where slug = 'mikeiken-kenshu-kakunin';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年4月から労働条件明示のルールが変わります', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_32105.html', '2026-09-30'::date, '試用期間や業務の変更の範囲など、明示される労働条件の確認', 1 from articles where slug = 'mikeiken-kenshu-kakunin';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'mikeiken-kenshu-kakunin' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"6cb37eaa61d78cd1e24302102417ea3bfcaac6d4810264c2168baee65a2b73a1","findings":[]}'::jsonb from articles where slug = 'mikeiken-kenshu-kakunin';
update articles set status = 'published' where slug = 'mikeiken-kenshu-kakunin';

-- article: mikeiken-tenshoku-hajimekata (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('mikeiken-tenshoku-hajimekata', 'article', '未経験転職は何から始める？最初に整理したい5つのこと', '求人を眺める前に「転職したい理由」「経験」「希望条件」「比べる職種」「スケジュール」の5つを整理しておくと、求人の良し悪しを自分の基準で判断しやすくなります。それぞれの整理のしかたを具体的に紹介します。', '未経験から転職を考え始めたとき、多くの人が最初につまずくのは「何から手をつければいいのか分からない」ことです。求人サイトを開いても、職種も条件も幅が広すぎて、どれが自分に合っているのか判断できません。

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

整理したメモは完成品である必要はありません。調べたり人と話したりする中で、何度書き直しても大丈夫です。大切なのは、求人を見る前に「自分にとって何が大事か」の手がかりを持っておくことです。', 'review', true, '2026-08-18'::timestamptz, '2026-10-01'::timestamptz, '2026-10-01'::timestamptz, null, '2026-10-01'::timestamptz, '未経験転職は何から始める？最初に整理したい5つのこと', '未経験転職の最初の一歩は、求人探しより「整理」です。転職理由・経験・希望条件・比べる職種・スケジュールの5つを、書き出し例つきで解説します。', array['agent-mendan-mae', 'donichi-yasumi-nenshu-hikaku', 'eigyo-cs-it-support-chigai']::text[], '{}'::text[], array['mikeiken-shokushu', 'yaritai']::text[], array['hajimete']::text[], array['未経験の転職、', '何から始める？']::text[], null, false, '[{"q":"自分には強みと言えるような経験がありません。それでも整理する意味はありますか？","a":"あります。整理の目的は「すごい経験」を探すことではなく、どんな作業をどのくらい続けてきたかを事実として並べることです。アルバイトのシフト管理や新人への説明なども、書き出してみると仕事選びの材料になります。"},{"q":"転職したい理由が不満ばかりです。ネガティブでも大丈夫でしょうか？","a":"最初は不満のままで構いません。そのうえで「その不満がなくなったら、次はどうなっていたいか」に言い換えると、求人を比べるときの基準として使えるようになります。"},{"q":"整理にはどれくらい時間をかければいいですか？","a":"目安は1〜2週間です。完璧に仕上げる必要はなく、5つの項目に一度メモを書けたら、職種を調べたり相談したりしながら書き直していくほうが進めやすくなります。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"求人探しの前に、比較の基準を作る"}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'mikeiken-tenshoku-hajimekata' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'mikeiken-tenshoku-hajimekata' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業情報提供サイト（job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/', '2026-10-01'::date, '職種ごとの仕事内容を調べる方法の紹介', 0 from articles where slug = 'mikeiken-tenshoku-hajimekata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年4月から労働条件明示のルールが変わります', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_32105.html', '2026-10-01'::date, '求人や内定時に確認できる労働条件の範囲', 1 from articles where slug = 'mikeiken-tenshoku-hajimekata';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'mikeiken-tenshoku-hajimekata' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"e1f1996bcc2e49d27a88694ea6829ad4ac5cbb6227a4c51b85aa5578ed1f339e","findings":[]}'::jsonb from articles where slug = 'mikeiken-tenshoku-hajimekata';
update articles set status = 'published' where slug = 'mikeiken-tenshoku-hajimekata';

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
```', 'review', false, '2026-09-18'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['donichi-yasumi-nenshu-hikaku', 'mikeiken-kenshu-kakunin', 'tenshoku-kaisu-kininaru']::text[], '{}'::text[], array['kyuryo', 'yametai']::text[], array['hajimete', 'kaisu']::text[], array['年収が高い求人、', 'それだけで決めていい？']::text[], null, false, '[{"q":"年収が高い求人は、避けたほうがいいですか？","a":"避ける必要はありません。固定残業代が含まれている、成果に応じた給与が含まれている、休日が少ないなど、年収が高い理由を確かめたうえで、自分が続けられる働き方かどうかで判断しましょう。"},{"q":"固定残業代がある求人では、何を確認すればいいですか？","a":"固定残業代を除いた基本給、何時間分の残業代でいくらか、その時間を超えた分が追加で支払われるかの3つです。あわせて、配属予定の部署で実際にどのくらい残業があるかも、面接で聞いておくと安心です。"},{"q":"年収以外では、何を優先して見ればいいですか？","a":"休み、勤務時間、仕事内容の3つが、続けやすさに大きく関わります。未経験で入る場合は、研修や入社後のフォローの体制も確認しておきましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"時給換算（donichi-yasumi-nenshu-hikaku）とは別の角度で、「続けられるか」と「次の転職への影響」から年収以外の比べ方を示す","quotes":[{"source_url":"https://www.mhlw.go.jp/content/11600000/000498453.pdf","text":"固定残業代制を採用する場合は、募集要項や求人票などに、固定残業代を除いた基本給の額、固定残業代に関する労働時間数と金額等の計算方法、固定残業時間を超える時間外労働等に割増賃金を追加で支払う旨の3つを明示する（若者雇用促進法に基づく指針）","used_in":"年収が高いのはなぜ？"},{"source_url":"https://www.mhlw.go.jp/stf/newpage_32105.html","text":"2024年4月1日から、労働条件の明示事項に就業場所・業務の変更の範囲が追加された。変更の範囲は将来の配置転換などの見込みも含む","used_in":"続けられるかは「休み・時間・仕事内容」で変わる"},{"source_url":"https://www.mhlw.go.jp/content/001114110.pdf","text":"2024年4月1日から、労働者の募集や求人の申込みの際に明示すべき労働条件に、従事すべき業務の変更の範囲、就業場所の変更の範囲、有期労働契約を更新する場合の基準が追加された（改正職業安定法施行規則）","used_in":"続けられるかは「休み・時間・仕事内容」で変わる"}],"not_used":["早期離職率や平均勤続年数などの統計値は使っていない"]}'::jsonb) on conflict (slug) do nothing;
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

パソコンの操作は、使う回数が増えるほど慣れていきます。「苦手だから無理」と決める前に、5つの項目のうち1つから始めてみてください。パソコンの仕事が初めての人に向けた記事は、[パソコンの仕事をしたことがない人へ](/situations/pc-mikeiken)のページにまとめています。', 'review', false, '2026-09-29'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['sekkyaku-office', 'mikeiken-kenshu-kakunin', 'eigyo-cs-it-support-chigai']::text[], array['jimu']::text[], array['office', 'mikeiken-shokushu']::text[], array['pc-mikeiken']::text[], array['PCが苦手でも、', '事務職って目指せる？']::text[], null, true, '[{"q":"タイピングが遅くても、事務職に応募していいですか？","a":"応募条件に入力の速さが書かれていなければ、応募して構いません。そのうえで、見ないで打てるように練習を続けておくと、入社後の負担が軽くなります。面接では「今どのくらい打てて、どんな練習をしているか」を伝えると印象が変わります。"},{"q":"MOSなどの資格は取ったほうがいいですか？","a":"応募条件に書かれていなければ、資格がなくても応募できます。MOSは受験資格の制限がなく、パソコンで実際にソフトを操作して答える試験なので、練習の目標として使うのは一つの方法です。資格よりも「何ができるか」を具体的に言えることが大切です。"},{"q":"パソコンを持っていなくても練習できますか？","a":"文字入力の練習やメールの書き方はスマートフォンでもある程度はできますが、表計算ソフトの操作はパソコンで練習したほうが身につきやすいです。仕事を探している人は、ハローワークで公的職業訓練（ハロートレーニング）について相談する方法もあります。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「PCが苦手」を分解し、事務でよく使う操作から順に練習する道筋を示す。資格は必須扱いしない","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/428","text":"一般事務は書類の作成・整理、メール対応、伝票、データ入力などを行う。書類作成や集計にはパソコンを使い、コピー機・FAXなどの事務機器もよく使う。","used_in":"事務でよく使うのは、どんな操作？"},{"source_url":"https://mos.odyssey-com.co.jp/","text":"MOSはWord・Excel・PowerPoint・Access・Outlookの操作スキルを証明する資格で、オデッセイコミュニケーションズが運営。CBT方式の実技試験で、年齢・国籍などの受験資格の制限はない（小学生以下は保護者の同意が必要）。","used_in":"資格は取ったほうがいい？"},{"source_url":"https://www.u-can.co.jp/course/data/in_html/158/column/column07.html","text":"MOSには一般レベル（アソシエイト）と上級レベル（エキスパート）があり、WordとExcelは両方のレベルがある。筆記はなく実技で、結果はその場で表示される。","used_in":"資格は取ったほうがいい？"},{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/jinzaikaihatsu/rishokusha.html","text":"公共職業訓練（離職者訓練）は主に雇用保険を受給している求職者、求職者支援訓練は主に雇用保険を受給できない求職者が対象で、いずれも受講料は無料（テキスト代等は自己負担）。","used_in":"どうやって練習する？"},{"source_url":"https://www.mhlw.go.jp/hellotraining/about","text":"ハロートレーニング（公的職業訓練）は就職に必要な技能・知識を身につけるための職業訓練制度で、受講料は原則無料。事務系をはじめ、介護、IT、製造、建設、デザインなどのコースがある。","used_in":"どうやって練習する？"}]}'::jsonb) on conflict (slug) do nothing;
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

書いた内容は面接でくわしく聞かれることがあるので、自分の言葉で説明できることだけを書きましょう。アルバイトの経験をもっとくわしく伝えたいときは[アルバイト経験だけの職務経歴書、何を書けばいい？](/articles/shokumu-keirekisho-arubaito)を、志望動機の組み立て方は[未経験職種の志望動機、何を書けばいい？](/articles/shiboudouki-mikeiken)も参考にしてください。', 'review', false, '2026-09-28'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['shokumu-keirekisho-arubaito', 'shiboudouki-mikeiken', 'freeter-seishain-hajimeni']::text[], '{}'::text[], array['mensetsu', 'seishain']::text[], array['seishain-keiken-sukunai', 'freeter']::text[], array['履歴書に', '書くことがない…？']::text[], null, false, '[{"q":"アルバイトの経歴は、全部書かないといけませんか？","a":"ハローワークの資料では、学生時代のアルバイトは通常は書かず、卒業後のアルバイトや、応募する仕事に関係するアルバイトなどは「アルバイト」と明記して書くよう案内されています。履歴書に書ききれない仕事の中身は、職務経歴書でくわしく補いましょう。"},{"q":"免許・資格の欄に書けるものがないときは、どうすればいいですか？","a":"「特になし」と書けば十分です。取得に向けて勉強中のものがあれば、「〇〇の取得に向けて勉強中」のように、勉強中であることが分かる形で書くこともできます。"},{"q":"履歴書の性別欄は、書かないといけませんか？","a":"厚生労働省の履歴書様式例では、性別欄は任意記載で、書かないこともできるとされています。応募先から様式の指定がある場合は、その様式に沿って書きましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"「書くことがない」を欄ごとに分けて、職歴（アルバイト）・資格・空白期間・自己PRの順に、何をどう書けばいいかを具体例で示す。年月をずらすなど事実と違う書き方はしないよう明記する","quotes":[{"source_url":"https://www.mhlw.go.jp/content/11601000/000769679.pdf","text":"JIS規格の解説から履歴書の様式例が削除されたことを受け、厚生労働省が新たに履歴書の様式例を作成（2021年4月）。性別欄は〔男・女〕の選択ではなく任意記載欄で、未記載も可能。「通勤時間」「扶養家族数（配偶者を除く）」「配偶者」「配偶者の扶養義務」の欄は設けていない","used_in":"どの欄で手が止まっている？／FAQ"},{"source_url":"https://www.hellowork.mhlw.go.jp/doc/kouroushourirekisho.pdf","text":"ハローワークインターネットサービスで公開されている厚生労働省履歴書様式例（性別欄に※印で任意記載の注記）","used_in":"どの欄で手が止まっている？"},{"source_url":"https://www.hellowork.mhlw.go.jp/doc/oubosyorui_pamphlet_01_070531.pdf","text":"学業期間中のアルバイトは通常記載しないが、卒業後のアルバイトや、応募先の職務に関係する場合、責任を与えられた仕事だった場合などは、アルバイト就業であることを明記の上で記載する。免許・資格は、勉強中のものなども、その旨を明示の上で記載するとアピールになる","used_in":"アルバイトしかしてない。職歴に書いていい？／資格がない。空欄でいい？"}],"not_used":["書類選考の通過率や、資格の有無による採否の差などの統計は使っていない","空白期間の書き方について公的な決まりは確認できなかったため、事実をそのまま書くこと・面接での説明の準備をすすめるにとどめた"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'rirekisho-kakukoto-nai' and c.slug = 'shorui-mensetsu' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '履歴書の様式例の作成について', '厚生労働省', 'https://www.mhlw.go.jp/content/11601000/000769679.pdf', '2026-10-06'::date, '厚生労働省が2021年4月に履歴書の様式例を作成したこと、性別欄が任意記載（未記載も可）であること、通勤時間・扶養家族数・配偶者などの欄を設けていないこと', 0 from articles where slug = 'rirekisho-kakukoto-nai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '厚生労働省履歴書様式例', 'ハローワークインターネットサービス（厚生労働省）', 'https://www.hellowork.mhlw.go.jp/doc/kouroushourirekisho.pdf', '2026-10-06'::date, '様式例がハローワークインターネットサービスで公開されていること', 1 from articles where slug = 'rirekisho-kakukoto-nai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '応募書類の作り方「1 履歴書」', 'ハローワークインターネットサービス（厚生労働省）', 'https://www.hellowork.mhlw.go.jp/doc/oubosyorui_pamphlet_01_070531.pdf', '2026-10-06'::date, '卒業後や応募先に関係するアルバイトは「アルバイト」と明記して職歴に書くこと、勉強中の資格も勉強中であることを明示して書けること', 2 from articles where slug = 'rirekisho-kakukoto-nai';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'rirekisho-kakukoto-nai' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"86a11112bcd0f8814e065751b792dc39c120576c5e798bb4bb6295636586cb50","findings":[]}'::jsonb from articles where slug = 'rirekisho-kakukoto-nai';
update articles set status = 'published' where slug = 'rirekisho-kakukoto-nai';

-- article: sekkyaku-keiken-ikasu (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, roles, concerns, situations, eyecatch, illustration, recommended, faq, news_meta, research_notes) values ('sekkyaku-keiken-ikasu', 'article', '接客経験は転職でどう活かせる？職種別のつながりと伝え方', '接客の仕事には、相手の要望を聞き取る力や、混雑時の段取り、クレーム対応など、ほかの職種でも使える経験が含まれています。経験を分解して、営業・カスタマーサポート・事務などにどうつながるかを整理します。', '「接客しかしてこなかったから、アピールできることがない」。未経験転職の相談では、こうした声をよく聞きます。

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

接客の経験は、どの職種でも「人を相手にする仕事」の基礎になります。自分では当たり前だと思っていた工夫こそ、書き出してみる価値があります。', 'review', true, '2026-08-25'::timestamptz, '2026-09-28'::timestamptz, '2026-09-28'::timestamptz, null, '2026-09-28'::timestamptz, null, null, array['shiboudouki-mikeiken', 'eigyo-cs-it-support-chigai', 'mikeiken-tenshoku-hajimekata']::text[], array['hanbai', 'customer-support', 'eigyo']::text[], array['mikeiken-shokushu', 'mensetsu']::text[], array['sekkyaku']::text[], array['接客の経験、', 'ほかの仕事で活かせる？']::text[], null, false, '[{"q":"アルバイトの接客経験でも、職務経歴書に書いていいのでしょうか？","a":"書いて構いません。雇用形態よりも、どんな業務をどのくらいの期間担当し、何を工夫したかが判断材料になります。正社員経験と区別がつくよう、雇用形態と期間は正確に書きましょう。"},{"q":"「コミュニケーション力があります」とだけ書くのはダメですか？","a":"ダメではありませんが、読み手に伝わりにくくなります。「1日に何人くらいのお客さまに対応していたか」「どんな問い合わせが多かったか」など、場面が浮かぶ事実を添えると説得力が増します。"}]'::jsonb, null, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'sekkyaku-keiken-ikasu' and c.slug = 'keiken' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'sekkyaku-keiken-ikasu' and c.slug = 'shorui-mensetsu' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業情報提供サイト（job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/', '2026-09-28'::date, '各職種の仕事内容・求められるスキルの確認', 0 from articles where slug = 'sekkyaku-keiken-ikasu';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'sekkyaku-keiken-ikasu' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"94a56506153950464243041fb66ad2f2f00603013bedecc5100e8090fc0c0859","findings":[{"code":"C03","severity":"warning","message":"出典が1件のみ。可能なら2件以上で裏付ける"}]}'::jsonb from articles where slug = 'sekkyaku-keiken-ikasu';
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

接客からオフィスワークへの移り方に、決まった正解はありません。「何がつらくて、何を続けたいか」を書き出してから求人を見ると、自分に合う仕事を選びやすくなります。', 'review', false, '2026-09-22'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['sekkyaku-keiken-ikasu', 'eigyo-cs-it-support-chigai', 'donichi-yasumi-nenshu-hikaku']::text[], array['customer-support', 'jimu', 'jinji']::text[], array['office', 'donichi']::text[], array['sekkyaku']::text[], array['接客からオフィスへ。', '働き方はどう変わる？']::text[], null, false, '[{"q":"オフィスワークに移れば、土日休みになりますか？","a":"そうとは限りません。会社の休日に合わせて働く事務などは土日休みの職場もありますが、カスタマーサポートのように問い合わせ窓口を開けている時間に合わせてシフトで働く仕事もあります。求人票の休日欄と年間休日の日数で確かめましょう。"},{"q":"ずっと座っている仕事に慣れられるか不安です。","a":"立ち仕事とは別の疲れ方をするので、不安に思うのは自然なことです。厚生労働省のガイドラインでは、会社が取り組むこととして、パソコンなどを使う作業の連続作業が1時間を超えないようにし、次の作業までに10〜15分の作業休止を設けることなどが示されています。面接で休憩の取り方や、席を離れる作業があるかを聞いておくと安心です。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"接客経験の言語化（sekkyaku-keiken-ikasu）ではなく、働き方・1日の過ごし方の変化に焦点をあてる","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/64","text":"コールセンターオペレーターは主に電話で顧客とやりとりする。顧客からの電話を受けるインバウンド（商品の注文受付、予約、資料請求、問い合わせ対応など）と、顧客に電話をかけるアウトバウンドに分かれる。","used_in":"移りやすいのは、どんな仕事？"},{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/428","text":"一般事務は書類の作成・整理、データ入力、電話の取り次ぎ、来客への対応などを行う。","used_in":"移りやすいのは、どんな仕事？"},{"source_url":"https://shigoto.mhlw.go.jp/User/Occupation/Detail/427","text":"受付事務は来訪者の用件を確認し、担当者や部署に取り次ぎ、案内する。","used_in":"移りやすいのは、どんな仕事？"},{"source_url":"https://www.mhlw.go.jp/content/000539603.pdf","text":"事業者が講ずべき措置として、一連続作業時間が1時間を超えないようにし、次の連続作業までの間に10〜15分の作業休止時間を設け、かつ一連続作業時間内に1〜2回程度の小休止を設けるよう指導することとされている。令和元年7月12日付け基発0712第3号で策定（旧VDTガイドラインを改めたもの）。","used_in":"座り仕事って、楽じゃないの？"}]}'::jsonb) on conflict (slug) do nothing;
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

経験の言葉にしかたで迷ったら[接客経験は転職でどう活かせる？](/articles/sekkyaku-keiken-ikasu)を、経歴の説明に不安があれば[転職回数が気になるときに整理したいこと](/articles/tenshoku-kaisu-kininaru)も参考にしてください。', 'review', false, '2026-10-02'::timestamptz, '2026-10-05'::timestamptz, '2026-10-05'::timestamptz, null, '2026-10-05'::timestamptz, null, null, array['sekkyaku-keiken-ikasu', 'tenshoku-kaisu-kininaru', 'eigyo-cs-it-support-chigai']::text[], '{}'::text[], array['mensetsu', 'mikeiken-shokushu']::text[], array['sekkyaku']::text[], array['未経験の志望動機、', '何を書けばいい？']::text[], null, false, '[{"q":"「未経験ですが頑張ります」だけでは伝わりませんか？","a":"意欲は伝わりますが、それだけだとほかの応募者との違いが見えにくくなります。なぜその仕事に興味を持ったのか、これまでの経験のどこが活かせそうかを添えると、同じ意欲でも説得力が変わります。"},{"q":"志望動機はどれくらいの長さで書けばいいですか？","a":"履歴書の志望動機欄なら、200〜300文字程度にまとめると読みやすくなります。面接では、その内容を1分前後で話せるように準備しておくと安心です。"}]'::jsonb, null, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'shiboudouki-mikeiken' and c.slug = 'shorui-mensetsu' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業情報提供サイト（job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/', '2026-10-05'::date, '応募する職種の仕事内容を調べる方法', 0 from articles where slug = 'shiboudouki-mikeiken';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'shiboudouki-mikeiken' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"4008fe43c5ca8eac0ff4939ae76490c8eb157b6a709de43b96e44bb1f8fc5bd3","findings":[{"code":"C03","severity":"warning","message":"出典が1件のみ。可能なら2件以上で裏付ける"}]}'::jsonb from articles where slug = 'shiboudouki-mikeiken';
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

候補が決まったあとの準備の流れは、[未経験転職は何から始める？](/articles/mikeiken-tenshoku-hajimekata)にまとめています。', 'review', true, '2026-10-04'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['mikeiken-tenshoku-hajimekata', 'eigyo-cs-it-support-chigai', 'sekkyaku-keiken-ikasu']::text[], array['sonota']::text[], array['yaritai', 'mikeiken-shokushu']::text[], array['hajimete', 'seishain-keiken-sukunai']::text[], array['やりたい仕事が', '分からないときは。']::text[], null, false, '[{"q":"やりたいことが決まっていないまま、転職活動を始めてもいいですか？","a":"始めて大丈夫です。やりたいことがはっきりしていなくても、避けたいこと・続けられた作業・ゆずれない条件の3つを書き出せば、候補をしぼって比べることはできます。働きながら、やりたいことが見えてくる人もいます。"},{"q":"適職診断の結果は、どこまで参考にしていいですか？","a":"結果は候補を広げるヒントとして使うのがおすすめです。job tag のよくある質問でも、職業興味検査や仕事価値観検査で出てくる職業は、学歴・職務経験・資格などを考えずに挙げたものなので、参考として使うよう案内されています。出てきた職業は、この記事の3ステップで確かめてみてください。"},{"q":"候補の職種はいくつくらいにしぼればいいですか？","a":"2〜3職種がおすすめです。1つだけだと比べる相手がなく、多すぎると一つひとつを調べきれなくなります。比べてみて合わないと分かった職種は、外して入れ替えて構いません。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"ホームのメイン導線の着地先。「やりたいこと」から探さず、避けたいこと・続けられた作業・ゆずれない条件の3ステップで候補を2〜3職種にしぼり、比べて確かめる。mikeiken-tenshoku-hajimekata（転職準備の5項目）とは重ならないよう、職種の候補を見つける手順に絞る","quotes":[{"source_url":"https://shigoto.mhlw.go.jp/Search/WorkActivity","text":"job tag では、仕事の内容（具体的な作業）から職業を検索できる。","used_in":"ステップ2：続けられた作業は？"},{"source_url":"https://shigoto.mhlw.go.jp/User/faq","text":"職業興味検査や仕事価値観検査で表示される職業リストは、回答者の学歴・職務経験・取得資格・専門性などを考慮しておらず、興味や価値観の特徴と職業との類似度から作成されているので、参考として利用すること。","used_in":"調べてもしぼれないときは？"},{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000181329.html","text":"わかものハローワークは、正社員を目指す若者（おおむね35歳未満）を対象に、担当者制による職業相談や自己理解・職務理解のサポートなどを無料で行っている。","used_in":"調べてもしぼれないときは？"}]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'shigoto-sagashikata' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'shigoto-sagashikata' and c.slug = 'shokushu' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '仕事の内容で検索（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/Search/WorkActivity', '2026-10-06'::date, '仕事の内容から職業を探せる検索があること', 0 from articles where slug = 'shigoto-sagashikata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'よくあるお問い合わせ（job tag）', '厚生労働省 職業情報提供サイト（job tag）', 'https://shigoto.mhlw.go.jp/User/faq', '2026-10-06'::date, '職業興味検査・仕事価値観検査があること、結果の職業リストは学歴・職務経験・資格などを考慮していないため参考として使うこと', 1 from articles where slug = 'shigoto-sagashikata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'わかものハローワーク', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000181329.html', '2026-10-06'::date, '正社員を目指すおおむね35歳未満の若者を対象に、担当者制の職業相談などを無料で行っていること', 2 from articles where slug = 'shigoto-sagashikata';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'shigoto-sagashikata' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"7fc9ad33fe211ba9cfc6381d7787ae9c70368d72ffc29fe8166c3874d8282676","findings":[]}'::jsonb from articles where slug = 'shigoto-sagashikata';
update articles set status = 'published' where slug = 'shigoto-sagashikata';

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

履歴書の欄の埋め方は[履歴書に書くことがないと思ったとき](/articles/rirekisho-kakukoto-nai)、書いた内容を面接でどう話すかは[未経験職種の面接、何を準備する？](/articles/mensetsu-junbi-mikeiken)もあわせて確認してみてください。', 'review', false, '2026-09-19'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['rirekisho-kakukoto-nai', 'sekkyaku-keiken-ikasu', 'shiboudouki-mikeiken']::text[], '{}'::text[], array['mensetsu']::text[], array['freeter', 'seishain-keiken-sukunai', 'sekkyaku']::text[], array['職務経歴書、', 'アルバイトだけでも？']::text[], null, false, '[{"q":"アルバイトをいくつもしてきた場合、全部くわしく書くべきですか？","a":"職務経歴書は自由な様式なので、期間が長いものや応募する仕事に近いものをくわしく書き、ほかは短くまとめる方法があります。履歴書の職歴欄と、勤務先や期間がずれないようにしておきましょう。"},{"q":"職務経歴書は手書きとパソコン、どちらで作ればいいですか？","a":"ハローワークの資料では、A4の用紙1〜2枚程度にパソコンで横書きで作るのが一般的で、黒のボールペンなどによる手書きでも差し支えないとされています。応募先から指定があれば、それに従いましょう。"},{"q":"売上や人数など、正確な数字を覚えていません。","a":"覚えていない数字を作る必要はありません。「約3年」「週4日」のように確かなものだけを書き、あいまいなものは「約」「〜程度」をつけるか、数字を使わずに具体的な作業で伝えましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"アルバイトしか経験がない人向けに、職務経歴書の全体の構成（5ブロック）と、そのまま置き換えて使える書き出し例を示す。既存の sekkyaku-keiken-ikasu（経験の分解）とは、書類全体の組み立てに焦点を置くことで分ける","quotes":[{"source_url":"https://www.hellowork.mhlw.go.jp/doc/oubosyorui_pamphlet_02_070531.pdf","text":"職務経歴書はA4縦1〜2枚程度に、これまでの職務の内容を自由様式で詳しく記載する書類。冒頭の「標題」「氏名」「日付」と「職務経歴」は必須で、「取得資格」「パソコンスキル」「活かせる能力」「自己PR」「志望動機」などを選んで追加するのが一般的。パソコンで横書きが一般的だが手書きでも差し支えない","used_in":"職務経歴書って、履歴書と何が違う？／FAQ"},{"source_url":"https://www.hellowork.mhlw.go.jp/doc/oubosyorui_pamphlet_02_070531.pdf","text":"職務経歴や資格がなく実務能力に自信がない場合でも、①応募職種と関連するアルバイト経験、②訓練・研修の経験、③現在勉強中の分野、④性格・行動特性、⑤仕事への姿勢・意欲、⑥将来目標などの面からアピールできる","used_in":"職務経歴書って、履歴書と何が違う？"},{"source_url":"https://www.hellowork.mhlw.go.jp/doc/syokurekisyo_pamphlet_070531.pdf","text":"職務経歴の記載スタイルには編年体式・逆編年体式・キャリア式があり、わからないときは編年体式（古い職務経歴から記載する方法）とする。アルバイト・パートの仕事の内容をよく分析し、応募先企業で活かせそうな要素を探してアピールする","used_in":"何を、どの順で書く？／書き出し例"}],"not_used":["書類選考の通過率や、職務経歴書の有無による差などの統計は使っていない","書き出し例の店舗・期間・人数は架空の例として明記した"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'shokumu-keirekisho-arubaito' and c.slug = 'shorui-mensetsu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'shokumu-keirekisho-arubaito' and c.slug = 'keiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '応募書類の作り方「2 職務経歴書」', 'ハローワークインターネットサービス（厚生労働省）', 'https://www.hellowork.mhlw.go.jp/doc/oubosyorui_pamphlet_02_070531.pdf', '2026-10-06'::date, '職務経歴書はA4で1〜2枚程度・自由様式で、標題・氏名・日付・職務経歴を入れ、資格や自己PRなどを加えるのが一般的なこと、パソコン作成が一般的だが手書きでも差し支えないこと、実務能力に自信がない場合にアピールできる6つの面', 0 from articles where slug = 'shokumu-keirekisho-arubaito';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職務経歴書（パンフレット）', 'ハローワークインターネットサービス（厚生労働省）', 'https://www.hellowork.mhlw.go.jp/doc/syokurekisyo_pamphlet_070531.pdf', '2026-10-06'::date, '職務経歴は古い順（編年体）が一般的で、迷ったときは編年体で書くこと、アルバイト・パートの仕事の内容を見直して応募先で活かせる要素を探すこと', 1 from articles where slug = 'shokumu-keirekisho-arubaito';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'shokumu-keirekisho-arubaito' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"5bf7f1c7f810faa6457ca7c631860e1431ae24c50ab6b7f0b5a4e88154772569","findings":[]}'::jsonb from articles where slug = 'shokumu-keirekisho-arubaito';
update articles set status = 'published' where slug = 'shokumu-keirekisho-arubaito';

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

今の仕事を辞めたい理由が給料だけでないなら、休日や仕事内容など、ほかの条件も一緒に書き出しておくと、求人を比べやすくなります。賞与を含めた年収での考え方は[年収300万円から転職すると、給料は下がる？上げられる？](/articles/nenshu-300man-tenshoku)、年収以外に比べたいことは[年収だけで求人を選ばないほうがいい理由](/articles/nenshu-dake-erabanai)で紹介しています。', 'review', false, '2026-10-01'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['nenshu-300man-tenshoku', 'donichi-yasumi-nenshu-hikaku', 'nenshu-dake-erabanai']::text[], '{}'::text[], array['kyuryo', 'yametai']::text[], array['hajimete']::text[], array['手取り20万円。', '転職で何を比べる？']::text[], null, false, '[{"q":"求人票の「月給」は手取りの金額ですか？","a":"多くの場合、税金や社会保険料が引かれる前の金額（額面）です。手取りは、ここから健康保険料・厚生年金保険料・雇用保険料・所得税・住民税などが引かれた金額になります。はっきりしないときは、面接や面談で確認しましょう。"},{"q":"手取りは額面の何割くらいになりますか？","a":"住んでいる地域や加入している健康保険、扶養している家族の有無、前の年の収入などで変わるため、決まった割合はありません。今の給与明細で「差引支給額 ÷ 総支給額」を計算すると、自分の場合の目安が分かります。"},{"q":"転職した年に、手取りが思ったより少ないのはなぜですか？","a":"理由のひとつが住民税です。住民税は前の年の所得をもとに計算され、6月から翌年5月までの給料から引かれます。そのため、転職して給料が下がっても、しばらくは前の年の収入をもとにした住民税を払い続けることになります。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"手取りと求人票の月給を同じものさしにそろえる。控除率は断定せず、読者自身の給与明細から割合を出してもらう","quotes":[{"source_url":"https://www.nta.go.jp/taxes/shiraberu/taxanswer/gensen/2511.htm","text":"税額表を使うときは、その月の給与等の金額から社会保険料等を控除した金額を当てはめて源泉徴収税額を求める","used_in":"「額面」と「手取り」は何が違う？"},{"source_url":"https://www.nenkin.go.jp/service/kounen/hokenryo/hoshu/20150515-01.html","text":"厚生年金保険料は、標準報酬月額と標準賞与額に共通の保険料率をかけて計算し、事業主と被保険者が折半して負担する","used_in":"「額面」と「手取り」は何が違う？"},{"source_url":"https://www.kyoukaikenpo.or.jp/about/business/insurance_rate/001","text":"協会けんぽの保険料率は都道府県支部ごとの医療費水準等にもとづき都道府県ごとに決められ、保険料は労使で折半負担するのが原則","used_in":"「額面」と「手取り」は何が違う？"},{"source_url":"https://jsite.mhlw.go.jp/tochigi-roudoukyoku/newpage_01657.html","text":"令和8年度（2026年4月1日〜2027年3月31日）の雇用保険料率の案内。料率は年度ごとに定められ、労働者負担と事業主負担に分かれている","used_in":"「額面」と「手取り」は何が違う？"},{"source_url":"https://www.tax.metro.tokyo.lg.jp/kazei/life/kojin_ju/tokubetsu/about","text":"特別徴収は、事業主が従業員に代わり毎月の給与から個人住民税を差し引いて納入する制度で、6月から翌年5月までの12回に分けて差し引く。個人住民税は前年の所得金額に応じて課税される「所得割」と定額の「均等割」からなる","used_in":"転職した年は「住民税」に気をつける"}],"not_used":["「手取りは額面の約8割」などの一般的な割合は根拠が人によって変わるため書かない。0.8 は読者が自分の明細で出す割合の仮の例として使用"]}'::jsonb) on conflict (slug) do nothing;
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

経歴の伝え方は一人で考えると堂々巡りになりやすいものです。キャリアアドバイザーとの面談では、こうした経歴の整理や伝え方の相談もできます。志望動機の組み立て方は[未経験職種の志望動機、何を書けばいい？](/articles/shiboudouki-mikeiken)も参考にしてください。', 'review', false, '2026-09-16'::timestamptz, '2026-09-29'::timestamptz, '2026-09-29'::timestamptz, null, '2026-09-29'::timestamptz, null, null, array['shiboudouki-mikeiken', 'agent-mendan-mae', 'sekkyaku-keiken-ikasu']::text[], '{}'::text[], array['mensetsu', 'yametai']::text[], array['kaisu', 'dainishinsotsu']::text[], array['転職回数が気になる。', 'どう説明する？']::text[], null, false, '[{"q":"短期間で辞めた職歴は、履歴書に書かなくてもいいですか？","a":"職歴は正確に書くのが基本です。書かなかった職歴があとで分かると、内容そのものより「伝えていなかったこと」が問題になる場合があります。短期間の職歴こそ、理由と学んだことを簡潔に添えて書きましょう。"},{"q":"前の職場の不満を正直に話してもいいのでしょうか？","a":"事実として話すのは構いませんが、不満だけで終わると「次も同じ理由で辞めるのでは」と受け取られやすくなります。「その経験から、次は何を重視して仕事を選んでいるか」までセットで伝えるのがおすすめです。"}]'::jsonb, null, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'tenshoku-kaisu-kininaru' and c.slug = 'shorui-mensetsu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'tenshoku-kaisu-kininaru' and c.slug = 'keiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年4月から労働条件明示のルールが変わります', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_32105.html', '2026-09-29'::date, '入社前に確認できる労働条件（業務・就業場所の変更の範囲など）', 0 from articles where slug = 'tenshoku-kaisu-kininaru';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業情報提供サイト（job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/', '2026-09-29'::date, '次に選ぶ職種の仕事内容を事前に調べる方法', 1 from articles where slug = 'tenshoku-kaisu-kininaru';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'tenshoku-kaisu-kininaru' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"b742151afc37975edb98cbd487cc25232c6b6e794a0b4d964c95ba1654597250","findings":[]}'::jsonb from articles where slug = 'tenshoku-kaisu-kininaru';
update articles set status = 'published' where slug = 'tenshoku-kaisu-kininaru';

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

辞めると決めたあとの進め方は[未経験転職は何から始める？](/articles/mikeiken-tenshoku-hajimekata)を、転職が何回目かが気になる人は[転職回数が気になるときに整理したいこと](/articles/tenshoku-kaisu-kininaru)を参考にしてください。', 'review', false, '2026-09-06'::timestamptz, '2026-10-06'::timestamptz, '2026-10-06'::timestamptz, null, '2026-10-06'::timestamptz, null, null, array['news-koyou-hoken-kyufu-seigen', 'tenshoku-kaisu-kininaru', 'mikeiken-tenshoku-hajimekata']::text[], '{}'::text[], array['yametai']::text[], array['hajimete']::text[], array['辞めたい。', 'その前に確認すること']::text[], null, false, '[{"q":"会社が退職を認めてくれないと、辞められないのですか？","a":"期間の定めのない雇用（正社員など）の場合、民法では、退職を申し出てから2週間がたつと雇用が終わるとされていて、会社の同意がないと辞められないわけではありません。ただし、就業規則に退職の申し出についての決まりがあれば原則としてそれが適用されるので、まず就業規則を確認しましょう。"},{"q":"有給休暇が何日あるか、どう確かめればいいですか？","a":"給与明細や勤怠のシステムに残りの日数が書かれていることがあります。分からなければ、人事の担当者や上司に確認しましょう。法律では、6か月続けて勤務し、出勤すべき日の8割以上出勤した人に、10日の年次有給休暇が与えられます（週5日勤務などの場合）。"},{"q":"辞めてから転職活動をしても大丈夫ですか？","a":"時間を確保しやすい一方で、収入が途切れる期間が出ます。雇用保険の基本手当には受け取るための条件があるので、自分が当てはまるかを確認し、生活費の見通しを立ててから決めましょう。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"辞めるかどうかを決める前に、理由の整理・活動の進め方・退職の手続き・有給・相談先の順に確認する。心身の不調がある場合は転職より休養と相談を先にする","quotes":[{"source_url":"https://jsite.mhlw.go.jp/kagoshima-roudoukyoku/yokuaru_goshitsumon/qa07/0701.html","text":"民法では期間の定めのない雇用契約は解約の申し入れ後2週間で終了することとなっており、会社の同意がなければ退職できないというものではない（民法第627条）。就業規則に退職の規定がある場合は原則として就業規則が適用されるが、極端に長い申し入れ期間などは無効とされる場合もある","used_in":"退職はいつまでに伝える？"},{"source_url":"https://www.check-roudou.mhlw.go.jp/qa/roudousya/yukyu/q1.html","text":"雇い入れから6か月継続勤務し、全労働日の8割以上出勤した労働者に10日の年次有給休暇。その後は勤続年数に応じて増え、最高20日（週5日以上または週30時間以上の場合）","used_in":"有給休暇は残っている？"},{"source_url":"https://www.mhlw.go.jp/general/seido/chihou/kaiketu/soudan.html","text":"総合労働相談コーナーは各都道府県労働局と全国の労働基準監督署内などに設置。解雇、雇止め、いじめなどあらゆる分野の労働問題を対象に、専門の相談員が面談または電話で対応。予約不要・無料","used_in":"つらさが強いときの相談先"},{"source_url":"https://kokoro.mhlw.go.jp/","text":"働く人とその家族などが、電話・SNS・メールで匿名・無料で相談できる窓口がある","used_in":"つらさが強いときの相談先"},{"source_url":"https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000160564.html","text":"令和7年4月1日以降に正当な理由なく自己都合で離職した場合、給付制限期間が原則2か月から1か月に短縮","used_in":"働きながら探す？辞めてから探す？"}],"not_used":["退職理由の割合や転職者数などの統計は使っていない","有期雇用の途中退職のルールは、契約書の確認をすすめるにとどめた"]}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'yametai-mae-kakunin' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'Q5 このたび、家庭の事情で10年間勤務していた会社を辞めたいと思い退職願を提出しましたが、上司が受け取ってくれません。会社が同意してくれないと私は退職できないのでしょうか。', '鹿児島労働局', 'https://jsite.mhlw.go.jp/kagoshima-roudoukyoku/yokuaru_goshitsumon/qa07/0701.html', '2026-10-06'::date, '期間の定めのない雇用は申し入れから2週間で終了し、会社の同意は必要ないこと（民法第627条）、就業規則に規定があれば原則としてそれが適用されること', 0 from articles where slug = 'yametai-mae-kakunin';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '年次有給休暇はどのような場合に与えられるのですか（確かめよう労働条件）', '厚生労働省', 'https://www.check-roudou.mhlw.go.jp/qa/roudousya/yukyu/q1.html', '2026-10-06'::date, '6か月継続勤務・全労働日の8割以上出勤で10日の年次有給休暇が与えられ、勤続年数に応じて日数が増えること', 1 from articles where slug = 'yametai-mae-kakunin';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '総合労働相談コーナーのご案内', '厚生労働省', 'https://www.mhlw.go.jp/general/seido/chihou/kaiketu/soudan.html', '2026-10-06'::date, '都道府県労働局・労働基準監督署内の総合労働相談コーナーで、解雇やいじめなど職場のあらゆる労働問題を、面談または電話で、予約不要・無料で相談できること', 2 from articles where slug = 'yametai-mae-kakunin';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'こころの耳 働く人のメンタルヘルス・ポータルサイト', '厚生労働省', 'https://kokoro.mhlw.go.jp/', '2026-10-06'::date, '働く人向けに電話・SNS・メールで無料の相談窓口があること', 3 from articles where slug = 'yametai-mae-kakunin';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '雇用保険制度の改正内容について', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000160564.html', '2026-10-06'::date, '2025年4月1日以降の自己都合退職で、基本手当の給付制限期間が原則1か月になったこと', 4 from articles where slug = 'yametai-mae-kakunin';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'yametai-mae-kakunin' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"8f7a9d86c2b634d657f6ce3d1bf2d69b14d35abcb8b737784cee580b69731796","findings":[]}'::jsonb from articles where slug = 'yametai-mae-kakunin';
update articles set status = 'published' where slug = 'yametai-mae-kakunin';

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

退職のタイミングに迷っている場合は、まず自分の雇用保険の加入状況を確認し、在職中に活動する場合と退職してから活動する場合のそれぞれで、スケジュールとお金の見通しを書き出してみてください。転職活動全体の進め方は[未経験転職は何から始める？](/articles/mikeiken-tenshoku-hajimekata)で紹介しています。', 'review', false, '2026-09-10'::timestamptz, '2026-10-02'::timestamptz, '2026-10-02'::timestamptz, null, '2026-10-02'::timestamptz, null, null, array['agent-mendan-mae', 'mikeiken-tenshoku-hajimekata', 'news-kyouiku-kunren-kyufu']::text[], '{}'::text[], array['yametai']::text[], array['hajimete']::text[], array['辞めてから転職活動、', '手当はいつから？']::text[], null, false, '[]'::jsonb, '{"announced_by":"厚生労働省","announced_at":"2025-04-01","what_happened":"令和6年の雇用保険法改正により、2025年4月1日以降に正当な理由なく自己都合で退職した人の基本手当の給付制限期間が、原則2か月から1か月に短縮されました。あわせて、離職期間中や離職日前1年以内に一定の教育訓練を受けた場合には、給付制限が解除されるしくみも設けられています。","who_is_affected":"今の仕事を自己都合で辞めてから転職活動をしようと考えている人が主な対象です。在職中に転職先を決めてから退職する人には、直接の影響はほとんどありません。","impact_for_career_changers":"退職してから転職活動に集中する場合、収入が途切れる期間の見通しが立てやすくなりました。ただし、手当を受け取るには条件があり、退職すれば誰でもすぐに受け取れるわけではありません。","unknowns":["自分が基本手当の受給資格を満たしているかどうかは、雇用保険の加入期間などによって変わります。","過去5年以内に自己都合退職による給付制限を繰り返し受けている場合は給付制限期間が3か月になるなど、例外があります。","給付制限の解除の対象になる教育訓練の範囲は、個別に確認が必要です。"],"what_to_check":["雇用保険の加入期間（原則として離職日以前2年間に通算12か月以上の被保険者期間が必要です）","退職理由が自己都合として扱われるのか、それ以外なのか","手続きの窓口となるハローワークでの具体的な手続きと必要書類","在職中に活動するか、退職してから活動するかの比較"]}'::jsonb, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'news-koyou-hoken-kyufu-seigen' and c.slug = 'news' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'news-koyou-hoken-kyufu-seigen' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '雇用保険制度の改正内容について', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000160564.html', '2026-10-02'::date, '給付制限期間の見直し内容と施行日', 0 from articles where slug = 'news-koyou-hoken-kyufu-seigen';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '雇用保険法等の一部を改正する法律の概要', '厚生労働省', 'https://www.mhlw.go.jp/content/11600000/001255172.pdf', '2026-10-02'::date, '改正の全体像と施行期日', 1 from articles where slug = 'news-koyou-hoken-kyufu-seigen';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'news-koyou-hoken-kyufu-seigen' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"3e199afc93663d3f3307ae9dd39b02da8285e340645cafd45eba6fa7fc4cacf7","findings":[]}'::jsonb from articles where slug = 'news-koyou-hoken-kyufu-seigen';
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

AIの普及で仕事の中身がどう変わるかについては、[AIで変わる仕事を、未経験転職者はどう見るべきか](/articles/ai-shigoto-mikeiken)でも解説しています。', 'review', false, '2026-09-24'::timestamptz, '2026-10-03'::timestamptz, '2026-10-03'::timestamptz, null, '2026-10-03'::timestamptz, null, null, array['ai-shigoto-mikeiken', 'news-koyou-hoken-kyufu-seigen', 'eigyo-cs-it-support-chigai']::text[], '{}'::text[], array['mikeiken-shokushu']::text[], array['pc-mikeiken']::text[], array['転職前に学びたい。', '講座の費用、補助ある？']::text[], 'graduation', false, '[]'::jsonb, '{"announced_by":"厚生労働省","announced_at":"2025-10-01","what_happened":"令和6年の雇用保険法改正により、2024年10月1日から教育訓練給付金の給付率の上限が引き上げられました（専門実践教育訓練では、受講後に賃金が上昇した場合などの条件を満たすと、受講費用の最大80%）。さらに2025年10月1日からは、雇用保険の被保険者が教育訓練のために休暇を取った場合に、賃金の一定割合を支給する「教育訓練休暇給付金」が設けられました。","who_is_affected":"雇用保険に加入して働いている人や、一定期間内に離職した人で、資格取得やスキルアップのための講座を受けようとしている人が主な対象です。","impact_for_career_changers":"ITや事務などの職種に挑戦する前に、指定された講座でスキルを身につける場合の費用負担を軽くできる可能性があります。在職中に学んでから転職するという進め方も検討しやすくなりました。","unknowns":["給付の対象になるのは、厚生労働大臣の指定を受けた講座だけです。受けたい講座が対象かどうかは個別に確認が必要です。","受給には一定期間以上の雇用保険の加入期間などの条件があり、給付率は講座の種類や受講後の状況によって変わります。","講座を修了したことが、そのまま希望する職種への採用につながるとは限りません。"],"what_to_check":["受けたい講座が教育訓練給付の指定講座かどうか","自分の雇用保険の加入期間が、支給の条件を満たしているか","受講前に必要な手続き（講座によっては受講開始前の手続きが必要です）","志望する職種で、その資格やスキルが実際にどう評価されるか"]}'::jsonb, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'news-kyouiku-kunren-kyufu' and c.slug = 'news' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'news-kyouiku-kunren-kyufu' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '雇用保険制度の改正内容について', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000160564.html', '2026-10-03'::date, '教育訓練給付の拡充と教育訓練休暇給付金の概要', 0 from articles where slug = 'news-kyouiku-kunren-kyufu';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '雇用保険法等の一部を改正する法律の概要', '厚生労働省', 'https://www.mhlw.go.jp/content/11600000/001255172.pdf', '2026-10-03'::date, '各改正の施行期日', 1 from articles where slug = 'news-kyouiku-kunren-kyufu';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'news-kyouiku-kunren-kyufu' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"89c65436821b93fa90ef191e974ac3512ed2c3b62592500638269d50c89b65ff","findings":[]}'::jsonb from articles where slug = 'news-kyouiku-kunren-kyufu';
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

未経験転職では、仕事内容がイメージと違うことが早期離職のきっかけになりがちです。求人を比べるときは、給与や休日と同じように、この「変更の範囲」の欄も見比べてみてください。年収や休日の比べ方は[「土日休み」と「年収」をどう比較する？](/articles/donichi-yasumi-nenshu-hikaku)で紹介しています。', 'review', false, '2026-09-05'::timestamptz, '2026-10-01'::timestamptz, '2026-10-01'::timestamptz, null, '2026-10-01'::timestamptz, null, null, array['donichi-yasumi-nenshu-hikaku', 'tenshoku-kaisu-kininaru', 'freeter-seishain-hajimeni']::text[], '{}'::text[], array['mikeiken-shokushu']::text[], array['hajimete']::text[], array['入社後の仕事や勤務地、', 'どこまで変わる？']::text[], 'search', false, '[]'::jsonb, '{"announced_by":"厚生労働省","announced_at":"2024-04-01","what_happened":"労働基準法施行規則などの改正により、2024年4月1日から、労働契約を結ぶときに「就業場所・業務の変更の範囲」を明示することになりました。有期契約の場合は、更新上限の有無と内容なども明示の対象です。求人の募集時や職業紹介の際に明示される事項にも、業務・就業場所の変更の範囲や、有期契約の更新の基準が加わっています。","who_is_affected":"これから求人に応募する人、内定を受けて労働契約を結ぶ人のすべてが関係します。契約社員など期間の定めがある働き方を検討している人は、更新上限に関する項目も確認の対象になります。","impact_for_career_changers":"入社直後の仕事内容や勤務地だけでなく、「将来どこまで変わる可能性があるか」を入社前に確認しやすくなりました。未経験で入社して「聞いていた仕事と違う」と感じるリスクを減らす材料として使えます。","unknowns":["変更の範囲が明示されていても、実際にどのくらいの頻度で異動や担当変更があるかまでは分かりません。","「会社の定める業務」のように広く書かれている場合、具体的に何が含まれるかは求人票だけでは判断しにくいことがあります。"],"what_to_check":["求人票や労働条件通知書の「業務の変更の範囲」「就業場所の変更の範囲」の欄","変更の範囲が広い場合、未経験で入社した人が実際にどんな異動・担当変更を経験しているか","契約社員の場合は、更新上限の有無と、正社員登用の実績"]}'::jsonb, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'news-roudou-jouken-meiji' and c.slug = 'news' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'news-roudou-jouken-meiji' and c.slug = 'hatarakikata' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年4月から労働条件明示のルールが変わります', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_32105.html', '2026-10-01'::date, '改正の概要と施行日', 0 from articles where slug = 'news-roudou-jouken-meiji';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '企業から受ける労働条件明示のルールが変わります（求職者向けリーフレット）', '厚生労働省', 'https://www.mhlw.go.jp/content/001114112.pdf', '2026-10-01'::date, '募集時・職業紹介時に追加された明示事項', 1 from articles where slug = 'news-roudou-jouken-meiji';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'news-roudou-jouken-meiji' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"021276f5cabd173b5241f9edc5987ff1e98df51a9c87439ce689f786585a0f5d","findings":[]}'::jsonb from articles where slug = 'news-roudou-jouken-meiji';
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
