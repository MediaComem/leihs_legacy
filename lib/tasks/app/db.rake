namespace :app do
  namespace :db do

    desc('Sync local application instance with test servers ' \
         'most recent database dump')
    task :sync do
      puts `mkdir ./db/backups/`
      puts `rsync -avuz leihs@test.leihs.zhdk.ch:~/test/leihs-current.sql ./db/backups/`

      Rake::Task['db:drop'].invoke
      Rake::Task['db:create'].invoke

      puts `mysql -h localhost -u root leihs2_dev < ./db/backups/leihs-current.sql`

      # NOTE Rake::Task['db:migrate'].invoke doesn't include engines' migrations
      puts `rake db:migrate`
      Rake::Task['leihs:maintenance'].invoke

      # also sync the test database schema
      `RAILS_ENV=test rake db:drop db:create db:migrate`
    end
  end
end
