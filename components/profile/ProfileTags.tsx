import { Tag } from 'lucide-react';

interface ProfileTagsProps {
  tags: Array<{
    id: string;
    tag_name: string;
    tag_color?: string;
  }>;
}

export function ProfileTags({ tags }: ProfileTagsProps) {
  // Get color for tag
  const getTagColor = (tagName: string) => {
    const colors: Record<string, string> = {
      sales: 'bg-lh-red/10 text-lh-red border-lh-red/30',
      leadership: 'bg-lh-yellow/20 text-yellow-800 border-lh-yellow/50',
      'P&L': 'bg-lh-blue/10 text-lh-blue border-lh-blue/30',
      HR: 'bg-purple-100 text-purple-800 border-purple-300',
      marketing: 'bg-pink-100 text-pink-800 border-pink-300',
      processing: 'bg-blue-100 text-blue-800 border-blue-300',
      'tech/ support': 'bg-green-100 text-green-800 border-green-300',
      'branch manager': 'bg-orange-100 text-orange-800 border-orange-300',
      'underwriting questions': 'bg-indigo-100 text-indigo-800 border-indigo-300',
      guidelines: 'bg-teal-100 text-teal-800 border-teal-300',
      closing: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      ctc: 'bg-sky-100 text-sky-800 border-sky-300',
      title: 'bg-violet-100 text-violet-800 border-violet-300',
      ARIVE: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300',
      payroll: 'bg-rose-100 text-rose-800 border-rose-300',
    };

    return colors[tagName] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <div>
      <h2 className="text-2xl font-bold font-poppins text-lh-text mb-6 flex items-center gap-2">
        <Tag className="w-6 h-6 text-lh-blue" />
        Specialties & Roles
      </h2>

      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <span
            key={tag.id}
            className={`
              inline-flex items-center px-4 py-2 rounded-full
              font-poppins font-semibold text-sm
              border-2 transition-all duration-300
              hover:scale-105 hover:shadow-md
              ${getTagColor(tag.tag_name)}
            `}
          >
            {tag.tag_name}
          </span>
        ))}
      </div>
    </div>
  );
}
