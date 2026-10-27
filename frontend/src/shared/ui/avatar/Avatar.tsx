type AvatarProps = {
  initials: string
}

const Avatar = ({ initials }: AvatarProps) => (
  <span className="inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-soft text-primary">
    <span className="w-7 text-center text-sm leading-5 font-medium">
      {initials}
    </span>
  </span>
)

export default Avatar
