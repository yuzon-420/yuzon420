-- 增修:允許學生刪除自己的解題進度(設定畫面的「重設進度」需要)
-- 執行方式:Supabase Dashboard → SQL Editor → 貼上執行
--
-- 原本的 schema.sql 只給了 progress 資料表 select / insert / update 政策,
-- 沒有 delete 政策。Row Level Security 在這種情況不會回報錯誤,
-- 但刪除會影響 0 筆 —— 也就是「靜默失敗」。
-- 這裡補上政策,而且條件限定 user_id = auth.uid(),
-- 所以學生只能刪自己的紀錄,刪不到別人的。

create policy "delete own progress" on public.progress
  for delete using (user_id = auth.uid());
