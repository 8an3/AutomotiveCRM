import { Form, useNavigation } from "@remix-run/react";
import { ButtonLoading } from "~/components";
import { toast } from "sonner";
import React, { useState } from 'react';



export default function FinanceTurnover({ data }) {
  const navigation = useNavigation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast.success(`Informing finance managers of requested turnover...`);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const lockedValue = true
  return (
    <div className='w-[175px] cursor-pointer'>
      <Form method='post' onSubmit={handleSubmit}>
        <input type='hidden' name='intent' value='financeTurnover' />
        <input type='hidden' name='locked' value={lockedValue} />
        <input type='hidden' name='financeId' value={data.id} />
        <ButtonLoading
          size="lg"
          className="w-auto cursor-pointer ml-auto mt-5 hover:text-primary"
          type="submit"
          isSubmitting={isSubmitting}
          loadingText="Updating client info..."
        >
          Finance Turnover
        </ButtonLoading>
      </Form>
    </div>
  );
}
