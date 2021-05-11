using Microsoft.EntityFrameworkCore.Migrations;

namespace ImageHub.Data.Migrations
{
    public partial class friends_added : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FriendConnections",
                columns: table => new
                {
                    Identifier = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserOne = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserTwo = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FriendConnections", x => x.Identifier);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FriendConnections");
        }
    }
}
