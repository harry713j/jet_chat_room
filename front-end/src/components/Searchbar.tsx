import type { SearchResult } from "@/types/types";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

type SearchbarType = {
  rooms: SearchResult;
  onSelectIndividual: (recieverId: string) => void;
  onSelectGroup: (groupId: string) => void;
  setSearchQuery: (val: string) => void;
};

export function Searchbar({
  rooms,
  onSelectIndividual,
  onSelectGroup,
  setSearchQuery,
}: SearchbarType) {
  return (
    <div className="space-y-2">
      <Input
        placeholder="Search users or groups..."
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <ScrollArea className="h-64 rounded-md border p-2">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-muted-foreground">Users</p>
          {rooms.users.map((user) => (
            <Button
              key={user.userId}
              variant="ghost"
              className="w-full justify-start text-left"
              onClick={() => onSelectIndividual(user.userId)}
            >
              @{user.username} ({user.fullName})
            </Button>
          ))}

          <p className="text-sm font-semibold text-muted-foreground mt-4">
            Groups
          </p>
          {rooms.groups.map((group) => (
            <Button
              key={group.groupId}
              variant="ghost"
              className="w-full justify-start text-left"
              onClick={() => onSelectGroup(group.groupId)}
            >
              #{group.groupName}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
