using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace ImageHub.Data.Migrations
{
    public partial class comment_and_like_imp : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NumberOfLikes",
                table: "Medias");

            migrationBuilder.CreateTable(
                name: "Comments",
                columns: table => new
                {
                    Indentifier = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MediaIdentifier = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserIdentifier = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Text = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comments", x => x.Indentifier);
                });

            migrationBuilder.CreateTable(
                name: "Likes",
                columns: table => new
                {
                    Indentifier = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MediaIdentifier = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserIdentifier = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Likes", x => x.Indentifier);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Comments");

            migrationBuilder.DropTable(
                name: "Likes");

            migrationBuilder.AddColumn<int>(
                name: "NumberOfLikes",
                table: "Medias",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
