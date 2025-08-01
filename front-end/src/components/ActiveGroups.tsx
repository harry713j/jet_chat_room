import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@/context/UserContext";
import type { ActiveChat } from "@/types/types";

type ActiveGroupsProps = {
  activeRooms: ActiveChat[];
  onSelectIndividual: (recieverId: string) => void;
  onSelectGroup: (groupId: string) => void;
};

export function ActiveGroups({
  activeRooms,
  onSelectIndividual,
  onSelectGroup,
}: ActiveGroupsProps) {
  const { user } = useUser();
  const activeIndividuals = activeRooms.filter(
    (room) => room.type === "private"
  );
  const activeGroups = activeRooms.filter((room) => room.type === "group");

  return (
    <Card className="mt-2">
      <CardHeader className="text-lg font-bold">Active Chats</CardHeader>
      <CardContent>
        <ScrollArea className="h-60 pr-2">
          <div className="space-y-3">
            <p className="text-muted-foreground text-sm">Individuals</p>
            {activeIndividuals.length === 0 ? (
              <p className="text-sm text-muted-foreground px-2">
                No personal chats
              </p>
            ) : (
              activeIndividuals.map((room) => (
                <div
                  key={room.recieverId}
                  onClick={() => onSelectIndividual(room.recieverId)}
                  className="cursor-pointer px-2 py-1 hover:bg-muted rounded-md"
                >
                  @
                  {
                    activeIndividuals.find(
                      (m: any) => m.username !== user.username
                    )?.username
                  }
                </div>
              ))
            )}

            <p className="text-muted-foreground text-sm mt-2">Groups</p>
            {activeGroups.length === 0 ? (
              <p className="text-sm text-muted-foreground px-2">
                No active groups
              </p>
            ) : (
              activeGroups.map((group) => (
                <div
                  key={group.groupId}
                  onClick={() => onSelectGroup(group.groupId)}
                  className="cursor-pointer px-2 py-1 hover:bg-muted rounded-md"
                >
                  #{group.groupName}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
