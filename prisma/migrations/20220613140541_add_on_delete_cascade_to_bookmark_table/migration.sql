-- DropForeignKey
ALTER TABLE "bookmarks " DROP CONSTRAINT "bookmarks _userId_fkey";

-- AddForeignKey
ALTER TABLE "bookmarks " ADD CONSTRAINT "bookmarks _userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
