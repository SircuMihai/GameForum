package com.forum.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;

@Component
public class DatabaseSeedRunner implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;
    private final DataSource dataSource;

    @Value("${forum.seed.enabled:true}")
    private boolean seedEnabled;

    @Autowired
    public DatabaseSeedRunner(JdbcTemplate jdbcTemplate, DataSource dataSource) {
        this.jdbcTemplate = jdbcTemplate;
        this.dataSource = dataSource;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (!seedEnabled) {
            return;
        }

        // If tables are empty, seed them. Use ON CONFLICT DO NOTHING in SQL to be idempotent.
        // Retry for a short period because schema creation (ddl-auto=update) can race startup.
        for (int attempt = 0; attempt < 30; attempt++) {
            boolean allOk = true;

            allOk &= seedIfTableEmpty("achievements", "db/seed/001_achievements.sql");
            allOk &= seedIfTableEmpty("category", "db/seed/002_categories.sql");
            allOk &= seedIfTableEmpty("users", "db/seed/003_users.sql");

            if (allOk) {
                return;
            }

            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return;
            }
        }
    }

    private boolean seedIfTableEmpty(String tableName, String classpathSql) {
        try {
            Long count = jdbcTemplate.queryForObject("select count(*) from " + tableName, Long.class);
            if (count != null && count > 0) {
                return true;
            }

            ResourceDatabasePopulator populator = new ResourceDatabasePopulator();
            populator.addScript(new ClassPathResource(classpathSql));
            populator.execute(dataSource);
            return true;
        } catch (DataAccessException ex) {
            return false;
        }
    }
}
