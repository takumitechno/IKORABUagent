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

-- article: agent-mendan-mae (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, faq, news_meta, research_notes) values ('agent-mendan-mae', 'article', 'エージェント面談の前に決めておくこと・決めなくていいこと', '人材紹介会社のキャリアアドバイザーとの面談は、すべてを決めてから臨む必要はありません。事前に決めておくと面談が進めやすくなること、面談で一緒に考えればいいこと、面談で聞いておきたいことを整理しました。', '転職エージェント（人材紹介会社）のキャリアアドバイザーとの面談を前に、「何を話せばいいのか」「志望動機を固めてから行くべきか」と悩む人は多いものです。

結論から言うと、面談の前にすべてを決めておく必要はありません。むしろ、**決めておいたほうがいいこと**と**面談で一緒に考えればいいこと**を分けておくと、面談の時間を有効に使えます。

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

面談の前に、自分の希望や経験をざっくり整理しておきたい場合は、[条件整理チェック](/check)を使ってみてください。整理した結果は、そのまま面談で話す材料になります。', 'review', true, '2026-09-20'::timestamptz, '2026-10-04'::timestamptz, '2026-10-04'::timestamptz, null, '2026-10-04'::timestamptz, null, null, array['mikeiken-tenshoku-hajimekata', 'donichi-yasumi-nenshu-hikaku', 'mikeiken-kenshu-kakunin']::text[], '[{"q":"人材紹介会社に相談すると、お金はかかりますか？","a":"職業安定法にもとづく有料職業紹介事業では、原則として求職者から手数料を受け取ることはできず、紹介手数料は採用した企業が支払うしくみです。一部の職業では例外もあるため、気になる場合は相談先に確認しましょう。"},{"q":"面談を受けたら、必ず応募しないといけませんか？","a":"面談を受けることと応募することは別です。紹介された求人に応募するかどうかは自分で決められます。合わないと感じた求人は、理由を添えて断って構いません。"},{"q":"相談先が許可を受けた事業者かどうかは、どうやって確かめられますか？","a":"厚生労働省の「人材サービス総合サイト」で、職業紹介事業の許可番号や事業者名から検索できます。"}]'::jsonb, null, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'agent-mendan-mae' and c.slug = 'junbi' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'agent-mendan-mae' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業安定法', 'e-Gov法令検索（デジタル庁）', 'https://laws.e-gov.go.jp/law/322AC0000000141', '2026-10-04'::date, '有料職業紹介事業の手数料に関する規定', 0 from articles where slug = 'agent-mendan-mae';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '人材サービス総合サイト（職業紹介事業所検索）', '厚生労働省', 'https://jinzai.hellowork.mhlw.go.jp/JinzaiWeb/GICB101010.do?action=transition&screenId=GICB101010&params=1', '2026-10-04'::date, '職業紹介事業者の許可番号の確認方法', 1 from articles where slug = 'agent-mendan-mae';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'agent-mendan-mae' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"02f7fa4d529186479a1573436f544e3cd12e6323079bb1868211017e663039ed","findings":[]}'::jsonb from articles where slug = 'agent-mendan-mae';
update articles set status = 'published' where slug = 'agent-mendan-mae';

-- article: ai-shigoto-mikeiken (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, faq, news_meta, research_notes) values ('ai-shigoto-mikeiken', 'article', 'AIで変わる仕事を、未経験転職者はどう見るべきか', '「AIに仕事を奪われる」という話を聞くと、これから選ぶ職種に不安を感じるかもしれません。職種名ではなく仕事の中の作業（タスク）に分けて考えると、変わりやすい部分と変わりにくい部分が見えてきます。職種選びと面接での確認のしかたを整理します。', 'ニュースやSNSで「AIに仕事を奪われる」という言葉を目にすると、これから選ぶ職種が数年後もあるのか、不安になるかもしれません。

ただ、こうした話は職種の名前だけで語られることが多く、実際に仕事選びに使うには大ざっぱすぎます。未経験から転職先を選ぶときは、**仕事を作業（タスク）に分けて考える**と、冷静に判断しやすくなります。

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

AIの影響は、職種によっても会社によっても違います。漠然とした不安で選択肢を狭めるより、作業に分けて考え、確認すべきことを確認する。それが、変化の大きい時代に仕事を選ぶうえでの現実的な向き合い方です。', 'review', false, '2026-09-26'::timestamptz, '2026-10-05'::timestamptz, '2026-10-05'::timestamptz, null, '2026-10-05'::timestamptz, null, null, array['eigyo-cs-it-support-chigai', 'mikeiken-tenshoku-hajimekata', 'news-kyouiku-kunren-kyufu']::text[], '[{"q":"AIが普及すると、未経験で入れる仕事はなくなりますか？","a":"仕事の中の一部の作業はAIなどの道具に置き換わっていく可能性がありますが、職種そのものがすぐになくなるとは限りません。どの作業が変わりやすく、どの作業が人に残りやすいかを分けて考えることが大切です。"},{"q":"転職前にAIツールを勉強しておいたほうがいいですか？","a":"専門的な勉強は必須ではありませんが、文章の下書きや調べものにAIツールを使ってみる経験は、どの職種でも役に立ちやすいです。使ってみて気づいた便利な点や注意点は、面接で話せる材料にもなります。"}]'::jsonb, null, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'ai-shigoto-mikeiken' and c.slug = 'shokushu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'ai-shigoto-mikeiken' and c.slug = 'news' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '情報通信白書', '総務省', 'https://www.soumu.go.jp/johotsusintokei/whitepaper/', '2026-10-05'::date, 'AIなどデジタル技術の利用状況に関する公的な情報源の紹介', 0 from articles where slug = 'ai-shigoto-mikeiken';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業情報提供サイト（job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/', '2026-10-05'::date, '職業を作業（タスク）やスキルの単位で調べる方法', 1 from articles where slug = 'ai-shigoto-mikeiken';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'ai-shigoto-mikeiken' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"f9202df05d7fe4cec5a752db06f14942033e63f95df9ae17325ad8589843a001","findings":[]}'::jsonb from articles where slug = 'ai-shigoto-mikeiken';
update articles set status = 'published' where slug = 'ai-shigoto-mikeiken';

-- article: dainishinsotsu-tenshoku-timing (review)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, faq, news_meta, research_notes) values ('dainishinsotsu-tenshoku-timing', 'article', '第二新卒の転職、動き始めるタイミングはいつがいい？', '入社1〜3年目で転職を考え始めたときに、在職中に動くか退職してから動くか、どの時期に動くかを判断するための材料を整理します。', '（査読待ちのサンプル記事です。status が review のため、公開ページ・検索・サイトマップには表示されません。）

入社して1〜3年ほどで「この仕事を続けていいのか」と考え始める人は少なくありません。第二新卒の転職では、動き始めるタイミングによって、選べる進め方が変わります。

## 在職中に動くか、退職してから動くか

在職中に活動すれば収入が途切れない一方で、面接の日程調整がしにくくなります。退職してから活動する場合は時間を確保しやすい一方で、収入が途切れる期間の生活費を考えておく必要があります。

2025年4月以降に自己都合で退職した場合、雇用保険の基本手当の給付制限期間は原則1か月になりました。ただし、受給には条件があるため、自分が対象になるかは事前に確認しましょう。', 'review', false, null, '2026-10-05'::timestamptz, null, null, null, null, null, array['mikeiken-tenshoku-hajimekata', 'agent-mendan-mae']::text[], '[]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","reviewer_todo":"退職後に活動する場合の生活費の目安について、出典付きの記述を追加するか検討"}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'dainishinsotsu-tenshoku-timing' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'dainishinsotsu-tenshoku-timing' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '雇用保険制度の改正内容について', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000160564.html', '2026-10-05'::date, '自己都合退職時の給付制限期間', 0 from articles where slug = 'dainishinsotsu-tenshoku-timing';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'dainishinsotsu-tenshoku-timing' on conflict do nothing;

-- article: donichi-yasumi-nenshu-hikaku (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, faq, news_meta, research_notes) values ('donichi-yasumi-nenshu-hikaku', 'article', '「土日休み」と「年収」をどう比較する？求人票の数字の読み方', '「年収は高いけれど休みが少ない」「土日休みだけど年収は少し低い」。迷ったときは、年間休日・労働時間・年収の内訳をそろえて比べると判断しやすくなります。求人票の数字の読み方と、時給換算での比べ方を紹介します。', '求人を比べていると、「年収は高いけれど休みが少ない」「土日休みだけど年収は少し低い」という選択に迷うことがあります。

どちらが正解というものはありませんが、比べ方を少し工夫すると、自分に合うほうが見えやすくなります。ポイントは、**数字の条件をそろえてから比べる**ことです。

## まずは「年間休日」で休みを数える

「土日休み」と書かれていても、祝日や夏季・年末年始の休みがあるかどうかで、1年間の休みの日数は変わります。求人票では、**年間休日の日数**を確認しましょう。

目安として、1年はおよそ52週なので、毎週土日が休みなら104日です。これに祝日や夏季・年末年始の休暇が加わると、120日前後になる会社が多くなります。

休日の書き方にも注意が必要です。

- **完全週休2日制**: 毎週2日の休みがある
- **週休2日制**: 月に1回以上、週2日休める週がある（毎週とは限らない）

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

> 年収 ÷（年間の勤務日数 × 1日の所定労働時間）

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

「休み」と「年収」のどちらを優先するかに正解はありません。数字の条件をそろえて比べたうえで、自分の生活に合うほうを選ぶことが、入社後の「こんなはずじゃなかった」を減らす近道です。', 'review', false, '2026-09-08'::timestamptz, '2026-10-03'::timestamptz, '2026-10-03'::timestamptz, null, '2026-10-03'::timestamptz, null, null, array['mikeiken-tenshoku-hajimekata', 'agent-mendan-mae', 'news-roudou-jouken-meiji']::text[], '[{"q":"「週休2日制」と「完全週休2日制」は何が違いますか？","a":"一般的に、完全週休2日制は毎週2日の休みがあることを指します。週休2日制は、月に1回以上は週2日の休みがある週があるという意味で使われ、毎週2日休めるとは限りません。休日の欄は、年間休日数とあわせて確認しましょう。"},{"q":"固定残業代が含まれている求人は避けたほうがいいですか？","a":"固定残業代そのものが問題というわけではありません。基本給と固定残業代がそれぞれいくらか、何時間分の残業が含まれているか、それを超えた分が追加で支払われるかを確認し、ほかの求人とそろえて比べることが大切です。"}]'::jsonb, null, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'donichi-yasumi-nenshu-hikaku' and c.slug = 'hatarakikata' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'donichi-yasumi-nenshu-hikaku' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '労働基準法', 'e-Gov法令検索（デジタル庁）', 'https://laws.e-gov.go.jp/law/322AC0000000049', '2026-10-03'::date, '法定労働時間（第32条）と法定休日（第35条）', 0 from articles where slug = 'donichi-yasumi-nenshu-hikaku';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年4月から労働条件明示のルールが変わります', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_32105.html', '2026-10-03'::date, '労働条件の明示事項', 1 from articles where slug = 'donichi-yasumi-nenshu-hikaku';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'donichi-yasumi-nenshu-hikaku' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"00b9184e47a9a9666f620136bbb08ca51078231af97ba97281471df3a493e605","findings":[]}'::jsonb from articles where slug = 'donichi-yasumi-nenshu-hikaku';
update articles set status = 'published' where slug = 'donichi-yasumi-nenshu-hikaku';

-- article: eigyo-cs-it-support-chigai (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, faq, news_meta, research_notes) values ('eigyo-cs-it-support-chigai', 'article', '営業・カスタマーサポート・ITサポートの違いは？仕事内容と向き不向きを比べる', '未経験歓迎の求人で目にすることが多い「営業」「カスタマーサポート」「ITサポート」。人と話す量、パソコン作業、数字の目標という3つの軸で、仕事内容の違いと入社前に確認したいことを整理します。', '未経験歓迎の求人を探していると、「営業」「カスタマーサポート」「ITサポート」という職種をよく目にします。どれも人と関わる仕事ですが、1日の過ごし方や求められることはかなり違います。

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

ただし、ここで挙げたのは一般的な傾向です。同じ職種名でも、会社によって仕事の範囲は大きく違います。2024年4月からは、求人や労働契約の際に「業務の変更の範囲」も明示されるようになったので、入社後にどんな仕事に変わる可能性があるかも確認できます。

ほかの職種も含めた比較は[職種比較ページ](/jobs)で、これまでの経験との相性は[条件整理チェック](/check)で整理できます。', 'review', true, '2026-09-02'::timestamptz, '2026-10-02'::timestamptz, '2026-10-02'::timestamptz, null, '2026-10-02'::timestamptz, null, null, array['sekkyaku-keiken-ikasu', 'ai-shigoto-mikeiken', 'mikeiken-kenshu-kakunin']::text[], '[{"q":"人と話すのが苦手でも、営業はできますか？","a":"営業にもいろいろなスタイルがあり、初対面の人に次々と電話をかける仕事もあれば、決まった取引先と長く付き合う仕事もあります。「話すのが苦手」の中身が、初対面が苦手なのか、断られるのがつらいのかによって、向き不向きは変わります。求人では営業先が新規か既存かを確認しましょう。"},{"q":"ITサポートは、パソコンに詳しくないと応募できませんか？","a":"未経験可の求人では、入社後の研修や先輩の同行で知識を身につける前提のものもあります。ただし、パソコンの基本操作に抵抗がないことや、新しい知識を自分で調べる習慣は求められることが多いです。研修の内容は応募前に確認しておきましょう。"},{"q":"カスタマーサポートとコールセンターは同じ仕事ですか？","a":"重なる部分は多いですが、同じとは限りません。電話の受付が中心の仕事もあれば、メールやチャットでの対応、マニュアル作成、ほかの部署への改善提案まで担当する仕事もあります。求人の仕事内容欄で、対応する手段と範囲を確認しましょう。"}]'::jsonb, null, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'eigyo-cs-it-support-chigai' and c.slug = 'shokushu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'eigyo-cs-it-support-chigai' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業情報提供サイト（job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/', '2026-10-02'::date, '各職種の仕事内容・求められるスキルの確認', 0 from articles where slug = 'eigyo-cs-it-support-chigai';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年4月から労働条件明示のルールが変わります', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_32105.html', '2026-10-02'::date, '業務の変更の範囲が明示されるようになった点', 1 from articles where slug = 'eigyo-cs-it-support-chigai';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'eigyo-cs-it-support-chigai' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"a7d9eefca76d606ddd7c1795b2a050d4b6432d6d87683c40b039637e05a187dd","findings":[]}'::jsonb from articles where slug = 'eigyo-cs-it-support-chigai';
update articles set status = 'published' where slug = 'eigyo-cs-it-support-chigai';

-- article: freeter-seishain-hajimeni (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, faq, news_meta, research_notes) values ('freeter-seishain-hajimeni', 'article', 'フリーターから正社員を目指すとき、最初に確認したいこと', 'アルバイトから正社員を目指すときは、雇用形態による働き方の違いを知り、アルバイト経験や空白期間をどう伝えるかを整理しておくことが大切です。求人の探し方の使い分けとあわせて紹介します。', 'アルバイトを続けながら「そろそろ正社員として働きたい」と考え始めたとき、何から確認すればいいのか迷う人は多いと思います。

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

整理したことをもとに、自分の場合はどんな選択肢がありそうかを人に相談してみるのも、遠回りに見えて近道になることがあります。', 'review', true, '2026-09-30'::timestamptz, '2026-10-05'::timestamptz, '2026-10-05'::timestamptz, null, '2026-10-05'::timestamptz, null, null, array['mikeiken-tenshoku-hajimekata', 'sekkyaku-keiken-ikasu', 'agent-mendan-mae']::text[], '[{"q":"アルバイト経験しかないと、正社員の書類選考に通らないのでしょうか？","a":"アルバイト経験しかないことだけで判断されるわけではありません。未経験者を対象にした求人では、これまでの経験の中身や、働くことへの姿勢、入社後に学ぶ意欲などもあわせて見られます。担当していた業務を具体的に書くことが大切です。"},{"q":"空白期間があるのですが、どう説明すればいいですか？","a":"空白期間に何をしていたのかを、事実として簡潔に伝えましょう。資格の勉強や家庭の事情など理由はさまざまです。そのうえで「今は働く準備ができていること」「これから何をしたいか」を添えると、前向きに伝わりやすくなります。"}]'::jsonb, null, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'freeter-seishain-hajimeni' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'freeter-seishain-hajimeni' and c.slug = 'keiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年4月から労働条件明示のルールが変わります', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_32105.html', '2026-10-05'::date, '契約期間・更新上限など、雇用形態にかかわる労働条件の明示', 0 from articles where slug = 'freeter-seishain-hajimeni';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, 'ハローワークインターネットサービス', '厚生労働省', 'https://www.hellowork.mhlw.go.jp/', '2026-10-05'::date, '公的な求人検索・職業相談の窓口の紹介', 1 from articles where slug = 'freeter-seishain-hajimeni';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '人材サービス総合サイト（職業紹介事業所検索）', '厚生労働省', 'https://jinzai.hellowork.mhlw.go.jp/JinzaiWeb/GICB101010.do?action=transition&screenId=GICB101010&params=1', '2026-10-05'::date, '民間の職業紹介事業者の許可の確認方法', 2 from articles where slug = 'freeter-seishain-hajimeni';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'freeter-seishain-hajimeni' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"e978738c3c9229f5e7e60e294e202f0624bff32d41dd4fcd056b349e080b29d8","findings":[]}'::jsonb from articles where slug = 'freeter-seishain-hajimeni';
update articles set status = 'published' where slug = 'freeter-seishain-hajimeni';

-- article: kyujin-hyo-yomikata (draft)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, faq, news_meta, research_notes) values ('kyujin-hyo-yomikata', 'article', '求人票の「未経験歓迎」「学歴不問」はどう読む？', '求人票によく出てくる言葉の意味と、その言葉だけでは分からないことを整理する記事（執筆中）。', '（執筆中のドラフトです。status が draft のため、公開ページには表示されません。本文が存在しても、査読と公開承認を経るまでは公開されません。）

## 「未経験歓迎」が意味すること

「未経験歓迎」は、その職種の経験がない人の応募を受け付けているという意味で使われることが多い表現です。ただし、入社後の研修の内容や、求められる基本的なスキルは求人ごとに違います。', 'draft', false, null, '2026-10-06'::timestamptz, null, null, null, null, null, '{}'::text[], '[]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","brief":"求人票の定型表現の読み方。出典候補を調査中。"}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'kyujin-hyo-yomikata' and c.slug = 'junbi' on conflict do nothing;
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'kyujin-hyo-yomikata' on conflict do nothing;

-- article: mikeiken-kenshu-kakunin (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, faq, news_meta, research_notes) values ('mikeiken-kenshu-kakunin', 'article', '未経験求人の「研修あり」で確認すべきこと｜期間・内容・その後のフォロー', '「研修制度あり」「未経験でも安心」と書かれた求人でも、研修の中身は会社によって大きく違います。期間・形式・教える人・研修後のフォローなど、応募前や面接で確認したいポイントを質問例つきでまとめました。', '未経験歓迎の求人には、「研修制度あり」「未経験でも安心のサポート体制」といった言葉がよく並んでいます。けれど、研修の中身は会社によってまったく違います。

1か月かけて座学で基礎を学ぶ会社もあれば、初日から現場に出て先輩の横で覚えていく会社もあります。どちらが良い悪いではなく、**自分に合ったやり方かどうか**を入社前に確かめておくことが大切です。

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

研修以外に面談で確認したいことは、[エージェント面談前に決めておくこと・決めなくていいこと](/articles/agent-mendan-mae)にまとめています。', 'review', false, '2026-09-12'::timestamptz, '2026-09-30'::timestamptz, '2026-09-30'::timestamptz, null, '2026-09-30'::timestamptz, null, null, array['eigyo-cs-it-support-chigai', 'agent-mendan-mae', 'mikeiken-tenshoku-hajimekata']::text[], '[{"q":"研修について質問すると、やる気がないと思われませんか？","a":"聞き方次第です。「早く一人前になりたいので、最初の数か月でどんなことを学ぶのか知りたい」のように、前向きな理由を添えて聞けば、意欲の表れとして受け取られることが多いです。"},{"q":"研修期間中の給与は、通常と違うことがありますか？","a":"会社によっては、研修期間や試用期間中の給与や待遇が本採用後と異なる場合があります。求人票や労働条件の説明で、期間と条件を確認しておきましょう。"}]'::jsonb, null, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'mikeiken-kenshu-kakunin' and c.slug = 'junbi' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'mikeiken-kenshu-kakunin' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職場情報の提供制度', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000122234.html', '2026-09-30'::date, '若者雇用促進法にもとづく職場情報（研修の有無及び内容など）の提供', 0 from articles where slug = 'mikeiken-kenshu-kakunin';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年4月から労働条件明示のルールが変わります', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_32105.html', '2026-09-30'::date, '試用期間や業務の変更の範囲など、明示される労働条件の確認', 1 from articles where slug = 'mikeiken-kenshu-kakunin';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'mikeiken-kenshu-kakunin' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"c58a0ef5ee0ee93512dbde3a522372346739af1b16bdba8cb6db9458a09df04c","findings":[]}'::jsonb from articles where slug = 'mikeiken-kenshu-kakunin';
update articles set status = 'published' where slug = 'mikeiken-kenshu-kakunin';

-- article: mikeiken-tenshoku-hajimekata (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, faq, news_meta, research_notes) values ('mikeiken-tenshoku-hajimekata', 'article', '未経験転職は何から始める？最初に整理したい5つのこと', '求人を眺める前に「転職したい理由」「経験」「希望条件」「比べる職種」「スケジュール」の5つを整理しておくと、求人の良し悪しを自分の基準で判断しやすくなります。それぞれの整理のしかたを具体的に紹介します。', '未経験から転職を考え始めたとき、多くの人が最初につまずくのは「何から手をつければいいのか分からない」ことです。求人サイトを開いても、職種も条件も幅が広すぎて、どれが自分に合っているのか判断できません。

そこでおすすめしたいのが、求人を探す前に**自分の側の材料を整理しておく**ことです。ここでは、最初に整理しておきたい5つの項目と、その書き出し方を紹介します。

## 1. 転職したい理由を「不満」と「望み」に分ける

まずは、なぜ今の働き方を変えたいのかを書き出します。ここでは遠慮せず、本音をそのまま書いて構いません。

書き出したら、それぞれを次の2つに分けてみてください。

- **不満**: 今の状況で困っていること・続けたくないこと
- **望み**: 転職したあとに実現したいこと

たとえば「シフトが毎月変わって予定が立てにくい」は不満です。これを望みに言い換えると「平日の日中に働いて、休みの曜日を固定したい」になります。

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

整理したメモは完成品である必要はありません。調べたり人と話したりする中で、何度書き直しても大丈夫です。大切なのは、求人を見る前に「自分にとって何が大事か」の手がかりを持っておくことです。', 'review', true, '2026-08-18'::timestamptz, '2026-10-01'::timestamptz, '2026-10-01'::timestamptz, null, '2026-10-01'::timestamptz, '未経験転職は何から始める？最初に整理したい5つのこと', '未経験転職の最初の一歩は、求人探しより「整理」です。転職理由・経験・希望条件・比べる職種・スケジュールの5つを、書き出し例つきで解説します。', array['agent-mendan-mae', 'donichi-yasumi-nenshu-hikaku', 'eigyo-cs-it-support-chigai']::text[], '[{"q":"自分には強みと言えるような経験がありません。それでも整理する意味はありますか？","a":"あります。整理の目的は「すごい経験」を探すことではなく、どんな作業をどのくらい続けてきたかを事実として並べることです。アルバイトのシフト管理や新人への説明なども、書き出してみると仕事選びの材料になります。"},{"q":"転職したい理由が不満ばかりです。ネガティブでも大丈夫でしょうか？","a":"最初は不満のままで構いません。そのうえで「その不満がなくなったら、次はどうなっていたいか」に言い換えると、求人を比べるときの基準として使えるようになります。"},{"q":"整理にはどれくらい時間をかければいいですか？","a":"目安は1〜2週間です。完璧に仕上げる必要はなく、5つの項目に一度メモを書けたら、職種を調べたり相談したりしながら書き直していくほうが進めやすくなります。"}]'::jsonb, null, '{"schema_version":2,"writer_agent":"career-writer","angle":"求人探しの前に、比較の基準を作る"}'::jsonb) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'mikeiken-tenshoku-hajimekata' and c.slug = 'mikeiken' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'mikeiken-tenshoku-hajimekata' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業情報提供サイト（job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/', '2026-10-01'::date, '職種ごとの仕事内容を調べる方法の紹介', 0 from articles where slug = 'mikeiken-tenshoku-hajimekata';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年4月から労働条件明示のルールが変わります', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_32105.html', '2026-10-01'::date, '求人や内定時に確認できる労働条件の範囲', 1 from articles where slug = 'mikeiken-tenshoku-hajimekata';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'mikeiken-tenshoku-hajimekata' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"087f4ab2d4d532391e0a44e526823e0d4bd75ceb73c48a971647111fa8f6b416","findings":[]}'::jsonb from articles where slug = 'mikeiken-tenshoku-hajimekata';
update articles set status = 'published' where slug = 'mikeiken-tenshoku-hajimekata';

-- article: sekkyaku-keiken-ikasu (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, faq, news_meta, research_notes) values ('sekkyaku-keiken-ikasu', 'article', '接客経験は転職でどう活かせる？職種別のつながりと伝え方', '接客の仕事には、相手の要望を聞き取る力や、混雑時の段取り、クレーム対応など、ほかの職種でも使える経験が含まれています。経験を分解して、営業・カスタマーサポート・事務などにどうつながるかを整理します。', '「接客しかしてこなかったから、アピールできることがない」。未経験転職の相談では、こうした声をよく聞きます。

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

接客の経験は、どの職種でも「人を相手にする仕事」の基礎になります。自分では当たり前だと思っていた工夫こそ、書き出してみる価値があります。', 'review', true, '2026-08-25'::timestamptz, '2026-09-28'::timestamptz, '2026-09-28'::timestamptz, null, '2026-09-28'::timestamptz, null, null, array['shiboudouki-mikeiken', 'eigyo-cs-it-support-chigai', 'mikeiken-tenshoku-hajimekata']::text[], '[{"q":"アルバイトの接客経験でも、職務経歴書に書いていいのでしょうか？","a":"書いて構いません。雇用形態よりも、どんな業務をどのくらいの期間担当し、何を工夫したかが判断材料になります。正社員経験と区別がつくよう、雇用形態と期間は正確に書きましょう。"},{"q":"「コミュニケーション力があります」とだけ書くのはダメですか？","a":"ダメではありませんが、読み手に伝わりにくくなります。「1日に何人くらいのお客さまに対応していたか」「どんな問い合わせが多かったか」など、場面が浮かぶ事実を添えると説得力が増します。"}]'::jsonb, null, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'sekkyaku-keiken-ikasu' and c.slug = 'keiken' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'sekkyaku-keiken-ikasu' and c.slug = 'shorui-mensetsu' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業情報提供サイト（job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/', '2026-09-28'::date, '各職種の仕事内容・求められるスキルの確認', 0 from articles where slug = 'sekkyaku-keiken-ikasu';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'sekkyaku-keiken-ikasu' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"3e6f3981c2b05fbbf21c8967edfb4c336bc5dc2885fa8c1cb65b6acdb198e04d","findings":[{"code":"C03","severity":"warning","message":"出典が1件のみ。可能なら2件以上で裏付ける"}]}'::jsonb from articles where slug = 'sekkyaku-keiken-ikasu';
update articles set status = 'published' where slug = 'sekkyaku-keiken-ikasu';

-- article: shiboudouki-mikeiken (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, faq, news_meta, research_notes) values ('shiboudouki-mikeiken', 'article', '未経験職種の志望動機、何を書けばいい？3つの要素と例文', '未経験の職種に応募するとき、志望動機に「経験がないこと」をどう書けばいいか迷う人は多いはずです。きっかけ・経験との接点・入社後に取り組みたいことの3つの要素で組み立てる方法を、例文つきで紹介します。', '未経験の職種に応募するとき、志望動機で手が止まってしまう人は多いと思います。「経験がないのに、何をアピールすればいいのか」と悩むのは自然なことです。

未経験の志望動機は、**きっかけ**・**経験との接点**・**入社後に取り組みたいこと**の3つの要素で組み立てると、書きやすくなります。

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

経験の言葉にしかたで迷ったら[接客経験は転職でどう活かせる？](/articles/sekkyaku-keiken-ikasu)を、経歴の説明に不安があれば[転職回数が気になるときに整理したいこと](/articles/tenshoku-kaisu-kininaru)も参考にしてください。', 'review', false, '2026-10-02'::timestamptz, '2026-10-05'::timestamptz, '2026-10-05'::timestamptz, null, '2026-10-05'::timestamptz, null, null, array['sekkyaku-keiken-ikasu', 'tenshoku-kaisu-kininaru', 'eigyo-cs-it-support-chigai']::text[], '[{"q":"「未経験ですが頑張ります」だけでは伝わりませんか？","a":"意欲は伝わりますが、それだけだとほかの応募者との違いが見えにくくなります。なぜその仕事に興味を持ったのか、これまでの経験のどこが活かせそうかを添えると、同じ意欲でも説得力が変わります。"},{"q":"志望動機はどれくらいの長さで書けばいいですか？","a":"履歴書の志望動機欄なら、200〜300文字程度にまとめると読みやすくなります。面接では、その内容を1分前後で話せるように準備しておくと安心です。"}]'::jsonb, null, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'shiboudouki-mikeiken' and c.slug = 'shorui-mensetsu' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業情報提供サイト（job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/', '2026-10-05'::date, '応募する職種の仕事内容を調べる方法', 0 from articles where slug = 'shiboudouki-mikeiken';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'shiboudouki-mikeiken' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"d45c814cd60bd81cbed6a006e91d7b0af59ae19bb6024110110531741e312672","findings":[{"code":"C03","severity":"warning","message":"出典が1件のみ。可能なら2件以上で裏付ける"}]}'::jsonb from articles where slug = 'shiboudouki-mikeiken';
update articles set status = 'published' where slug = 'shiboudouki-mikeiken';

-- article: tenshoku-kaisu-kininaru (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, faq, news_meta, research_notes) values ('tenshoku-kaisu-kininaru', 'article', '転職回数が気になるときに整理したいこと｜説明のしかたと次の選び方', '短期間での離職や転職回数の多さが気になるときは、隠すよりも事実を整理し、次の職場で何を変えたいのかを説明できるようにしておくことが大切です。経歴の整理のしかたと、伝え方の型を紹介します。', '「転職回数が多いと、書類で落とされるのでは」「短期間で辞めた経歴をどう説明すればいいか分からない」。こうした不安から、転職活動そのものに踏み出せなくなる人は少なくありません。

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

経歴の伝え方は一人で考えると堂々巡りになりやすいものです。キャリアアドバイザーとの面談では、こうした経歴の整理や伝え方の相談もできます。志望動機の組み立て方は[未経験職種の志望動機、何を書けばいい？](/articles/shiboudouki-mikeiken)も参考にしてください。', 'review', false, '2026-09-16'::timestamptz, '2026-09-29'::timestamptz, '2026-09-29'::timestamptz, null, '2026-09-29'::timestamptz, null, null, array['shiboudouki-mikeiken', 'agent-mendan-mae', 'sekkyaku-keiken-ikasu']::text[], '[{"q":"短期間で辞めた職歴は、履歴書に書かなくてもいいですか？","a":"職歴は正確に書くのが基本です。書かなかった職歴があとで分かると、内容そのものより「伝えていなかったこと」が問題になる場合があります。短期間の職歴こそ、理由と学んだことを簡潔に添えて書きましょう。"},{"q":"前の職場の不満を正直に話してもいいのでしょうか？","a":"事実として話すのは構いませんが、不満だけで終わると「次も同じ理由で辞めるのでは」と受け取られやすくなります。「その経験から、次は何を重視して仕事を選んでいるか」までセットで伝えるのがおすすめです。"}]'::jsonb, null, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'tenshoku-kaisu-kininaru' and c.slug = 'shorui-mensetsu' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'tenshoku-kaisu-kininaru' and c.slug = 'keiken' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年4月から労働条件明示のルールが変わります', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_32105.html', '2026-09-29'::date, '入社前に確認できる労働条件（業務・就業場所の変更の範囲など）', 0 from articles where slug = 'tenshoku-kaisu-kininaru';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '職業情報提供サイト（job tag）', '厚生労働省', 'https://shigoto.mhlw.go.jp/User/', '2026-09-29'::date, '次に選ぶ職種の仕事内容を事前に調べる方法', 1 from articles where slug = 'tenshoku-kaisu-kininaru';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'tenshoku-kaisu-kininaru' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"e5354e31711b2d5c2366f9236d55cb093f9db13c6cf1c85eca174604b3e33aea","findings":[]}'::jsonb from articles where slug = 'tenshoku-kaisu-kininaru';
update articles set status = 'published' where slug = 'tenshoku-kaisu-kininaru';

-- news: news-koyou-hoken-kyufu-seigen (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, faq, news_meta, research_notes) values ('news-koyou-hoken-kyufu-seigen', 'news', '自己都合退職の給付制限が原則1か月に｜退職してから転職活動する人が確認したいこと', '2025年4月1日以降に自己都合で退職した場合、雇用保険の基本手当（いわゆる失業手当）の給付制限期間が原則2か月から1か月に短縮されました。退職してから転職活動を考えている人が、何を確認すべきかを整理します。', '「仕事を辞めてから、じっくり転職活動をしたい」と考えている人にとって、生活費の見通しは大きな判断材料です。今回の改正で、自己都合退職のあとに基本手当を受け取れるまでの期間は短くなりました。

ただし、この変更は「辞めても大丈夫」という意味ではありません。基本手当を受け取るには雇用保険の加入期間などの条件があり、受け取れる金額や日数も人によって違います。また、在職中に転職活動をすれば、収入を途切れさせずに次の職場を探せるという利点は変わりません。

退職のタイミングに迷っている場合は、まず自分の雇用保険の加入状況を確認し、在職中に活動する場合と退職してから活動する場合のそれぞれで、スケジュールとお金の見通しを書き出してみてください。転職活動全体の進め方は[未経験転職は何から始める？](/articles/mikeiken-tenshoku-hajimekata)で紹介しています。', 'review', false, '2026-09-10'::timestamptz, '2026-10-02'::timestamptz, '2026-10-02'::timestamptz, null, '2026-10-02'::timestamptz, null, null, array['agent-mendan-mae', 'mikeiken-tenshoku-hajimekata', 'news-kyouiku-kunren-kyufu']::text[], '[]'::jsonb, '{"announced_by":"厚生労働省","announced_at":"2025-04-01","what_happened":"令和6年の雇用保険法改正により、2025年4月1日以降に正当な理由なく自己都合で退職した人の基本手当の給付制限期間が、原則2か月から1か月に短縮されました。あわせて、離職期間中や離職日前1年以内に一定の教育訓練を受けた場合には、給付制限が解除されるしくみも設けられています。","who_is_affected":"今の仕事を自己都合で辞めてから転職活動をしようと考えている人が主な対象です。在職中に転職先を決めてから退職する人には、直接の影響はほとんどありません。","impact_for_career_changers":"退職してから転職活動に集中する場合、収入が途切れる期間の見通しが立てやすくなりました。ただし、手当を受け取るには条件があり、退職すれば誰でもすぐに受け取れるわけではありません。","unknowns":["自分が基本手当の受給資格を満たしているかどうかは、雇用保険の加入期間などによって変わります。","過去5年以内に自己都合退職による給付制限を繰り返し受けている場合は給付制限期間が3か月になるなど、例外があります。","給付制限の解除の対象になる教育訓練の範囲は、個別に確認が必要です。"],"what_to_check":["雇用保険の加入期間（原則として離職日以前2年間に通算12か月以上の被保険者期間が必要です）","退職理由が自己都合として扱われるのか、それ以外なのか","手続きの窓口となるハローワークでの具体的な手続きと必要書類","在職中に活動するか、退職してから活動するかの比較"]}'::jsonb, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'news-koyou-hoken-kyufu-seigen' and c.slug = 'news' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'news-koyou-hoken-kyufu-seigen' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '雇用保険制度の改正内容について', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000160564.html', '2026-10-02'::date, '給付制限期間の見直し内容と施行日', 0 from articles where slug = 'news-koyou-hoken-kyufu-seigen';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '雇用保険法等の一部を改正する法律の概要', '厚生労働省', 'https://www.mhlw.go.jp/content/11600000/001255172.pdf', '2026-10-02'::date, '改正の全体像と施行期日', 1 from articles where slug = 'news-koyou-hoken-kyufu-seigen';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'news-koyou-hoken-kyufu-seigen' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"3935fcd521173d903eb2984b34b0772ee3cf4cd61528a5438f7e9ed3a9366f6c","findings":[]}'::jsonb from articles where slug = 'news-koyou-hoken-kyufu-seigen';
update articles set status = 'published' where slug = 'news-koyou-hoken-kyufu-seigen';

-- news: news-kyouiku-kunren-kyufu (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, faq, news_meta, research_notes) values ('news-kyouiku-kunren-kyufu', 'news', '学び直しの支援が拡充｜教育訓練給付の引き上げと教育訓練休暇給付金', '雇用保険の教育訓練給付は、2024年10月から給付率の上限が引き上げられ、2025年10月には教育訓練休暇給付金が新設されました。未経験の職種に挑戦するためにスキルを身につけたい人に関係する制度変更を解説します。', '未経験の職種に挑戦するとき、「入社前に少しでもスキルを身につけておきたい」と考える人は多いと思います。今回の制度変更は、そうした学び直しの費用や時間の負担を軽くする方向のものです。

一方で、注意したいのは「資格を取れば転職できる」とは限らない点です。未経験者を採用する会社の多くは、資格そのものよりも、仕事への理解や学び続ける姿勢を見ています。講座を選ぶ前に、志望する職種で何が求められているかを調べ、必要なら人材紹介会社のキャリアアドバイザーなどに「その資格が実際の求人でどう評価されるか」を確認してから決めると、時間とお金を無駄にしにくくなります。

AIの普及で仕事の中身がどう変わるかについては、[AIで変わる仕事を、未経験転職者はどう見るべきか](/articles/ai-shigoto-mikeiken)でも解説しています。', 'review', false, '2026-09-24'::timestamptz, '2026-10-03'::timestamptz, '2026-10-03'::timestamptz, null, '2026-10-03'::timestamptz, null, null, array['ai-shigoto-mikeiken', 'news-koyou-hoken-kyufu-seigen', 'eigyo-cs-it-support-chigai']::text[], '[]'::jsonb, '{"announced_by":"厚生労働省","announced_at":"2025-10-01","what_happened":"令和6年の雇用保険法改正により、2024年10月1日から教育訓練給付金の給付率の上限が引き上げられました（専門実践教育訓練では、受講後に賃金が上昇した場合などの条件を満たすと、受講費用の最大80%）。さらに2025年10月1日からは、雇用保険の被保険者が教育訓練のために休暇を取った場合に、賃金の一定割合を支給する「教育訓練休暇給付金」が設けられました。","who_is_affected":"雇用保険に加入して働いている人や、一定期間内に離職した人で、資格取得やスキルアップのための講座を受けようとしている人が主な対象です。","impact_for_career_changers":"ITや事務などの職種に挑戦する前に、指定された講座でスキルを身につける場合の費用負担を軽くできる可能性があります。在職中に学んでから転職するという進め方も検討しやすくなりました。","unknowns":["給付の対象になるのは、厚生労働大臣の指定を受けた講座だけです。受けたい講座が対象かどうかは個別に確認が必要です。","受給には一定期間以上の雇用保険の加入期間などの条件があり、給付率は講座の種類や受講後の状況によって変わります。","講座を修了したことが、そのまま希望する職種への採用につながるとは限りません。"],"what_to_check":["受けたい講座が教育訓練給付の指定講座かどうか","自分の雇用保険の加入期間が、支給の条件を満たしているか","受講前に必要な手続き（講座によっては受講開始前の手続きが必要です）","志望する職種で、その資格やスキルが実際にどう評価されるか"]}'::jsonb, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'news-kyouiku-kunren-kyufu' and c.slug = 'news' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'news-kyouiku-kunren-kyufu' and c.slug = 'junbi' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '雇用保険制度の改正内容について', '厚生労働省', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000160564.html', '2026-10-03'::date, '教育訓練給付の拡充と教育訓練休暇給付金の概要', 0 from articles where slug = 'news-kyouiku-kunren-kyufu';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '雇用保険法等の一部を改正する法律の概要', '厚生労働省', 'https://www.mhlw.go.jp/content/11600000/001255172.pdf', '2026-10-03'::date, '各改正の施行期日', 1 from articles where slug = 'news-kyouiku-kunren-kyufu';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'news-kyouiku-kunren-kyufu' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"7b93c946886ec0e5dc3e2fbd9885e2b827bdbe11227125e59ee76a80018bbfa8","findings":[]}'::jsonb from articles where slug = 'news-kyouiku-kunren-kyufu';
update articles set status = 'published' where slug = 'news-kyouiku-kunren-kyufu';

-- news: news-roudou-jouken-meiji (published)
insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, faq, news_meta, research_notes) values ('news-roudou-jouken-meiji', 'news', '求人で明示される労働条件が増えた｜「業務・就業場所の変更の範囲」とは', '2024年4月から、求人の募集時や労働契約を結ぶときに明示される労働条件に「業務の変更の範囲」「就業場所の変更の範囲」などが加わりました。未経験転職で求人を比べるときに、どこを見ればいいかを解説します。', '求人票や労働条件通知書には、これまでも仕事内容や勤務地が書かれていました。今回のルール変更で大きいのは、**「入社直後」だけでなく「将来の変更の範囲」も書かれるようになった**点です。

たとえば、仕事内容の欄に「（雇入れ直後）カスタマーサポート業務　（変更の範囲）会社の定める業務」と書かれている場合、入社後にほかの部署の業務へ変わる可能性があることを意味します。反対に、変更の範囲が「変更なし」や特定の業務に限られていれば、担当が大きく変わる可能性は低いと読み取れます。

未経験転職では、仕事内容がイメージと違うことが早期離職のきっかけになりがちです。求人を比べるときは、給与や休日と同じように、この「変更の範囲」の欄も見比べてみてください。年収や休日の比べ方は[「土日休み」と「年収」をどう比較する？](/articles/donichi-yasumi-nenshu-hikaku)で紹介しています。', 'review', false, '2026-09-05'::timestamptz, '2026-10-01'::timestamptz, '2026-10-01'::timestamptz, null, '2026-10-01'::timestamptz, null, null, array['donichi-yasumi-nenshu-hikaku', 'tenshoku-kaisu-kininaru', 'freeter-seishain-hajimeni']::text[], '[]'::jsonb, '{"announced_by":"厚生労働省","announced_at":"2024-04-01","what_happened":"労働基準法施行規則などの改正により、2024年4月1日から、労働契約を結ぶときに「就業場所・業務の変更の範囲」を明示することになりました。有期契約の場合は、更新上限の有無と内容なども明示の対象です。求人の募集時や職業紹介の際に明示される事項にも、業務・就業場所の変更の範囲や、有期契約の更新の基準が加わっています。","who_is_affected":"これから求人に応募する人、内定を受けて労働契約を結ぶ人のすべてが関係します。契約社員など期間の定めがある働き方を検討している人は、更新上限に関する項目も確認の対象になります。","impact_for_career_changers":"入社直後の仕事内容や勤務地だけでなく、「将来どこまで変わる可能性があるか」を入社前に確認しやすくなりました。未経験で入社して「聞いていた仕事と違う」と感じるリスクを減らす材料として使えます。","unknowns":["変更の範囲が明示されていても、実際にどのくらいの頻度で異動や担当変更があるかまでは分かりません。","「会社の定める業務」のように広く書かれている場合、具体的に何が含まれるかは求人票だけでは判断しにくいことがあります。"],"what_to_check":["求人票や労働条件通知書の「業務の変更の範囲」「就業場所の変更の範囲」の欄","変更の範囲が広い場合、未経験で入社した人が実際にどんな異動・担当変更を経験しているか","契約社員の場合は、更新上限の有無と、正社員登用の実績"]}'::jsonb, null) on conflict (slug) do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, true from articles a, categories c where a.slug = 'news-roudou-jouken-meiji' and c.slug = 'news' on conflict do nothing;
insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, false from articles a, categories c where a.slug = 'news-roudou-jouken-meiji' and c.slug = 'hatarakikata' on conflict do nothing;
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '2024年4月から労働条件明示のルールが変わります', '厚生労働省', 'https://www.mhlw.go.jp/stf/newpage_32105.html', '2026-10-01'::date, '改正の概要と施行日', 0 from articles where slug = 'news-roudou-jouken-meiji';
insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, '企業から受ける労働条件明示のルールが変わります（求職者向けリーフレット）', '厚生労働省', 'https://www.mhlw.go.jp/content/001114112.pdf', '2026-10-01'::date, '募集時・職業紹介時に追加された明示事項', 1 from articles where slug = 'news-roudou-jouken-meiji';
insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = 'news-roudou-jouken-meiji' on conflict do nothing;
insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, 'seed', 'approved', '{"content_hash":"74c48337e3aadcdc55e3eaf39c49f9c92e35a36aea2dce7973775c8f04a296d8","findings":[]}'::jsonb from articles where slug = 'news-roudou-jouken-meiji';
update articles set status = 'published' where slug = 'news-roudou-jouken-meiji';

commit;
