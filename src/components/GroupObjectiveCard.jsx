import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

const GroupObjectiveCard = ({ membership }) => {
  const goal = membership.group_objectives;
  const allMembers = goal.otros_miembros || [];
  // include the current membership plus any other active members, deduplicating by id
  const membersWithState = [
    { profiles: membership.profiles, state: membership.state },
    ...allMembers
      .filter((m) => m.state === 'active' && m.member_id !== membership.member_id)
      .map((m) => ({ profiles: m.profiles, state: m.state })),
  ];

  const uniqueMembers = membersWithState
    .map((m) => m.profiles)
    .filter(Boolean)
    // dedupe by profile id
    .filter(
      (v, i, arr) => arr.findIndex((p) => p.id === v.id) === i
    );

  const createdAt = new Date(goal.created_at);
  const endDate = new Date(goal.end_date);
  const now = new Date();
  const totalTime = endDate - createdAt;
  const elapsedTime = now - createdAt;
  const timeProgress = Math.max(0, (elapsedTime / totalTime) * 100);
  const moneyProgress =
    goal.total_amount > 0
      ? ((goal.total_amount - goal.remaining_amount) / goal.total_amount) * 100
      : 0;
  const isCompleted = goal.remaining_amount <= 0;
  const daysLeft = Math.max(
    0,
    Math.ceil((endDate - now) / (1000 * 60 * 60 * 24))
  );
  const isOverdue = now > endDate;

  return (
    <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold">{goal.objective_name}</CardTitle>
        {goal.description && (
          <CardDescription className="text-sm">
            {goal.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Avatars */}
        <div className="flex -space-x-2">
          {uniqueMembers.slice(0, 5).map((member, idx) => (
            <div key={idx} className="relative">
              <Avatar
                className={`h-10 w-10 border-2 ${
                  member.id === goal.owner_id
                    ? 'border-yellow-400 ring-2 ring-yellow-200'
                    : 'border-background'
                }`}
              >
                <AvatarImage src={member.avatar_url} alt={member.full_name} />
                <AvatarFallback className="text-xs">
                  {member.full_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {member.id === goal.owner_id && (
                <div className="absolute -top-1 -right-1 bg-yellow-400 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  👑
                </div>
              )}
            </div>
          ))}
          {uniqueMembers.length > 5 && (
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
              +{uniqueMembers.length - 5}
            </div>
          )}
        </div>

        {/* Time Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className={isOverdue ? 'text-red-600' : ''}>
              Tiempo {isOverdue ? 'excedido' : 'restante'}
            </span>
            <span className={isOverdue ? 'text-red-600' : ''}>
              {isOverdue ? `${Math.abs(daysLeft)} días atrás` : `${daysLeft} días`}
            </span>
          </div>
          <Progress value={timeProgress} className="h-3" />
        </div>

        {/* Money Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Progreso financiero</span>
            <span>${goal.remaining_amount} faltante</span>
          </div>
          <Progress value={moneyProgress} className="h-3" />
        </div>

        {isCompleted && (
          <div className="text-center text-green-600 font-semibold bg-green-50 p-2 rounded-lg">
            🎉 ¡Objetivo completado!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GroupObjectiveCard;
