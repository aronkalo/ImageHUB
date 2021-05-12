using Microsoft.EntityFrameworkCore.Migrations;

namespace ImageHub.Data.Migrations
{
    public partial class friend_approval_system : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Verified",
                table: "FriendConnections",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Verified",
                table: "FriendConnections");
        }
    }
}
