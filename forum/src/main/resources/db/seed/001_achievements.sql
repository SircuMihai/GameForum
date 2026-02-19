INSERT INTO public.achievements (achievement_id, achievement_name, achievement_photo, achievement_description)
VALUES
  (1, 'Town Founder', '/Achievments/town_founder.png', 'Created your first topic'),
  (2, 'First Battle', '/Achievments/first_battle.png', 'Created your first post on the battlefield'),
  (3, 'Veteran Commander', '/Achievments/veteran_commander.png', 'Commanded respect in 250 discussions'),
  (4, 'Master Strategist', '/Achievments/master_battlefield.png', 'Created a topic with 50+ replies'),
  (5, 'Imperial Advisor', '/Achievments/imperial_favor.png', 'Became a moderator or admin'),
  (6, 'Explorer', '/Achievments/legend_realm.png', 'Visited every category'),
  (7, 'Skirmisher', '/Achievments/skirmisher.png', 'Engaged in 10 discussions with tactical precision'),
  (8, 'Line Infantry', '/Achievments/line_infantry.png', 'A disciplined regular. 50 posts created'),
  (10, 'Warlord', '/Achievments/warlord.png', 'A legendary figure of 1,000 battles'),
  (11, 'Master of the Battlefield', '/Achievments/master_battlefield.png', 'Dominated 5,000 engagements with unmatched skill'),
  (12, 'Unbreakable', '/Achievments/unbreakable.png', '100 consecutive days active'),
  (13, 'Iron Will', '/Achievments/iron_will.png', '1 year of continuous service'),
  (14, 'Village Builder', '/Achievments/village_builder.png', '10 topics created'),
  (15, 'City Architect', '/Achievments/city_architect.png', '50 topics created'),
  (16, 'Capital Established', '/Achievments/capital_established.png', '200 topics created'),
  (17, 'Pillar of the Empire', '/Achievments/pillar_empire.png', 'Highly respected community member'),
  (18, 'Founder''s Seal', '/Achievments/founders_seal.png', 'Early registration member'),
  (19, 'Imperial Favor', '/Achievments/imperial_favor.png', 'Granted by administrators'),
  (20, 'Legend of the Realm', '/Achievments/legend_realm.png', 'Historic community figure'),
  (21, 'Hero of the Age', '/Achievments/hero_age.png', 'Wololoooo')
ON CONFLICT (achievement_id) DO NOTHING;
