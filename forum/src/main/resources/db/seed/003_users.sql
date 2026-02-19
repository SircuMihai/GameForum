INSERT INTO public.users (selected_title_achievement_id, user_id, created_at, last_login, nickname, password, quoto, role, banned, user_email, avatar)
VALUES (null, 1, '2026-02-15T15:25:51.011508100+02:00', '2026-02-15T16:14:27.899138+02:00', 'ADMIN', '$2a$10$DYuecJVpznRfXm/6Mninb.pdqHDGQcu3mNLMX9i8Bm/K2whNIn/vK', null, 'ADMIN', false, 'ADMIN@gmail.com', null)
ON CONFLICT (user_email) DO NOTHING;
