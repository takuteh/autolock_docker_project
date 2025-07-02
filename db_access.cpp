#include <iostream>
#include <stdexcept>
#include <mysql_driver.h>
#include <mysql_connection.h>

#include <cppconn/driver.h>
#include <cppconn/exception.h>
#include <cppconn/resultset.h>
#include <cppconn/statement.h>

int main()
{
    try
    {
        sql::mysql::MySQL_Driver *driver;
        sql::Connection *con;
        sql::Statement *stmt;
        sql::ResultSet *res;

        // 接続情報
        std::string host = "tcp://autolock_auth_db:3306"; // Docker上のサービス名
        std::string user = "pi";
        std::string password = "raspberry";
        std::string database = "autolock_user";

        // ドライバ取得
        driver = sql::mysql::get_mysql_driver_instance();
        con = driver->connect(host, user, password);

        // DB選択
        con->setSchema(database);

        // クエリ実行
        stmt = con->createStatement();
        res = stmt->executeQuery("SELECT * FROM users");

        while (res->next())
        {
            std::cout << "id: " << res->getInt("id") << ", name: " << res->getString("user_name") << ", line_id: " << res->getString("line_id") << ", slack_id: " << res->getString("slack_id") << ", start_date: " << res->getString("start_date") << ", end_date: " << res->getString("end_date") << std::endl;
        }

        delete res;
        delete stmt;
        delete con;
    }
    catch (sql::SQLException &e)
    {
        std::cerr << "SQL Error: " << e.what() << std::endl;
        return 1;
    }

    return 0;
}
