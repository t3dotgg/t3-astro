import * as Accordion from '@radix-ui/react-accordion';
import '../RadixUi/AccordionStyle.css'

export default function AccordionUi({ question, answer, value}){
    return(
        <Accordion.Root className="AccordionRoot text-[#B7B2BF]" type="single" defaultValue="1" collapsible>
        <Accordion.Item value={value} className="AccordionItem pb-4 bg-[#251C33] w-fit rounded-b-xl rounded-t-xl" value="item-1">
          <Accordion.Trigger className="flex gap-6 items-center justify-between text-start bg-[#12002B]  min-[410px]:w-[400px] transition-colors  hover:bg-[#34264b] py-2 px-4 border border-[#C7A4FF] rounded-xl">{question} <i className="ri-arrow-down-s-line"></i> </Accordion.Trigger>
          <Accordion.Content className="AccordionContent text-lg px-4 mt-3  w-[400px]">{answer}</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    )
}