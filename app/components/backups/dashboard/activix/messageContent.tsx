import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "~/components/ui/select"

export default function MesasageContent() {
  return (
    <>
      <Select name='note'  defaultValue="none">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="messageContent" />
        </SelectTrigger>
        <SelectContent>
        <SelectGroup>
        <SelectItem value="none">Message Content</SelectItem>

          <SelectLabel>Moving Forward</SelectLabel>
          <SelectItem value="wants to move forward, got deposit">Wans to move forward, got deposit</SelectItem>
          <SelectItem value="Wants to move forward, did not have credit card on him">Wants to move forward, did not have credit card on him</SelectItem>
          <SelectItem value="Wants to get fiannce approval before moving forward">Wants to get approval before moving forward</SelectItem>
          <SelectItem value="Sent BOS to sign off on">Sent BOS to sign off on</SelectItem>
          <SelectItem value="Wants to come back in to view and negotiate">Wants to come back in to view and negotiate</SelectItem>

          <SelectLabel>Stand Still</SelectLabel>
          <SelectItem value="Talked to spouse, client was not home">Talked to wife, husband was not home</SelectItem>

          <SelectItem value="Got ahold of the client, was busy, need to call back">Got ahold of the client, was busy need to call back</SelectItem>
          <SelectItem value="Gave pricing, need to follow up">Gave pricing, need to follow up</SelectItem>
          <SelectItem value="Needs to discuss with spouse">Needs to discuss with spouse</SelectItem>

          <SelectLabel>Not Moving Forward</SelectLabel>

          <SelectItem value="Does not want to move forward right now wants me to call in the future">Does not want to move forward right now wants me to call in the future</SelectItem>
          <SelectItem value="Bought else where, set to lost">Bought else where</SelectItem>
          <SelectItem value="Does not want to move forward, set to lost">Does not want to move forward, set to lost</SelectItem>
          <SelectItem value=""></SelectItem>
         </SelectGroup>
        </SelectContent>
      </Select>
    </>

  )
}
